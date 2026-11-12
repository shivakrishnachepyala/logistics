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
    <div className={`bg-chalk border-[1.5px] border-asphalt stamp ${className}`}>
      {/* Top Header */}
      <div className="bg-asphalt text-paper px-4 py-2.5 flex flex-wrap items-center justify-between border-b border-asphalt gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-yellow inline-block"></span>
          <span className="font-heading font-black text-sm uppercase tracking-wider text-yellow">
            {lang === 'hi' ? 'लाइव पार्सल मार्ग और गाड़ी की स्थिति' : 'LIVE PARCEL ROUTE & VEHICLE LOCATION'}
          </span>
          <span className="font-mono text-xs text-steel">[{shipment.originHubCode} ➔ {shipment.destinationHubCode}]</span>
        </div>
        <div className="font-mono text-xs flex items-center gap-3 text-steel">
          <span>{lang === 'hi' ? 'दूरी पूरी:' : 'PROGRESS:'} <strong className="text-yellow font-bold">{progress}%</strong></span>
          <span className="hidden sm:inline">{lang === 'hi' ? 'गाड़ी:' : 'VEHICLE:'} <strong className="text-paper">{shipment.vesselOrFlight || shipment.carrier}</strong></span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full overflow-hidden bg-[#FAF7F0] bg-manifest-grid border-b border-asphalt">
        <div className="absolute top-3 left-4 pointer-events-none font-mono text-[10px] text-steel uppercase leading-tight select-none">
          ROUTE: {shipment.originHubCode} ➔ {shipment.destinationHubCode}<br />
          GPS STATUS: LIVE SIGNAL LOCKED<br />
          SPEED: 60 KM/H
        </div>

        <div className="absolute top-3 right-4 pointer-events-none flex items-center gap-2 font-mono text-[10px] text-asphalt select-none">
          <div className="w-6 h-6 border border-asphalt rounded-full flex items-center justify-center font-bold text-[9px]">
            N
          </div>
          <span>EXPRESS HIGHWAY ROUTE</span>
        </div>

        {/* Interactive SVG Route */}
        <svg
          viewBox="0 0 800 320"
          className="w-full h-auto min-h-[220px] max-h-[340px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1A1C1E" strokeWidth="0.5" strokeOpacity="0.08" />
            </pattern>
            <radialGradient id="cargoRadar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E4501D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#E4501D" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="320" fill="url(#smallGrid)" />

          {/* Road Buffer Path */}
          <path
            d="M 90 240 Q 400 60 710 240"
            fill="none"
            stroke="#6E7A82"
            strokeWidth="18"
            strokeOpacity="0.12"
          />

          {/* Full Planned Route Path */}
          <path
            d="M 100 230 Q 400 70 700 230"
            fill="none"
            stroke="#1A1C1E"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Completed Segment */}
          <path
            d={`M 100 230 Q ${100 + (p1.x - 100) * t} ${230 + (p1.y - 230) * t} ${currentX} ${currentY}`}
            fill="none"
            stroke="#E4501D"
            strokeWidth="3.5"
          />

          {/* Origin Hub Marker */}
          <g transform="translate(100, 230)">
            <circle cx="0" cy="0" r="8" fill="#1D5A52" stroke="#1A1C1E" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#FAF7F0" />
            <rect x="-70" y="14" width="140" height="26" fill="#1A1C1E" rx="1" />
            <text
              x="0"
              y="31"
              fill="#FAF7F0"
              textAnchor="middle"
              fontFamily="Barlow Condensed"
              fontSize="12"
              fontWeight="bold"
              letterSpacing="0.05em"
            >
              {lang === 'hi' ? 'शुरुआत: ' : 'FROM: '}{shipment.originHubCode}
            </text>
          </g>

          {/* Midpoint Checkpoint */}
          {shipment.checkpoints.length > 2 && (
            <g transform="translate(400, 110)">
              <circle cx="0" cy="0" r="6" fill={shipment.progressPercent >= 50 ? '#1D5A52' : '#FAF7F0'} stroke="#1A1C1E" strokeWidth="2" />
              <rect x="-65" y="-32" width="130" height="22" fill="#FAF7F0" stroke="#1A1C1E" strokeWidth="1.5" rx="1" />
              <text
                x="0"
                y="-18"
                fill="#1A1C1E"
                textAnchor="middle"
                fontFamily="IBM Plex Mono"
                fontSize="10"
                fontWeight="bold"
              >
                HIGHWAY TOLL / JUNCTION
              </text>
            </g>
          )}

          {/* Active Cargo Position Radar Pulse */}
          <g transform={`translate(${currentX}, ${currentY})`}>
            <circle cx="0" cy="0" r="28" fill="url(#cargoRadar)" className="animate-pulse" />
            <circle cx="0" cy="0" r="14" fill="#E4501D" stroke="#1A1C1E" strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill="#FAF7F0" />

            {/* Live Tag */}
            <g transform="translate(0, -28)">
              <rect
                x="-80"
                y="-26"
                width="160"
                height="24"
                fill="#E4501D"
                stroke="#1A1C1E"
                strokeWidth="1.5"
                rx="1"
              />
              <text
                x="0"
                y="-10"
                fill="#FAF7F0"
                textAnchor="middle"
                fontFamily="IBM Plex Mono"
                fontSize="10"
                fontWeight="bold"
              >
                {lang === 'hi' ? 'गाड़ी यहाँ है' : 'VEHICLE HERE'}: {shipment.id}
              </text>
            </g>
          </g>

          {/* Destination Hub Marker */}
          <g transform="translate(700, 230)">
            <circle cx="0" cy="0" r="8" fill={shipment.status === 'delivered' ? '#1D5A52' : '#E5A823'} stroke="#1A1C1E" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#FAF7F0" />
            <rect x="-70" y="14" width="140" height="26" fill="#1A1C1E" rx="1" />
            <text
              x="0"
              y="31"
              fill="#FAF7F0"
              textAnchor="middle"
              fontFamily="Barlow Condensed"
              fontSize="12"
              fontWeight="bold"
              letterSpacing="0.05em"
            >
              {lang === 'hi' ? 'पहुंच: ' : 'TO: '}{shipment.destinationHubCode}
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Readout Grid */}
      <div className="p-3 bg-chalk grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="border border-steel-border p-2 bg-paper">
          <div className="text-[10px] text-steel uppercase font-heading font-bold">
            {lang === 'hi' ? 'गाड़ी / वाहन का प्रकार' : 'VEHICLE / TRUCK NUMBER'}
          </div>
          <div className="text-asphalt font-bold text-xs truncate mt-0.5">
            {shipment.vesselOrFlight || 'Express Road Vehicle'}
          </div>
        </div>
        <div className="border border-steel-border p-2 bg-paper">
          <div className="text-[10px] text-steel uppercase font-heading font-bold">
            {lang === 'hi' ? 'संभावित डिलीवरी तारीख' : 'EXPECTED DELIVERY DATE'}
          </div>
          <div className="text-orange font-bold text-xs truncate mt-0.5">
            {shipment.deliveryTimeEstimate || shipment.eta}
          </div>
        </div>
        <div className="border border-steel-border p-2 bg-paper">
          <div className="text-[10px] text-steel uppercase font-heading font-bold">
            {lang === 'hi' ? 'लाइव जीपीएस स्थिति' : 'LIVE GPS TRACKING'}
          </div>
          <div className="text-teal font-bold text-xs truncate mt-0.5">
            {lang === 'hi' ? 'सिग्नल सक्रिय (सड़क पर)' : 'ACTIVE HIGHWAY PING'}
          </div>
        </div>
        <div className="border border-steel-border p-2 bg-paper">
          <div className="text-[10px] text-steel uppercase font-heading font-bold">
            {lang === 'hi' ? 'भुगतान स्थिति' : 'PAYMENT MODE'}
          </div>
          <div className="text-asphalt font-bold text-xs truncate mt-0.5 uppercase">
            {shipment.paymentMethod === 'cod'
              ? (lang === 'hi' ? 'डिलीवरी पर नकद (COD)' : 'Cash on Delivery (COD)')
              : (lang === 'hi' ? 'ऑनलाइन भुगतान (UPI)' : 'Paid Online (UPI)')}
          </div>
        </div>
      </div>
    </div>
  );
};
