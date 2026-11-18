import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getShipmentById, updateShipmentStatus } from '../data/mockShipments';
import type { Shipment } from '../types';
import { RouteMap } from '../components/tracking/RouteMap';
import { TrackingTimeline } from '../components/tracking/TrackingTimeline';
import { StatusBadge } from '../components/common/StatusBadge';
import { Barcode } from '../components/common/Barcode';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { DelayReasonCard } from '../components/tracking/DelayReasonCard';
import { OtpVerificationModal } from '../components/tracking/OtpVerificationModal';
import { ShipmentCardDetailModal, type ShipmentCardModalType } from '../components/tracking/ShipmentCardDetailModal';
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
  const [cardModalType, setCardModalType] = useState<ShipmentCardModalType | null>(null);

  if (queryId !== prevQueryId) {
    setPrevQueryId(queryId);
    setInputVal(queryId);
    const found = getShipmentById(queryId);
    setShipment(found);
    setNotFound(!found);
  }

  useEffect(() => {
    const handleUpdate = () => {
      if (queryId) {
        const found = getShipmentById(queryId);
        if (found) {
          setShipment(found);
          setNotFound(false);
        }
      }
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [queryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    navigate(`/track?id=${encodeURIComponent(inputVal.trim().toUpperCase())}`);
  };

  const sampleShipmentIds = [
    { id: 'FLX-8829-JPR', label: lang === 'hi' ? 'दिल्ली ➔ जयपुर (सामान्य)' : 'Delhi ➔ Jaipur (On-Time)' },
    { id: 'FLX-7741-KOL', label: lang === 'hi' ? 'लुधियाना ➔ कोलकाता (देरी)' : 'Ludhiana ➔ Kolkata (Delayed)' },
    { id: 'FLX-6218-DEL', label: lang === 'hi' ? 'जयपुर ➔ दिल्ली (देरी)' : 'Jaipur ➔ Delhi (Delayed)' },
    { id: 'FLX-4012-MUM', label: lang === 'hi' ? 'सूरत ➔ मुंबई (पहुंच गया)' : 'Surat ➔ Mumbai (Delivered)' },
    { id: 'FLX-3109-BLR', label: lang === 'hi' ? 'चेन्नई ➔ बेंगलुरु' : 'Chennai ➔ Bengaluru' },
  ];

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              {lang === 'hi' ? 'रीयल-टाइम ट्रैकिंग कंसोल' : 'Real-Time Telematics & Tracking'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              {t('track.title', 'Live Shipment Tracking')}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors"
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
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('track.inputPlaceholder', 'Enter Consignment Number (e.g. FLX-8829-JPR)...')}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono px-4 py-3 pl-11 border border-slate-200 dark:border-slate-700 rounded-xl uppercase placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-2xs"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
                <IndustrialIcon name="barcode" size={18} />
              </span>
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-7 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <IndustrialIcon name="search" size={15} />
              <span>{t('track.btn', 'Track Consignment')}</span>
            </button>
          </form>

          {/* Quick chips */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'hi' ? 'चालू पार्सल चेक करें:' : 'Try active consignments:'}
            </span>
            {sampleShipmentIds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/track?id=${item.id}`)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 font-mono cursor-pointer ${
                  queryId === item.id
                    ? 'bg-slate-900 dark:bg-orange-500 text-white border-slate-900 dark:border-orange-500 font-semibold shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{item.id}</span>
                <span className="text-slate-400 dark:text-slate-400">({item.label})</span>
              </button>
            ))}
          </div>
        </div>

        {/* If Shipment Not Found */}
        {notFound && (
          <div className="bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-900/60 rounded-2xl p-8 text-center space-y-4 shadow-sm mb-8">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <IndustrialIcon name="alert" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('track.notFoundTitle', 'Consignment Not Found')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t('track.notFoundDesc', 'We could not find an active shipment matching this ID. Please double check the ID from your receipt or click below.')}
            </p>
            <button
              onClick={() => navigate('/track?id=FLX-8829-JPR')}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              {lang === 'hi' ? 'उदाहरण पार्सल लोड करें (FLX-8829-JPR)' : 'Load Default Demo Consignment (FLX-8829-JPR)'}
            </button>
          </div>
        )}

        {/* If Shipment Found */}
        {shipment && (
          <div className="space-y-8">
            {/* 1. Visible Delivery Delayed Warning Alert (Only when shipment is actively delayed and NOT delivered) */}
            {shipment.status === 'delayed' && (
              <DelayReasonCard
                parcelNumber={shipment.id}
                status={shipment.status}
                delayInfo={shipment.delayInfo}
              />
            )}

            {/* Top Consignment Overview Banner Card */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: ID & Route */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {shipment.id}
                    </span>
                    <StatusBadge status={shipment.status} size="md" />
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs px-2.5 py-1 rounded-md font-semibold border border-slate-200 dark:border-slate-700">
                      LR: {shipment.billOfLading}
                    </span>
                  </div>

                  {/* Route corridor */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <span className="bg-slate-900 dark:bg-slate-800 text-white font-semibold px-2.5 py-1 rounded-md border border-slate-800 dark:border-slate-700">
                      {shipment.sender.city.toUpperCase()}
                    </span>
                    <span className="text-orange-500 font-bold text-sm">➔</span>
                    <span className="bg-slate-900 dark:bg-slate-800 text-white font-semibold px-2.5 py-1 rounded-md border border-slate-800 dark:border-slate-700">
                      {shipment.receiver.city.toUpperCase()}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium ml-1">
                      ({shipment.originHub} ➔ {shipment.destinationHub})
                    </span>
                  </div>

                  {/* Consignee Self-Service Link Pill */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to={`/r/${shipment.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/50 text-orange-700 dark:text-orange-300 text-xs font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                      title="Open Consignee Self-Service Portal"
                    >
                      <IndustrialIcon name="lock" size={13} className="text-orange-500" />
                      <span>{lang === 'hi' ? 'प्राप्तकर्ता पोर्टल व ओटीपी' : 'Consignee Portal & Delivery OTP'} ➔</span>
                    </Link>

                    {shipment.whatsappUpdates && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <IndustrialIcon name="check" size={14} className="text-emerald-500" />
                        <span>{lang === 'hi' ? 'व्हाट्सएप अलर्ट सक्रिय' : 'WhatsApp alerts enabled'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Barcode & Actions */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-2xs">
                    <Barcode value={shipment.id.replace(/-/g, '')} subtext="VERIFIED CONSIGNMENT" height={38} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/receipt/${shipment.id}`}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      title="View full official parcel receipt and e-LR bilty"
                    >
                      <IndustrialIcon name="file" size={14} />
                      <span>{t('track.viewReceipt', 'View Official Bilty')}</span>
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <IndustrialIcon name="printer" size={14} />
                      <span>{t('track.printReceipt', 'Print Receipt')}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Specification Grid */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/80 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 text-xs">
                {/* 1. Consignment Item */}
                <div className="border border-slate-200/90 dark:border-slate-700 rounded-xl p-3 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">
                      {lang === 'hi' ? 'सामान का प्रकार' : 'Consignment Item'}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug break-words" title={shipment.cargo.type}>
                      {shipment.cargo.type}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {shipment.cargo.quantity} {lang === 'hi' ? 'इकाई' : 'Units'} • {shipment.cargo.weightKg} KG
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardModalType('consignment')}
                    className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1 mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 transition-colors group cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>
                </div>

                {/* 2. Total Weight */}
                <div className="border border-slate-200/90 dark:border-slate-700 rounded-xl p-3 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">
                      {lang === 'hi' ? 'कुल वजन' : 'Total Weight'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 truncate">
                      {shipment.cargo.weightKg.toLocaleString('en-IN')} KG
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {lang === 'hi' ? 'सत्यापित वेईब्रिज' : 'Weighbridge Certified'}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 truncate">
                    {shipment.cargo.volumeCbm ? `${shipment.cargo.volumeCbm} CBM Volume` : 'Standard Volume'}
                  </div>
                </div>

                {/* 3. Declared Value */}
                <div className="border border-slate-200/90 dark:border-slate-700 rounded-xl p-3 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">
                      {lang === 'hi' ? 'घोषित मूल्य' : 'Declared Value'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 truncate">
                      {shipment.cargo.declaredValueInr ? formatCurrency(shipment.cargo.declaredValueInr) : '₹4,85,000'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {lang === 'hi' ? 'पार्सल बीमा सुरक्षित' : 'Transit Insured'}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 truncate">
                    {shipment.billOfLading ? `LR #${shipment.billOfLading.slice(-6)}` : 'Policy Active'}
                  </div>
                </div>

                {/* 4. Fleet Carrier */}
                <div className="border border-slate-200/90 dark:border-slate-700 rounded-xl p-3 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">
                      {lang === 'hi' ? 'गाड़ी / वाहन' : 'Fleet Carrier'}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white truncate leading-snug mt-0.5" title={shipment.vesselOrFlight || shipment.carrier}>
                      {shipment.vesselOrFlight || shipment.carrier}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {shipment.assignedDriver?.vehiclePlate || shipment.carrier || 'VELTRAX Fleet'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardModalType('carrier')}
                    className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1 mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 transition-colors group cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>
                </div>

                {/* 5. Scheduled ETA and SLA */}
                <div className="border border-slate-200/90 dark:border-slate-700 rounded-xl p-3 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                      <span className="truncate">{lang === 'hi' ? 'पहुंचने की तारीख' : 'Scheduled ETA'}</span>
                      {shipment.status === 'delayed' ? (
                        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1 py-0.2 rounded border border-rose-200 dark:border-rose-800">DELAY</span>
                      ) : shipment.status === 'delivered' ? (
                        <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">DONE</span>
                      ) : (
                        <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1 py-0.2 rounded border border-blue-200 dark:border-blue-800">TRANSIT</span>
                      )}
                    </div>
                    <div className={`font-semibold truncate leading-tight ${shipment.status === 'delayed' ? 'text-rose-600 dark:text-rose-400' : shipment.status === 'delivered' ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {shipment.status === 'delayed'
                        ? shipment.delayInfo?.revisedEta || shipment.deliveryTimeEstimate || shipment.eta
                        : shipment.deliveryTimeEstimate || shipment.eta}
                    </div>
                    {/* Compact SLA Progress Bar (Single % display, strictly contained) */}
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                        <span className="truncate">{shipment.deliveryPromise?.promisedDay || (lang === 'hi' ? 'गुरुवार तक' : 'By Thu')}</span>
                        <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                          {shipment.deliveryPromise?.confidencePercent ?? 90}% SLA
                        </span>
                      </div>
                      <div
                        className="w-full bg-slate-200/80 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={shipment.deliveryPromise?.confidencePercent ?? 90}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="SLA On-time chance"
                      >
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${shipment.deliveryPromise?.confidencePercent ?? 90}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardModalType('eta_sla')}
                    className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1 mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 transition-colors group cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>
                </div>

                {/* 6. Payment Mode */}
                <div className="border border-slate-200/90 dark:border-slate-700 rounded-xl p-3 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">
                      {lang === 'hi' ? 'भुगतान तरीका' : 'Payment Mode'}
                    </div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                      {shipment.paymentMethod === 'cod'
                        ? (lang === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery')
                        : (lang === 'hi' ? 'ऑनलाइन भुगतान (UPI)' : 'Prepaid Online')}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {shipment.paymentMethod === 'cod'
                        ? (lang === 'hi' ? 'डिलीवरी पर देय' : 'Pay Upon Handover')
                        : (lang === 'hi' ? 'पूर्ण भुगतान प्राप्त' : '100% Settled')}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 truncate">
                    GST #{shipment.id.slice(-4)}
                  </div>
                </div>
              </div>
            </div>

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
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <IndustrialIcon name="compass" size={16} className="text-orange-500" />
                  <span>{lang === 'hi' ? 'कॉरिडोर प्रोग्रेस व रूट रडार (सिम्युलेटेड)' : 'Corridor Progress & Route Radar (Simulated)'}</span>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
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
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs border border-slate-800 dark:border-slate-700">
                    {shipment.assignedDriver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'डिलीवरी ड्राइवर:' : 'Assigned Line-Haul Driver:'} {shipment.assignedDriver.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang === 'hi' ? 'वाहन विवरण:' : 'Vehicle:'} {shipment.assignedDriver.vehicleType} ({shipment.assignedDriver.vehiclePlate})
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{lang === 'hi' ? 'वर्तमान स्थान:' : 'Current Location:'} {shipment.assignedDriver.currentLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${shipment.assignedDriver.phone}`}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <IndustrialIcon name="phone" size={15} />
                    <span>{t('track.callDriver', 'Call Driver')}: {shipment.assignedDriver.phone}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Simulated Demonstration Notice Banner */}
            <div className="bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
              <IndustrialIcon name="alert" size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300 font-semibold block mb-0.5">
                  {lang === 'hi' ? 'डेमो सूचना:' : 'Simulation Demonstration Notice:'}
                </strong>
                {lang === 'hi'
                  ? 'यह ट्रैकिंग पोर्टल वेल्ट्रैक्स एलएमएस के रीयल-टाइम जीपीएस और टेलीमैटिक्स सिस्टम का लाइव फ्रंटएंड प्रदर्शन है। सभी गतिविधियां, समय और चेकपॉइंट मॉक डेटा पर आधारित हैं।'
                  : 'This tracking page demonstrates real-time consignment telematics, dynamic delay revisions, and OTP security workflows for VELTRAX LMS using browser state.'}
              </div>
            </div>

            {/* Shipment Card Detail Modal */}
            <ShipmentCardDetailModal
              type={cardModalType}
              isOpen={Boolean(cardModalType)}
              onClose={() => setCardModalType(null)}
              shipment={shipment}
            />

          </div>
        )}
      </div>
    </div>
  );
};
