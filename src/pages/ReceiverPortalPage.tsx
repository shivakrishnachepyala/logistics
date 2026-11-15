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
  const { lang } = useTranslation();

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
      <div className="flex-1 py-16 px-4 bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <IndustrialIcon name="alert" size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {lang === 'hi' ? 'पार्सल रसीद नहीं मिली' : 'Consignment Not Found'}
          </h2>
          <p className="text-xs text-slate-500 my-3">
            {lang === 'hi' ? 'इस नंबर का कोई पार्सल दर्ज नहीं है:' : 'No active shipment registered under:'}{' '}
            <strong className="font-mono text-slate-800">{id}</strong>
          </p>
          <Link
            to="/"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors mt-2"
          >
            <span>{lang === 'hi' ? 'मुख्य पृष्ठ पर जाएं' : 'Return to Home'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-0.5">
              {lang === 'hi' ? 'प्राप्तकर्ता स्वयं-सेवा पोर्टल' : 'Consignee Self-Service Desk'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {lang === 'hi' ? 'नमस्ते, आपका पार्सल आ रहा है!' : 'Your Consignment is on the Way!'}
            </h1>
          </div>
          <Link
            to={`/track?id=${shipment.id}`}
            className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs shrink-0 flex items-center gap-1.5 transition-colors"
          >
            <IndustrialIcon name="compass" size={14} className="text-orange-500" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'लाइव नक्शा' : 'Live Tracking Map'}</span>
          </Link>
        </div>

        {/* 1. Primary Handover OTP Security Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-50 text-emerald-700 font-medium text-xs px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {lang === 'hi' ? 'सुरक्षित सुपुर्दगी' : 'Secure Consignee Handover'}
                </span>
                <span className="font-mono text-xs text-slate-400">ID: {shipment.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {lang === 'hi' ? 'डिलीवरी ओटीपी (हैंडओवर कोड)' : 'Delivery Handover OTP'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                {lang === 'hi'
                  ? 'यह 4-अंकों का कोड डिलीवरी साथी को केवल पार्सल हाथ में मिलने और भौतिक रूप से जांचने के बाद बताएं।'
                  : 'Share this 4-digit code with the delivery driver ONLY after physical inspection of your consignment.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shrink-0 min-w-[150px] shadow-2xs">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {lang === 'hi' ? 'आपका कोड' : 'YOUR OTP'}
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-slate-900 tracking-widest my-1">
                {shipment.deliveryOtp || '4829'}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {shipment.photoProof?.otpVerified ? '✓ Handover Completed' : 'Active for Handover'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Consignment Status Snapshot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900 text-sm">{shipment.id}</span>
              <StatusBadge status={shipment.status} size="sm" />
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              LR: <strong className="text-slate-700">{shipment.billOfLading}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {lang === 'hi' ? 'भेजने वाला (Sender)' : 'Shipper / Sender'}
              </div>
              <div className="font-bold text-slate-900 mt-0.5">{shipment.sender.name}</div>
              <div className="text-slate-500 text-[11px] truncate">{shipment.sender.company} ({shipment.sender.city})</div>
            </div>

            <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {lang === 'hi' ? 'सामान व वजन' : 'Cargo & Weight'}
              </div>
              <div className="font-bold text-slate-900 mt-0.5">{shipment.cargo.weightKg} KG</div>
              <div className="text-slate-500 text-[11px] truncate">{shipment.cargo.type}</div>
            </div>

            <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {lang === 'hi' ? 'पहुंचने का समय' : 'Scheduled Arrival'}
              </div>
              <div className="font-bold text-orange-600 mt-0.5 truncate">
                {shipment.deliveryTimeEstimate || shipment.eta}
              </div>
              <div className="text-emerald-700 text-[11px] font-semibold mt-0.5">
                {shipment.paymentMethod === 'cod' ? `COD: ${formatCurrency(shipment.priceBreakdown?.total || 906)}` : 'Prepaid Online'}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Receiver Preferences Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'hi' ? 'डिलीवरी निर्देश व समय चुनें' : 'Delivery Preferences & Time Slot'}
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                {lang === 'hi' ? 'ड्राइवर के आने से पहले अपना लैंडमार्क व पसंदीदा समय दर्ज करें' : 'Help our driver find your exact address without repeated phone calls'}
              </div>
            </div>
            <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-100 shrink-0">
              {lang === 'hi' ? 'लाइव सिंक' : 'Dispatch Sync'}
            </span>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <IndustrialIcon name="check" size={16} className="text-emerald-600 shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'निर्देश सफलतापूर्वक सहेजे गए! ड्राइवर के सिस्टम में सूचना दर्ज हो गई है।'
                  : 'Preferences updated! Driver telematics console has been synchronized.'}
              </span>
            </div>
          )}

          <form onSubmit={handlePreferencesSubmit} className="space-y-4">
            {/* Preferred Delivery Slot */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                {lang === 'hi' ? 'पसंदीदा डिलीवरी समय (Choose Preferred Slot) *' : 'Select Preferred Delivery Window *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'Morning (09:00 AM - 01:00 PM)', label: lang === 'hi' ? 'सुबह (09:00 - 13:00)' : 'Morning (9 AM - 1 PM)' },
                  { id: 'Afternoon (02:00 PM - 05:00 PM)', label: lang === 'hi' ? 'दोपहर (14:00 - 17:00)' : 'Afternoon (2 PM - 5 PM)' },
                  { id: 'Evening (05:00 PM - 08:00 PM)', label: lang === 'hi' ? 'शाम (17:00 - 20:00)' : 'Evening (5 PM - 8 PM)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlot(s.id)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      slot === s.id
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>{s.label}</span>
                      {slot === s.id && <span className="text-orange-400 font-bold">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Landmark Confirmation */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'दुकान / घर का लैंडमार्क (Nearby Landmark)' : 'Nearby Landmark / Prominent Spot'}
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: सांगानेरी गेट के सामने, चाय की दुकान के पास' : 'e.g. Near Sanganeri Gate opposite Chai Corner'}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white text-xs transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {lang === 'hi' ? 'ड्राइवर को आपकी लोकेशन बिना कॉल किए आसानी से मिल जाएगी।' : 'Saves time and avoids delivery coordination delays.'}
              </span>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'अतिरिक्त निर्देश (Special Notes / In case unavailable)' : 'Special Delivery Notes (Optional)'}
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: पहुंचने से 10 मिनट पहले कॉल करें' : 'e.g. Call 10 minutes prior to arrival; if door locked hand over to neighbor'}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white text-xs transition-all"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-sm transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <IndustrialIcon name="check" size={16} />
                <span>{lang === 'hi' ? 'निर्देश सहेजें' : 'Save Delivery Preferences'}</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center sm:text-left">
                {lang === 'hi' ? 'ड्राइवर के डिवाइस पर तुरंत अपडेट होगा' : 'Instantly visible to assigned driver'}
              </div>
            </div>
          </form>
        </div>

        {/* 4. Support Assistance Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="mailto:support@freightline.in"
            className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IndustrialIcon name="phone" size={16} />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{lang === 'hi' ? 'हेल्प डेस्क सहायता' : 'Operations Help Desk'}</div>
                <div className="text-[11px] text-slate-500">support@freightline.in</div>
              </div>
            </div>
            <span className="text-orange-600 font-semibold text-xs">Email ➔</span>
          </a>

          <Link
            to={`/shipment/${shipment.id}`}
            className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <IndustrialIcon name="file" size={16} />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{lang === 'hi' ? 'पक्की बिलती रसीद' : 'Official LR Bilty'}</div>
                <div className="text-[11px] text-slate-500 font-mono">{shipment.billOfLading}</div>
              </div>
            </div>
            <span className="text-orange-600 font-semibold text-xs">View ➔</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
