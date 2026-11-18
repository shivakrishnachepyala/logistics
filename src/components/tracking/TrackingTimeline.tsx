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

  // Rule: If the revised delivery date is unknown, explicitly display "New delivery estimate pending" instead of inventing a date.
  const isRevisedUnknown = !shipment.delayInfo?.revisedEta ||
    shipment.delayInfo.revisedEta.trim() === '' ||
    shipment.delayInfo.revisedEta.toLowerCase().includes('pending') ||
    shipment.delayInfo.revisedEta.toLowerCase().includes('recalculation') ||
    shipment.delayInfo.revisedEta.toLowerCase().includes('unknown');

  const revisedEtaText = isRevisedUnknown
    ? (lang === 'hi' ? 'नई डिलीवरी अनुमान लंबित' : 'New delivery estimate pending')
    : (shipment.delayInfo?.revisedEta || '');

  // Guarantee that if a shipment is delayed, a delay milestone is always present in the timeline
  const checkpoints = React.useMemo(() => {
    const raw = shipment.checkpoints || [];
    const list = raw.map(c => ({ ...c }));
    const hasDelayedCp = list.some(c => c.status === 'delayed');

    if (!hasDelayedCp && shipment.status === 'delayed') {
      const activeIdx = list.findIndex(c => c.isCurrent);
      if (activeIdx !== -1) {
        list[activeIdx] = {
          ...list[activeIdx],
          status: 'delayed',
          description: shipment.delayInfo?.customerExplanation || list[activeIdx].description
        };
      } else {
        const insertIdx = Math.max(0, list.length - 1);
        list.splice(insertIdx, 0, {
          id: `CP-DLY-${shipment.id}`,
          location: shipment.delayInfo?.location || `${shipment.originHub} ➔ ${shipment.destinationHub} Transit Corridor`,
          city: shipment.originHubCode,
          country: 'India',
          timestamp: shipment.delayInfo?.updatedAt || 'Recent',
          status: 'delayed',
          facilityCode: 'TRANSIT-DELAY',
          description: shipment.delayInfo?.customerExplanation || "We're investigating the delay and will update you shortly.",
          completed: false,
          isCurrent: true
        });
      }
    }
    return list;
  }, [shipment]);

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between">
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
      <div className="bg-slate-50 dark:bg-slate-800/60 p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <IndustrialIcon name="pin" size={14} className="text-slate-400 dark:text-slate-500" />
            <span>{shipment.originHubCode}</span>
          </span>
          <span className="text-orange-600 dark:text-orange-400 font-semibold font-mono text-xs">
            {lang === 'hi' ? 'यात्रा पूरी:' : 'Progress:'} {shipment.progressPercent}%
          </span>
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <IndustrialIcon name="pin" size={14} className="text-orange-500" />
            <span>{shipment.destinationHubCode}</span>
          </span>
        </div>

        {/* Track Line with moving vehicle */}
        <div className="relative w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full my-4">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              shipment.status === 'delayed' ? 'bg-amber-500' : 'bg-orange-500'
            }`}
            style={{ width: `${shipment.progressPercent}%` }}
          />

          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-white p-1 rounded-full shadow-md z-10 transition-all duration-300 border-2 border-white dark:border-slate-800 ${
              shipment.status === 'delayed' ? 'bg-amber-500' : 'bg-orange-500'
            }`}
            style={{ left: `${shipment.progressPercent}%` }}
            title={`Parcel progress: ${shipment.progressPercent}%`}
          >
            <IndustrialIcon name="truck" size={12} />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
          <span>{lang === 'hi' ? 'सेंटर से रवाना:' : 'Dispatched:'} {shipment.dispatchedAt.slice(0, 10)}</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium hidden sm:inline">{lang === 'hi' ? 'गाड़ी:' : 'Vehicle:'} {shipment.vesselOrFlight || shipment.carrier}</span>
          <span className={`font-semibold ${shipment.status === 'delayed' ? 'text-amber-700 dark:text-amber-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {lang === 'hi' ? 'संभावित डिलीवरी:' : 'Expected:'} {shipment.status === 'delayed' ? revisedEtaText : (shipment.deliveryTimeEstimate || shipment.eta.slice(0, 10))}
          </span>
        </div>
      </div>

      {/* Delay History Timeline Line (Retained when delivered or in-transit) */}
      {shipment.delayInfo && (
        <div className={`mx-4 sm:mx-6 mt-4 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          shipment.status === 'delivered'
            ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <IndustrialIcon
              name={shipment.status === 'delivered' ? 'check' : 'alert'}
              size={16}
              className={shipment.status === 'delivered' ? 'text-emerald-600 dark:text-emerald-400 shrink-0' : 'text-amber-600 dark:text-amber-400 shrink-0'}
            />
            <div>
              <span className={`font-semibold uppercase mr-2 ${shipment.status === 'delivered' ? 'text-slate-700 dark:text-slate-300' : 'text-amber-800 dark:text-amber-300'}`}>
                {shipment.status === 'delivered'
                  ? (lang === 'hi' ? 'पूर्व ट्रांजिट देरी इतिहास (समाधानित):' : 'Historical Transit Delay (Resolved):')
                  : (lang === 'hi' ? 'देरी का विवरण:' : 'Active Delay Advisory:')}
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {shipment.delayInfo.historyText || `Expected ${shipment.delayInfo.originalEta} → Revised ${revisedEtaText}`}
              </span>
            </div>
          </div>
          {shipment.delayInfo.durationText && (
            <span className={`px-2 py-0.5 font-bold rounded text-[11px] w-fit shrink-0 ${
              shipment.status === 'delivered' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
            }`}>
              +{shipment.delayInfo.durationText}
            </span>
          )}
        </div>
      )}

      {/* Vertical Checkpoints Sequence */}
      <div className="p-5 sm:p-6 space-y-0">
        {checkpoints.map((cp: Checkpoint, idx: number) => {
          const isLast = idx === checkpoints.length - 1;
          const isPassed = cp.completed;
          const isCurrentActive = cp.isCurrent;
          const isDelayedEvent = cp.status === 'delayed';

          return (
            <div key={cp.id} className="relative flex items-start group">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[17px] top-7 bottom-0 w-[2px] ${
                    isDelayedEvent
                      ? 'bg-amber-300 dark:bg-amber-700'
                      : isPassed
                        ? 'bg-slate-300 dark:bg-slate-700'
                        : 'bg-slate-200 dark:bg-slate-700 border-dashed border-l border-slate-300 dark:border-slate-700'
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Milestone Node Icon */}
              <div className="relative z-10 mr-4 shrink-0 mt-0.5">
                {isDelayedEvent ? (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                    isCurrentActive
                      ? 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-900/60 animate-pulse'
                      : 'bg-amber-600 text-white'
                  }`}>
                    <IndustrialIcon name="alert" size={16} />
                  </div>
                ) : isPassed ? (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                    isCurrentActive ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-950/60' : 'bg-emerald-500 text-white'
                  }`}>
                    {isCurrentActive ? (
                      <IndustrialIcon name="truck" size={16} />
                    ) : (
                      <IndustrialIcon name="check" size={16} />
                    )}
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    0{idx + 1}
                  </div>
                )}
              </div>

              {/* Checkpoint Card */}
              <div className={`flex-1 mb-5 p-4 rounded-xl border transition-all duration-150 ${
                isDelayedEvent
                  ? isCurrentActive
                    ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 shadow-sm'
                    : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 shadow-2xs'
                  : isCurrentActive
                    ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/50 shadow-sm'
                    : isPassed
                      ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs'
                      : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-60'
              }`}>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isDelayedEvent ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {cp.facilityCode}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
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
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex flex-wrap items-center gap-x-4">
                  <span>{lang === 'hi' ? 'स्थान:' : 'Location:'} <strong className="text-slate-800 dark:text-slate-200 font-medium">{cp.city}, {cp.country}</strong></span>
                  <span>{lang === 'hi' ? 'समय:' : 'Timestamp:'} <strong className="text-slate-800 dark:text-slate-200 font-medium">{cp.timestamp}</strong></span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cp.description}
                </p>

                {/* Delay Event Details Box inside Timeline Node */}
                {isDelayedEvent && (
                  <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-mono">
                        {isCurrentActive ? (lang === 'hi' ? 'सक्रिय देरी घटना' : 'ACTIVE DELAY EVENT') : (lang === 'hi' ? 'पूर्व ट्रांजिट देरी' : 'TRANSIT DELAY LOGGED')}
                      </span>
                      <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                        {lang === 'hi' ? 'संशोधित डिलीवरी अनुमान' : 'Delivery Schedule Impact'}
                      </span>
                    </div>

                    {/* Customer-friendly Delay Explanation */}
                    <div className="text-xs text-slate-800 dark:text-slate-200 font-medium bg-white/90 dark:bg-slate-900/60 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
                      <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider mb-0.5">
                        {lang === 'hi' ? 'देरी का कारण' : 'Customer Delay Explanation'}
                      </div>
                      <p className="leading-relaxed">
                        {(shipment.delayInfo?.customerExplanation || shipment.delayInfo?.reason || cp.description || "We're investigating the delay and will update you shortly.").replace(/^NOTICE:\s*/i, '')}
                      </p>
                    </div>

                    {/* Original vs Revised ETA comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                          {lang === 'hi' ? 'पहले का अनुमानित समय' : 'Original Scheduled Date'}
                        </span>
                        <span className="line-through text-slate-500 dark:text-slate-400 font-medium">
                          {shipment.delayInfo?.originalEta || '—'}
                        </span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg shadow-2xs">
                        <span className="text-amber-800 dark:text-amber-400 block text-[10px] uppercase font-semibold">
                          {lang === 'hi' ? 'नया अनुमानित समय (संशोधित)' : 'Revised Estimated Delivery'}
                        </span>
                        <span className="text-amber-800 dark:text-amber-300 font-bold">
                          {revisedEtaText}
                        </span>
                      </div>
                    </div>

                    {/* Action being taken */}
                    {shipment.delayInfo?.actionTaken && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                        <IndustrialIcon name="truck" size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <span><strong className="text-slate-700 dark:text-slate-300">{lang === 'hi' ? 'की जा रही कार्रवाई:' : 'Action Taken:'}</strong> {shipment.delayInfo.actionTaken}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Active Subtext for Normal In-Transit */}
                {isCurrentActive && !isDelayedEvent && (
                  <div className="mt-3 pt-2.5 border-t border-orange-200/60 dark:border-orange-800/40 flex items-center justify-between text-xs text-orange-600 dark:text-orange-400">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                      {lang === 'hi' ? 'वर्तमान स्थिति - गाड़ी चल रही है' : 'Active Corridor Status: Moving on Highway'}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
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

export default TrackingTimeline;
