import React, { useState, useMemo, useEffect } from 'react';
import type { AnalyticsTimeframe, ChartDataPoint, AnalyticsPeriodSummary } from '../../types/analytics';
import { getFreightAnalytics, CURRENT_SIMULATED_DATE } from '../../data/mockAnalyticsData';
import { AppIcon } from '../common/AppIcon';

interface FreightVolumeVelocityChartProps {
  initialTimeframe?: AnalyticsTimeframe;
  initialDate?: string;
  onPeriodChange?: (summary: AnalyticsPeriodSummary) => void;
  className?: string;
}

export const FreightVolumeVelocityChart: React.FC<FreightVolumeVelocityChartProps> = ({
  initialTimeframe = '7d',
  initialDate = CURRENT_SIMULATED_DATE,
  onPeriodChange,
  className = '',
}) => {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>(initialTimeframe);
  const [currentDate, setCurrentDate] = useState<string>(initialDate);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  // Re-fetch analytics whenever timeframe or currentDate changes
  const summary: AnalyticsPeriodSummary = useMemo(() => {
    return getFreightAnalytics(timeframe, currentDate);
  }, [timeframe, currentDate]);

  // Notify parent of summary metrics update
  useEffect(() => {
    if (onPeriodChange) {
      onPeriodChange(summary);
    }
  }, [summary, onPeriodChange]);

  // Handlers for navigation
  const handlePrev = () => {
    if (summary.canNavigatePrev) {
      const prevStr = summary.previousDate.toISOString().split('T')[0];
      setCurrentDate(prevStr);
    }
  };

  const handleNext = () => {
    if (summary.canNavigateNext) {
      const nextStr = summary.nextDate.toISOString().split('T')[0];
      setCurrentDate(nextStr);
    }
  };

  const handleResetToToday = () => {
    setCurrentDate(CURRENT_SIMULATED_DATE);
  };

  // SVG Chart Geometry Calculations
  const chartWidth = 700;
  const chartHeight = 220;
  const padLeft = 60; // Room for up to 6-digit thousands separators e.g. "75,000"
  const padRight = 20;
  const padTop = 25;
  const padBottom = 175;
  const usableWidth = chartWidth - padLeft - padRight;
  const usableHeight = padBottom - padTop;

  const points = summary.points;
  const hasData = points.length > 0 && (summary.totalDispatched > 0 || summary.totalDelivered > 0);

  // Determine Max Y value
  const maxDispatched = Math.max(...points.map((p) => p.dispatched), 0);
  const maxDelivered = Math.max(...points.map((p) => p.delivered), 0);
  const rawMax = Math.max(maxDispatched, maxDelivered, 5);

  // Compute clean, readable Y-axis scale and tick values with thousands support
  const { yCeil, yTicks } = useMemo(() => {
    const targetSteps = 3;
    const rawStep = Math.max(1, rawMax / targetSteps);
    const power = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / power;
    let mult = 10;
    if (norm <= 1) mult = 1;
    else if (norm <= 1.5) mult = 1.5;
    else if (norm <= 2) mult = 2;
    else if (norm <= 2.5) mult = 2.5;
    else if (norm <= 3) mult = 3;
    else if (norm <= 4) mult = 4;
    else if (norm <= 5) mult = 5;
    else if (norm <= 6) mult = 6;
    else if (norm <= 7.5) mult = 7.5;
    else mult = 10;

    const step = Math.max(1, Math.round(mult * power));
    const ceil = step * targetSteps;
    return {
      yCeil: ceil,
      yTicks: [
        { value: ceil, y: padTop },
        { value: Math.round(step * 2), y: padTop + usableHeight * 0.333 },
        { value: Math.round(step), y: padTop + usableHeight * 0.667 },
        { value: 0, y: padBottom },
      ],
    };
  }, [rawMax, padTop, usableHeight, padBottom]);

  // Map each point to X, Y coordinates
  const mappedPoints = useMemo(() => {
    const len = points.length;
    if (len === 0) return [];
    if (len === 1) {
      const p = points[0];
      const x = padLeft + usableWidth / 2;
      const yDisp = padBottom - (p.dispatched / yCeil) * usableHeight;
      const yDel = padBottom - (p.delivered / yCeil) * usableHeight;
      return [{ ...p, x, yDisp, yDel, originalIndex: 0 }];
    }

    return points.map((p, i) => {
      const x = padLeft + (i / (len - 1)) * usableWidth;
      const yDisp = padBottom - (p.dispatched / yCeil) * usableHeight;
      const yDel = padBottom - (p.delivered / yCeil) * usableHeight;
      return {
        ...p,
        x,
        yDisp,
        yDel,
        originalIndex: i,
      };
    });
  }, [points, yCeil, usableWidth, usableHeight, padLeft, padBottom]);

  // Construct SVG Path strings
  const { dispatchedPath, dispatchedAreaPath, deliveredPath } = useMemo(() => {
    if (mappedPoints.length === 0) {
      return { dispatchedPath: '', dispatchedAreaPath: '', deliveredPath: '' };
    }

    if (mappedPoints.length === 1) {
      const pt = mappedPoints[0];
      return {
        dispatchedPath: `M ${pt.x - 20} ${pt.yDisp} L ${pt.x + 20} ${pt.yDisp}`,
        dispatchedAreaPath: `M ${pt.x - 20} ${pt.yDisp} L ${pt.x + 20} ${pt.yDisp} L ${pt.x + 20} ${padBottom} L ${pt.x - 20} ${padBottom} Z`,
        deliveredPath: `M ${pt.x - 20} ${pt.yDel} L ${pt.x + 20} ${pt.yDel}`,
      };
    }

    // Build Monotone / Smooth Bezier path
    let dPath = `M ${mappedPoints[0].x} ${mappedPoints[0].yDisp}`;
    let delPath = `M ${mappedPoints[0].x} ${mappedPoints[0].yDel}`;

    for (let i = 0; i < mappedPoints.length - 1; i++) {
      const p0 = mappedPoints[i];
      const p1 = mappedPoints[i + 1];
      const cx = (p0.x + p1.x) / 2;

      dPath += ` C ${cx} ${p0.yDisp}, ${cx} ${p1.yDisp}, ${p1.x} ${p1.yDisp}`;
      delPath += ` C ${cx} ${p0.yDel}, ${cx} ${p1.yDel}, ${p1.x} ${p1.yDel}`;
    }

    const firstPt = mappedPoints[0];
    const lastPt = mappedPoints[mappedPoints.length - 1];
    const areaPath = `${dPath} L ${lastPt.x} ${padBottom} L ${firstPt.x} ${padBottom} Z`;

    return {
      dispatchedPath: dPath,
      dispatchedAreaPath: areaPath,
      deliveredPath: delPath,
    };
  }, [mappedPoints, padBottom]);

  // Smart label interval filter to avoid overlapping text
  const isLabelVisible = (index: number, total: number) => {
    if (timeframe === '7d') return true;
    if (timeframe === 'year') return true;
    if (timeframe === 'day') return index % 3 === 0 || index === total - 1;
    if (timeframe === 'month' || timeframe === '30d') return index % 5 === 0 || index === total - 1;
    if (timeframe === '90d') return index % 2 === 0 || index === total - 1;
    return true;
  };

  const isCurrentMaxDate = currentDate >= CURRENT_SIMULATED_DATE;

  return (
    <div className={`bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-saas-sm space-y-4 transition-colors ${className}`}>
      {/* ------------------------------------------------------------- */}
      {/* 1. Header: Title, Timeframe Buttons, and Date Navigator       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <AppIcon name="trending-up" size={16} />
            </span>
            <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white tracking-tight">
              Weekly Freight Volume & Velocity
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Simulated Demo Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {summary.rangeDescription}
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Presets */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
            {(['day', 'month', 'year'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTimeframe(mode)}
                className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                  timeframe === mode
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}

            <span className="w-px h-3.5 bg-slate-300 dark:bg-slate-600 mx-1"></span>

            {(['7d', '30d', '90d'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg transition-all uppercase ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Date Range Navigation Controls */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-1 rounded-xl text-xs">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={!summary.canNavigatePrev}
              className={`p-1.5 rounded-lg transition-colors ${
                summary.canNavigatePrev
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
              }`}
              title="Previous period"
              aria-label="Previous period"
            >
              <AppIcon name="chevron-left" size={14} />
            </button>

            {/* Current Range Label */}
            <div className="px-2 py-0.5 font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs flex items-center gap-1.5 min-w-[130px] sm:min-w-[150px] justify-center text-center">
              <AppIcon name="calendar" size={12} className="text-orange-500 shrink-0" />
              <span className="truncate">{summary.periodLabel}</span>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!summary.canNavigateNext}
              className={`p-1.5 rounded-lg transition-colors ${
                summary.canNavigateNext
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
              }`}
              title={summary.canNavigateNext ? 'Next period' : 'Next period (future dates unavailable)'}
              aria-label="Next period"
            >
              <AppIcon name="chevron-right" size={14} />
            </button>

            {/* Return to Latest Button if currently browsing history */}
            {!isCurrentMaxDate && (
              <button
                type="button"
                onClick={handleResetToToday}
                className="ml-1 px-2 py-0.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors shadow-2xs"
                title="Return to latest simulated date"
              >
                Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Dynamic Period Summary KPI Strip (Dispatches, Deliveries, SLA) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Dispatched</div>
          <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-0.5">
            {summary.totalDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">Consignments</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Delivered</div>
          <div className="font-mono font-bold text-base sm:text-lg text-emerald-600 dark:text-emerald-400 mt-0.5">
            {summary.totalDelivered.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Safely Received</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">In-Transit</div>
          <div className="font-mono font-bold text-base sm:text-lg text-amber-600 dark:text-amber-400 mt-0.5">
            {summary.totalInTransit.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Active En-Route</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Delayed</div>
          <div className="font-mono font-bold text-base sm:text-lg text-rose-600 dark:text-rose-400 mt-0.5">
            {summary.totalDelayed.toLocaleString()}
          </div>
          <div className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">Exceptions</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">On-Time SLA</div>
          <div className="font-mono font-bold text-base sm:text-lg text-purple-600 dark:text-purple-400 mt-0.5">
            {summary.onTimeSlaRate}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Adherence</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-2.5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Tonnage</div>
          <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-0.5">
            {(summary.totalVolumeKg / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">T</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Freight Load</div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Interactive SVG Area & Line Chart                          */}
      {/* ------------------------------------------------------------- */}
      <div className="relative pt-2">
        {hasData ? (
          <div className="h-60 sm:h-72 w-full relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible select-none"
            >
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Y-Gridlines and Labels */}
              {yTicks.map((tick) => (
                <g key={`ytick-${tick.y}`}>
                  <line
                    x1={padLeft}
                    y1={tick.y}
                    x2={chartWidth - padRight}
                    y2={tick.y}
                    stroke={tick.value === 0 ? 'var(--chart-axis)' : 'var(--chart-grid)'}
                    strokeWidth={tick.value === 0 ? '1.5' : '1'}
                    strokeDasharray={tick.value === 0 ? undefined : '3 3'}
                  />
                  <text
                    x={padLeft - 8}
                    y={tick.y + 3.5}
                    fontSize="10"
                    fill="var(--chart-text)"
                    textAnchor="end"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {tick.value.toLocaleString()}
                  </text>
                </g>
              ))}

              {/* Smooth Dispatched Area Gradient Fill */}
              {dispatchedAreaPath && (
                <path d={dispatchedAreaPath} fill="url(#velocityGrad)" />
              )}

              {/* Dispatched Primary Line (Orange) */}
              {dispatchedPath && (
                <path
                  d={dispatchedPath}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Delivered Secondary Line (Emerald Dashed) */}
              {deliveredPath && (
                <path
                  d={deliveredPath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Hover Cursor Vertical Guide Line */}
              {hoveredPoint && (
                <g>
                  {(() => {
                    const match = mappedPoints.find((mp) => mp.id === hoveredPoint.id);
                    if (!match) return null;
                    return (
                      <>
                        <line
                          x1={match.x}
                          y1={padTop}
                          x2={match.x}
                          y2={padBottom}
                          stroke="#94A3B8"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                        {/* Hover Highlight Dot for Dispatched */}
                        <circle
                          cx={match.x}
                          cy={match.yDisp}
                          r="5"
                          fill="#F97316"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        {/* Hover Highlight Dot for Delivered */}
                        <circle
                          cx={match.x}
                          cy={match.yDel}
                          r="4.5"
                          fill="#10B981"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Data Point Dots & X-Axis Labels */}
              {mappedPoints.map((pt) => {
                const showLabel = isLabelVisible(pt.originalIndex, mappedPoints.length);

                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onMouseOver={() => setHoveredPoint(pt)}
                  >
                    {/* Invisible transparent hit area for hover */}
                    <rect
                      x={pt.x - (usableWidth / Math.max(1, mappedPoints.length * 2))}
                      y={padTop}
                      width={usableWidth / Math.max(1, mappedPoints.length)}
                      height={padBottom - padTop}
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseOver={() => setHoveredPoint(pt)}
                    />

                    {/* Discreet Point Dots */}
                    <circle
                      cx={pt.x}
                      cy={pt.yDisp}
                      r="2.5"
                      fill="#F97316"
                      className="group-hover:r-4 transition-all"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.yDel}
                      r="2"
                      fill="#10B981"
                      className="group-hover:r-3.5 transition-all"
                    />

                    {/* X-Axis Tick and Label */}
                    {showLabel && (
                      <g>
                        <line
                          x1={pt.x}
                          y1={padBottom}
                          x2={pt.x}
                          y2={padBottom + 5}
                          stroke="var(--chart-axis)"
                          strokeWidth="1"
                        />
                        <text
                          x={pt.x}
                          y={padBottom + 18}
                          fontSize="10"
                          fill={hoveredPoint?.id === pt.id ? 'var(--chart-text-active)' : 'var(--chart-text)'}
                          fontWeight={hoveredPoint?.id === pt.id ? '700' : '500'}
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {pt.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute z-20 pointer-events-none bg-slate-900/95 dark:bg-[#0B1220]/95 border border-slate-700/80 dark:border-slate-600 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 transition-all -translate-x-1/2 -translate-y-full backdrop-blur-xs"
                style={{
                  left: `${((mappedPoints.find((p) => p.id === hoveredPoint.id)?.x || 0) / chartWidth) * 100}%`,
                  top: '25%',
                }}
              >
                <div className="font-bold border-b border-slate-700/80 pb-1 text-[11px] text-slate-200">
                  {hoveredPoint.fullDateLabel}
                </div>
                <div className="flex items-center justify-between gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 text-orange-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Dispatched:
                  </span>
                  <span className="font-mono font-bold">{hoveredPoint.dispatched.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Delivered:
                  </span>
                  <span className="font-mono font-bold">{hoveredPoint.delivered.toLocaleString()}</span>
                </div>
                {hoveredPoint.delayed > 0 && (
                  <div className="flex items-center justify-between gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Delayed:
                    </span>
                    <span className="font-mono font-bold text-rose-300">{hoveredPoint.delayed.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 pt-0.5 border-t border-slate-800">
                  <span>Weight Volume:</span>
                  <span className="font-mono">
                    {(hoveredPoint.volumeKg / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} T
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State if no data recorded for selected period */
          <div className="h-60 sm:h-72 w-full flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
              <AppIcon name="calendar" size={20} />
            </div>
            <div className="font-bold text-sm text-slate-700 dark:text-slate-200">No Consignment Activity Recorded</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              No historical dispatch or delivery movements found for {summary.periodLabel}.
            </p>
            <button
              type="button"
              onClick={handleResetToToday}
              className="mt-3 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Jump to Latest Activity
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Chart Legend & Peak Volume Footer                          */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-2 border-t border-slate-100 dark:border-slate-700/80 pt-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded-full bg-orange-500 inline-block"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Dispatches Outbound</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded-full bg-emerald-500 inline-block border-b border-dashed border-emerald-600"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Delivered Inbound</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300">Peak Volume:</span>
            <span>
              {summary.peakPoint.label} ({summary.peakPoint.dispatched.toLocaleString()} dispatched, {summary.peakPoint.delivered.toLocaleString()} delivered)
            </span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 italic">
          * Note: All metrics represent simulated enterprise demo analytics to showcase high-scale logistics capacity.
        </div>
      </div>
    </div>
  );
};
