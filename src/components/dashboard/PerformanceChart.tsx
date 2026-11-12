import React, { useState, useEffect } from 'react';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';
import { getStoredShipments } from '../../data/mockShipments';

export const PerformanceChart: React.FC = () => {
  const { lang } = useTranslation();
  const [shipments, setShipments] = useState(() => getStoredShipments());

  useEffect(() => {
    const handleUpdate = () => {
      setShipments(getStoredShipments());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute live metrics from stored shipments
  const totalShipments = shipments.length;
  const delayedShipments = shipments.filter(s => s.status === 'delayed').length;
  const onTimeShipments = shipments.filter(s => s.status === 'delivered' || s.status === 'in-transit' || s.status === 'pending').length;
  const onTimeRate = totalShipments > 0
    ? Math.min(99.9, Math.max(85.0, Number(((onTimeShipments / totalShipments) * 100).toFixed(1))))
    : 98.2;

  const totalWeightKg = shipments.reduce((sum, s) => sum + (s.cargo?.weightKg || 0), 0);

  // Day names: Mon - Sun
  const dayLabels = [
    { en: 'MON', hi: 'सोम' },
    { en: 'TUE', hi: 'मंगल' },
    { en: 'WED', hi: 'बुध' },
    { en: 'THU', hi: 'गुरु' },
    { en: 'FRI', hi: 'शुक्र' },
    { en: 'SAT', hi: 'शनि' },
    { en: 'SUN', hi: 'रवि' },
  ];

  // Baseline weekly volume distribution (KG)
  const baseVolumes = [1420, 1680, 1890, 1540, 2100, 1120, 980];
  const baseOnTime = [99, 98, 97, 99, 98, 99, 96];

  // Distribute real shipments by creation weekday
  const dynamicWeeklyData = dayLabels.map((lbl, idx) => {
    let dayWeightBonus = 0;
    let dayDelayedCount = 0;

    shipments.forEach(s => {
      const dateStr = s.dispatchedAt || (s.activities && s.activities[s.activities.length - 1]?.timestamp);
      const date = dateStr ? new Date(dateStr) : null;
      if (date && !isNaN(date.getTime())) {
        const monSunIdx = (date.getDay() + 6) % 7;
        if (monSunIdx === idx) {
          dayWeightBonus += Math.round(s.cargo?.weightKg || 25);
          if (s.status === 'delayed') dayDelayedCount++;
        }
      }
    });

    const calculatedVolume = baseVolumes[idx] + dayWeightBonus;
    const calculatedOnTime = Math.max(90, baseOnTime[idx] - (dayDelayedCount * 2));

    return {
      day: lang === 'hi' ? lbl.hi : lbl.en,
      onTime: calculatedOnTime,
      volume: calculatedVolume,
    };
  });

  const maxVolume = Math.max(2400, ...dynamicWeeklyData.map(d => d.volume + 200));

  return (
    <div className="bg-chalk border-[1.5px] border-asphalt stamp">
      {/* Header */}
      <div className="bg-asphalt text-paper p-3 flex items-center justify-between border-b border-asphalt">
        <div className="flex items-center gap-2">
          <IndustrialIcon name="gauge" size={16} className="text-yellow" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-paper">
            {lang === 'hi' ? 'समय पर डिलीवरी का रिकॉर्ड' : 'ON-TIME DELIVERY PERFORMANCE'}
          </h2>
        </div>
        <div className="font-mono text-xs text-teal font-bold">
          {lang === 'hi' ? `समय पर डिलीवरी: ${onTimeRate}%` : `ON-TIME RATE: ${onTimeRate}%`}
        </div>
      </div>

      <div className="p-4">
        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-3 mb-5 font-mono text-xs">
          <div className="border border-asphalt bg-paper p-2.5">
            <div className="text-[10px] text-steel uppercase font-heading font-bold">
              {lang === 'hi' ? 'कुल फ्रेट लोड' : 'ACTIVE FREIGHT LOAD'}
            </div>
            <div className="text-asphalt font-bold text-lg mt-0.5">{totalWeightKg.toLocaleString('en-IN')} KG</div>
            <div className="text-teal text-[10px]">{lang === 'hi' ? `${totalShipments} कुल कन्साइनमेंट` : `${totalShipments} Consignments Tracked`}</div>
          </div>
          <div className="border border-asphalt bg-paper p-2.5">
            <div className="text-[10px] text-steel uppercase font-heading font-bold">
              {lang === 'hi' ? 'सुरक्षित सुपुर्दगी' : 'SAFE HANDOVER'}
            </div>
            <div className="text-asphalt font-bold text-lg mt-0.5">{delayedShipments === 0 ? '99.9%' : '98.5%'}</div>
            <div className="text-teal text-[10px]">{delayedShipments === 0 ? (lang === 'hi' ? 'शून्य शिकायत' : 'Zero Breakage Record') : (lang === 'hi' ? `${delayedShipments} विलंबित पार्सल` : `${delayedShipments} Delayed Transit`)}</div>
          </div>
          <div className="border border-asphalt bg-paper p-2.5">
            <div className="text-[10px] text-steel uppercase font-heading font-bold">
              {lang === 'hi' ? 'डोरस्टेप पिकअप' : 'DOORSTEP PICKUP'}
            </div>
            <div className="text-asphalt font-bold text-lg mt-0.5">100%</div>
            <div className="text-steel text-[10px]">{lang === 'hi' ? 'घर/दुकान से' : 'Direct from Your Door'}</div>
          </div>
        </div>

        {/* Weekly Consignment Volume & On-Time Performance Chart */}
        <div className="mb-2 flex items-center justify-between text-xs font-heading font-bold uppercase text-steel">
          <span>{lang === 'hi' ? 'दैनिक पार्सल वजन (किलोग्राम में)' : 'DAILY PARCEL WEIGHT (IN KG)'}</span>
          <span className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-asphalt">
              <span className="w-2.5 h-2.5 bg-asphalt inline-block"></span> {lang === 'hi' ? 'वजन (KG)' : 'Weight (KG)'}
            </span>
            <span className="flex items-center gap-1 text-orange">
              <span className="w-2.5 h-2.5 bg-orange inline-block"></span> {lang === 'hi' ? 'लक्ष्य पूरा' : 'Target Met'}
            </span>
          </span>
        </div>

        {/* Industrial Bar Graph */}
        <div className="relative pt-6 pb-2 border-b border-asphalt bg-paper p-3">
          <div className="absolute left-0 right-0 top-[28%] border-b border-dashed border-steel-dark z-0 opacity-40"></div>
          <div className="absolute right-3 top-[20%] text-[9px] font-mono text-steel uppercase">
            {lang === 'hi' ? 'दैनिक क्षमता: 1,800 KG' : 'DAILY VEHICLE CAPACITY (1,800 KG)'}
          </div>

          <div className="flex items-end justify-between gap-2 h-36 relative z-10">
            {dynamicWeeklyData.map((item) => {
              const heightPercent = Math.round((item.volume / maxVolume) * 100);
              const isPeak = item.volume > 1800;

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="font-mono text-[10px] font-bold text-steel group-hover:text-asphalt transition-colors">
                    {item.onTime}%
                  </div>

                  {/* The bar */}
                  <div
                    className={`w-full max-w-[36px] transition-all duration-150 border border-asphalt relative ${
                      isPeak ? 'bg-orange stamp-orange' : 'bg-asphalt hover:bg-asphalt-soft stamp-sm'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${item.day}: ${item.volume} KG (${item.onTime}% on-time)`}
                  >
                    <div className="h-1 bg-yellow w-full"></div>
                  </div>

                  <div className="font-heading font-bold text-xs uppercase text-asphalt mt-1">
                    {item.day}
                  </div>
                  <div className="font-mono text-[9px] text-steel">
                    {item.volume} kg
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lane Velocity Breakdown */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <div className="border border-steel-border p-2 bg-[#F6F2EA]">
            <div className="text-[10px] text-steel font-heading font-bold uppercase">DELHI ➔ JAIPUR</div>
            <div className="font-bold text-asphalt mt-0.5">{lang === 'hi' ? '24 घंटे में' : 'Within 24 Hours'}</div>
            <div className="w-full bg-[#E5E0D5] h-1.5 mt-1 border border-steel">
              <div className="bg-teal h-full w-[96%]"></div>
            </div>
          </div>
          <div className="border border-steel-border p-2 bg-[#F6F2EA]">
            <div className="text-[10px] text-steel font-heading font-bold uppercase">SURAT ➔ MUMBAI</div>
            <div className="font-bold text-asphalt mt-0.5">{lang === 'hi' ? 'अगले दिन सुबह' : 'Next Morning'}</div>
            <div className="w-full bg-[#E5E0D5] h-1.5 mt-1 border border-steel">
              <div className="bg-teal h-full w-[94%]"></div>
            </div>
          </div>
          <div className="border border-steel-border p-2 bg-[#F6F2EA]">
            <div className="text-[10px] text-steel font-heading font-bold uppercase">CHENNAI ➔ BLR</div>
            <div className="font-bold text-asphalt mt-0.5">{lang === 'hi' ? 'उसी दिन शाम' : 'Same Day Evening'}</div>
            <div className="w-full bg-[#E5E0D5] h-1.5 mt-1 border border-steel">
              <div className="bg-teal h-full w-[98%]"></div>
            </div>
          </div>
          <div className="border border-steel-border p-2 bg-[#F6F2EA]">
            <div className="text-[10px] text-steel font-heading font-bold uppercase">LUDHIANA ➔ KOL</div>
            <div className="font-bold text-asphalt mt-0.5">{lang === 'hi' ? '3 से 4 दिन' : '3 to 4 Days'}</div>
            <div className="w-full bg-[#E5E0D5] h-1.5 mt-1 border border-steel">
              <div className="bg-yellow h-full w-[82%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
