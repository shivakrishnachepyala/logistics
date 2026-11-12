import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShipmentById, updateReceiverPreferences } from '../data/mockShipments';
import type { Shipment } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { useTranslation } from '../context/LanguageContext';
import { formatCurrency } from '../utils/indiaHelpers';

export const ReceiverPortalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useTranslation();

  const [prevId, setPrevId] = useState(id);
  const [shipment, setShipment] = useState<Shipment | undefined>(() => id ? getShipmentById(id) : undefined);
  
  if (id !== prevId) {
    setPrevId(id);
    setShipment(id ? getShipmentById(id) : undefined);
  }

  // Receiver preferences form state
  const [landmark, setLandmark] = useState(() => shipment?.receiverPreferences?.landmark || shipment?.receiver.landmark || '');
  const [slot, setSlot] = useState(() => shipment?.receiverPreferences?.preferredSlot || 'Morning (09:00 AM - 01:00 PM)');
  const [instructions, setInstructions] = useState(() => shipment?.receiverPreferences?.instructions || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;

    const updated = updateReceiverPreferences(shipment.id, {
      landmark: landmark.trim(),
      preferredSlot: slot,
      instructions: instructions.trim()
    });

    if (updated) {
      setShipment(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    }
  };

  if (!shipment) {
    return (
      <div className="flex-1 py-12 px-4 bg-paper flex items-center justify-center">
        <div className="bg-chalk border-[2px] border-asphalt p-6 sm:p-8 max-w-md w-full text-center stamp">
          <IndustrialIcon name="alert" size={32} className="text-orange mx-auto mb-3" />
          <h2 className="font-heading font-black text-2xl uppercase text-asphalt">
            {lang === 'hi' ? 'पार्सल रसीद नहीं मिली' : 'PARCEL NOT FOUND'}
          </h2>
          <p className="font-body text-xs text-steel my-3">
            {lang === 'hi' ? 'इस नंबर का कोई पार्सल दर्ज नहीं है:' : 'No active shipment under ID:'} <strong className="font-mono text-asphalt">{id}</strong>
          </p>
          <Link
            to="/"
            className="btn-industrial bg-asphalt text-paper text-xs px-4 py-2.5 border border-asphalt hover:bg-orange inline-flex items-center gap-2 min-h-[44px]"
          >
            <span>{lang === 'hi' ? 'मुख्य पृष्ठ पर जाएं' : 'GO TO HOME'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-6 sm:py-10 bg-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Top Header Stencil */}
        <div className="flex items-center justify-between border-b border-asphalt pb-3">
          <div>
            <div className="font-heading font-black text-xs text-orange tracking-widest uppercase mb-0.5">
              {lang === 'hi' ? 'प्राप्तकर्ता स्वयं-सेवा पोर्टल' : 'CONSIGNEE SELF-SERVICE PORTAL'}
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-asphalt leading-none">
              {lang === 'hi' ? 'नमस्ते, आपका पार्सल आ रहा है!' : 'HELLO, YOUR PARCEL IS ON THE WAY!'}
            </h1>
          </div>
          <Link
            to={`/track?id=${shipment.id}`}
            className="btn-industrial bg-chalk text-asphalt text-xs px-3 py-2 border border-asphalt hover:bg-paper shrink-0 flex items-center gap-1.5 min-h-[40px]"
          >
            <IndustrialIcon name="compass" size={14} className="text-orange" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'लाइव नक्शा' : 'LIVE MAP'}</span>
          </Link>
        </div>

        {/* 1. Primary Handover OTP Security Card */}
        <div className="bg-chalk border-[2px] border-asphalt p-5 sm:p-6 stamp-lg ticket-perforated-r relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-teal text-white font-mono text-[10px] font-bold px-2 py-0.5 border border-asphalt">
                  {lang === 'hi' ? 'सुरक्षित सुपुर्दगी' : 'SECURITY HANDOVER'}
                </span>
                <span className="font-mono text-xs text-steel">ID: {shipment.id}</span>
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl uppercase text-asphalt leading-tight">
                {lang === 'hi' ? 'डिलीवरी ओटीपी (हैंडओवर कोड)' : 'Delivery Handover OTP'}
              </h2>
              <p className="font-body text-xs text-steel mt-1 max-w-md">
                {lang === 'hi'
                  ? 'यह 4-अंकों का कोड डिलीवरी साथी को केवल पार्सल हाथ में मिलने और जांचने के बाद बताएं।'
                  : 'Tell this 4-digit code to the delivery driver ONLY after receiving and inspecting your parcel.'}
              </p>
            </div>

            <div className="bg-paper border-[2px] border-asphalt p-3.5 sm:p-4 text-center shrink-0 stamp-sm min-w-[140px]">
              <div className="text-[10px] text-steel font-heading font-bold uppercase">
                {lang === 'hi' ? 'आपका कोड' : 'YOUR OTP'}
              </div>
              <div className="font-mono text-3xl font-black text-asphalt tracking-widest my-0.5">
                {shipment.deliveryOtp || '4829'}
              </div>
              <div className="text-[9px] text-teal font-mono font-bold">
                {shipment.photoProof?.otpVerified ? '✓ ALREADY VERIFIED' : 'ACTIVE FOR HANDOVER'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Consignment Status Snapshot */}
        <div className="bg-chalk border-[1.5px] border-asphalt p-4 sm:p-5 stamp font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-steel-border pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-asphalt">{shipment.id}</span>
              <StatusBadge status={shipment.status} size="sm" />
            </div>
            <div className="text-steel text-[11px]">
              LR: <strong className="text-asphalt">{shipment.billOfLading}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-2.5 bg-paper border border-steel-border">
              <div className="text-[10px] text-steel font-heading font-bold uppercase">
                {lang === 'hi' ? 'भेजने वाला (Sender)' : 'FROM (SENDER)'}
              </div>
              <div className="font-bold text-asphalt mt-0.5">{shipment.sender.name}</div>
              <div className="text-steel text-[11px] truncate">{shipment.sender.company} ({shipment.sender.city})</div>
            </div>

            <div className="p-2.5 bg-paper border border-steel-border">
              <div className="text-[10px] text-steel font-heading font-bold uppercase">
                {lang === 'hi' ? 'सामान व वजन' : 'PARCEL CARGO'}
              </div>
              <div className="font-bold text-asphalt mt-0.5">{shipment.cargo.weightKg} KG</div>
              <div className="text-steel text-[11px] truncate">{shipment.cargo.type}</div>
            </div>

            <div className="p-2.5 bg-paper border border-steel-border">
              <div className="text-[10px] text-steel font-heading font-bold uppercase">
                {lang === 'hi' ? 'पहुंचने का समय' : 'EXPECTED ARRIVAL'}
              </div>
              <div className="font-bold text-orange mt-0.5 truncate">
                {shipment.deliveryTimeEstimate || shipment.eta}
              </div>
              <div className="text-teal text-[10px] font-bold">
                {shipment.paymentMethod === 'cod' ? `COD: ${formatCurrency(shipment.priceBreakdown?.total || 906)}` : 'PAID ONLINE'}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Receiver Preferences Form */}
        <div className="bg-chalk border-[2px] border-asphalt p-5 sm:p-6 stamp-lg font-body text-xs">
          <div className="flex items-center justify-between border-b border-asphalt pb-3 mb-4">
            <div>
              <h2 className="font-heading font-black text-xl uppercase text-asphalt">
                {lang === 'hi' ? 'डिलीवरी निर्देश व समय चुनें' : 'Delivery Preferences & Slot'}
              </h2>
              <div className="font-mono text-xs text-steel mt-0.5">
                {lang === 'hi' ? 'ड्राइवर के आने से पहले अपना लैंडमार्क व पसंदीदा समय दर्ज करें' : 'Help the driver reach your doorstep without phone calls'}
              </div>
            </div>
            <span className="bg-yellow text-asphalt font-heading font-bold text-[10px] px-2 py-1 uppercase border border-asphalt shrink-0">
              {lang === 'hi' ? 'लाइव अपडेट' : 'DISPATCH SYNC'}
            </span>
          </div>

          {saveSuccess && (
            <div className="bg-teal-soft border-[1.5px] border-teal p-3.5 mb-4 flex items-center gap-2 text-teal font-mono text-xs font-bold stamp-sm">
              <IndustrialIcon name="check" size={16} />
              <span>
                {lang === 'hi' 
                  ? 'निर्देश सफलतापूर्वक सहेजे गए! ड्राइवर को सूचना भेज दी गई है।' 
                  : 'Preferences confirmed! Driver will deliver as requested.'}
              </span>
            </div>
          )}

          <form onSubmit={handlePreferencesSubmit} className="space-y-4">
            {/* Preferred Delivery Slot */}
            <div>
              <label className="block font-heading font-bold uppercase text-asphalt text-xs mb-2">
                {lang === 'hi' ? 'पसंदीदा डिलीवरी समय (Choose Preferred Slot) *' : 'Preferred Delivery Time Slot *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                {[
                  { id: 'Morning (09:00 AM - 01:00 PM)', label: lang === 'hi' ? 'सुबह (09:00 - 13:00)' : 'Morning (9 AM - 1 PM)' },
                  { id: 'Afternoon (02:00 PM - 05:00 PM)', label: lang === 'hi' ? 'दोपहर (14:00 - 17:00)' : 'Afternoon (2 PM - 5 PM)' },
                  { id: 'Evening (05:00 PM - 08:00 PM)', label: lang === 'hi' ? 'शाम (17:00 - 20:00)' : 'Evening (5 PM - 8 PM)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlot(s.id)}
                    className={`p-3 text-left border-[1.5px] transition-all rounded-[2px] ${
                      slot === s.id
                        ? 'bg-asphalt text-paper border-asphalt stamp-sm font-bold'
                        : 'bg-paper text-asphalt border-steel-border hover:border-asphalt'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{s.label}</span>
                      {slot === s.id && <span className="text-yellow text-xs font-bold">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Landmark Confirmation */}
            <div>
              <label className="block font-heading font-bold uppercase text-asphalt text-xs mb-1">
                {lang === 'hi' ? 'दुकान / घर का लैंडमार्क (Landmark / Shop Landmark)' : 'Doorstep Landmark (Nearby landmark for driver)'}
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: सांगानेरी गेट के सामने, चाय की दुकान के पास' : 'E.G. NEAR SANGANERI GATE OPPOSITE CHAI CORNER'}
                className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-[2px] font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
              />
              <span className="text-[10px] text-steel mt-0.5 block">
                {lang === 'hi' ? 'ड्राइवर को रास्ता खोजने में आसानी होगी।' : 'Helps driver find your exact location without multiple phone calls.'}
              </span>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block font-heading font-bold uppercase text-asphalt text-xs mb-1">
                {lang === 'hi' ? 'अतिरिक्त निर्देश (Special Notes / In case unavailable)' : 'Special Instructions (Optional)'}
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: दुकान बंद हो तो पड़ोस की दुकान में छोड़ें, पहुंचने पर कॉल करें' : 'E.G. CALL 10 MINUTES BEFORE ARRIVAL'}
                className="w-full bg-paper text-asphalt px-3 py-2 border-[1.5px] border-asphalt rounded-[2px] font-mono text-xs uppercase focus:outline-none focus:bg-white"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="btn-industrial bg-orange text-white text-xs px-6 py-3.5 border-[1.5px] border-asphalt stamp-sm hover:bg-orange-hover w-full sm:w-auto flex items-center justify-center gap-2 min-h-[48px]"
              >
                <IndustrialIcon name="check" size={16} />
                <span>{lang === 'hi' ? 'निर्देश सहेजें (Confirm Slot)' : 'CONFIRM DELIVERY PREFERENCES'}</span>
              </button>

              <div className="text-[11px] text-steel font-mono text-center sm:text-left">
                {lang === 'hi' ? 'ड्राइवर के मोबाइल पर तुरंत अपडेट होगा' : 'Instantly synchronized with assigned driver'}
              </div>
            </div>
          </form>
        </div>

        {/* 4. Bottom Support Quick Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <a
            href="tel:+919876543210"
            className="p-3 bg-chalk border-[1.5px] border-asphalt stamp-sm flex items-center justify-between hover:bg-paper transition-colors min-h-[48px]"
          >
            <div className="flex items-center gap-2">
              <IndustrialIcon name="phone" size={16} className="text-teal" />
              <div>
                <div className="font-heading font-bold uppercase text-asphalt">{t('contact.callUs')}</div>
                <div className="text-[11px] text-steel">+91 98765 43210</div>
              </div>
            </div>
            <span className="text-orange font-bold text-xs">CALL ➔</span>
          </a>

          <Link
            to={`/shipment/${shipment.id}`}
            className="p-3 bg-chalk border-[1.5px] border-asphalt stamp-sm flex items-center justify-between hover:bg-paper transition-colors min-h-[48px]"
          >
            <div className="flex items-center gap-2">
              <IndustrialIcon name="file" size={16} className="text-orange" />
              <div>
                <div className="font-heading font-bold uppercase text-asphalt">{lang === 'hi' ? 'पक्की बिलती रसीद' : 'OFFICIAL BILTY RECEIPT'}</div>
                <div className="text-[11px] text-steel">{shipment.billOfLading}</div>
              </div>
            </div>
            <span className="text-orange font-bold text-xs">VIEW ➔</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
