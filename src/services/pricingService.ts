import type { PriceBreakdown } from '../types';

export interface PricingOptions {
  weightKg: number;
  weightGrams?: number;
  speed: string; // 'standard' | 'next_day' | 'same_day'
  paymentMethod: 'upi' | 'cod' | 'card' | 'netbanking';
  isShopDropoff?: boolean;
  packingType?: string;
}

/**
 * Calculates a fully transparent price breakdown for India logistics.
 * All math is explicit so real APIs or ERP systems can replace it seamlessly.
 */
export const calculatePriceBreakdown = (options: PricingOptions): PriceBreakdown => {
  const totalWeight = Math.max(1, (options.weightKg || 0) + ((options.weightGrams || 0) / 1000));
  
  // Rate per kg based on speed tier
  let ratePerKg = 18;
  if (options.speed === 'same_day') {
    ratePerKg = 38;
  } else if (options.speed === 'next_day') {
    ratePerKg = 24;
  } else {
    ratePerKg = 16;
  }

  // Base charge (minimum base rate + weight multiplied)
  const baseCharge = Math.round(180 + totalWeight * ratePerKg);

  // Fuel surcharge: 10% of base charge
  const fuelCharge = Math.round(baseCharge * 0.10);

  // Packing charge: 0 if basic or ₹60 for special box
  let packingCharge = 40;
  if (options.packingType?.toLowerCase().includes('cold')) {
    packingCharge = 120;
  } else if (options.packingType?.toLowerCase().includes('wooden')) {
    packingCharge = 90;
  }

  // Pickup charge: ₹50 for doorstep pickup, ₹0 if dropped at nearby shop
  const pickupCharge = options.isShopDropoff ? 0 : 50;

  // Pay-when-delivered (COD) fee: ₹40 flat for cash collection handling, ₹0 for prepaid/UPI
  const codFee = options.paymentMethod === 'cod' ? 40 : 0;

  // Subtotal before tax
  const subtotal = baseCharge + fuelCharge + packingCharge + pickupCharge + codFee;

  // GST 18% (Standard Indian Goods & Services Tax on freight transport)
  const gstAmount = Math.round(subtotal * 0.18);

  // Final Total
  const total = subtotal + gstAmount;

  return {
    baseCharge,
    fuelCharge,
    packingCharge,
    pickupCharge,
    codFee,
    gstAmount,
    total,
  };
};

export const PRICING_TOOLTIPS = {
  base: {
    en: 'Cost of transporting your parcel based on weight and distance.',
    hi: 'वजन और दूरी के हिसाब से पार्सल ले जाने का मूल किराया।',
  },
  fuel: {
    en: 'Standard diesel and highway toll costs for long routes.',
    hi: 'गाड़ी के डीजल और हाईवे टोल टैक्स का खर्च।',
  },
  packing: {
    en: 'Cost of protective cartons, waterproof tape, and security seals.',
    hi: 'मजबूत डिब्बे, वॉटरप्रूफ टेप और सुरक्षा सील का खर्च।',
  },
  pickup: {
    en: 'Cost for driver to come directly to your shop or home.',
    hi: 'डिलीवरी साथी के आपकी दुकान या घर आकर पार्सल लेने का खर्च।',
  },
  cod: {
    en: 'Cost for collecting cash safely and depositing to your bank.',
    hi: 'डिलीवरी पर नकद रुपये लेकर आपके बैंक में जमा करने का खर्च।',
  },
  gst: {
    en: 'Official Government Goods & Services Tax (18% on transport).',
    hi: 'परिवहन पर भारत सरकार का 18% आधिकारिक जीएसटी टैक्स।',
  },
  total: {
    en: 'No hidden charges. This is the exact final price you pay.',
    hi: 'कोई छुपा शुल्क नहीं। यह अंतिम और पक्का मूल्य है।',
  },
};
