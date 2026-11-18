import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShipmentById } from '../data/mockShipments';
import type { Shipment, DocumentItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Barcode } from '../components/common/Barcode';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { RouteMap } from '../components/tracking/RouteMap';
import { TrackingTimeline } from '../components/tracking/TrackingTimeline';
import { DelayReasonCard } from '../components/tracking/DelayReasonCard';
import { UpdateDelayModal } from '../components/tracking/UpdateDelayModal';
import { PhotoProofCard } from '../components/tracking/PhotoProofCard';
import { ShipmentCardDetailModal, type ShipmentCardModalType } from '../components/tracking/ShipmentCardDetailModal';
import { PriceBreakdown } from '../components/common/PriceBreakdown';
import { calculatePriceBreakdown } from '../services/pricingService';
import { useTranslation } from '../context/LanguageContext';
import { formatCurrency } from '../utils/indiaHelpers';

export const ShipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useTranslation();
  const [prevId, setPrevId] = useState(id);
  const [shipment, setShipment] = useState<Shipment | undefined>(() => id ? getShipmentById(id) : undefined);
  const [activeTab, setActiveTab] = useState<'manifest' | 'route' | 'documents' | 'activity' | 'photoproof' | 'pricing'>('manifest');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [cardModalType, setCardModalType] = useState<ShipmentCardModalType | null>(null);

  if (id !== prevId) {
    setPrevId(id);
    setShipment(id ? getShipmentById(id) : undefined);
  }

  useEffect(() => {
    const handleUpdate = () => {
      if (id) {
        const fresh = getShipmentById(id);
        if (fresh) setShipment(fresh);
      }
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    return () => window.removeEventListener('freightline_storage_update', handleUpdate);
  }, [id]);

  if (!shipment) {
    return (
      <div className="flex-1 py-16 bg-paper flex items-center justify-center">
        <div className="bg-chalk border-[2px] border-asphalt p-8 max-w-md text-center stamp">
          <IndustrialIcon name="alert" size={32} className="text-orange mx-auto mb-3" />
          <h2 className="font-heading font-black text-2xl uppercase text-asphalt">
            {lang === 'hi' ? 'पार्सल रसीद नहीं मिली' : 'PARCEL RECORD NOT FOUND'}
          </h2>
          <p className="font-body text-xs text-steel my-3">
            {lang === 'hi' ? 'इस नंबर का कोई पार्सल दर्ज नहीं है:' : 'No record under identifier:'} <strong className="font-mono text-asphalt">{id}</strong>.
          </p>
          <Link
            to="/manager/shipments"
            className="btn-industrial bg-asphalt text-paper text-xs px-4 py-2.5 border border-asphalt hover:bg-orange inline-flex items-center gap-1.5 min-h-[44px]"
          >
            <IndustrialIcon name="box" size={14} />
            <span>{lang === 'hi' ? 'कंसाइनमेंट सूची' : 'Shipments Grid'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-6 sm:py-10 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Fast Action Bar */}
        <div className="bg-chalk border-[2px] border-asphalt p-4 sm:p-6 stamp-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-asphalt pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-black text-xs text-orange tracking-widest uppercase">
                  {lang === 'hi' ? 'पक्की पार्सल रसीद (बिल्टी)' : 'OFFICIAL PARCEL RECEIPT (BILTY / LR)'}
                </span>
                <span className="text-steel font-mono text-xs">•</span>
                <span className="font-mono text-xs text-steel font-bold">
                  {shipment.billOfLading}
                </span>
              </div>
              <h1 className="font-mono font-black text-3xl sm:text-4xl uppercase text-asphalt leading-none mt-1">
                {shipment.id}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/track?id=${shipment.id}`}
                className="btn-industrial bg-orange text-white text-xs px-4 py-2.5 border-[1.5px] border-asphalt hover:bg-orange-hover flex items-center gap-1.5 stamp-sm min-h-[48px]"
              >
                <IndustrialIcon name="compass" size={14} />
                <span>{lang === 'hi' ? 'लाइव ट्रैक करें' : 'TRACK ON LIVE MAP'}</span>
              </Link>

              {/* Share receiver link (Phase 2 Requirement 6) */}
              <div className="flex items-center gap-1 bg-paper border-[1.5px] border-asphalt p-1 rounded-[2px]">
                <button
                  type="button"
                  onClick={() => {
                    const receiverUrl = `${window.location.origin}/r/${shipment.id}`;
                    navigator.clipboard?.writeText(receiverUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="btn-industrial bg-chalk text-asphalt hover:bg-white text-xs px-3 py-2 border border-asphalt flex items-center gap-1.5 min-h-[44px]"
                  title="Copy receiver self-service link"
                >
                  <IndustrialIcon name="file" size={14} />
                  <span>{copiedLink ? (lang === 'hi' ? 'लिंक कॉपी हुआ!' : 'COPIED LINK!') : (lang === 'hi' ? 'रिसीवर लिंक कॉपी करें' : 'COPY RECEIVER LINK')}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Namaste, your parcel ${shipment.id} from ${shipment.sender.city} is on the way. Confirm address or choose delivery time: ${window.location.origin}/r/${shipment.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-industrial bg-[#25D366] text-white hover:brightness-105 text-xs px-3 py-2 border border-asphalt flex items-center gap-1.5 min-h-[44px]"
                  title="Share on WhatsApp"
                >
                  <IndustrialIcon name="phone" size={14} />
                  <span>{lang === 'hi' ? 'व्हाट्सएप भेजें' : 'WHATSAPP LINK'}</span>
                </a>
              </div>

              <button
                onClick={() => setIsDelayModalOpen(true)}
                className="btn-industrial bg-amber-500 hover:bg-amber-600 text-white text-xs px-3.5 py-2.5 border-[1.5px] border-asphalt flex items-center gap-1.5 min-h-[48px] font-bold uppercase tracking-wider shadow-xs"
                title="Record or update customer-facing delay advisory and staff operational notes"
              >
                <IndustrialIcon name="alert" size={14} />
                <span>{shipment.delayInfo ? (lang === 'hi' ? 'देरी अपडेट करें' : 'UPDATE DELAY') : (lang === 'hi' ? 'देरी दर्ज करें' : 'RECORD DELAY')}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="btn-industrial bg-paper text-asphalt text-xs px-3.5 py-2.5 border-[1.5px] border-asphalt hover:bg-chalk flex items-center gap-1.5 min-h-[48px]"
              >
                <IndustrialIcon name="printer" size={14} />
                <span>{lang === 'hi' ? 'रसीद प्रिंट करें' : 'PRINT RECEIPT'}</span>
              </button>
              <Link
                to="/manager/shipments"
                className="btn-industrial bg-chalk text-asphalt text-xs px-3.5 py-2.5 border-[1.5px] border-asphalt hover:bg-paper min-h-[48px] flex items-center gap-1.5"
              >
                <span>← {lang === 'hi' ? 'कंसाइनमेंट सूची' : 'Shipments'}</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 font-mono text-xs">
            {/* 1. Consignment Item */}
            <div className="p-3 border border-steel-border bg-paper min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] text-steel font-heading font-bold uppercase truncate">
                  {lang === 'hi' ? 'सामान का प्रकार' : 'CONSIGNMENT ITEM'}
                </div>
                <div className="font-bold text-asphalt line-clamp-2 leading-snug break-words" title={shipment.cargo.type}>
                  {shipment.cargo.type}
                </div>
                <div className="text-[10px] text-steel truncate">
                  {shipment.cargo.quantity} Units • {shipment.cargo.weightKg.toLocaleString('en-IN')} KG
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCardModalType('consignment')}
                className="text-[11px] font-bold text-orange hover:text-orange/80 flex items-center gap-1 mt-2.5 pt-1.5 border-t border-steel-border/60 transition-colors group cursor-pointer"
              >
                <span>{lang === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>

            {/* 2. Total Weight */}
            <div className="p-3 border border-steel-border bg-paper min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] text-steel font-heading font-bold uppercase truncate">
                  {lang === 'hi' ? 'कुल वजन' : 'TOTAL WEIGHT'}
                </div>
                <div className="font-bold text-asphalt text-sm mt-0.5 truncate">
                  {shipment.cargo.weightKg.toLocaleString('en-IN')} KG
                </div>
                <div className="text-[10px] text-teal truncate">
                  Seal: {shipment.cargo.sealNumber}
                </div>
              </div>
              <div className="text-[10px] text-steel mt-2.5 pt-1.5 border-t border-steel-border/60 truncate">
                {shipment.cargo.volumeCbm ? `${shipment.cargo.volumeCbm} CBM` : 'Electronic Weighbridge'}
              </div>
            </div>

            {/* 3. Route & Status */}
            <div className="p-3 border border-steel-border bg-paper min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] text-steel font-heading font-bold uppercase truncate">
                  {lang === 'hi' ? 'कहाँ से ➔ कहाँ तक' : 'ROUTE & STATUS'}
                </div>
                <div className="font-bold text-asphalt mt-0.5 truncate" title={`${shipment.sender.city} ➔ ${shipment.receiver.city}`}>
                  {shipment.sender.city} ➔ {shipment.receiver.city}
                </div>
                <div className="mt-1">
                  <StatusBadge status={shipment.status} size="sm" />
                </div>
              </div>
              <div className="text-[10px] text-steel mt-2.5 pt-1.5 border-t border-steel-border/60 truncate font-mono">
                {shipment.originHubCode} ➔ {shipment.destinationHubCode}
              </div>
            </div>

            {/* 4. Fleet Carrier */}
            <div className="p-3 border border-steel-border bg-paper min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] text-steel font-heading font-bold uppercase truncate">
                  {lang === 'hi' ? 'गाड़ी / वाहन' : 'FLEET CARRIER'}
                </div>
                <div className="font-bold text-asphalt truncate leading-snug mt-0.5" title={shipment.vesselOrFlight || shipment.carrier}>
                  {shipment.vesselOrFlight || shipment.carrier}
                </div>
                <div className="text-[10px] text-steel truncate">
                  {shipment.assignedDriver?.vehiclePlate || shipment.carrier || 'Express Road Carrier'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCardModalType('carrier')}
                className="text-[11px] font-bold text-orange hover:text-orange/80 flex items-center gap-1 mt-2.5 pt-1.5 border-t border-steel-border/60 transition-colors group cursor-pointer"
              >
                <span>{lang === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>

            {/* 5. Scheduled ETA and SLA */}
            <div className="p-3 border border-steel-border bg-paper min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-1 text-[10px] text-steel font-heading font-bold uppercase">
                  <span className="truncate">{lang === 'hi' ? 'पहुंचने की तारीख' : 'SCHEDULED ETA'}</span>
                  {shipment.status === 'delayed' ? (
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">DELAY</span>
                  ) : shipment.status === 'delivered' ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">DONE</span>
                  ) : (
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.2 rounded border border-blue-200">TRANSIT</span>
                  )}
                </div>
                <div className={`font-bold truncate mt-0.5 ${shipment.status === 'delayed' ? 'text-rose-600' : shipment.status === 'delivered' ? 'text-emerald-700' : 'text-orange'}`}>
                  {shipment.status === 'delayed'
                    ? shipment.delayInfo?.revisedEta || shipment.deliveryTimeEstimate || shipment.eta
                    : shipment.deliveryTimeEstimate || shipment.eta}
                </div>
                {/* Compact SLA Progress Bar (Single % display, strictly contained) */}
                <div className="pt-0.5">
                  <div className="flex items-center justify-between text-[10px] text-steel mb-0.5">
                    <span className="truncate">{shipment.deliveryPromise?.promisedDay || 'By Thu'}</span>
                    <span className="font-bold font-mono text-emerald-600 shrink-0 ml-1">
                      {shipment.deliveryPromise?.confidencePercent ?? 90}% SLA
                    </span>
                  </div>
                  <div
                    className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden"
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
                className="text-[11px] font-bold text-orange hover:text-orange/80 flex items-center gap-1 mt-2.5 pt-1.5 border-t border-steel-border/60 transition-colors group cursor-pointer"
              >
                <span>{lang === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>

            {/* 6. Payment & Value */}
            <div className="p-3 border border-steel-border bg-paper min-w-0 flex flex-col justify-between h-full min-h-[148px] shadow-2xs">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] text-steel font-heading font-bold uppercase truncate">
                  {lang === 'hi' ? 'भुगतान तरीका' : 'PAYMENT & VALUE'}
                </div>
                <div className="font-bold text-teal mt-0.5 uppercase truncate">
                  {shipment.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid (UPI)'}
                </div>
                <div className="text-[10px] text-steel truncate">
                  Val: {shipment.cargo.declaredValueInr ? formatCurrency(shipment.cargo.declaredValueInr) : '₹4,85,000'}
                </div>
              </div>
              <div className="text-[10px] text-steel mt-2.5 pt-1.5 border-t border-steel-border/60 truncate font-mono">
                LR #{shipment.billOfLading.slice(-6)}
              </div>
            </div>
          </div>
        </div>

        {/* Delay Reason Card (Phase 1 Requirement) */}
        {(shipment.status === 'delayed' || shipment.delayInfo) && (
          <div className="space-y-3 mb-6">
            <DelayReasonCard
              parcelNumber={shipment.id}
              status={shipment.status}
              delayInfo={shipment.delayInfo}
              onManagerEdit={() => setIsDelayModalOpen(true)}
            />

            {/* Manager Operational Staff Notes (Never exposed to customers) */}
            {shipment.delayInfo?.internalNotes && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
                      🔒 Confidential Staff Notes (Manager Portal Only)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    NEVER EXPOSED TO CUSTOMER
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-200 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  {shipment.delayInfo.internalNotes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b-[2px] border-asphalt overflow-x-auto pb-1">
          {[
            { id: 'manifest', label: lang === 'hi' ? 'पक्की रसीद (बिल्टी)' : 'PARCEL RECEIPT (BILTY)', icon: 'file' as const },
            { id: 'photoproof', label: lang === 'hi' ? 'फोटो सबूत (Photo Proof)' : 'PHOTO PROOF & OTP', icon: 'camera' as const },
            { id: 'pricing', label: lang === 'hi' ? 'खर्च का हिसाब (Pricing)' : 'PRICE BREAKDOWN', icon: 'file' as const },
            { id: 'route', label: lang === 'hi' ? 'रास्ता व पड़ाव' : 'ROUTE & CHECKPOINTS', icon: 'compass' as const },
            { id: 'documents', label: lang === 'hi' ? `कागजात (${shipment.documents.length})` : `DOCUMENTS (${shipment.documents.length})`, icon: 'download' as const },
            { id: 'activity', label: lang === 'hi' ? `गतिविधि रिकॉर्ड (${shipment.activities.length})` : `ACTIVITY LOG (${shipment.activities.length})`, icon: 'clock' as const },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`font-heading font-bold text-xs uppercase px-4 py-2.5 border-[1.5px] transition-all duration-150 flex items-center gap-2 shrink-0 min-h-[48px] ${
                  isActive
                    ? 'bg-asphalt text-paper border-asphalt stamp-sm'
                    : 'bg-chalk text-asphalt border-transparent hover:border-asphalt hover:bg-paper'
                }`}
              >
                <IndustrialIcon name={tab.icon as any} size={14} className={isActive ? 'text-yellow' : 'text-steel'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OFFICIAL PARCEL RECEIPT (BILTY) */}
        {activeTab === 'manifest' && (
          <div className="bg-chalk border-[2px] border-asphalt p-6 sm:p-8 stamp-lg font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-asphalt pb-4 mb-6 gap-4">
              <div>
                <div className="font-heading font-black text-2xl uppercase tracking-tight text-asphalt">
                  VELTRAX PARCEL RECEIPT & BILTY
                </div>
                <div className="text-[11px] text-steel mt-0.5">
                  GOODS TRANSPORT AGENCY CONSIGNMENT NOTE // 100% VERIFIED RECEIPT
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Barcode value={shipment.id.replace(/-/g, '')} subtext="ORIGINAL BILTY COPY" height={36} />
              </div>
            </div>

            {/* Boxes 1 & 2: Shipper and Consignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 border border-asphalt mb-4 divide-y md:divide-y-0 md:divide-x divide-asphalt">
              <div className="p-4 bg-paper">
                <div className="font-heading font-bold uppercase text-[11px] text-steel mb-1">
                  1. {t('term.sender')}
                </div>
                <div className="font-bold text-sm text-asphalt">{shipment.sender.name} ({shipment.sender.company})</div>
                <div className="text-xs text-asphalt mt-1">{shipment.sender.address}</div>
                <div className="text-xs text-asphalt">{shipment.sender.city}, {shipment.sender.state} (PIN: {shipment.sender.postalCode})</div>
                <div className="text-steel text-[11px] mt-2">
                  PHONE: {shipment.sender.contactPhone}<br />
                  GSTIN: {shipment.sender.taxIdOrEori || 'NOT APPLICABLE (INDIVIDUAL SENDER)'}
                </div>
              </div>

              <div className="p-4 bg-paper">
                <div className="font-heading font-bold uppercase text-[11px] text-steel mb-1">
                  2. {t('term.receiver')}
                </div>
                <div className="font-bold text-sm text-asphalt">{shipment.receiver.name} ({shipment.receiver.company})</div>
                <div className="text-xs text-asphalt mt-1">{shipment.receiver.address}</div>
                <div className="text-xs text-asphalt">{shipment.receiver.city}, {shipment.receiver.state} (PIN: {shipment.receiver.postalCode})</div>
                <div className="text-steel text-[11px] mt-2">
                  PHONE: {shipment.receiver.contactPhone}<br />
                  GSTIN: {shipment.receiver.taxIdOrEori || 'NOT APPLICABLE'}
                </div>
              </div>
            </div>

            {/* Voyage / Route Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 border border-asphalt mb-4 divide-x divide-y md:divide-y-0 divide-asphalt bg-paper">
              <div className="p-3">
                <div className="text-[10px] text-steel font-heading font-bold uppercase">COLLECTION CENTRE</div>
                <div className="font-bold text-asphalt mt-0.5 truncate">{shipment.originHub}</div>
                <div className="text-[10px] text-steel">FROM: {shipment.sender.city}</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-steel font-heading font-bold uppercase">VEHICLE ASSIGNED</div>
                <div className="font-bold text-asphalt mt-0.5 truncate">{shipment.vesselOrFlight || shipment.carrier}</div>
                <div className="text-[10px] text-steel">CARRIER: Express Road</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-steel font-heading font-bold uppercase">DELIVERY CENTRE</div>
                <div className="font-bold text-asphalt mt-0.5 truncate">{shipment.destinationHub}</div>
                <div className="text-[10px] text-steel">TO: {shipment.receiver.city}</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-steel font-heading font-bold uppercase">PAYMENT OPTION</div>
                <div className="font-bold text-teal mt-0.5 truncate">
                  {shipment.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Paid Online (UPI)'}
                </div>
                <div className="text-[10px] text-steel">SEAL: {shipment.cargo.sealNumber}</div>
              </div>
            </div>

            {/* Particulars of Goods Table */}
            <div className="border border-asphalt mb-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-asphalt text-paper text-[11px] font-heading uppercase">
                  <tr>
                    <th className="p-2.5">PARCEL NUMBER</th>
                    <th className="p-2.5">PACKAGES</th>
                    <th className="p-2.5">GOODS DESCRIPTION</th>
                    <th className="p-2.5">TOTAL WEIGHT</th>
                    <th className="p-2.5">DECLARED VALUE</th>
                  </tr>
                </thead>
                <tbody className="bg-paper text-xs divide-y divide-steel-border">
                  <tr>
                    <td className="p-3 font-bold text-asphalt">
                      {shipment.id}<br />
                      <span className="text-[11px] text-steel font-normal">LR: {shipment.billOfLading}</span>
                    </td>
                    <td className="p-3">
                      {shipment.cargo.quantity} Units<br />
                      <span className="text-[11px] text-steel">{shipment.cargo.type}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-asphalt">{shipment.cargo.type}</div>
                      <div className="text-[11px] text-steel">
                        Tamper-evident cable seal: {shipment.cargo.sealNumber}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-asphalt">
                      {shipment.cargo.weightKg.toLocaleString('en-IN')} KG<br />
                      <span className="text-[10px] text-teal font-normal">ELECTRONIC WEIGHBRIDGE</span>
                    </td>
                    <td className="p-3 font-bold text-asphalt">
                      {formatCurrency(shipment.cargo.declaredValueInr || 485000)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Conditions & Stamp */}
            <div className="border-t-2 border-asphalt pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] text-steel">
              <div className="max-w-xl leading-relaxed">
                {lang === 'hi'
                  ? 'सामान सही हालत में प्राप्त किया गया। डिलीवरी के समय रसीद पर हस्ताक्षर या मोबाइल ओटीपी दर्ज किया जाएगा। माल की सुरक्षा हमारी जिम्मेदारी है।'
                  : 'Carried under standard Goods Transport Agency terms. Handover verified via digital photo proof or receiver signature. 100% safe transit guaranteed.'}
              </div>
              <div className="border-[1.5px] border-asphalt p-3 bg-paper text-center shrink-0 stamp-sm">
                <div className="font-heading font-black text-xs uppercase text-asphalt">
                  VELTRAX CENTRAL DESK
                </div>
                <div className="text-[9px] text-teal font-bold mt-1">
                  DIGITALLY STAMPED & VERIFIED
                </div>
                <div className="text-[9px] text-steel mt-0.5">
                  DATE: {shipment.dispatchedAt}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROUTE MAP & CHECKPOINTS */}
        {activeTab === 'route' && (
          <div className="space-y-6">
            <RouteMap shipment={shipment} />
            <TrackingTimeline shipment={shipment} />
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-chalk border-[2px] border-asphalt p-6 stamp-lg">
            <div className="flex items-center justify-between border-b border-asphalt pb-3 mb-6">
              <div>
                <h2 className="font-heading font-black text-xl uppercase text-asphalt">
                  {lang === 'hi' ? 'रसीद और संबंधित कागजात' : 'PARCEL RECEIPTS & INVOICE COPIES'}
                </h2>
                <div className="font-mono text-xs text-steel">
                  {lang === 'hi' ? 'सुरक्षित ऑनलाइन रिकॉर्ड' : 'ALL COPIES ARCHIVED SAFELY IN SYSTEM'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shipment.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-paper border-[1.5px] border-asphalt p-4 stamp-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="bg-asphalt text-paper p-1.5 border border-asphalt stamp-sm">
                        <IndustrialIcon name="file" size={16} />
                      </div>
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border uppercase ${
                        doc.status === 'verified'
                          ? 'bg-teal-soft text-teal border-teal'
                          : 'bg-yellow-soft text-asphalt border-yellow'
                      }`}>
                        {lang === 'hi' ? 'सत्यापित' : 'VERIFIED'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-sm uppercase text-asphalt mb-1">
                      {doc.title}
                    </h3>
                    <div className="font-mono text-xs text-steel">
                      DOC ID: <strong className="text-asphalt">{doc.docNumber}</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-steel-border flex items-center justify-between font-mono text-[11px] text-steel">
                    <span>{doc.fileSize} • {doc.issuedDate}</span>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="btn-industrial bg-chalk text-asphalt text-xs px-2.5 py-1.5 border border-asphalt hover:bg-asphalt hover:text-paper min-h-[36px]"
                    >
                      {lang === 'hi' ? 'देखें' : 'VIEW'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Preview Modal */}
            {selectedDoc && (
              <div className="fixed inset-0 z-50 bg-asphalt/60 flex items-center justify-center p-4">
                <div className="bg-chalk border-[2px] border-asphalt max-w-lg w-full p-6 stamp-lg relative">
                  <div className="flex items-center justify-between border-b border-asphalt pb-3 mb-4">
                    <div>
                      <h4 className="font-heading font-black text-lg uppercase text-asphalt">
                        {selectedDoc.title}
                      </h4>
                      <div className="font-mono text-xs text-steel">
                        REF: {selectedDoc.docNumber} • SIZE: {selectedDoc.fileSize}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="bg-asphalt text-paper px-2.5 py-1 font-mono text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-paper p-4 border border-asphalt font-mono text-xs space-y-2 mb-4">
                    <div className="text-teal font-bold">✓ DOCUMENT VALIDATED UNDER TRANSPORT PROTOCOL</div>
                    <div>SENDER: {shipment.sender.name} ({shipment.sender.company})</div>
                    <div>RECEIVER: {shipment.receiver.name} ({shipment.receiver.company})</div>
                    <div>SEAL NUMBER: {shipment.cargo.sealNumber}</div>
                    <div>PAYMENT: {shipment.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Paid Online (UPI)'}</div>
                    <div className="text-steel text-[10px] pt-2 border-t border-steel-border">
                      Digitally verified copy on VELTRAX Central Transport Network.
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedDoc(null);
                        setActiveTab('manifest');
                        setTimeout(() => window.print(), 150);
                      }}
                      className="btn-industrial bg-orange text-white text-xs px-4 py-2.5 border border-asphalt hover:bg-orange-hover min-h-[44px]"
                    >
                      DOWNLOAD COPY (PRINT / PDF)
                    </button>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="btn-industrial bg-paper text-asphalt text-xs px-4 py-2.5 border border-asphalt hover:bg-chalk min-h-[44px]"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACTIVITY LOG */}
        {activeTab === 'activity' && (
          <div className="bg-chalk border-[2px] border-asphalt p-6 stamp-lg">
            <div className="border-b border-asphalt pb-3 mb-6">
              <h2 className="font-heading font-black text-xl uppercase text-asphalt">
                {lang === 'hi' ? 'पार्सल की पूरी गतिविधि और अपडेट रिकॉर्ड' : 'PARCEL JOURNEY ACTIVITY & TIMESTAMPS'}
              </h2>
              <div className="font-mono text-xs text-steel">
                {lang === 'hi' ? `पार्सल ${shipment.id} के सभी वास्तविक अपडेट` : `COMPLETE AUDIT RECORD FOR PARCEL ${shipment.id}`}
              </div>
            </div>

            <div className="divide-y divide-steel-border font-body text-xs">
              {shipment.activities.map((act) => (
                <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-asphalt text-paper border border-asphalt flex items-center justify-center font-mono text-xs shrink-0 stamp-sm">
                      <IndustrialIcon name="clock" size={14} className="text-yellow" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm uppercase text-asphalt">
                        {act.event}
                      </div>
                      <div className="font-mono text-[11px] text-steel mt-0.5">
                        {lang === 'hi' ? 'पर्यवेक्षक:' : 'SUPERVISOR:'} <strong className="text-asphalt">{act.actor}</strong> ({act.role})
                        {act.notes && <span className="text-orange ml-2">• NOTE: {act.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="font-mono text-xs sm:text-right shrink-0">
                    <div className="font-bold text-asphalt">{act.timestamp}</div>
                    <div className="text-[10px] text-steel font-heading uppercase">CENTRE: {act.terminalCode}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PHOTO PROOF (Phase 1 Requirement) */}
        {activeTab === 'photoproof' && (
          <div>
            <PhotoProofCard photoProof={shipment.photoProof} shipmentId={shipment.id} />
          </div>
        )}

        {/* TAB 6: TRANSPARENT PRICE BREAKDOWN (Phase 1 Requirement) */}
        {activeTab === 'pricing' && (
          <div className="max-w-2xl">
            <PriceBreakdown
              breakdown={
                shipment.priceBreakdown ||
                calculatePriceBreakdown({
                  weightKg: shipment.cargo.weightKg,
                  speed: shipment.priorityLevel === 'critical_overnight' ? 'same_day' : 'standard',
                  paymentMethod: shipment.paymentMethod || 'cod',
                })
              }
              isCod={shipment.paymentMethod === 'cod'}
            />
          </div>
        )}

        {/* Modal: Update Delay Advisory */}
        <UpdateDelayModal
          isOpen={isDelayModalOpen}
          onClose={() => setIsDelayModalOpen(false)}
          shipment={shipment}
          onSuccess={(updated) => setShipment(updated)}
        />

        {/* Modal: Shipment Card Details */}
        <ShipmentCardDetailModal
          type={cardModalType}
          isOpen={Boolean(cardModalType)}
          onClose={() => setCardModalType(null)}
          shipment={shipment}
        />

      </div>
    </div>
  );
};
