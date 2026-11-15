import React from 'react';
import type { DeliveryPromise } from '../../types';
import { useTranslation, InfoTooltip } from '../../context/LanguageContext';

interface ConfidenceMeterProps {
  promise?: DeliveryPromise;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ promise }) => {
  const { lang } = useTranslation();

  const percent = promise?.confidencePercent ?? 90;
  const day = promise?.promisedDay || (lang === 'hi' ? 'गुरुवार' : 'Thursday');
  const date = promise?.promisedDate || '';

  const tooltipText = lang === 'hi'
    ? 'इस मार्ग पर पिछले डिलीवरी रिकॉर्ड के आधार पर हमारा सबसे सटीक अनुमान।'
    : 'Historical on-time probability calculated from corridor telemetry.';

  return (
    <div className="flex flex-col gap-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full">
      <div className="flex items-center justify-between text-[11px] gap-2">
        <span className="font-semibold text-slate-800 flex items-center">
          <span>
            {lang === 'hi'
              ? `${percent}% संभावना: ${day}`
              : `${percent}% by ${day}`}
          </span>
          {date && <span className="text-slate-400 ml-1 text-[10px]">({date})</span>}
          <InfoTooltip text={tooltipText} />
        </span>
        <span className="text-[10px] text-emerald-600 font-bold">{percent}%</span>
      </div>

      {/* Meter Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full relative overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="On-time delivery chance">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      
      <div className="text-[9px] text-slate-400 uppercase font-semibold">
        {lang === 'hi' ? 'समय पर पहुंचने का भरोसा' : 'On-Time SLA Promise'}
      </div>
    </div>
  );
};
