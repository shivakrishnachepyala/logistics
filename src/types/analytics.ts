export type AnalyticsTimeframe = 'day' | 'month' | 'year' | '7d' | '30d' | '90d';

export interface ChartDataPoint {
  id: string;
  label: string;          // Formatted X-axis label (e.g. "08:00", "15 Nov", "Oct", etc.)
  shortLabel: string;     // Ultra-compact label for mobile view
  fullDateLabel: string;  // Detailed label for hover tooltip
  date: string;           // ISO date string
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

export interface AnalyticsPeriodSummary {
  timeframe: AnalyticsTimeframe;
  periodLabel: string;         // e.g. "Wednesday, 18 Nov 2026" or "November 2026"
  rangeDescription: string;    // e.g. "Hourly consignment velocity"
  startDate: string;
  endDate: string;
  totalDispatched: number;
  totalDelivered: number;
  totalInTransit: number;
  totalDelayed: number;
  totalCancelled: number;
  totalVolumeKg: number;
  totalRevenue: number;
  totalCollected: number;
  onTimeSlaRate: number;       // SLA Percentage
  peakPoint: {
    label: string;
    dispatched: number;
    delivered: number;
    volumeKg: number;
  };
  canNavigateNext: boolean;
  canNavigatePrev: boolean;
  previousDate: Date;
  nextDate: Date;
  points: ChartDataPoint[];
}
