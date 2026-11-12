import React from 'react';
import type { Shipment } from '../../types';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';

interface StatusCounterCardsProps {
  shipments: Shipment[];
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatusCounterCards: React.FC<StatusCounterCardsProps> = ({
  shipments,
  activeFilter,
  onSelectFilter,
}) => {
  const { lang } = useTranslation();

  const inTransitCount = shipments.filter(s => s.status === 'in-transit').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
  const delayedCount = shipments.filter(s => s.status === 'delayed').length;

  const totalWeightKg = shipments.reduce((acc, s) => acc + (s.cargo?.weightKg || 0), 0);

  const cards = [
    {
      id: 'all',
      label: lang === 'hi' ? 'कुल चालू पार्सल' : 'TOTAL ACTIVE PARCELS',
      value: shipments.length,
      subtext: `${totalWeightKg.toLocaleString('en-IN')} KG (${(totalWeightKg / 1000).toFixed(1)} MT)`,
      icon: 'box' as const,
      accentBorder: 'border-asphalt',
      badgeBg: 'bg-asphalt text-paper',
      shadow: 'stamp',
    },
    {
      id: 'in-transit',
      label: lang === 'hi' ? 'रास्ते में हैं (गाड़ी चल रही है)' : 'ON THE WAY (VEHICLE MOVING)',
      value: inTransitCount,
      subtext: lang === 'hi' ? 'सड़क व रेल मार्ग पर सक्रिय' : 'ROAD & RAIL HIGHWAY ACTIVE',
      icon: 'truck' as const,
      accentBorder: 'border-yellow',
      badgeBg: 'bg-yellow text-asphalt font-bold',
      shadow: 'stamp-yellow',
    },
    {
      id: 'delivered',
      label: lang === 'hi' ? 'सफलतापूर्वक पहुंच गए' : 'DELIVERED SAFELY',
      value: deliveredCount,
      subtext: lang === 'hi' ? 'हस्ताक्षर और फोटो प्राप्त' : 'SIGNED PROOF CONFIRMED',
      icon: 'check' as const,
      accentBorder: 'border-teal',
      badgeBg: 'bg-teal text-white font-bold',
      shadow: 'stamp-teal',
    },
    {
      id: 'delayed',
      label: lang === 'hi' ? 'देरी से चल रहे पार्सल' : 'RUNNING LATE (DELAYED)',
      value: delayedCount,
      subtext: lang === 'hi' ? 'मौसम या जाम के कारण' : 'DUE TO FOG OR ROAD REPAIR',
      icon: 'alert' as const,
      accentBorder: 'border-orange',
      badgeBg: 'bg-orange text-white font-bold',
      shadow: 'stamp-orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`text-left p-4 bg-chalk border-[2px] rounded-[2px] transition-all duration-150 relative overflow-hidden min-h-[105px] ${
              isSelected ? 'ring-2 ring-orange bg-paper stamp-lg' : `${card.shadow} hover:bg-paper`
            } ${card.accentBorder}`}
          >
            {/* Top row with icon & status */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-steel">
                {card.label}
              </span>
              <div className={`p-1.5 border border-asphalt rounded-[2px] ${card.badgeBg}`}>
                <IndustrialIcon name={card.icon} size={16} />
              </div>
            </div>

            {/* Metric Value */}
            <div className="flex items-baseline gap-2 my-1">
              <span className="font-mono text-3xl font-extrabold text-asphalt leading-none">
                {card.value < 10 ? `0${card.value}` : card.value}
              </span>
              <span className="font-heading font-bold text-xs uppercase text-steel">
                {lang === 'hi' ? 'पार्सल' : 'PARCELS'}
              </span>
            </div>

            {/* Subtext */}
            <div className="font-mono text-[10px] text-steel mt-2 border-t border-steel-border pt-1.5 flex items-center justify-between">
              <span>{card.subtext}</span>
              {isSelected && (
                <span className="text-orange font-bold font-heading">
                  {lang === 'hi' ? 'चुना हुआ' : 'FILTER ACTIVE'}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
