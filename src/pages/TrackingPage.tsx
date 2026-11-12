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
    <div className="flex-1 py-6 sm:py-10 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-asphalt pb-4">
          <div>
            <div className="font-heading font-black text-xs text-orange tracking-widest uppercase mb-1">
              {t('track.sub')}
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase text-asphalt leading-none">
              {t('track.title')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="btn-industrial bg-chalk text-asphalt text-xs px-3.5 py-2.5 border-[1.5px] border-asphalt hover:bg-paper min-h-[44px] flex items-center gap-1.5"
            >
              <span>← {t('nav.dashboard')}</span>
            </Link>
            <Link
              to="/create"
              className="btn-industrial bg-orange text-white text-xs px-3.5 py-2.5 border-[1.5px] border-asphalt hover:bg-orange-hover min-h-[44px] flex items-center gap-1.5 stamp-sm"
            >
              <IndustrialIcon name="plus" size={14} />
              <span>{t('nav.newShipment')}</span>
            </Link>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="bg-chalk border-[2px] border-asphalt p-4 sm:p-5 stamp mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('track.inputPlaceholder')}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-paper text-asphalt text-sm font-mono px-4 py-3 border-[1.5px] border-asphalt rounded-[2px] uppercase placeholder:text-steel focus:outline-none focus:bg-white min-h-[48px]"
              />
              <span className="absolute right-3.5 top-3.5 text-steel pointer-events-none">
                <IndustrialIcon name="barcode" size={18} />
              </span>
            </div>
            <button
              type="submit"
              className="btn-industrial bg-orange text-white text-sm px-6 py-3 border-[1.5px] border-asphalt hover:bg-orange-hover shrink-0 flex items-center justify-center gap-2 stamp-sm min-h-[48px]"
            >
              <IndustrialIcon name="search" size={16} />
              <span>{t('track.btn')}</span>
            </button>
          </form>

          {/* Quick chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-[11px] text-steel font-heading font-bold uppercase">
              {lang === 'hi' ? 'चालू पार्सल चेक करें:' : 'CHECK ACTIVE PARCELS:'}
            </span>
            {sampleShipmentIds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/track?id=${item.id}`)}
                className={`text-xs px-2.5 py-1 border transition-colors duration-150 flex items-center gap-1.5 ${
                  queryId === item.id
                    ? 'bg-asphalt text-paper border-asphalt font-bold stamp-sm'
                    : 'bg-paper text-asphalt border-steel hover:bg-asphalt hover:text-paper'
                }`}
              >
                <span>{item.id}</span>
                <span className="text-[10px] text-steel">({item.label})</span>
              </button>
            ))}
          </div>
        </div>

        {/* If Shipment Not Found */}
        {notFound && (
          <div className="bg-orange-soft border-[2px] border-orange p-8 text-center space-y-4 stamp">
            <div className="w-12 h-12 bg-orange text-white flex items-center justify-center mx-auto rounded-[2px]">
              <IndustrialIcon name="alert" size={24} />
            </div>
            <h2 className="font-heading font-black text-2xl uppercase text-asphalt">
              {t('track.notFoundTitle')}
            </h2>
            <p className="font-body text-sm text-asphalt max-w-md mx-auto">
              {t('track.notFoundDesc')}
            </p>
            <button
              onClick={() => navigate('/track?id=FLX-8829-JPR')}
              className="btn-industrial bg-asphalt text-paper text-xs px-4 py-2.5 border border-asphalt hover:bg-orange min-h-[44px]"
            >
              {lang === 'hi' ? 'उदाहरण पार्सल लोड करें (FLX-8829-JPR)' : 'LOAD DEFAULT PARCEL (FLX-8829-JPR)'}
            </button>
          </div>
        )}

        {/* If Shipment Found */}
        {shipment && (
          <div className="space-y-8">
            
            {/* Top Consignment Overview Banner */}
            <div className="bg-chalk border-[2px] border-asphalt p-4 sm:p-6 stamp-lg ticket-notch-y">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: ID & Route */}
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-asphalt">
                      {shipment.id}
                    </span>
                    <StatusBadge status={shipment.status} size="md" />
                    <span className="bg-[#EAECEE] text-asphalt border border-steel font-mono text-xs px-2 py-0.5 font-bold">
                      {lang === 'hi' ? 'रसीद संख्या:' : 'RECEIPT NO:'} {shipment.billOfLading}
                    </span>
                  </div>

                  {/* Route corridor */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-sm mt-1">
                    <span className="bg-asphalt text-paper font-bold px-2 py-0.5">
                      {shipment.sender.city.toUpperCase()}
                    </span>
                    <span className="text-orange font-bold text-base">➔</span>
                    <span className="bg-asphalt text-paper font-bold px-2 py-0.5">
                      {shipment.receiver.city.toUpperCase()}
                    </span>
                    <span className="text-steel text-xs font-body ml-2">
                      ({shipment.originHub} ➔ {shipment.destinationHub})
                    </span>
                  </div>

                  {/* WhatsApp confirmation badge */}
                  {shipment.whatsappUpdates && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-teal font-bold">
                      <IndustrialIcon name="check" size={14} className="text-teal" />
                      <span>{lang === 'hi' ? 'व्हाट्सएप अपडेट सक्रिय है (अपडेट सीधे फोन पर आएंगे)' : 'WhatsApp updates active on mobile'}</span>
                    </div>
                  )}
                </div>

                {/* Right: Barcode & Actions */}
                <div className="flex flex-wrap items-center gap-4">
                  <Barcode value={shipment.id.replace(/-/g, '')} subtext="PARCEL BARCODE" height={40} />
                  
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/shipment/${shipment.id}`}
                      className="btn-industrial bg-asphalt text-paper text-xs px-4 py-2.5 border border-asphalt hover:bg-orange text-center stamp-sm min-h-[44px] flex items-center justify-center gap-1.5"
                    >
                      <IndustrialIcon name="file" size={14} />
                      <span>{t('track.viewReceipt')} ➔</span>
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="btn-industrial bg-paper text-asphalt text-xs px-4 py-2 border border-asphalt hover:bg-chalk flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <IndustrialIcon name="printer" size={14} />
                      <span>{t('track.printReceipt')}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Specification Grid */}
              <div className="mt-6 pt-4 border-t border-asphalt grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className="border border-steel-border p-2 bg-paper">
                  <div className="text-[10px] text-steel font-heading font-bold uppercase">
                    {lang === 'hi' ? 'सामान का प्रकार' : 'PARCEL ITEM'}
                  </div>
                  <div className="font-bold text-asphalt truncate mt-0.5">{shipment.cargo.type}</div>
                </div>
                <div className="border border-steel-border p-2 bg-paper">
                  <div className="text-[10px] text-steel font-heading font-bold uppercase">
                    {lang === 'hi' ? 'कुल वजन' : 'TOTAL WEIGHT'}
                  </div>
                  <div className="font-bold text-asphalt mt-0.5">{shipment.cargo.weightKg.toLocaleString()} KG</div>
                </div>
                <div className="border border-steel-border p-2 bg-paper">
                  <div className="text-[10px] text-steel font-heading font-bold uppercase">
                    {lang === 'hi' ? 'घोषित मूल्य' : 'GOODS VALUE'}
                  </div>
                  <div className="font-bold text-asphalt mt-0.5">
                    {shipment.cargo.declaredValueInr ? formatCurrency(shipment.cargo.declaredValueInr) : '₹4,85,000'}
                  </div>
                </div>
                <div className="border border-steel-border p-2 bg-paper">
                  <div className="text-[10px] text-steel font-heading font-bold uppercase">
                    {lang === 'hi' ? 'गाड़ी / वाहन' : 'VEHICLE'}
                  </div>
                  <div className="font-bold text-asphalt truncate mt-0.5">{shipment.vesselOrFlight || shipment.carrier}</div>
                </div>
                <div className="border border-steel-border p-2 bg-paper col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-steel font-heading font-bold uppercase">
                    {lang === 'hi' ? 'पहुंचने की तारीख' : 'EXPECTED DATE'}
                  </div>
                  <div className="font-bold text-orange truncate mt-0.5">{shipment.deliveryTimeEstimate || shipment.eta}</div>
                  <div className="mt-1">
                    <ConfidenceMeter promise={shipment.deliveryPromise} />
                  </div>
                </div>
                <div className="border border-steel-border p-2 bg-paper">
                  <div className="text-[10px] text-steel font-heading font-bold uppercase">
                    {lang === 'hi' ? 'भुगतान तरीका' : 'PAYMENT'}
                  </div>
                  <div className="font-bold text-teal truncate mt-0.5 uppercase">
                    {shipment.paymentMethod === 'cod'
                      ? (lang === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery')
                      : (lang === 'hi' ? 'ऑनलाइन यूपीआई (UPI)' : 'Paid Online')}
                  </div>
                </div>
              </div>
            </div>

            {/* Delay Reason Card (Phase 1 Requirement) */}
            {(shipment.status === 'delayed' || shipment.delayInfo) && (
              <DelayReasonCard
                parcelNumber={shipment.id}
                delayInfo={
                  shipment.delayInfo || {
                    reason: 'Road blocked due to heavy rain and bridge inspection.',
                    reasonHindi: 'भारी बारिश और पुल निरीक्षण के कारण मुख्य हाईवे पर जाम।',
                    reasonCode: 'heavy_rain',
                    durationHours: 18,
                    durationText: '18 Hours',
                    originalEta: shipment.eta,
                    revisedEta: 'Tomorrow evening (revised)',
                    location: `${shipment.sender.city} - ${shipment.receiver.city} Corridor`,
                    historyText: `Expected ${shipment.eta} → Revised due to heavy rain`,
                    actionOption: 'change_time',
                  }
                }
              />
            )}

            {/* OTP-Confirmed Delivery Modal / Code (Phase 1 Requirement) */}
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
                <div className="font-heading font-black text-sm uppercase tracking-wider text-asphalt flex items-center gap-2">
                  <IndustrialIcon name="compass" size={16} className="text-orange" />
                  <span>{lang === 'hi' ? 'लाइव जीपीएस नक्शा और मार्ग' : 'LIVE GPS ROUTE & HIGHWAY MAP'}</span>
                </div>
                <div className="font-mono text-xs text-steel">
                  {lang === 'hi' ? 'रीयल-टाइम जीपीएस सिग्नल सक्रिय' : 'ACTIVE REAL-TIME GPS'}
                </div>
              </div>
              <RouteMap shipment={shipment} />
            </div>

            {/* Vertical Checkpoints Timeline */}
            <div>
              <TrackingTimeline shipment={shipment} />
            </div>

            {/* Courier / Driver Telematics Drawer if assigned */}
            {shipment.assignedDriver && (
              <div className="bg-chalk border-[1.5px] border-asphalt p-4 sm:p-5 stamp flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-asphalt text-paper border border-asphalt flex items-center justify-center font-heading font-black text-base shrink-0 stamp-sm">
                    {shipment.assignedDriver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-heading font-black text-base uppercase text-asphalt">
                      {lang === 'hi' ? 'डिलीवरी ड्राइवर:' : 'DELIVERY DRIVER:'} {shipment.assignedDriver.name}
                    </div>
                    <div className="font-mono text-xs text-steel mt-0.5">
                      {lang === 'hi' ? 'गाड़ी:' : 'VEHICLE:'} {shipment.assignedDriver.vehicleType} ({shipment.assignedDriver.vehiclePlate})
                    </div>
                    <div className="text-xs font-body text-asphalt mt-1 font-semibold">
                      {lang === 'hi' ? 'वर्तमान स्थान:' : 'Current Location:'} {shipment.assignedDriver.currentLocation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${shipment.assignedDriver.phone}`}
                    className="btn-industrial bg-asphalt text-paper text-xs px-4 py-2.5 border border-asphalt hover:bg-orange flex items-center gap-2 min-h-[44px]"
                  >
                    <IndustrialIcon name="phone" size={16} />
                    <span>{t('track.callDriver')}: {shipment.assignedDriver.phone}</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
