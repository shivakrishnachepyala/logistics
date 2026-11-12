import React from 'react';
import type { PriceBreakdown as PriceBreakdownType } from '../../types';
import { formatCurrency } from '../../utils/indiaHelpers';
import { useTranslation, InfoTooltip } from '../../context/LanguageContext';
import { PRICING_TOOLTIPS } from '../../services/pricingService';
import { IndustrialIcon } from './IndustrialIcon';

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
  isCod?: boolean;
  className?: string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  breakdown,
  isCod = false,
  className = '',
}) => {
  const { lang } = useTranslation();

  const lines = [
    {
      key: 'base',
      label: lang === 'hi' ? 'मूल भाड़ा (Base charge)' : 'Base charge',
      amount: breakdown.baseCharge,
      tooltip: PRICING_TOOLTIPS.base[lang],
    },
    {
      key: 'fuel',
      label: lang === 'hi' ? 'डीजल व टोल खर्च (Fuel & Toll)' : 'Fuel & toll surcharge',
      amount: breakdown.fuelCharge,
      tooltip: PRICING_TOOLTIPS.fuel[lang],
    },
    {
      key: 'packing',
      label: lang === 'hi' ? 'सुरक्षित पैकिंग (Packing)' : 'Protective packing',
      amount: breakdown.packingCharge,
      tooltip: PRICING_TOOLTIPS.packing[lang],
    },
    {
      key: 'pickup',
      label: lang === 'hi' ? 'घर से पिकअप (Pickup charge)' : 'Doorstep pickup fee',
      amount: breakdown.pickupCharge,
      tooltip: PRICING_TOOLTIPS.pickup[lang],
    },
    ...(isCod || breakdown.codFee > 0
      ? [
          {
            key: 'cod',
            label: lang === 'hi' ? 'कैश ऑन डिलीवरी शुल्क (COD fee)' : 'Pay-when-delivered fee',
            amount: breakdown.codFee,
            tooltip: PRICING_TOOLTIPS.cod[lang],
          },
        ]
      : []),
    {
      key: 'gst',
      label: lang === 'hi' ? 'सरकारी जीएसटी टैक्स (GST 18%)' : 'Government GST (18%)',
      amount: breakdown.gstAmount,
      tooltip: PRICING_TOOLTIPS.gst[lang],
    },
  ];

  return (
    <div className={`bg-chalk border-[2px] border-asphalt p-4 sm:p-5 stamp font-mono text-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-asphalt pb-2.5 mb-3">
        <div className="font-heading font-black text-sm uppercase tracking-wider text-asphalt flex items-center gap-1.5">
          <IndustrialIcon name="file" size={16} className="text-orange" />
          <span>{lang === 'hi' ? 'खर्च का पूरा हिसाब (बिल विवरण)' : 'TRANSPARENT PRICE BREAKDOWN'}</span>
        </div>
        <span className="text-[10px] bg-teal text-white font-bold px-2 py-0.5 border border-asphalt">
          {lang === 'hi' ? 'जीएसटी बिल' : 'GST INVOICE'}
        </span>
      </div>

      {/* Line Items */}
      <div className="space-y-2 mb-3">
        {lines.map((line) => (
          <div key={line.key} className="flex items-center justify-between py-1 border-b border-dashed border-steel-border/50 text-asphalt">
            <div className="flex items-center">
              <span>{line.label}</span>
              <InfoTooltip text={line.tooltip} />
            </div>
            <span className="font-bold text-asphalt">{formatCurrency(line.amount)}</span>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="pt-2 border-t-2 border-asphalt flex items-center justify-between text-sm sm:text-base">
        <div className="flex items-center font-heading font-black text-base text-asphalt uppercase">
          <span>{lang === 'hi' ? 'कुल देय राशि (Total)' : 'TOTAL FINAL PRICE'}</span>
          <InfoTooltip text={PRICING_TOOLTIPS.total[lang]} />
        </div>
        <div className="font-mono font-black text-xl sm:text-2xl text-orange">
          {formatCurrency(breakdown.total)}
        </div>
      </div>

      {/* Trust Stamp Line */}
      <div className="mt-3 pt-2.5 border-t border-asphalt/20 flex items-center justify-between text-[11px] text-teal font-bold">
        <span className="flex items-center gap-1.5">
          <IndustrialIcon name="shield" size={14} />
          <span>{PRICING_TOOLTIPS.total[lang]}</span>
        </span>
        <span className="text-steel font-normal">All India Standard</span>
      </div>
    </div>
  );
};
