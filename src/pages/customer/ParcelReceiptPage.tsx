import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getShipmentById } from '../../data/mockShipments';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { useTranslation } from '../../context/LanguageContext';
import { Barcode } from '../../components/common/Barcode';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/indiaHelpers';

export const ParcelReceiptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { lang } = useTranslation();
  const { customer } = useCustomerAuth();

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick(t => t + 1);
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const shipment = id ? getShipmentById(id) : undefined;
  void tick; // Track updates

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Determine context
  const isCustomerPortalRoute = location.pathname.startsWith('/account/');

  // Customer ownership authorization check for Customer Portal access
  const isCustomerAccountAuthorized = () => {
    if (!shipment) return false;
    // If accessed through Customer Portal, the shipment must belong to the active customer
    if (isCustomerPortalRoute || customer) {
      // If customer is logged in and viewing, allow if it matches customerId or customer's email/phone
      if (customer) {
        if (!shipment.customerId) {
          // Fallback check against sender/receiver email or mobile
          return (
            shipment.sender.contactEmail.toLowerCase() === customer.email.toLowerCase() ||
            shipment.sender.contactPhone === customer.mobile ||
            shipment.receiver.contactEmail.toLowerCase() === customer.email.toLowerCase() ||
            shipment.receiver.contactPhone === customer.mobile
          );
        }
        return shipment.customerId === customer.id;
      }
    }
    // Public tracking or recipient route access
    return true;
  };

  if (!shipment) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <IndustrialIcon name="alert" size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {lang === 'hi' ? 'पार्सल रसीद नहीं मिली' : 'Parcel Receipt Not Found'}
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {lang === 'hi'
              ? `पार्सल आईडी "${id || ''}" के लिए कोई आधिकारिक बिल्ती या रसीद दर्ज नहीं है। कृपया ट्रैकिंग नंबर की जांच करें।`
              : `No official lorry receipt (e-LR) was found for consignment identifier "${id || ''}". Please verify the tracking number.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              to="/track"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              {lang === 'hi' ? 'पार्सल ट्रैक करें' : 'Back to Tracking'}
            </Link>
            {customer && (
              <Link
                to="/account/shipments"
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                {lang === 'hi' ? 'मेरे पार्सल' : 'My Shipments'}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Access restriction enforcement for Customer Portal
  if (isCustomerPortalRoute && !isCustomerAccountAuthorized()) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white border border-rose-200 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <IndustrialIcon name="shield" size={28} />
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono mb-1">
            403 Security Restriction
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {lang === 'hi' ? 'पहुंच प्रतिबंधित है' : 'Access Restricted'}
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {lang === 'hi'
              ? `यह पार्सल रसीद (${shipment.id}) दूसरे ग्राहक खाते से जुड़ी है। आप केवल अपने बुक किए गए पार्सल की रसीदें देख सकते हैं।`
              : `This consignment note (${shipment.id}) belongs to another registered customer account. Through the Customer Portal, you can only access receipts for your own shipments.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              to="/account/shipments"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              {lang === 'hi' ? 'मेरे पार्सल पर लौटें' : 'Back to My Shipments'}
            </Link>
            <Link
              to={`/track?id=${shipment.id}`}
              className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              {lang === 'hi' ? 'सार्वजनिक ट्रैकिंग देखें' : 'Public Tracking'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normalized receipt data
  const lrNumber = shipment.billOfLading || `LR-2026-${shipment.id.replace(/[^0-9]/g, '').slice(-5) || '88290'}`;
  const trackingNumber = shipment.id;
  const bookingRef = shipment.bookingRef || `BKG-${shipment.id.replace(/[^0-9]/g, '')}`;
  const issueDate = shipment.dispatchedAt || '2026-10-22';
  const serviceModeText = shipment.serviceMode ? shipment.serviceMode.replace('_', ' ').toUpperCase() : 'EXPRESS ROAD FREIGHT';

  // Sender / Consignor details
  const sender = shipment.sender;
  const senderGstin = sender.taxIdOrEori || '07AAACF8829F1Z4';

  // Receiver / Consignee details
  const receiver = shipment.receiver;
  const receiverGstin = receiver.taxIdOrEori || '08AAACM8819Q1ZY';

  // Cargo details
  const cargo = shipment.cargo;
  const declaredValueInr = cargo.declaredValueInr || (cargo.declaredValueUsd ? cargo.declaredValueUsd * 83 : 45000);

  // Financial charges
  const baseRate = shipment.priceBreakdown?.baseCharge || 1850;
  const fuelRate = shipment.priceBreakdown?.fuelCharge || Math.round(baseRate * 0.1);
  const handlingFee = shipment.priceBreakdown?.pickupCharge || shipment.priceBreakdown?.packingCharge || 120;
  const gstAmount = shipment.priceBreakdown?.gstAmount || Math.round((baseRate + fuelRate + handlingFee) * 0.18);
  const totalAmount = shipment.priceBreakdown?.total || (baseRate + fuelRate + handlingFee + gstAmount);
  const paymentMethod = (shipment.paymentMethod || 'upi').toUpperCase();
  const paymentStatus = shipment.status === 'delivered' ? 'Settled & Verified' : 'Paid / Authorized';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
================================================================================
VELTRAX LOGISTICS MANAGEMENT SYSTEM
OFFICIAL ELECTRONIC LORRY RECEIPT (e-LR / BILTY)
Receipt / LR Number: ${lrNumber}
Consignment / Tracking ID: ${trackingNumber}
Booking Reference: ${bookingRef}
Issue Date: ${issueDate}
Status: ${shipment.status.toUpperCase()}
================================================================================
1. CONSIGNOR (SENDER / PICKUP LOCATION):
Name:    ${sender.name}
Company: ${sender.company || 'Consignor Entity'}
Address: ${sender.address}, ${sender.city}, ${sender.state || ''} - ${sender.postalCode}
Contact: ${sender.contactPhone} | ${sender.contactEmail}
GSTIN:   ${senderGstin}
Pickup Hub: ${shipment.originHub} (${shipment.originHubCode})

2. CONSIGNEE (RECEIVER / DELIVERY LOCATION):
Name:    ${receiver.name}
Company: ${receiver.company || 'Consignee Entity'}
Address: ${receiver.address}, ${receiver.city}, ${receiver.state || ''} - ${receiver.postalCode}
Contact: ${receiver.contactPhone} | ${receiver.contactEmail}
GSTIN:   ${receiverGstin}
Delivery Hub: ${shipment.destinationHub} (${shipment.destinationHubCode})

3. CARGO SPECIFICATIONS:
Description:       ${cargo.type}
Quantity:          ${cargo.quantity} Package(s)
Chargeable Weight: ${cargo.weightKg} KG
Volume:            ${cargo.volumeCbm} CBM
Declared Value:    Rs. ${declaredValueInr.toLocaleString('en-IN')}
Service Mode:      ${serviceModeText}
Dangerous Goods:   ${cargo.hazardous ? `Hazardous (Class ${cargo.hazmatClass || 'General'})` : 'No (Standard Non-Hazardous)'}
Seal Number:       ${cargo.sealNumber || 'N/A'}

4. FREIGHT CHARGES & TAX BREAKDOWN:
Base Freight Charge:       Rs. ${baseRate.toLocaleString('en-IN')}
Fuel Surcharge:            Rs. ${fuelRate.toLocaleString('en-IN')}
Docket & Handling Fee:     Rs. ${handlingFee.toLocaleString('en-IN')}
Goods & Services Tax (18%): Rs. ${gstAmount.toLocaleString('en-IN')}
--------------------------------------------------------------------------------
TOTAL AMOUNT:              Rs. ${totalAmount.toLocaleString('en-IN')}
Payment Mode:              ${paymentMethod}
Payment Status:            ${paymentStatus}
Consignee Delivery OTP:    ${shipment.deliveryOtp || '4829'}
================================================================================
STATUTORY DECLARATION:
Issued under the Carriage by Road Act 2007 and Goods Transport Agency rules.
Carrier: ${shipment.carrier}
Helpline: 1800-266-8829 | support@veltrax.in | WhatsApp: +91 6303766064
================================================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VELTRAX_Receipt_${lrNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:min-h-0">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* 1. Header Toolbar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <IndustrialIcon name="file" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                  {isCustomerPortalRoute ? 'Customer Portal' : 'Public Consignment'}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {lang === 'hi' ? 'आधिकारिक पार्सल रसीद' : 'Official Consignment Note'}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {lang === 'hi' ? 'पक्की बिल्टी व पार्सल रसीद' : 'Parcel Receipt & e-LR Bilty'}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Contextual Back Navigation */}
            {isCustomerPortalRoute ? (
              <Link
                to="/account/shipments"
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>← {lang === 'hi' ? 'मेरे पार्सल' : 'My Shipments'}</span>
              </Link>
            ) : (
              <Link
                to={`/track?id=${shipment.id}`}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>← {lang === 'hi' ? 'ट्रैकिंग पर लौटें' : 'Back to Tracking'}</span>
              </Link>
            )}

            {/* Print Receipt Action */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Print official receipt or save as PDF"
            >
              <IndustrialIcon name="printer" size={14} />
              <span>{lang === 'hi' ? 'प्रिंट / PDF सेव करें' : 'Print / Save PDF'}</span>
            </button>

            {/* Download Text Action */}
            <button
              onClick={handleDownloadText}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Download text version of bilty"
            >
              <span>{lang === 'hi' ? 'टेक्स्ट कॉपी डाउनलोड' : 'Download .txt'}</span>
            </button>

            {/* Direct WhatsApp Helpdesk */}
            <a
              href="https://wa.me/916303766064"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Chat on WhatsApp (+91 6303766064)"
            >
              <IndustrialIcon name="phone" size={13} className="text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 2. Printable Official Lorry Receipt Body */}
        <div
          id="printable-parcel-receipt"
          className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg text-slate-800 space-y-7 print:border-none print:shadow-none print:p-0 print:m-0"
        >
          {/* A. Top Brand & Carrier Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
                  V
                </div>
                <div>
                  <div className="font-black text-2xl tracking-tight text-slate-900 leading-none">
                    VELTRAX LOGISTICS
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-orange-600 uppercase mt-0.5">
                    Express Multimodal Freight & Parcel Network
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-3 space-y-0.5">
                <div>Registered Office: Barakhamba Road, Connaught Place, New Delhi 110001</div>
                <div>Customer Helpdesk: 1800-266-8829 • support@veltrax.in • WhatsApp: +91 6303766064</div>
                <div className="font-mono text-[11px]">GSTIN: 07AAACF8829F1Z4 • PAN: AAACF8829F • GTA Reg No: GTA/DEL/2026/882</div>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-mono font-bold uppercase tracking-wider">
                CONSIGNMENT NOTE (e-LR)
              </div>
              <div className="text-xl font-black font-mono text-slate-900 mt-1.5">
                {lrNumber}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Issue Date: <strong className="text-slate-800">{issueDate}</strong>
              </div>
              <div className="text-xs text-slate-500">
                Booking Ref: <strong className="font-mono text-slate-800">{bookingRef}</strong>
              </div>
              <div className="mt-2">
                <StatusBadge status={shipment.status} />
              </div>
            </div>
          </div>

          {/* B. Consignment Identifiers & Quick Route Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Tracking ID
              </span>
              <span className="font-mono font-bold text-sm text-slate-900">
                {trackingNumber}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Corridor / Route
              </span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <span>{sender.city}</span>
                <span className="text-orange-500">➔</span>
                <span>{receiver.city}</span>
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Transport Mode
              </span>
              <span className="font-bold text-slate-900 uppercase">
                {serviceModeText}
              </span>
            </div>
          </div>

          {/* Active Delay Advisory Banner if Delayed */}
          {shipment.status === 'delayed' && (
            <div className="p-3.5 bg-amber-50/95 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                <div>
                  <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] mr-2">
                    ACTIVE TRANSIT DELAY ADVISORY:
                  </span>
                  <span className="font-medium text-slate-800">
                    {shipment.delayInfo?.customerExplanation || shipment.delayInfo?.reason || 'Unexpected transportation disruption along the delivery route.'}
                  </span>
                </div>
              </div>
              <div className="text-[11px] font-mono shrink-0 text-slate-600 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200">
                <span className="text-slate-400">Orig ETA: </span>
                <span className="line-through text-slate-400 mr-2">{shipment.delayInfo?.originalEta || '17/11/2026, 02:00 PM'}</span>
                <span className="text-amber-800 font-bold">Revised: {shipment.delayInfo?.revisedEta || '19/11/2026, 06:00 PM'}</span>
              </div>
            </div>
          )}

          {/* C. Sender & Receiver Party Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sender / Consignor */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  1. Consignor (Sender)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Pickup Origin</span>
              </div>
              <div className="font-bold text-sm text-slate-900">{sender.name}</div>
              {sender.company && (
                <div className="font-semibold text-slate-700">{sender.company}</div>
              )}
              <div className="text-slate-600 leading-relaxed">
                {sender.address}, {sender.city}, {sender.state || ''} - {sender.postalCode}
              </div>
              <div className="text-slate-600 pt-1">
                <span className="font-semibold text-slate-800">Phone:</span> {sender.contactPhone}
              </div>
              <div className="text-slate-600">
                <span className="font-semibold text-slate-800">Email:</span> {sender.contactEmail}
              </div>
              <div className="text-slate-600 font-mono text-[11px] pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-800">GSTIN:</span> {senderGstin}
              </div>
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold">Dispatch Hub:</span> {shipment.originHub} ({shipment.originHubCode})
              </div>
            </div>

            {/* Receiver / Consignee */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  2. Consignee (Receiver)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Delivery Destination</span>
              </div>
              <div className="font-bold text-sm text-slate-900">{receiver.name}</div>
              {receiver.company && (
                <div className="font-semibold text-slate-700">{receiver.company}</div>
              )}
              <div className="text-slate-600 leading-relaxed">
                {receiver.address}, {receiver.city}, {receiver.state || ''} - {receiver.postalCode}
              </div>
              <div className="text-slate-600 pt-1">
                <span className="font-semibold text-slate-800">Phone:</span> {receiver.contactPhone}
              </div>
              <div className="text-slate-600">
                <span className="font-semibold text-slate-800">Email:</span> {receiver.contactEmail}
              </div>
              <div className="text-slate-600 font-mono text-[11px] pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-800">GSTIN:</span> {receiverGstin}
              </div>
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold">Destination Hub:</span> {shipment.destinationHub} ({shipment.destinationHubCode})
              </div>
            </div>
          </div>

          {/* D. Parcel Specifications & Weight Details */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                3. Parcel & Cargo Description
              </span>
              <span className="text-[11px] text-slate-500">
                Chargeable Weight Basis: Actual / Volumetric
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Commodity Description
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {cargo.type}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Chargeable Weight
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block font-mono text-sm">
                  {cargo.weightKg} KG
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Package Quantity
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {cargo.quantity} Package(s)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Declared Consignment Value
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block font-mono text-sm text-emerald-700">
                  {formatCurrency(declaredValueInr)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 font-medium">Volume:</span>{' '}
                <strong className="text-slate-800">{cargo.volumeCbm} CBM</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Hazardous Cargo:</span>{' '}
                <strong className="text-slate-800">{cargo.hazardous ? `Yes (${cargo.hazmatClass || 'Classified'})` : 'No (Standard)'}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Temperature Control:</span>{' '}
                <strong className="text-slate-800">{cargo.temperatureControlled ? cargo.tempRange || 'Controlled' : 'Ambient'}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Security Seal:</span>{' '}
                <strong className="font-mono text-slate-800">{cargo.sealNumber || 'VERIFIED-01'}</strong>
              </div>
            </div>
          </div>

          {/* E. Freight Charges, GST & Total Tariff Breakdown */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                4. Freight Charges & Tariff Breakdown
              </span>
              <span className="text-[11px] text-slate-500 font-mono">GST Rate: 18% Statutory Rate</span>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-slate-700">
                <span>Base Line-Haul Freight Charge ({cargo.weightKg} kg):</span>
                <span className="font-mono font-semibold">{formatCurrency(baseRate)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Fuel Surcharge & Highway Tolls:</span>
                <span className="font-mono font-semibold">{formatCurrency(fuelRate)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Docket Processing & Terminal Handling Fee:</span>
                <span className="font-mono font-semibold">{formatCurrency(handlingFee)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Goods & Services Tax (GST 18%):</span>
                <span className="font-mono font-semibold">{formatCurrency(gstAmount)}</span>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900">
                <span>Total Freight Charges Payable:</span>
                <span className="font-mono text-lg text-slate-900">{formatCurrency(totalAmount)}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-mono font-bold uppercase">
                    {paymentMethod}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                    {paymentStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Consignee Delivery OTP:</span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded font-mono font-bold tracking-wider">
                    {shipment.deliveryOtp || '4829'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* F. Barcode & Statutory Declaration */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <Barcode value={trackingNumber.replace(/-/g, '')} subtext="OFFICIAL CONSIGNMENT LR" height={42} />
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Digital Consignment Token: {lrNumber}-{trackingNumber}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 max-w-sm text-center sm:text-right space-y-1">
              <div>
                <strong>Carriage by Road Act 2007 Compliance:</strong> All goods carried subject to the standard conditions of domestic freight carriage.
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                Carrier: {shipment.carrier} • Verified via VELTRAX Central Operations
              </div>
            </div>
          </div>

          {/* G. Signatures & Stamp Blocks (Optimized for print) */}
          <div className="pt-6 border-t border-dashed border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="h-10 border-b border-slate-300 border-dashed flex items-end justify-center pb-1 text-[11px] text-slate-400 font-mono">
                {sender.name}
              </div>
              <div className="text-[10px] font-bold text-slate-700 uppercase mt-2">
                Consignor Signature
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="h-10 border-b border-slate-300 border-dashed flex items-end justify-center pb-1 text-[11px] text-slate-400 font-mono">
                VELTRAX Authorized Dispatch
              </div>
              <div className="text-[10px] font-bold text-slate-700 uppercase mt-2">
                Carrier Stamp & Sign
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="h-10 border-b border-slate-300 border-dashed flex items-end justify-center pb-1 text-[11px] text-slate-400 font-mono">
                OTP: {shipment.deliveryOtp || '4829'}
              </div>
              <div className="text-[10px] font-bold text-slate-700 uppercase mt-2">
                Consignee Verification
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ParcelReceiptPage;
