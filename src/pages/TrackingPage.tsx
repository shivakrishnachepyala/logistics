import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getShipmentById, updateShipmentStatus } from '../data/mockShipments';
import type { Shipment } from '../types';
import { RouteMap } from '../components/tracking/RouteMap';
import { TrackingTimeline } from '../components/tracking/TrackingTimeline';
import { StatusBadge } from '../components/common/StatusBadge';
import { Barcode } from '../components/common/Barcode';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { DelayReasonCard } from '../components/tracking/DelayReasonCard';
import { ConfidenceMeter } from '../components/tracking/ConfidenceMeter';
import { OtpVerificationModal } from '../components/tracking/OtpVerificationModal';
import { useTranslation } from '../context/LanguageContext';
import { formatCurrency } from '../utils/indiaHelpers';

export const TrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang, t } = useTranslation();
  const queryId = searchParams.get('id') || 'FLX-8829-JPR';

  const [prevQueryId, setPrevQueryId] = useState(queryId);
  const [inputVal, setInputVal] = useState(queryId);
  const [shipment, setShipment] = useState<Shipment | undefined>(() => queryId ? getShipmentById(queryId) : undefined);
  const [notFound, setNotFound] = useState(() => !getShipmentById(queryId));

  if (queryId !== prevQueryId) {
    setPrevQueryId(queryId);
    setInputVal(queryId);
    const found = getShipmentById(queryId);
    setShipment(found);
    setNotFound(!found);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    navigate(`/track?id=${encodeURIComponent(inputVal.trim().toUpperCase())}`);
  };

  const sampleShipmentIds = [
    { id: 'FLX-8829-JPR', label: lang === 'hi' ? 'दिल्ली ➔ जयपुर' : 'Delhi ➔ Jaipur' },
    { id: 'FLX-4012-MUM', label: lang === 'hi' ? 'सूरत ➔ मुंबई' : 'Surat ➔ Mumbai' },
    { id: 'FLX-3109-BLR', label: lang === 'hi' ? 'चेन्नई ➔ बेंगलुरु' : 'Chennai ➔ Bengaluru' },
    { id: 'FLX-7741-KOL', label: lang === 'hi' ? 'लुधियाना ➔ कोलकाता' : 'Ludhiana ➔ Kolkata' },
    { id: 'FLX-5520-HYD', label: lang === 'hi' ? 'अहमदाबाद ➔ हैदराबाद' : 'Ahmedabad ➔ Hyderabad' },
    { id: 'FLX-1194-IND', label: lang === 'hi' ? 'पुणे ➔ इंदौर' : 'Pune ➔ Indore' },
  ];

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
              {lang === 'hi' ? 'रीयल-टाइम ट्रैकिंग कंसोल' : 'Real-Time Telematics & Tracking'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {t('track.title', 'Live Shipment Tracking')}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <span>← {lang === 'hi' ? 'होम' : 'Back to Home'}</span>
            </Link>
            <Link
              to="/create"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <IndustrialIcon name="plus" size={14} />
              <span>{t('nav.newShipment', 'Book Shipment')}</span>
            </Link>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('track.inputPlaceholder', 'Enter Consignment Number (e.g. FLX-8829-JPR)...')}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-sm font-mono px-4 py-3 pl-11 border border-slate-200 rounded-xl uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
                <IndustrialIcon name="barcode" size={18} />
              </span>
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-7 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <IndustrialIcon name="search" size={15} />
              <span>{t('track.btn', 'Track Consignment')}</span>
            </button>
          </form>

          {/* Quick chips */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              {lang === 'hi' ? 'चालू पार्सल चेक करें:' : 'Try active consignments:'}
            </span>
            {sampleShipmentIds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/track?id=${item.id}`)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 font-mono ${
                  queryId === item.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{item.id}</span>
                <span className="text-slate-400">({item.label})</span>
              </button>
            ))}
          </div>
        </div>

        {/* If Shipment Not Found */}
        {notFound && (
          <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-4 shadow-sm mb-8">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <IndustrialIcon name="alert" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('track.notFoundTitle', 'Consignment Not Found')}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t('track.notFoundDesc', 'We could not find an active shipment matching this ID. Please double check the ID from your receipt or click below.')}
            </p>
            <button
              onClick={() => navigate('/track?id=FLX-8829-JPR')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              {lang === 'hi' ? 'उदाहरण पार्सल लोड करें (FLX-8829-JPR)' : 'Load Default Demo Consignment (FLX-8829-JPR)'}
            </button>
          </div>
        )}

        {/* If Shipment Found */}
        {shipment && (
          <div className="space-y-8">
            
            {/* Top Consignment Overview Banner Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: ID & Route */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {shipment.id}
                    </span>
                    <StatusBadge status={shipment.status} size="md" />
                    <span className="bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-1 rounded-md font-semibold">
                      LR: {shipment.billOfLading}
                    </span>
                  </div>

                  {/* Route corridor */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                    <span className="bg-slate-900 text-white font-semibold px-2.5 py-1 rounded-md">
                      {shipment.sender.city.toUpperCase()}
                    </span>
                    <span className="text-orange-500 font-bold text-sm">➔</span>
                    <span className="bg-slate-900 text-white font-semibold px-2.5 py-1 rounded-md">
                      {shipment.receiver.city.toUpperCase()}
                    </span>
                    <span className="text-slate-400 font-medium ml-1">
                      ({shipment.originHub} ➔ {shipment.destinationHub})
                    </span>
                  </div>

                  {/* Consignee Self-Service Link Pill */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to={`/r/${shipment.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition-colors"
                      title="Open Consignee Self-Service Portal"
                    >
                      <IndustrialIcon name="lock" size={13} className="text-orange-500" />
                      <span>{lang === 'hi' ? 'प्राप्तकर्ता पोर्टल व ओटीपी' : 'Consignee Portal & Delivery OTP'} ➔</span>
                    </Link>

                    {shipment.whatsappUpdates && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <IndustrialIcon name="check" size={14} className="text-emerald-500" />
                        <span>{lang === 'hi' ? 'व्हाट्सएप अलर्ट सक्रिय' : 'WhatsApp alerts enabled'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Barcode & Actions */}
                <div className="flex flex-wrap items-center gap-4">
                  <Barcode value={shipment.id.replace(/-/g, '')} subtext="VERIFIED CONSIGNMENT" height={38} />
                  
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/shipment/${shipment.id}`}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <IndustrialIcon name="file" size={14} />
                      <span>{t('track.viewReceipt', 'View Official Bilty')}</span>
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <IndustrialIcon name="printer" size={14} />
                      <span>{t('track.printReceipt', 'Print Receipt')}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Specification Grid */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/60">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'सामान का प्रकार' : 'Consignment Item'}
                  </div>
                  <div className="font-semibold text-slate-900 truncate mt-0.5">{shipment.cargo.type}</div>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/60">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'कुल वजन' : 'Total Weight'}
                  </div>
                  <div className="font-semibold text-slate-900 mt-0.5">{shipment.cargo.weightKg.toLocaleString()} KG</div>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/60">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'घोषित मूल्य' : 'Declared Value'}
                  </div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {shipment.cargo.declaredValueInr ? formatCurrency(shipment.cargo.declaredValueInr) : '₹4,85,000'}
                  </div>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/60">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'गाड़ी / वाहन' : 'Fleet Carrier'}
                  </div>
                  <div className="font-semibold text-slate-900 truncate mt-0.5">{shipment.vesselOrFlight || shipment.carrier}</div>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/60">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'पहुंचने की तारीख' : 'Scheduled ETA'}
                  </div>
                  <div className="font-semibold text-orange-600 truncate mt-0.5">{shipment.deliveryTimeEstimate || shipment.eta}</div>
                  <div className="mt-1">
                    <ConfidenceMeter promise={shipment.deliveryPromise} />
                  </div>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/60">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'भुगतान तरीका' : 'Payment Mode'}
                  </div>
                  <div className="font-semibold text-emerald-600 truncate mt-0.5 uppercase">
                    {shipment.paymentMethod === 'cod'
                      ? (lang === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery')
                      : (lang === 'hi' ? 'ऑनलाइन भुगतान (UPI)' : 'Prepaid Online')}
                  </div>
                </div>
              </div>
            </div>

            {/* Delay Reason Card (if delayed) */}
            {(shipment.status === 'delayed' || shipment.delayInfo) && (
              <DelayReasonCard
                parcelNumber={shipment.id}
                delayInfo={
                  shipment.delayInfo || {
                    reason: 'Corridor slowdown due to highway inspection and localized rain.',
                    reasonHindi: 'हाईवे पर भारी बारिश और पुल निरीक्षण के कारण गति धीमी हुई।',
                    reasonCode: 'heavy_rain',
                    durationHours: 18,
                    durationText: '18 Hours',
                    originalEta: shipment.eta,
                    revisedEta: 'Tomorrow evening (revised)',
                    location: `${shipment.sender.city} - ${shipment.receiver.city} Corridor`,
                    historyText: `Expected ${shipment.eta} → Revised due to weather`,
                    actionOption: 'change_time',
                  }
                }
              />
            )}

            {/* OTP-Confirmed Delivery Card */}
            <OtpVerificationModal
              deliveryOtp={shipment.deliveryOtp || '4829'}
              isDelivered={shipment.status === 'delivered'}
              onDelivered={() => {
                const updated = updateShipmentStatus(shipment.id, 'delivered', {
                  progressPercent: 100,
                  deliveryTimeEstimate: 'Delivered just now with OTP confirmation',
                  photoProof: {
                    ...(shipment.photoProof || { otpVerified: false }),
                    otpVerified: true,
                    deliveryTimestamp: new Date().toLocaleString('en-IN'),
                    deliveredTo: shipment.receiver.name
                  }
                });
                if (updated) {
                  setShipment(updated);
                }
              }}
            />

            {/* Live Route Radar Map */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <IndustrialIcon name="compass" size={16} className="text-orange-500" />
                  <span>{lang === 'hi' ? 'कॉरिडोर प्रोग्रेस व रूट रडार (सिम्युलेटेड)' : 'Corridor Progress & Route Radar (Simulated)'}</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {lang === 'hi' ? 'सिम्युलेटेड टेलीमैटिक्स डेटा' : 'Simulated Telematics Telemetry'}
                </div>
              </div>
              <RouteMap shipment={shipment} />
            </div>

            {/* Vertical Checkpoints Timeline */}
            <div>
              <TrackingTimeline shipment={shipment} />
            </div>

            {/* Assigned Driver & Line-Haul Vehicle Card */}
            {shipment.assignedDriver && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                    {shipment.assignedDriver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {lang === 'hi' ? 'डिलीवरी ड्राइवर:' : 'Assigned Line-Haul Driver:'} {shipment.assignedDriver.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {lang === 'hi' ? 'वाहन विवरण:' : 'Vehicle:'} {shipment.assignedDriver.vehicleType} ({shipment.assignedDriver.vehiclePlate})
                    </div>
                    <div className="text-xs text-slate-700 mt-1 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{lang === 'hi' ? 'वर्तमान स्थान:' : 'Current Location:'} {shipment.assignedDriver.currentLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${shipment.assignedDriver.phone}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <IndustrialIcon name="phone" size={15} />
                    <span>{t('track.callDriver', 'Call Driver')}: {shipment.assignedDriver.phone}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Simulated Demonstration Notice Banner */}
            <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-start gap-3">
              <IndustrialIcon name="alert" size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-slate-700 font-semibold block mb-0.5">
                  {lang === 'hi' ? 'डेमो सूचना:' : 'Simulation Demonstration Notice:'}
                </strong>
                {lang === 'hi'
                  ? 'यह ट्रैकिंग पोर्टल फ्रेटलाइन एलएमएस के रीयल-टाइम जीपीएस और टेलीमैटिक्स सिस्टम का लाइव फ्रंटएंड प्रदर्शन है। सभी गतिविधियां, समय और चेकपॉइंट मॉक डेटा पर आधारित हैं।'
                  : 'This tracking page demonstrates real-time consignment telematics, dynamic delay revisions, and OTP security workflows for FreightLine LMS using browser state.'}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
