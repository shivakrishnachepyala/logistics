import React from 'react';
import type { Shipment } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface RouteMapProps {
  shipment: Shipment;
  className?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({ shipment, className = '' }) => {
  const { lang } = useTranslation();

  // Dynamic progress percentage
  const progress = Math.min(100, Math.max(0, shipment.progressPercent));
  
  // Calculate position along an arc path (viewBox 0 0 800 320)
  const t = progress / 100;
  const p0 = { x: 100, y: 230 };
  const p1 = { x: 400, y: 70 };
  const p2 = { x: 700, y: 230 };

  const currentX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const currentY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  return (
    <div className={`bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {/* Top Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-white">
            {lang === 'hi' ? 'कॉरिडोर मार्ग व प्रोग्रेस रडार (सिम्युलेटेड)' : 'Corridor Progress & Route Radar (Simulated)'}
          </span>
          <span className="font-mono text-xs text-orange-400 font-medium">[{shipment.originHubCode} ➔ {shipment.destinationHubCode}]</span>
        </div>
        <div className="text-xs flex items-center gap-4 text-slate-300">
          <span>{lang === 'hi' ? 'दूरी पूरी:' : 'Completed:'} <strong className="text-orange-400 font-bold">{progress}%</strong></span>
          <span className="hidden sm:inline">{lang === 'hi' ? 'गाड़ी:' : 'Vehicle:'} <strong className="text-white font-medium">{shipment.vesselOrFlight || shipment.carrier}</strong></span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-[#0B1220] border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-3 left-4 pointer-events-none font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase leading-tight select-none">
          CORRIDOR: {shipment.originHubCode} ➔ {shipment.destinationHubCode}<br />
          TELEMETRICS: CORRIDOR PROGRESS (SIMULATED DATA)<br />
          EST. SPEED: 62 KM/H
        </div>

        <div className="absolute top-3 right-4 pointer-events-none flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-slate-400 select-none">
          <div className="w-6 h-6 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center font-bold text-[9px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            N
          </div>
          <span>NATIONAL HIGHWAY CORRIDOR</span>
        </div>

        {/* Interactive SVG Route */}
        <svg
          viewBox="0 0 800 320"
          className="w-full h-auto min-h-[220px] max-h-[340px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle grid lines */}
          <defs>
            <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800/80" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="800" height="320" fill="url(#radarGrid)" />

          {/* Background Route Arc (Incomplete path) */}
          <path
            d="M 100 230 Q 400 70 700 230"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-700"
            strokeWidth="4"
            strokeDasharray="6 6"
          />

          {/* Origin Station Point */}
          <g transform="translate(100, 230)">
            <circle r="14" fill="#0F172A" />
            <circle r="6" fill="#F97316" />
            <text
              y="32"
              fill="#0F172A"
              textAnchor="middle"
              className="text-xs font-bold"
              fontSize="12"
            >
              {lang === 'hi' ? 'प्रस्थान: ' : 'FROM: '}{shipment.originHubCode}
            </text>
          </g>

          {/* Completed Path Indicator */}
          <path
            d={`M 100 230 Q ${(100 + currentX) / 2} ${(230 + currentY) / 2 - 20} ${currentX} ${currentY}`}
            fill="none"
            stroke="#F97316"
            strokeWidth="4"
          />

          {/* Current Moving Vehicle Marker */}
          <g transform={`translate(${currentX}, ${currentY})`}>
            <circle r="22" fill="#F97316" fillOpacity="0.2" className="animate-ping" />
            <circle r="16" fill="#F97316" />
            <circle r="6" fill="#FFFFFF" />
            {/* Tooltip / Label above vehicle */}
            <g transform="translate(0, -28)">
              <rect
                x="-55"
                y="-18"
                width="110"
                height="22"
                rx="6"
                fill="#0F172A"
              />
              <text
                x="0"
                y="-4"
                fill="#FFFFFF"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {progress}% IN TRANSIT
              </text>
            </g>
          </g>

          {/* Destination Station Point */}
          <g transform="translate(700, 230)">
            <circle r="14" fill="#0F172A" />
            <circle r="6" fill="#10B981" />
            <text
              y="32"
              fill="#0F172A"
              textAnchor="middle"
              className="text-xs font-bold"
              fontSize="12"
            >
              {lang === 'hi' ? 'गंतव्य: ' : 'TO: '}{shipment.destinationHubCode}
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Readout Grid */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-[#1E293B] shadow-2xs">
          <div className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold">
            {lang === 'hi' ? 'गाड़ी / वाहन का प्रकार' : 'Vehicle Assignment'}
          </div>
          <div className="text-slate-900 dark:text-white font-semibold text-xs truncate mt-0.5">
            {shipment.vesselOrFlight || 'Express Road Vehicle'}
          </div>
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-[#1E293B] shadow-2xs">
          <div className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold">
            {lang === 'hi' ? 'संभावित डिलीवरी तारीख' : 'Scheduled Delivery'}
          </div>
          <div className="text-orange-600 dark:text-orange-400 font-semibold text-xs truncate mt-0.5">
            {shipment.deliveryTimeEstimate || shipment.eta}
          </div>
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-[#1E293B] shadow-2xs">
          <div className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold">
            {lang === 'hi' ? 'सिम्युलेटेड स्थिति' : 'Telematics Status'}
          </div>
          <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs truncate mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang === 'hi' ? 'सिम्युलेटेड ट्रांजिट सिग्नल' : 'Simulated Corridor Ping'}</span>
          </div>
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-[#1E293B] shadow-2xs">
          <div className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold">
            {lang === 'hi' ? 'भुगतान स्थिति' : 'Payment Status'}
          </div>
          <div className="text-slate-900 dark:text-white font-semibold text-xs truncate mt-0.5">
            {shipment.paymentMethod === 'cod'
              ? (lang === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery (COD)')
              : (lang === 'hi' ? 'ऑनलाइन भुगतान (UPI)' : 'Prepaid Online (UPI)')}
          </div>
        </div>
      </div>
    </div>
  );
};
