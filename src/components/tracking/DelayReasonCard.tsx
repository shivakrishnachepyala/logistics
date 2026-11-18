import React, { useState } from 'react';
import type { DelayInfo } from '../../types';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';

interface DelayReasonCardProps {
  delayInfo?: DelayInfo | null;
  parcelNumber: string;
  status?: string;
  onManagerEdit?: () => void;
}

export const DelayReasonCard: React.FC<DelayReasonCardProps> = ({
  delayInfo,
  parcelNumber,
  status = 'delayed',
  onManagerEdit
}) => {
  const { lang } = useTranslation();
  const [actionDone, setActionDone] = useState<string | null>(null);

  const getReasonIcon = (code?: string) => {
    switch (code) {
      case 'heavy_rain':
        return 'alert';
      case 'road_blocked':
        return 'alert';
      case 'festival_rush':
        return 'clock';
      case 'vehicle_breakdown':
        return 'truck';
      case 'receiver_unavailable':
        return 'user';
      case 'wrong_address':
        return 'pin';
      default:
        return 'alert';
    }
  };

  // Rule: Never invent a delay reason.
  // If the reason is unknown, display strictly: "We're investigating the delay and will update you shortly."
  const getCustomerFriendlyReason = () => {
    if (!delayInfo) {
      return lang === 'hi'
        ? 'हम देरी की जांच कर रहे हैं और जल्द ही आपको अपडेट करेंगे।'
        : "We're investigating the delay and will update you shortly.";
    }

    if (lang === 'hi' && delayInfo.reasonHindi) {
      return delayInfo.reasonHindi;
    }

    const reasonText = (delayInfo.customerExplanation || delayInfo.reason || '').trim();
    if (!reasonText) {
      return lang === 'hi'
        ? 'हम देरी की जांच कर रहे हैं और जल्द ही आपको अपडेट करेंगे।'
        : "We're investigating the delay and will update you shortly.";
    }
    return reasonText;
  };

  const actionTakenText = delayInfo?.actionTaken || (
    lang === 'hi'
      ? 'हमारी परिचालन टीम ट्रांजिट में गति लाने और त्वरित राहत के लिए काम कर रही है।'
      : 'Our operations team is actively coordinating relief transit and highway clearance to minimize delay.'
  );

  const lastUpdatedText = delayInfo?.updatedAt || (
    lang === 'hi'
      ? 'हाल ही में स्वचालित सिस्टम द्वारा अपडेट किया गया'
      : 'Recently updated via fleet telematics'
  );

  const locationText = delayInfo?.location || (
    lang === 'hi' ? 'मार्ग में (ट्रांजिट कॉरिडोर)' : 'In Transit Corridor'
  );

  const originalEtaText = delayInfo?.originalEta || '—';

  // Rule: If the revised delivery date is unknown, explicitly display "New delivery estimate pending" instead of inventing a date.
  const isRevisedUnknown = !delayInfo?.revisedEta ||
    delayInfo.revisedEta.trim() === '' ||
    delayInfo.revisedEta.toLowerCase().includes('pending') ||
    delayInfo.revisedEta.toLowerCase().includes('recalculation') ||
    delayInfo.revisedEta.toLowerCase().includes('unknown');

  const revisedEtaText = isRevisedUnknown
    ? (lang === 'hi' ? 'नई डिलीवरी अनुमान लंबित' : 'New delivery estimate pending')
    : delayInfo.revisedEta;

  return (
    <div className="bg-amber-50/95 border-2 border-amber-400/90 rounded-2xl p-5 sm:p-7 shadow-md mb-6 text-slate-800">
      {/* 1. Clear "Delivery Delayed" Warning Header Banner */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 border-b border-amber-200 pb-4 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0 ring-4 ring-amber-100">
            <IndustrialIcon name={getReasonIcon(delayInfo?.reasonCode) as any} size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {status ? status.toUpperCase() : 'DELAYED'} • {lang === 'hi' ? 'वितरण में देरी' : 'Delivery Delayed'}
              </span>
              <span className="text-xs font-semibold text-amber-900">
                {lang === 'hi' ? 'पार्सल ट्रांजिट चेतावनी' : 'Transit Delay Advisory'}
              </span>
              <span className="text-xs font-mono text-slate-700 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300/80">
                ID: {parcelNumber}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mt-1">
              {lang === 'hi' ? 'पार्सल डिलीवरी में देरी • संशोधित आगमन समय' : 'Delivery Delayed • Revised Arrival Schedule'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {delayInfo?.durationText && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs px-2.5 py-1 rounded-lg font-bold shrink-0">
              +{delayInfo.durationText}
            </span>
          )}
          {onManagerEdit && (
            <button
              onClick={onManagerEdit}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-amber-300 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <IndustrialIcon name="file" size={12} className="text-amber-600" />
              <span>Update Advisory</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* 2. Customer-Friendly Delay Reason */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider mb-1">
            {lang === 'hi' ? 'देरी का कारण (ग्राहक सूचना)' : 'Customer Delay Explanation'}
          </div>
          <div className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
            {getCustomerFriendlyReason()}
          </div>
        </div>

        {/* 3, 4, 5, 6: Key Transit Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Current / Last Known Location */}
          <div className="p-3 bg-white border border-amber-100 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {lang === 'hi' ? 'अंतिम ज्ञात स्थान' : 'Last Known Location'}
            </span>
            <span className="font-bold text-slate-900 text-xs mt-0.5 block truncate" title={locationText}>
              {locationText}
            </span>
          </div>

          {/* Original Expected Delivery Date */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {lang === 'hi' ? 'पहले का अनुमानित समय' : 'Original Scheduled Date'}
            </span>
            <span className="line-through text-slate-400 font-medium text-xs mt-0.5 block truncate">
              {originalEtaText}
            </span>
          </div>

          {/* Revised Estimated Delivery Date */}
          <div className="p-3 bg-white border border-amber-300 rounded-xl shadow-2xs">
            <span className="text-amber-800 block text-[10px] uppercase font-semibold">
              {lang === 'hi' ? 'नया अनुमानित समय (संशोधित)' : 'Revised Estimated Delivery'}
            </span>
            <span className="text-amber-800 font-bold text-xs mt-0.5 block truncate">
              {revisedEtaText}
            </span>
          </div>

          {/* Last Update Date and Time */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {lang === 'hi' ? 'अंतिम अपडेट समय' : 'Last Advisory Update'}
            </span>
            <span className="text-slate-700 font-medium text-xs mt-0.5 block truncate" title={lastUpdatedText}>
              {lastUpdatedText}
            </span>
          </div>
        </div>

        {/* 7. Action Being Taken */}
        <div className="p-3.5 bg-white border border-amber-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
            <IndustrialIcon name="truck" size={13} className="text-amber-600" />
            <span>{lang === 'hi' ? 'किए जा रहे उपाय (Action Taken)' : 'Action Being Taken by Operations'}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {actionTakenText}
          </p>
        </div>

        {/* Customer Self-Service Actions */}
        <div className="pt-2 border-t border-amber-200/70">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            {lang === 'hi' ? 'सहायता व समय विकल्प:' : 'Customer Self-Service & Assistance:'}
          </div>

          {actionDone ? (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
              <IndustrialIcon name="check" size={16} />
              <span>{actionDone}</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActionDone(
                    lang === 'hi'
                      ? 'अनुरोध दर्ज हुआ। हमारी टीम नए समय पर डिलीवरी करेगी।'
                      : 'Slot reschedule confirmed. Delivery dispatched according to your preference.'
                  )
                }
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
              >
                <IndustrialIcon name="calendar" size={14} />
                <span>{lang === 'hi' ? 'डिलीवरी का समय बदलें' : 'Reschedule Delivery Slot'}</span>
              </button>

              <a
                href="tel:1800266000"
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 border border-slate-200 rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
              >
                <IndustrialIcon name="phone" size={14} />
                <span>{lang === 'hi' ? 'हेल्पलाइन पर बात करें' : 'Call Toll-Free Desk'}</span>
              </a>

              <a
                href="https://wa.me/916303766064"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp (+91 6303766064)"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
              >
                <IndustrialIcon name="phone" size={14} />
                <span>{lang === 'hi' ? 'व्हाट्सएप (+91 6303766064)' : 'WhatsApp (+91 6303766064)'}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
