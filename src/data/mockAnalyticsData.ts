import type { AnalyticsTimeframe, ChartDataPoint, AnalyticsPeriodSummary } from '../types/analytics';
import { getStoredShipments } from './mockShipments';

export const CURRENT_SIMULATED_DATE = '2026-11-18';
export const MIN_HISTORICAL_DATE = '2025-11-01';

/**
 * Deterministic pseudo-random hash for consistent day values
 */
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface RawDayRecord {
  date: string; // YYYY-MM-DD
  dayOfWeek: number;
  dispatched: number;
  delivered: number;
  inTransit: number;
  delayed: number;
  cancelled: number;
  volumeKg: number;
  revenue: number;
  collected: number;
  onTimePercent: number;
}

/**
 * Generates a realistic, naturally varying day record for any date between 2025-11-01 and 2026-11-18.
 * Incorporates seasonal shifts (Diwali festive peak in Oct/Nov, Monsoon in Jul/Aug, FY close in Mar),
 * weekday dynamics (Tue-Wed-Fri peaks, weekend troughs), and natural daily noise.
 */
function generateDayRecord(dateStr: string): RawDayRecord {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed
  const dayOfMonth = parseInt(dayStr, 10);

  const dateObj = new Date(year, month, dayOfMonth, 12, 0, 0);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
  const seed = stringHash(dateStr);

  // Weekday distribution multiplier (Monday ramp-up, Tue-Wed-Fri surges, weekend commercial drop)
  // Calibrated so that daily dispatches stay reliably in the 1,200 - 2,800 range
  const dowMultipliers = [0.82, 0.96, 1.08, 1.12, 1.06, 1.18, 0.88];
  const dowMul = dowMultipliers[dayOfWeek];

  // Indian Logistics Seasonality Multipliers
  // Nov-Dec: Post-festive / winter peak
  // Jan-Feb: Standard post-holiday
  // Mar: Fiscal year-end shipping push
  // Jul-Aug: Monsoon slowdown
  // Sep-Oct: Festive stocking rush (Diwali / Durga Puja)
  const monthSeasonality = [
    1.02, // Jan
    1.00, // Feb
    1.15, // Mar (FY close)
    1.00, // Apr
    0.98, // May
    0.94, // Jun
    0.88, // Jul (Monsoon dip)
    0.90, // Aug (Monsoon)
    1.08, // Sep (Pre-festive)
    1.22, // Oct (Festive peak)
    1.18, // Nov (Festive / E-commerce rush)
    1.10  // Dec (Year-end)
  ];
  const monthMul = monthSeasonality[month];

  // Pseudo-random daily jitter: ±6% natural variance
  const jitter = 0.94 + ((seed % 100) / 100) * 0.12;

  // Baseline dispatches for large-scale enterprise logistics operation
  const baseDispatched = 1820;
  let dispatched = Math.round(baseDispatched * dowMul * monthMul * jitter);
  // Strictly enforce user-specified daily dispatch range: 1,200 - 2,800
  dispatched = Math.max(1200, Math.min(2800, dispatched));

  // Delivery calculation: strictly ensure deliveries never exceed dispatched shipments (89% - 96% adherence)
  // Strictly enforce user-specified daily delivery range: 1,000 - 2,600
  const deliveryRatio = 0.89 + (((seed >> 4) % 100) / 100) * 0.07;
  let delivered = Math.round(dispatched * deliveryRatio);
  delivered = Math.max(1000, Math.min(2600, Math.min(dispatched, delivered)));
  if (delivered > dispatched) delivered = dispatched;

  // In-transit buffer (active pipelines en-route across nationwide hubs)
  const inTransit = Math.max(400, Math.round(dispatched * 0.42 + (seed % 150)));

  // Realistic operational delays (higher in monsoon Jul/Aug and winter fog Dec/Jan)
  const isDelaySeason = month === 6 || month === 7 || month === 11 || month === 0;
  const delayChance = isDelaySeason ? 0.042 : 0.024;
  let delayed = Math.max(15, Math.round(dispatched * delayChance + (seed % 20)));

  // Rare cancelled shipments (0 - 4)
  const cancelled = (seed % 23 === 0) ? 2 : (seed % 47 === 0) ? 4 : 0;

  // Weight & Volume (averaging 42 - 66 KG per consignment across parcel/freight network)
  const avgWeight = 42 + (seed % 24);
  const volumeKg = dispatched * avgWeight;

  // Commercial Revenue (₹1,450 - ₹1,800 per commercial consignment)
  const avgRevenuePerConsignment = 1450 + (seed % 350);
  const revenue = dispatched * avgRevenuePerConsignment;
  const collected = Math.round(revenue * 0.92);

  // Overlay live seeded shipments from mockShipments.ts for dates where they exist
  try {
    const liveShipments = getStoredShipments();
    liveShipments.forEach(s => {
      const liveDateStr = s.dispatchedAt ? s.dispatchedAt.split(' ')[0].split('T')[0] : '';
      if (liveDateStr === dateStr) {
        dispatched += 1;
        if (s.status === 'delivered') delivered = Math.min(dispatched, delivered + 1);
        if (s.status === 'delayed') delayed += 1;
      }
    });
  } catch {
    // Graceful fallback if called outside DOM context
  }

  // Ensure absolute adherence: delivered <= dispatched
  if (delivered > dispatched) delivered = dispatched;

  const eligibleDelivered = Math.max(1, delivered);
  const onTimePercent = Math.min(
    99.2,
    Math.max(91.5, Number((100 - (delayed / eligibleDelivered) * 100).toFixed(1)))
  );

  return {
    date: dateStr,
    dayOfWeek,
    dispatched,
    delivered,
    inTransit,
    delayed,
    cancelled,
    volumeKg,
    revenue,
    collected,
    onTimePercent
  };
}

/**
 * Cache of generated day records to prevent redundant computation
 */
const dayRecordsCache = new Map<string, RawDayRecord>();

function getDayRecord(dateStr: string): RawDayRecord {
  if (!dayRecordsCache.has(dateStr)) {
    dayRecordsCache.set(dateStr, generateDayRecord(dateStr));
  }
  return dayRecordsCache.get(dateStr)!;
}

/**
 * Generates exact 24-hour hourly points for a given day
 * Strictly guarantees that deliveries never exceed dispatched shipments for each hour,
 * and sums match dayRecord.dispatched, dayRecord.delivered, and dayRecord.delayed with zero rounding loss.
 */
function getHourlyPointsForDay(dayRecord: RawDayRecord): ChartDataPoint[] {
  // Realistic hourly wave weights (morning linehaul 06-10, afternoon transfers 13-16, evening departures 18-21)
  // Normalized to sum to exactly 1.0000 across all 24 hours
  const hourlyDispatchedWeights = [
    0.0092, 0.0077, 0.0077, 0.0115, 0.0192, 0.0346, // 00 - 05
    0.0576, 0.0807, 0.0961, 0.0807, 0.0576, 0.0423, // 06 - 11
    0.0346, 0.0423, 0.0500, 0.0576, 0.0423, 0.0346, // 12 - 17
    0.0500, 0.0615, 0.0538, 0.0346, 0.0192, 0.0146  // 18 - 23 (sum = 1.0)
  ];

  // 1. Compute hourly dispatches ensuring exact sum
  const dispArr: number[] = [];
  let remDisp = dayRecord.dispatched;
  for (let h = 0; h < 24; h++) {
    const d = h === 23 ? remDisp : Math.round(dayRecord.dispatched * hourlyDispatchedWeights[h]);
    dispArr.push(Math.max(0, d));
    remDisp -= d;
  }

  // 2. Compute hourly deliveries strictly ensuring del <= disp for every hour AND exact sum
  const delArr: number[] = [];
  const delRatio = dayRecord.dispatched > 0 ? (dayRecord.delivered / dayRecord.dispatched) : 0.92;
  for (let h = 0; h < 24; h++) {
    delArr.push(Math.min(dispArr[h], Math.floor(dispArr[h] * delRatio)));
  }

  // Distribute any remainder so sum(delArr) === dayRecord.delivered without ever exceeding dispArr[h]
  let sumDel = delArr.reduce((a, b) => a + b, 0);
  let delDiff = dayRecord.delivered - sumDel;
  let allocIdx = 8; // start around morning delivery peak
  while (delDiff > 0) {
    if (delArr[allocIdx] < dispArr[allocIdx]) {
      delArr[allocIdx]++;
      delDiff--;
    }
    allocIdx = (allocIdx + 1) % 24;
  }

  // 3. Compute delayed exceptions ensuring exact sum
  const dlyArr: number[] = [];
  let remDly = dayRecord.delayed;
  for (let h = 0; h < 24; h++) {
    const d = h === 23 ? remDly : Math.min(remDly, Math.round(dayRecord.delayed * (dispArr[h] / Math.max(1, dayRecord.dispatched))));
    dlyArr.push(Math.max(0, d));
    remDly -= d;
  }

  const points: ChartDataPoint[] = [];

  for (let h = 0; h < 24; h++) {
    const hourStr = String(h).padStart(2, '0') + ':00';
    const disp = dispArr[h];
    const del = delArr[h];
    const dly = dlyArr[h];

    const volume = Math.round(disp * (dayRecord.volumeKg / Math.max(1, dayRecord.dispatched)));
    const rev = Math.round(disp * (dayRecord.revenue / Math.max(1, dayRecord.dispatched)));

    points.push({
      id: `H-${dayRecord.date}-${hourStr}`,
      label: hourStr,
      shortLabel: `${h}h`,
      fullDateLabel: `${dayRecord.date} at ${hourStr}`,
      date: `${dayRecord.date}T${hourStr}:00`,
      dispatched: disp,
      delivered: del,
      inTransit: Math.round(dayRecord.inTransit / 24),
      delayed: dly,
      cancelled: 0,
      volumeKg: volume,
      revenue: rev,
      collected: Math.round(rev * 0.92),
      onTimePercent: del > 0 ? Math.min(100, Math.max(85, Math.round(((del - dly) / del) * 100))) : 98
    });
  }

  return points;
}

/**
 * Main query function to get analytics data, chart points, and summaries for any period
 */
export function getFreightAnalytics(
  timeframe: AnalyticsTimeframe = '7d',
  referenceDateInput?: Date | string
): AnalyticsPeriodSummary {
  // Normalize reference date (defaults to current simulated application date 2026-11-18)
  let refDate: Date;
  if (!referenceDateInput) {
    const [y, m, d] = CURRENT_SIMULATED_DATE.split('-').map(Number);
    refDate = new Date(y, m - 1, d, 12, 0, 0);
  } else if (typeof referenceDateInput === 'string') {
    const parts = referenceDateInput.split('T')[0].split('-').map(Number);
    refDate = new Date(parts[0], parts[1] - 1, parts[2] || 1, 12, 0, 0);
  } else {
    refDate = new Date(referenceDateInput);
  }

  // Bound to current simulated max date
  const [maxY, maxM, maxD] = CURRENT_SIMULATED_DATE.split('-').map(Number);
  const maxDateObj = new Date(maxY, maxM - 1, maxD, 12, 0, 0);
  if (refDate > maxDateObj) {
    refDate = new Date(maxDateObj);
  }

  // Bound to historical min date
  const [minY, minM, minD] = MIN_HISTORICAL_DATE.split('-').map(Number);
  const minDateObj = new Date(minY, minM - 1, minD, 12, 0, 0);
  if (refDate < minDateObj) {
    refDate = new Date(minDateObj);
  }

  const refYear = refDate.getFullYear();
  const refMonth = refDate.getMonth(); // 0-11
  const refDay = refDate.getDate();
  const refDateStr = `${refYear}-${String(refMonth + 1).padStart(2, '0')}-${String(refDay).padStart(2, '0')}`;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let points: ChartDataPoint[] = [];
  let periodLabel = '';
  let rangeDescription = '';
  let startDate = '';
  let endDate = '';
  let previousDate = new Date(refDate);
  let nextDate = new Date(refDate);
  let canNavigateNext = false;
  let canNavigatePrev = false;

  // -------------------------------------------------------------------------
  // 1. DAY TIMEFRAME (Hourly 24-hour analytics)
  // -------------------------------------------------------------------------
  if (timeframe === 'day') {
    const dayRecord = getDayRecord(refDateStr);
    points = getHourlyPointsForDay(dayRecord);

    periodLabel = `${dayNames[dayRecord.dayOfWeek]}, ${refDay} ${monthShort[refMonth]} ${refYear}`;
    rangeDescription = 'Hourly consignment dispatches and deliveries across national corridors';
    startDate = `${refDateStr}T00:00:00`;
    endDate = `${refDateStr}T23:59:59`;

    previousDate = new Date(refYear, refMonth, refDay - 1, 12, 0, 0);
    nextDate = new Date(refYear, refMonth, refDay + 1, 12, 0, 0);

    canNavigateNext = nextDate <= maxDateObj;
    canNavigatePrev = previousDate >= minDateObj;
  }

  // -------------------------------------------------------------------------
  // 2. MONTH TIMEFRAME (Daily analytics for selected month)
  // -------------------------------------------------------------------------
  else if (timeframe === 'month') {
    const daysInMonth = new Date(refYear, refMonth + 1, 0).getDate();
    periodLabel = `${monthNames[refMonth]} ${refYear}`;
    rangeDescription = `Daily freight performance for ${monthNames[refMonth]} ${refYear} (${daysInMonth} days)`;
    startDate = `${refYear}-${String(refMonth + 1).padStart(2, '0')}-01`;
    endDate = `${refYear}-${String(refMonth + 1).padStart(2, '0')}-${daysInMonth}`;

    const isCurrentActiveMonth = refYear === maxY && refMonth === maxM - 1;
    const maxDayToPopulate = isCurrentActiveMonth ? maxD : daysInMonth;

    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${refYear}-${String(refMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isPastOrToday = d <= maxDayToPopulate;

      if (isPastOrToday) {
        const dayRecord = getDayRecord(dStr);
        points.push({
          id: `M-${dStr}`,
          label: `${d} ${monthShort[refMonth]}`,
          shortLabel: `${d}`,
          fullDateLabel: `${d} ${monthNames[refMonth]} ${refYear}`,
          date: dStr,
          dispatched: dayRecord.dispatched,
          delivered: dayRecord.delivered,
          inTransit: dayRecord.inTransit,
          delayed: dayRecord.delayed,
          cancelled: dayRecord.cancelled,
          volumeKg: dayRecord.volumeKg,
          revenue: dayRecord.revenue,
          collected: dayRecord.collected,
          onTimePercent: dayRecord.onTimePercent
        });
      } else {
        // Future days in current month remain unpopulated
        points.push({
          id: `M-${dStr}`,
          label: `${d} ${monthShort[refMonth]}`,
          shortLabel: `${d}`,
          fullDateLabel: `${d} ${monthNames[refMonth]} ${refYear} (Pending)`,
          date: dStr,
          dispatched: 0,
          delivered: 0,
          inTransit: 0,
          delayed: 0,
          cancelled: 0,
          volumeKg: 0,
          revenue: 0,
          collected: 0,
          onTimePercent: 100
        });
      }
    }

    previousDate = new Date(refYear, refMonth - 1, 15, 12, 0, 0);
    nextDate = new Date(refYear, refMonth + 1, 15, 12, 0, 0);

    canNavigateNext = (nextDate.getFullYear() < maxY) || (nextDate.getFullYear() === maxY && nextDate.getMonth() <= maxM - 1);
    canNavigatePrev = (previousDate.getFullYear() > minY) || (previousDate.getFullYear() === minY && previousDate.getMonth() >= minM - 1);
  }

  // -------------------------------------------------------------------------
  // 3. YEAR TIMEFRAME (12 monthly data points for selected year)
  // -------------------------------------------------------------------------
  else if (timeframe === 'year') {
    periodLabel = `Year ${refYear}`;
    rangeDescription = `Monthly freight volume and logistics revenue for calendar year ${refYear}`;
    startDate = `${refYear}-01-01`;
    endDate = `${refYear}-12-31`;

    for (let m = 0; m < 12; m++) {
      const isPastOrCurrentMonth = (refYear < maxY) || (refYear === maxY && m <= maxM - 1);
      const daysInM = new Date(refYear, m + 1, 0).getDate();
      const maxDay = (refYear === maxY && m === maxM - 1) ? maxD : daysInM;

      let monthDispatched = 0;
      let monthDelivered = 0;
      let monthDelayed = 0;
      let monthCancelled = 0;
      let monthVolume = 0;
      let monthRevenue = 0;
      let monthCollected = 0;

      if (isPastOrCurrentMonth) {
        for (let d = 1; d <= maxDay; d++) {
          const dStr = `${refYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const dayRec = getDayRecord(dStr);
          monthDispatched += dayRec.dispatched;
          monthDelivered += dayRec.delivered;
          monthDelayed += dayRec.delayed;
          monthCancelled += dayRec.cancelled;
          monthVolume += dayRec.volumeKg;
          monthRevenue += dayRec.revenue;
          monthCollected += dayRec.collected;
        }
      }

      const onTimePct = monthDelivered > 0
        ? Math.min(99.4, Math.max(88.0, Number((100 - (monthDelayed / monthDelivered) * 80).toFixed(1))))
        : 100;

      points.push({
        id: `Y-${refYear}-${m}`,
        label: monthShort[m],
        shortLabel: monthShort[m][0],
        fullDateLabel: `${monthNames[m]} ${refYear}`,
        date: `${refYear}-${String(m + 1).padStart(2, '0')}-01`,
        dispatched: monthDispatched,
        delivered: monthDelivered,
        inTransit: Math.round(monthDispatched * 0.05),
        delayed: monthDelayed,
        cancelled: monthCancelled,
        volumeKg: monthVolume,
        revenue: monthRevenue,
        collected: monthCollected,
        onTimePercent: onTimePct
      });
    }

    previousDate = new Date(refYear - 1, 6, 1, 12, 0, 0);
    nextDate = new Date(refYear + 1, 6, 1, 12, 0, 0);

    canNavigateNext = refYear < maxY;
    canNavigatePrev = refYear > minY;
  }

  // -------------------------------------------------------------------------
  // 4. 7D TIMEFRAME (Last 7 Days)
  // -------------------------------------------------------------------------
  else if (timeframe === '7d') {
    const windowStart = new Date(refDate);
    windowStart.setDate(windowStart.getDate() - 6);

    const sDay = windowStart.getDate();
    const sMonth = monthShort[windowStart.getMonth()];
    const eDay = refDate.getDate();
    const eMonth = monthShort[refDate.getMonth()];
    const eYear = refDate.getFullYear();

    periodLabel = `Last 7 Days (${sDay} ${sMonth} – ${eDay} ${eMonth} ${eYear})`;
    rangeDescription = 'Daily consignments dispatched vs delivered for the 7-day period';
    startDate = windowStart.toISOString().split('T')[0];
    endDate = refDateStr;

    const walker = new Date(windowStart);
    while (walker <= refDate) {
      const dStr = walker.toISOString().split('T')[0];
      const dayRecord = getDayRecord(dStr);
      const dayAbbr = dayNames[dayRecord.dayOfWeek].slice(0, 3);

      points.push({
        id: `7D-${dStr}`,
        label: `${dayAbbr} ${walker.getDate()}`,
        shortLabel: dayAbbr,
        fullDateLabel: `${dayNames[dayRecord.dayOfWeek]}, ${walker.getDate()} ${monthShort[walker.getMonth()]} ${walker.getFullYear()}`,
        date: dStr,
        dispatched: dayRecord.dispatched,
        delivered: dayRecord.delivered,
        inTransit: dayRecord.inTransit,
        delayed: dayRecord.delayed,
        cancelled: dayRecord.cancelled,
        volumeKg: dayRecord.volumeKg,
        revenue: dayRecord.revenue,
        collected: dayRecord.collected,
        onTimePercent: dayRecord.onTimePercent
      });

      walker.setDate(walker.getDate() + 1);
    }

    previousDate = new Date(refDate);
    previousDate.setDate(previousDate.getDate() - 7);
    nextDate = new Date(refDate);
    nextDate.setDate(nextDate.getDate() + 7);

    canNavigateNext = nextDate <= maxDateObj;
    canNavigatePrev = previousDate >= minDateObj;
  }

  // -------------------------------------------------------------------------
  // 5. 30D TIMEFRAME (Last 30 Days)
  // -------------------------------------------------------------------------
  else if (timeframe === '30d') {
    const windowStart = new Date(refDate);
    windowStart.setDate(windowStart.getDate() - 29);

    const sDay = windowStart.getDate();
    const sMonth = monthShort[windowStart.getMonth()];
    const eDay = refDate.getDate();
    const eMonth = monthShort[refDate.getMonth()];
    const eYear = refDate.getFullYear();

    periodLabel = `Last 30 Days (${sDay} ${sMonth} – ${eDay} ${eMonth} ${eYear})`;
    rangeDescription = 'Daily freight volume and fulfillment metrics over 30 days';
    startDate = windowStart.toISOString().split('T')[0];
    endDate = refDateStr;

    const walker = new Date(windowStart);
    while (walker <= refDate) {
      const dStr = walker.toISOString().split('T')[0];
      const dayRecord = getDayRecord(dStr);

      points.push({
        id: `30D-${dStr}`,
        label: `${walker.getDate()} ${monthShort[walker.getMonth()]}`,
        shortLabel: `${walker.getDate()}`,
        fullDateLabel: `${walker.getDate()} ${monthNames[walker.getMonth()]} ${walker.getFullYear()}`,
        date: dStr,
        dispatched: dayRecord.dispatched,
        delivered: dayRecord.delivered,
        inTransit: dayRecord.inTransit,
        delayed: dayRecord.delayed,
        cancelled: dayRecord.cancelled,
        volumeKg: dayRecord.volumeKg,
        revenue: dayRecord.revenue,
        collected: dayRecord.collected,
        onTimePercent: dayRecord.onTimePercent
      });

      walker.setDate(walker.getDate() + 1);
    }

    previousDate = new Date(refDate);
    previousDate.setDate(previousDate.getDate() - 30);
    nextDate = new Date(refDate);
    nextDate.setDate(nextDate.getDate() + 30);

    canNavigateNext = nextDate <= maxDateObj;
    canNavigatePrev = previousDate >= minDateObj;
  }

  // -------------------------------------------------------------------------
  // 6. 90D TIMEFRAME (Quarter / Last 90 Days grouped by 13 weeks)
  // -------------------------------------------------------------------------
  else if (timeframe === '90d') {
    const windowStart = new Date(refDate);
    windowStart.setDate(windowStart.getDate() - 89);

    const sDay = windowStart.getDate();
    const sMonth = monthShort[windowStart.getMonth()];
    const eDay = refDate.getDate();
    const eMonth = monthShort[refDate.getMonth()];
    const eYear = refDate.getFullYear();

    periodLabel = `Quarter (90 Days: ${sDay} ${sMonth} – ${eDay} ${eMonth} ${eYear})`;
    rangeDescription = 'Weekly consolidated dispatch volume and velocity trends over 90 days';
    startDate = windowStart.toISOString().split('T')[0];
    endDate = refDateStr;

    // Group into 13 distinct 7-day week chunks
    const walker = new Date(windowStart);
    let weekIndex = 1;

    while (walker <= refDate) {
      const weekStart = new Date(walker);
      const weekEnd = new Date(walker);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > refDate) weekEnd.setTime(refDate.getTime());

      let wDisp = 0;
      let wDel = 0;
      let wDly = 0;
      let wCanc = 0;
      let wVol = 0;
      let wRev = 0;
      let wColl = 0;

      const subWalker = new Date(weekStart);
      while (subWalker <= weekEnd) {
        const dStr = subWalker.toISOString().split('T')[0];
        const dayRec = getDayRecord(dStr);
        wDisp += dayRec.dispatched;
        wDel += dayRec.delivered;
        wDly += dayRec.delayed;
        wCanc += dayRec.cancelled;
        wVol += dayRec.volumeKg;
        wRev += dayRec.revenue;
        wColl += dayRec.collected;
        subWalker.setDate(subWalker.getDate() + 1);
      }

      const onTimeRate = wDel > 0
        ? Math.min(99.2, Math.max(88.0, Number((100 - (wDly / wDel) * 80).toFixed(1))))
        : 97;

      points.push({
        id: `90D-W${weekIndex}-${weekStart.toISOString().split('T')[0]}`,
        label: `W${weekIndex} (${weekStart.getDate()} ${monthShort[weekStart.getMonth()]})`,
        shortLabel: `W${weekIndex}`,
        fullDateLabel: `Week ${weekIndex}: ${weekStart.getDate()} ${monthShort[weekStart.getMonth()]} – ${weekEnd.getDate()} ${monthShort[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`,
        date: weekStart.toISOString().split('T')[0],
        dispatched: wDisp,
        delivered: wDel,
        inTransit: Math.round(wDisp * 0.12),
        delayed: wDly,
        cancelled: wCanc,
        volumeKg: wVol,
        revenue: wRev,
        collected: wColl,
        onTimePercent: onTimeRate
      });

      weekIndex++;
      walker.setDate(walker.getDate() + 7);
    }

    previousDate = new Date(refDate);
    previousDate.setDate(previousDate.getDate() - 90);
    nextDate = new Date(refDate);
    nextDate.setDate(nextDate.getDate() + 90);

    canNavigateNext = nextDate <= maxDateObj;
    canNavigatePrev = previousDate >= minDateObj;
  }

  // -------------------------------------------------------------------------
  // Compute Aggregates and Peak Volume
  // -------------------------------------------------------------------------
  const totalDispatched = points.reduce((acc, p) => acc + p.dispatched, 0);
  const totalDelivered = points.reduce((acc, p) => acc + p.delivered, 0);
  const totalInTransit = points.reduce((acc, p) => acc + p.inTransit, 0);
  const totalDelayed = points.reduce((acc, p) => acc + p.delayed, 0);
  const totalCancelled = points.reduce((acc, p) => acc + p.cancelled, 0);
  const totalVolumeKg = points.reduce((acc, p) => acc + p.volumeKg, 0);
  const totalRevenue = points.reduce((acc, p) => acc + p.revenue, 0);
  const totalCollected = points.reduce((acc, p) => acc + p.collected, 0);

  const onTimeSlaRate = totalDelivered > 0
    ? Math.min(99.4, Math.max(87.5, Number((((totalDelivered - totalDelayed) / totalDelivered) * 100).toFixed(1))))
    : 96.2;

  // Find peak volume point
  let peakPoint = {
    label: points[0]?.label || 'N/A',
    dispatched: points[0]?.dispatched || 0,
    delivered: points[0]?.delivered || 0,
    volumeKg: points[0]?.volumeKg || 0
  };

  let maxTotalActivity = -1;
  for (const pt of points) {
    const activity = pt.dispatched + pt.delivered;
    if (activity > maxTotalActivity) {
      maxTotalActivity = activity;
      peakPoint = {
        label: pt.label,
        dispatched: pt.dispatched,
        delivered: pt.delivered,
        volumeKg: pt.volumeKg
      };
    }
  }

  return {
    timeframe,
    periodLabel,
    rangeDescription,
    startDate,
    endDate,
    totalDispatched,
    totalDelivered,
    totalInTransit,
    totalDelayed,
    totalCancelled,
    totalVolumeKg,
    totalRevenue,
    totalCollected,
    onTimeSlaRate,
    peakPoint,
    canNavigateNext,
    canNavigatePrev,
    previousDate,
    nextDate,
    points
  };
}
