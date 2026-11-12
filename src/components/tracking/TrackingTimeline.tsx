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
    <div className="bg-chalk border-[1.5px] border-asphalt stamp">
      {/* Header */}
      <div className="bg-asphalt text-paper px-4 py-3 flex items-center justify-between border-b border-asphalt">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-yellow inline-block"></span>
          <h2 className="font-heading font-black text-base uppercase tracking-wider text-paper">
            {t('track.timelineTitle')}
          </h2>
        </div>
        <div className="font-mono text-xs text-yellow font-bold">
          {checkpoints.filter(c => c.completed).length} / {checkpoints.length} {lang === 'hi' ? 'पड़ाव पूरे हुए' : 'STAGES COMPLETED'}
        </div>
      </div>

      {/* Progress Bar with Moving Vehicle */}
      <div className="bg-paper p-4 border-b border-asphalt">
        <div className="flex items-center justify-between font-mono text-xs text-steel mb-1.5">
          <span className="font-bold text-asphalt flex items-center gap-1.5">
            <IndustrialIcon name="pin" size={12} className="text-teal" />
            <span>{shipment.originHubCode}</span>
          </span>
          <span className="text-orange font-bold font-mono">
            {lang === 'hi' ? 'यात्रा पूरी:' : 'PROGRESS:'} {shipment.progressPercent}%
          </span>
          <span className="font-bold text-asphalt flex items-center gap-1.5">
            <IndustrialIcon name="pin" size={12} className="text-orange" />
            <span>{shipment.destinationHubCode}</span>
          </span>
        </div>

        {/* Track Line with moving vehicle */}
        <div className="relative w-full h-4 bg-[#EAE5D9] border border-asphalt rounded-[2px] overflow-visible my-3">
          {/* Filled progress */}
          <div
            className="h-full bg-asphalt transition-all duration-300"
            style={{ width: `${shipment.progressPercent}%` }}
          />

          {/* Animated moving vehicle token on top of progress line */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-orange text-white p-1 border-[1.5px] border-asphalt rounded-[2px] shadow-sm z-10 transition-all duration-300"
            style={{ left: `${shipment.progressPercent}%` }}
            title={`Parcel progress: ${shipment.progressPercent}%`}
          >
            <IndustrialIcon name="truck" size={14} />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-steel">
          <span>{lang === 'hi' ? 'सेंटर से रवाना:' : 'PICKED UP:'} {shipment.dispatchedAt.slice(0, 10)}</span>
          <span className="text-asphalt font-bold">{lang === 'hi' ? 'गाड़ी:' : 'VEHICLE:'} {shipment.vesselOrFlight || shipment.carrier}</span>
          <span className="text-orange font-bold">{lang === 'hi' ? 'संभावित डिलीवरी:' : 'EXPECTED:'} {shipment.deliveryTimeEstimate || shipment.eta.slice(0, 10)}</span>
        </div>
      </div>

      {/* Delay History Timeline Line (Phase 1 Requirement) */}
      {shipment.delayInfo && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-yellow-soft border-[1.5px] border-yellow text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 stamp-sm">
          <div className="flex items-center gap-2">
            <IndustrialIcon name="alert" size={16} className="text-orange shrink-0" />
            <div>
              <span className="font-heading font-black uppercase text-orange mr-2">
                {lang === 'hi' ? 'देरी का इतिहास:' : 'DELAY HISTORY:'}
              </span>
              <span className="font-bold text-asphalt">
                {shipment.delayInfo.historyText || `Expected ${shipment.delayInfo.originalEta} → Now ${shipment.delayInfo.revisedEta}, because of ${shipment.delayInfo.reason}`}
              </span>
            </div>
          </div>
          <span className="bg-yellow text-asphalt px-2 py-0.5 font-bold border border-asphalt text-[10px] w-fit shrink-0">
            +{shipment.delayInfo.durationText}
          </span>
        </div>
      )}

      {/* Vertical Checkpoints Sequence */}
      <div className="p-4 sm:p-6 space-y-0">
        {checkpoints.map((cp: Checkpoint, idx: number) => {
          const isLast = idx === checkpoints.length - 1;
          const isPassed = cp.completed;
          const isCurrentActive = cp.isCurrent;

          return (
            <div key={cp.id} className="relative flex items-start group">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[19px] top-7 bottom-0 w-[2px] ${
                    isPassed ? 'bg-asphalt' : 'bg-steel-border border-dashed border-l border-steel'
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Milestone Icon */}
              <div className="relative z-10 mr-4 shrink-0 mt-0.5">
                {isPassed ? (
                  <div className={`w-10 h-10 border-[1.5px] border-asphalt flex items-center justify-center font-bold text-xs stamp-sm ${
                    isCurrentActive ? 'bg-orange text-white' : 'bg-teal text-white'
                  }`}>
                    {isCurrentActive ? (
                      <IndustrialIcon name="truck" size={18} />
                    ) : (
                      <IndustrialIcon name="check" size={18} />
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 border-[1.5px] border-steel bg-[#EAE5D9] flex items-center justify-center font-mono text-xs text-steel">
                    0{idx + 1}
                  </div>
                )}
              </div>

              {/* Checkpoint Card */}
              <div className={`flex-1 mb-6 p-3.5 sm:p-4 border-[1.5px] rounded-[2px] transition-all duration-150 ${
                isCurrentActive 
                  ? 'bg-paper border-orange stamp' 
                  : isPassed 
                    ? 'bg-chalk border-asphalt stamp-sm' 
                    : 'bg-[#FAF7F0] border-steel-border opacity-70'
              }`}>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-steel-border pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-asphalt bg-[#E8E2D5] px-1.5 py-0.5 border border-steel">
                      {cp.facilityCode}
                    </span>
                    <span className="font-heading font-black text-sm uppercase tracking-wide text-asphalt">
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
                <div className="font-mono text-[11px] text-steel mb-2 flex flex-wrap items-center gap-x-4">
                  <span>{lang === 'hi' ? 'स्थान:' : 'LOCATION:'} <strong className="text-asphalt font-semibold">{cp.city}, {cp.country}</strong></span>
                  <span>{lang === 'hi' ? 'समय:' : 'TIME:'} <strong className="text-asphalt font-semibold">{cp.timestamp}</strong></span>
                </div>

                {/* Plain description in simple words */}
                <p className="text-xs sm:text-sm font-body text-asphalt leading-relaxed">
                  {cp.description}
                </p>

                {/* Active Subtext */}
                {isCurrentActive && (
                  <div className="mt-3 pt-2 border-t border-dashed border-orange flex items-center justify-between text-[11px] font-mono text-orange">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="inline-block w-2 h-2 bg-orange animate-ping rounded-full"></span>
                      {lang === 'hi' ? 'वर्तमान स्थिति - गाड़ी चल रही है' : 'ACTIVE LOCATION - PARCEL IS MOVING'}
                    </span>
                    <span className="text-asphalt text-[10px]">
                      {lang === 'hi' ? 'अगला अपडेट 15 मिनट में' : 'NEXT UPDATE IN 15 MIN'}
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
