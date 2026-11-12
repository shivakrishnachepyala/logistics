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
    <div className="bg-yellow-soft border-[2px] border-yellow p-4 sm:p-5 stamp mb-6">
      {/* Top Banner with Hazard Stripe Accent */}
      <div className="flex items-start sm:items-center justify-between gap-3 border-b border-asphalt/20 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-yellow text-asphalt border-[1.5px] border-asphalt flex items-center justify-center stamp-sm shrink-0">
            <IndustrialIcon name={getReasonIcon(delayInfo.reasonCode) as any} size={20} />
          </div>
          <div>
            <div className="font-heading font-black text-xs uppercase tracking-wider text-orange">
              {lang === 'hi' ? 'देरी की सूचना (पार्सल लेट है)' : 'DELAY ALERT // RUNNING LATE'}
            </div>
            <h3 className="font-heading font-black text-xl text-asphalt uppercase leading-tight">
              {lang === 'hi' ? 'पार्सल पहुंचने में देरी क्यों हुई?' : 'Why is your parcel late?'}
            </h3>
          </div>
        </div>

        <span className="bg-yellow text-asphalt border border-asphalt font-mono text-xs px-2.5 py-1 font-bold shrink-0">
          +{delayInfo.durationText}
        </span>
      </div>

      {/* Concrete Plain Reason & Timeline Impact */}
      <div className="space-y-3 font-body text-sm text-asphalt">
        <div className="bg-chalk border border-asphalt/30 p-3 rounded-[2px]">
          <div className="font-semibold text-base text-asphalt">
            {getDelayTitle()}
          </div>
          <div className="text-xs text-steel mt-1 font-mono">
            {lang === 'hi'
              ? `जगह: ${delayInfo.location} • देरी: लगभग ${delayInfo.durationText}`
              : `Location: ${delayInfo.location} • Expected Delay: Approx ${delayInfo.durationText}`}
          </div>
        </div>

        {/* Expected vs New Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-paper border border-asphalt/30">
            <span className="text-steel block text-[10px] uppercase font-bold">
              {lang === 'hi' ? 'पहले का समय' : 'PREVIOUS EXPECTED DATE'}
            </span>
            <span className="line-through text-steel font-bold">{delayInfo.originalEta}</span>
          </div>

          <div className="p-2.5 bg-chalk border border-orange">
            <span className="text-orange block text-[10px] uppercase font-bold">
              {lang === 'hi' ? 'नया पहुंचने का समय' : 'NEW EXPECTED DATE'}
            </span>
            <span className="text-orange font-bold text-sm">{delayInfo.revisedEta}</span>
          </div>
        </div>

        {/* What you can do section */}
        <div className="pt-2 border-t border-asphalt/20">
          <div className="text-xs font-semibold text-asphalt mb-2">
            {lang === 'hi' ? 'आप क्या कर सकते हैं:' : 'What you can do:'}
          </div>

          {actionDone ? (
            <div className="bg-teal text-white p-3 font-mono text-xs font-bold border border-asphalt flex items-center gap-2">
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
                      : 'Request recorded. Driver will deliver at your preferred time.'
                  )
                }
                className="btn-industrial bg-asphalt text-paper hover:bg-orange text-xs px-3.5 py-2.5 border border-asphalt stamp-sm min-h-[48px] flex items-center gap-2"
              >
                <IndustrialIcon name="calendar" size={14} />
                <span>{lang === 'hi' ? 'डिलीवरी का समय बदलें' : 'Change delivery time'}</span>
              </button>

              <a
                href="tel:1800266000"
                className="btn-industrial bg-paper text-asphalt hover:bg-chalk text-xs px-3.5 py-2.5 border border-asphalt min-h-[48px] flex items-center gap-2"
              >
                <IndustrialIcon name="phone" size={14} />
                <span>{lang === 'hi' ? 'हेल्पलाइन पर बात करें' : 'Call us (Toll Free)'}</span>
              </a>

              <a
                href={`https://wa.me/919876543210?text=Hello%20FreightLine%2C%20my%20parcel%20${parcelNumber}%20is%20late`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-industrial bg-[#25D366] text-white hover:brightness-105 text-xs px-3.5 py-2.5 border border-asphalt stamp-sm min-h-[48px] flex items-center gap-2"
              >
                <IndustrialIcon name="phone" size={14} />
                <span>{lang === 'hi' ? 'व्हाट्सएप पर मदद' : 'WhatsApp Support'}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
