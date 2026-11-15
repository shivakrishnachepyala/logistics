import React, { useState } from 'react';
import type { DelayInfo } from '../../types';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';

interface DelayReasonCardProps {
  delayInfo: DelayInfo;
  parcelNumber: string;
}

export const DelayReasonCard: React.FC<DelayReasonCardProps> = ({ delayInfo, parcelNumber }) => {
  const { lang } = useTranslation();
  const [actionDone, setActionDone] = useState<string | null>(null);

  const getReasonIcon = (code: string) => {
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

  const getDelayTitle = () => {
    if (lang === 'hi') {
      return delayInfo.reasonHindi || delayInfo.reason;
    }
    return delayInfo.reason;
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-xs mb-6">
      {/* Top Banner */}
      <div className="flex items-start sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <IndustrialIcon name={getReasonIcon(delayInfo.reasonCode) as any} size={20} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              {lang === 'hi' ? 'देरी की सूचना (पार्सल लेट है)' : 'Transit Delay Advisory'}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {lang === 'hi' ? 'पार्सल पहुंचने में देरी क्यों हुई?' : 'Why is your consignment delayed?'}
            </h3>
          </div>
        </div>

        <span className="bg-amber-100 text-amber-800 border border-amber-300 font-mono text-xs px-2.5 py-1 rounded-lg font-bold shrink-0">
          +{delayInfo.durationText}
        </span>
      </div>

      {/* Concrete Plain Reason & Timeline Impact */}
      <div className="space-y-4 text-xs">
        <div className="bg-white border border-amber-200/80 rounded-xl p-3.5 shadow-2xs">
          <div className="font-semibold text-sm text-slate-900">
            {getDelayTitle()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {lang === 'hi'
              ? `जगह: ${delayInfo.location} • अनुमानित देरी: लगभग ${delayInfo.durationText}`
              : `Location: ${delayInfo.location} • Estimated Impact: Approx ${delayInfo.durationText}`}
          </div>
        </div>

        {/* Expected vs New Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {lang === 'hi' ? 'पहले का समय' : 'Original Scheduled Arrival'}
            </span>
            <span className="line-through text-slate-400 font-medium">{delayInfo.originalEta}</span>
          </div>

          <div className="p-3 bg-white border border-amber-300 rounded-xl">
            <span className="text-amber-700 block text-[10px] uppercase font-semibold">
              {lang === 'hi' ? 'नया पहुंचने का समय' : 'Revised Estimated Arrival'}
            </span>
            <span className="text-amber-700 font-bold text-sm">{delayInfo.revisedEta}</span>
          </div>
        </div>

        {/* What you can do section */}
        <div className="pt-2 border-t border-amber-200/70">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            {lang === 'hi' ? 'आप क्या कर सकते हैं:' : 'Recommended Actions & Resolution:'}
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
                href={`https://wa.me/919876543210?text=Hello%20FreightLine%2C%20my%20parcel%20${parcelNumber}%20is%20late`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
              >
                <IndustrialIcon name="phone" size={14} />
                <span>{lang === 'hi' ? 'व्हाट्सएप सहायता' : 'WhatsApp Support'}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
