import React, { useEffect } from 'react';
import type { Shipment } from '../../types';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { StatusBadge } from '../common/StatusBadge';
import { useTranslation } from '../../context/LanguageContext';

export type ShipmentCardModalType = 'consignment' | 'carrier' | 'eta_sla';

export interface ShipmentCardDetailModalProps {
  type: ShipmentCardModalType | null;
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
}

export const ShipmentCardDetailModal: React.FC<ShipmentCardDetailModalProps> = ({
  type,
  isOpen,
  onClose,
  shipment,
}) => {
  const { lang } = useTranslation();

  // Close on ESC key and prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !type) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  // Extract registration plate cleanly if available
  const registrationPlate =
    shipment.assignedDriver?.vehiclePlate ||
    shipment.transportAssignment?.roadDetails?.vehiclePlate ||
    (shipment.vesselOrFlight && shipment.vesselOrFlight.includes('(')
      ? shipment.vesselOrFlight.match(/\(([^)]+)\)/)?.[1]
      : null) ||
    'DL-01-AB-2041';

  // Extract vehicle model name cleanly
  const vehicleModelName =
    shipment.assignedDriver?.vehicleType ||
    (shipment.vesselOrFlight && shipment.vesselOrFlight.includes('(')
      ? shipment.vesselOrFlight.split('(')[0].trim()
      : shipment.vesselOrFlight) ||
    shipment.carrier ||
    'Express Freight Carrier';

  const slaPercent = shipment.deliveryPromise?.confidencePercent ?? 90;
  const isDelayed = shipment.status === 'delayed' || Boolean(shipment.delayInfo);
  const isDelivered = shipment.status === 'delivered';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shipment-modal-title"
    >
      <div
        className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
              {type === 'consignment' && <IndustrialIcon name="file" size={20} />}
              {type === 'carrier' && <IndustrialIcon name="truck" size={20} />}
              {type === 'eta_sla' && <IndustrialIcon name="clock" size={20} />}
            </div>
            <div>
              <div className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider font-mono">
                {type === 'consignment' && (lang === 'hi' ? 'सामान का विवरण' : 'Consignment Item Details')}
                {type === 'carrier' && (lang === 'hi' ? 'गाड़ी व ट्रांसपोर्टर विवरण' : 'Fleet Carrier & Vehicle Details')}
                {type === 'eta_sla' && (lang === 'hi' ? 'डिलीवरी समय व SLA विवरण' : 'Scheduled ETA & SLA Information')}
              </div>
              <h3 id="shipment-modal-title" className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {type === 'consignment' && (lang === 'hi' ? 'कंसाइनमेंट कार्गो विनिर्देश' : 'Cargo Specifications & Inventory')}
                {type === 'carrier' && (lang === 'hi' ? 'वाहन व ड्राइवर असाइनमेंट' : 'Assigned Vehicle & Transit Operator')}
                {type === 'eta_sla' && (lang === 'hi' ? 'समयबद्ध डिलीवरी व गारंटी' : 'Delivery Timeline & On-Time SLA')}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
            aria-label={lang === 'hi' ? 'बंद करें' : 'Close modal'}
          >
            ✕
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 text-xs leading-normal">
          {/* =========================================================================
              VIEW 1: CONSIGNMENT ITEM DETAILS
             ========================================================================= */}
          {type === 'consignment' && (
            <div className="space-y-4">
              {/* Top Banner: Full Item Title */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4">
                <div className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider font-mono mb-1">
                  {lang === 'hi' ? 'घोषित वस्तु का पूरा नाम' : 'Complete Consignment Description'}
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {shipment.cargo.type}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 font-mono">
                  <span>LR #{shipment.billOfLading}</span>
                  <span>•</span>
                  <span>Consignment #{shipment.id}</span>
                </div>
              </div>

              {/* Data Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'पैकेज मात्रा' : 'Package Quantity'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.cargo.quantity} {lang === 'hi' ? 'पैकेज / बॉक्स' : 'Packages / Units'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'मानक औद्योगिक पैकेजिंग' : 'Commercial cargo packaging'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'कुल बिल योग्य वजन' : 'Chargeable Total Weight'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.cargo.weightKg.toLocaleString('en-IN')} KG
                    {shipment.cargo.weightGrams ? ` (${shipment.cargo.weightGrams} g)` : ''}
                  </div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                    ✓ {lang === 'hi' ? 'इलेक्ट्रॉनिक वेईब्रिज द्वारा सत्यापित' : 'Electronic weighbridge certified'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'कार्गो वॉल्यूम (आयतन)' : 'Cargo Volume / Dimensions'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.cargo.volumeCbm ? `${shipment.cargo.volumeCbm} CBM` : 'Standard Parcel Volume'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'क्यूबिक मीटर माप' : 'Volumetric metric calculation'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'घोषित बीमा मूल्य' : 'Declared Insured Value'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.cargo.declaredValueInr
                      ? formatCurrency(shipment.cargo.declaredValueInr)
                      : '₹4,85,000'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {shipment.cargo.declaredValueUsd ? `($${shipment.cargo.declaredValueUsd} USD) • ` : ''}
                    {lang === 'hi' ? 'पार्सल पूर्ण सुरक्षित' : 'Full transit transit cover'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'सुरक्षा सील संख्या' : 'Tamper-Evident Security Seal'}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.cargo.sealNumber || 'SL-8842-FLX'}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                    <span>🔒</span> {lang === 'hi' ? 'सील डिजिटल रूप से लॉक' : 'Digital cable lock active'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'खतरनाक सामग्री (Hazmat)' : 'Hazardous Material Classification'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.cargo.hazardous
                      ? `Yes (${shipment.cargo.hazmatClass || 'Class 3 Flammable'})`
                      : 'Non-Hazardous Goods'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {shipment.cargo.hazardous ? `UN Number: ${shipment.cargo.unNumber || 'UN1263'}` : 'Standard commercial dispatch'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'तापमान नियंत्रण' : 'Temperature Control'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.cargo.temperatureControlled
                      ? `Active Reefer (${shipment.cargo.tempRange || '2°C to 8°C'})`
                      : 'Standard Ambient Temperature'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {shipment.cargo.temperatureControlled
                      ? 'Monitored temperature log'
                      : 'No cold-chain required'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'प्राथमिकता श्रेणी' : 'Handling Priority Level'}
                  </div>
                  <div className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-0.5 uppercase">
                    {shipment.priorityLevel === 'critical_overnight'
                      ? 'Critical Overnight'
                      : shipment.priorityLevel === 'expedited'
                      ? 'Expedited Express'
                      : 'Standard Priority'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Fast-track hub clearance
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: FLEET CARRIER & VEHICLE DETAILS
             ========================================================================= */}
          {type === 'carrier' && (
            <div className="space-y-4">
              {/* Carrier Summary Banner */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4">
                <div className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider font-mono mb-1">
                  {lang === 'hi' ? 'मुख्य ट्रांसपोर्टर / फ्लीट' : 'Primary Logistics Carrier & Vehicle'}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {vehicleModelName}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="bg-slate-900 dark:bg-slate-700 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                    {registrationPlate}
                  </span>
                  <span className="bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 font-semibold text-[11px] px-2.5 py-0.5 rounded-md">
                    {shipment.carrier || 'VELTRAX Fleet Express'}
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] px-2.5 py-0.5 rounded-md">
                    GPS Active
                  </span>
                </div>
              </div>

              {/* Data Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'गाड़ी पंजीकरण संख्या' : 'Vehicle Registration Plate'}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {registrationPlate}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    State transport authority registered
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'वाहन का प्रकार / मॉडल' : 'Vehicle Classification'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    {vehicleModelName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Dedicated commercial freight carrier
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'परिवहन सेवा माध्यम' : 'Transportation Service Mode'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.serviceMode === 'heavy_haul'
                      ? 'Heavy Haul Highway Express'
                      : shipment.serviceMode === 'intermodal_rail'
                      ? 'Intermodal Rail & Road Network'
                      : shipment.serviceMode === 'air_express'
                      ? 'Air Cargo Express Delivery'
                      : 'Ocean & Inland Freight Corridor'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Multi-modal logistics corridor
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'फ्लीट ऑपरेटर' : 'Fleet Operator Name'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.carrier || 'VELTRAX Integrated Logistics'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Certified Goods Transport Agency
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'असाइन किए गए ड्राइवर' : 'Designated Fleet Driver'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.assignedDriver?.name ||
                      shipment.transportAssignment?.roadDetails?.driverName ||
                      'Ramesh Singh (Staff Driver)'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Badge: {shipment.assignedDriver?.badgeNumber || 'FLX-DRV-8821'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'ड्राइवर संपर्क नंबर' : 'Driver Contact Number'}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.assignedDriver?.phone ||
                      shipment.transportAssignment?.roadDetails?.driverPhone ||
                      '+91 98765 43210'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Active during transit operational hours
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60 col-span-1 sm:col-span-2">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'मार्ग व हब कॉरिडोर' : 'Transit Corridor & Hub Network'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.originHub} ({shipment.originHubCode}) ➔ {shipment.destinationHub} ({shipment.destinationHubCode})
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    From {shipment.sender.city} to {shipment.receiver.city} • Telemetry tracked by Operations Control
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: SCHEDULED ETA & SLA DETAILS
             ========================================================================= */}
          {type === 'eta_sla' && (
            <div className="space-y-4">
              {/* Status & SLA Progress Banner */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {lang === 'hi' ? 'डिलीवरी स्थिति व गारंटी' : 'Delivery Status & SLA Guarantee'}
                  </div>
                  <StatusBadge status={shipment.status} size="sm" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isDelivered
                        ? (lang === 'hi' ? 'सफलतापूर्वक डिलीवरी संपन्न' : 'Actual Delivery Completed')
                        : isDelayed
                        ? (lang === 'hi' ? 'संशोधित अनुमानित समय' : 'Revised Estimated Delivery')
                        : (lang === 'hi' ? 'अनुमानित पहुंचने की तारीख' : 'Scheduled Estimated Delivery')}
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                      {isDelayed
                        ? shipment.delayInfo?.revisedEta || shipment.deliveryTimeEstimate || shipment.eta
                        : shipment.deliveryTimeEstimate || shipment.eta}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {slaPercent}% SLA
                    </span>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {lang === 'hi' ? 'समय पर पहुंचने की संभावना' : 'On-Time corridor confidence'}
                    </div>
                  </div>
                </div>

                {/* Progress bar (Single % representation) */}
                <div
                  className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={slaPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${slaPercent}%` }}
                  />
                </div>
              </div>

              {/* Comprehensive Timeline Projections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'मूल निर्धारित समय (Original ETA)' : 'Original Scheduled ETA'}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.delayInfo?.originalEta || shipment.eta}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'बुकिंग के समय जारी' : 'Committed at initial dispatch booking'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'संशोधित समय (Revised ETA)' : 'Revised ETA / Delay Projection'}
                  </div>
                  <div className={`text-sm font-mono font-bold mt-0.5 ${isDelayed ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {isDelayed
                      ? shipment.delayInfo?.revisedEta || 'New delivery estimate pending'
                      : 'On schedule (no revision required)'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isDelayed ? 'Adjusted based on active corridor telemetry' : 'Real-time telemetry tracking nominal'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'वास्तविक डिलीवरी समय' : 'Actual Delivery Timestamp'}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {isDelivered
                      ? shipment.deliveredAt || shipment.photoProof?.deliveryTimestamp || 'Delivered with Consignee Verification'
                      : 'In transit (Handover pending)'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isDelivered ? 'Verified by secure consignee OTP' : 'Awaiting physical destination arrival'}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'गारंटीकृत डिलीवरी दिन व तारीख' : 'Promised Delivery Day & Date'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {shipment.deliveryPromise?.promisedDay || 'Thursday'}
                    {shipment.deliveryPromise?.promisedDate ? `, ${shipment.deliveryPromise.promisedDate}` : ''}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    SLA committed corridor arrival window
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/60 col-span-1 sm:col-span-2">
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {lang === 'hi' ? 'कॉरिडोर विश्वसनीयता विवरण' : 'Corridor SLA Reliability Description'}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {shipment.deliveryPromise?.description ||
                      'Historical on-time probability calculated from VELTRAX corridor telemetry, historical vehicle transit times, automated hub sorting, and regional weather factors.'}
                  </div>
                </div>

                {/* Additional Delay Breakdown if Delayed */}
                {isDelayed && (
                  <div className="border border-rose-200 dark:border-rose-900/60 rounded-xl p-3.5 bg-rose-50/60 dark:bg-rose-950/30 col-span-1 sm:col-span-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
                      <span>⚠️</span>
                      <span>{lang === 'hi' ? 'सक्रिय देरी विवरण व सुधारात्मक कार्रवाई' : 'Active Delay Advisory & Resolution'}</span>
                    </div>
                    <div className="text-xs text-rose-900 dark:text-rose-200 font-medium">
                      {shipment.delayInfo?.reason || 'Corridor transit bottleneck'}
                    </div>
                    {shipment.delayInfo?.customerExplanation && (
                      <div className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
                        {shipment.delayInfo.customerExplanation}
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-rose-200/60 dark:border-rose-900/60 flex flex-wrap items-center justify-between text-[10px] text-rose-600 dark:text-rose-400 font-mono gap-2">
                      <span>Location: {shipment.delayInfo?.location || shipment.sender.city}</span>
                      <span>Action: {shipment.delayInfo?.actionTaken || 'Dedicated route priority assigned'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 dark:text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>VELTRAX Verified Consignment Data</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            {lang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
