import React from 'react';
import type { Shipment, Checkpoint } from '../../types';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { StatusBadge } from '../common/StatusBadge';
import { useTranslation } from '../../context/LanguageContext';

interface TrackingTimelineProps {
  shipment: Shipment;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ shipment }) => {
  const { lang, t } = useTranslation();
  const checkpoints = shipment.checkpoints || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
            {t('track.timelineTitle', 'Transit Checkpoints & Milestones')}
          </h2>
        </div>
        <div className="text-xs text-orange-400 font-medium">
          {checkpoints.filter(c => c.completed).length} / {checkpoints.length} {lang === 'hi' ? 'पड़ाव पूरे हुए' : 'Checkpoints Complete'}
        </div>
      </div>

      {/* Progress Bar with Moving Vehicle */}
      <div className="bg-slate-50 p-5 border-b border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            <IndustrialIcon name="pin" size={14} className="text-slate-400" />
            <span>{shipment.originHubCode}</span>
          </span>
          <span className="text-orange-600 font-semibold font-mono text-xs">
            {lang === 'hi' ? 'यात्रा पूरी:' : 'Progress:'} {shipment.progressPercent}%
          </span>
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            <IndustrialIcon name="pin" size={14} className="text-orange-500" />
            <span>{shipment.destinationHubCode}</span>
          </span>
        </div>

        {/* Track Line with moving vehicle */}
        <div className="relative w-full h-2.5 bg-slate-200 rounded-full my-4">
          {/* Filled progress */}
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${shipment.progressPercent}%` }}
          />

          {/* Animated moving vehicle token on top of progress line */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-orange-500 text-white p-1 rounded-full shadow-md z-10 transition-all duration-300 border-2 border-white"
            style={{ left: `${shipment.progressPercent}%` }}
            title={`Parcel progress: ${shipment.progressPercent}%`}
          >
            <IndustrialIcon name="truck" size={12} />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500">
          <span>{lang === 'hi' ? 'सेंटर से रवाना:' : 'Dispatched:'} {shipment.dispatchedAt.slice(0, 10)}</span>
          <span className="text-slate-900 font-medium hidden sm:inline">{lang === 'hi' ? 'गाड़ी:' : 'Vehicle:'} {shipment.vesselOrFlight || shipment.carrier}</span>
          <span className="text-orange-600 font-semibold">{lang === 'hi' ? 'संभावित डिलीवरी:' : 'Expected:'} {shipment.deliveryTimeEstimate || shipment.eta.slice(0, 10)}</span>
        </div>
      </div>

      {/* Delay History Timeline Line (If present) */}
      {shipment.delayInfo && (
        <div className="mx-4 sm:mx-6 mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IndustrialIcon name="alert" size={16} className="text-amber-600 shrink-0" />
            <div>
              <span className="font-semibold uppercase text-amber-800 mr-2">
                {lang === 'hi' ? 'देरी का विवरण:' : 'Delay History:'}
              </span>
              <span className="text-slate-800">
                {shipment.delayInfo.historyText || `Expected ${shipment.delayInfo.originalEta} → Revised ${shipment.delayInfo.revisedEta}`}
              </span>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 font-bold rounded text-[11px] w-fit shrink-0">
            +{shipment.delayInfo.durationText}
          </span>
        </div>
      )}

      {/* Vertical Checkpoints Sequence */}
      <div className="p-5 sm:p-6 space-y-0">
        {checkpoints.map((cp: Checkpoint, idx: number) => {
          const isLast = idx === checkpoints.length - 1;
          const isPassed = cp.completed;
          const isCurrentActive = cp.isCurrent;

          return (
            <div key={cp.id} className="relative flex items-start group">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[17px] top-7 bottom-0 w-[2px] ${
                    isPassed ? 'bg-slate-300' : 'bg-slate-200 border-dashed border-l border-slate-300'
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Milestone Node Icon */}
              <div className="relative z-10 mr-4 shrink-0 mt-0.5">
                {isPassed ? (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                    isCurrentActive ? 'bg-orange-500 text-white ring-4 ring-orange-100' : 'bg-emerald-500 text-white'
                  }`}>
                    {isCurrentActive ? (
                      <IndustrialIcon name="truck" size={16} />
                    ) : (
                      <IndustrialIcon name="check" size={16} />
                    )}
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center font-mono text-[11px] text-slate-400">
                    0{idx + 1}
                  </div>
                )}
              </div>

              {/* Checkpoint Card */}
              <div className={`flex-1 mb-5 p-4 rounded-xl border transition-all duration-150 ${
                isCurrentActive
                  ? 'bg-orange-50/40 border-orange-200 shadow-sm'
                  : isPassed
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-100 opacity-60'
              }`}>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {cp.facilityCode}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {cp.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge 
                      status={cp.status} 
                      size="sm" 
                      showPulse={isCurrentActive} 
                    />
                  </div>
                </div>

                {/* Location and recorded time */}
                <div className="text-xs text-slate-500 mb-2 flex flex-wrap items-center gap-x-4">
                  <span>{lang === 'hi' ? 'स्थान:' : 'Location:'} <strong className="text-slate-800 font-medium">{cp.city}, {cp.country}</strong></span>
                  <span>{lang === 'hi' ? 'समय:' : 'Timestamp:'} <strong className="text-slate-800 font-medium">{cp.timestamp}</strong></span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cp.description}
                </p>

                {/* Active Subtext */}
                {isCurrentActive && (
                  <div className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-center justify-between text-xs text-orange-600">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                      {lang === 'hi' ? 'वर्तमान स्थिति - गाड़ी चल रही है' : 'Active Corridor Status: Moving on Highway'}
                    </span>
                    <span className="text-slate-500 text-[11px] hidden sm:inline">
                      {lang === 'hi' ? 'अगला अपडेट 15 मिनट में' : 'Next telematics refresh in 15 min'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
