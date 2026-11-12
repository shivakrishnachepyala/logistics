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
    : 'This is our best guess based on past deliveries on this route.';

  // Determine meter color
  const meterColor = percent >= 85 ? 'bg-teal' : percent >= 70 ? 'bg-yellow' : 'bg-orange';

  return (
    <div className="inline-flex flex-col gap-1.5 p-2 bg-chalk border border-steel-border rounded-[2px] max-w-xs">
      <div className="flex items-center justify-between text-xs font-mono gap-2">
        <span className="font-bold text-asphalt flex items-center">
          <span>
            {lang === 'hi'
              ? `${percent}% संभावना: ${day} तक`
              : `${percent}% chance by ${day}`}
          </span>
          {date && <span className="text-steel ml-1 text-[11px]">({date})</span>}
          <InfoTooltip text={tooltipText} />
        </span>
        <span className="text-[11px] text-steel font-bold">{percent}%</span>
      </div>

      {/* Meter Bar */}
      <div className="w-full bg-[#E5DFD3] h-2 border border-asphalt relative overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="On-time delivery chance">
        <div
          className={`h-full ${meterColor} transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
      
      <div className="text-[10px] text-steel font-heading uppercase font-semibold">
        {lang === 'hi' ? 'समय पर पहुंचने का भरोसा' : 'ON-TIME DELIVERY PROMISE'}
      </div>
    </div>
  );
};
