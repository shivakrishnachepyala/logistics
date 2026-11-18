import React from 'react';
import type { Shipment } from '../../types';
import type { BookingRecord } from '../../types/customer';
import { Barcode } from '../common/Barcode';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { formatCurrency } from '../../utils/indiaHelpers';

interface CustomerReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment?: Shipment | null;
  booking?: BookingRecord | null;
}

const DEFAULT_BOOKING_DATE = '2026-10-22';

export const CustomerReceiptModal: React.FC<CustomerReceiptModalProps> = ({
  isOpen,
  onClose,
  shipment,
  booking,
}) => {
  if (!isOpen || (!shipment && !booking)) return null;

  // Normalized receipt data
  const trackingNumber = shipment?.id || booking?.trackingId || 'FLX-2026-DEMO';
  const lrNumber = shipment?.billOfLading || `LR-2026-${trackingNumber.replace(/[^0-9]/g, '').slice(-5) || '88290'}`;
  const bookingId = booking?.bookingId || shipment?.bookingRef || 'BKG-2026-ONLINE';
  const bookingDate = booking?.bookingDate || shipment?.dispatchedAt || DEFAULT_BOOKING_DATE;

  // Consignor / Sender details
  const senderName = shipment?.sender.name || 'Self-Service Registered Sender';
  const senderCompany = shipment?.sender.company || 'Consignor Entity';
  const senderAddress = shipment?.sender.address || (booking ? `${booking.originCity} Hub Collection Point` : 'Industrial Area, Phase 1');
  const senderCity = shipment?.sender.city || booking?.originCity || 'Delhi';
  const senderState = shipment?.sender.state || booking?.originState || 'Delhi NCR';
  const senderPhone = shipment?.sender.contactPhone || '+91 98110 00000';
  const senderGstin = shipment?.sender.taxIdOrEori || '07AAACF8829F1Z4';

  // Consignee / Receiver details
  const receiverName = shipment?.receiver.name || 'Designated Consignee';
  const receiverCompany = shipment?.receiver.company || 'Consignee Entity';
  const receiverAddress = shipment?.receiver.address || (booking ? `${booking.destinationCity} Delivery Point` : 'Commercial Terminal');
  const receiverCity = shipment?.receiver.city || booking?.destinationCity || 'Jaipur';
  const receiverState = shipment?.receiver.state || booking?.destinationState || 'Rajasthan';
  const receiverPhone = shipment?.receiver.contactPhone || '+91 94140 00000';
  const receiverGstin = shipment?.receiver.taxIdOrEori || '08AAACM8819Q1ZY';

  // Cargo & Package details
  const cargoType = shipment?.cargo.type || booking?.cargoDescription || 'Industrial Freight Consignment';
  const packageCount = shipment?.cargo.quantity || booking?.quantity || 1;
  const weightKg = shipment?.cargo.weightKg || booking?.weightKg || 25;
  const serviceMode = shipment?.serviceMode ? shipment.serviceMode.replace('_', ' ').toUpperCase() : 'EXPRESS ROAD FREIGHT';

  // Financial breakdown
  const baseRate = shipment?.priceBreakdown?.baseCharge || (booking ? Math.round(booking.totalAmount * 0.75) : 1850);
  const fuelRate = shipment?.priceBreakdown?.fuelCharge || Math.round(baseRate * 0.1);
  const handlingFee = shipment?.priceBreakdown?.pickupCharge || 120;
  const gstAmount = shipment?.priceBreakdown?.gstAmount || Math.round((baseRate + fuelRate + handlingFee) * 0.18);
  const totalAmount = shipment?.priceBreakdown?.total || booking?.totalAmount || (baseRate + fuelRate + handlingFee + gstAmount);
  const paymentMethod = (shipment?.paymentMethod || booking?.paymentMethod || 'upi').toUpperCase();
  const paymentStatus = shipment?.status === 'delivered' ? 'Settled / Verified' : 'Authorized';
  const deliveryOtp = shipment?.deliveryOtp || '4829';

  const handlePrint = () => {
    window.print();
  };

  const handleSimulatedDownload = () => {
    const receiptText = `
================================================================================
VELTRAX LOGISTICS MANAGEMENT SYSTEM
OFFICIAL ELECTRONIC LORRY RECEIPT (e-LR / BILTY)
LR Consignment Number: ${lrNumber}
Tracking Number: ${trackingNumber}
Booking Reference: ${bookingId}
Booking Date: ${bookingDate}
================================================================================
CONSIGNOR (SENDER):
${senderName} (${senderCompany})
${senderAddress}, ${senderCity}, ${senderState}
Phone: ${senderPhone} | GSTIN: ${senderGstin}

CONSIGNEE (RECEIVER):
${receiverName} (${receiverCompany})
${receiverAddress}, ${receiverCity}, ${receiverState}
Phone: ${receiverPhone} | GSTIN: ${receiverGstin}

CARGO SPECIFICATIONS:
Description: ${cargoType}
Quantity: ${packageCount} Packages | Declared Weight: ${weightKg} KG
Transport Mode: ${serviceMode}

CHARGES & TARIFF BREAKDOWN:
Base Freight Charge:    Rs. ${baseRate.toLocaleString('en-IN')}
Fuel Surcharge:         Rs. ${fuelRate.toLocaleString('en-IN')}
Handling & Docket Fee:  Rs. ${handlingFee.toLocaleString('en-IN')}
Goods & Services Tax:   Rs. ${gstAmount.toLocaleString('en-IN')} (18% GST)
--------------------------------------------------------------------------------
TOTAL AMOUNT PAYABLE:   Rs. ${totalAmount.toLocaleString('en-IN')}
Payment Mode: ${paymentMethod} | Status: ${paymentStatus}
Consignee Delivery OTP: ${deliveryOtp}
================================================================================
Generated via VELTRAX Customer Self-Service Portal
Statutory copy issued under Carriage by Road Act 2007
================================================================================
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VELTRAX_eLR_${lrNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white select-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden print:border-none print:shadow-none print:m-0 print:max-w-full">
        {/* Top Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
              <IndustrialIcon name="file" size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Official Electronic Lorry Receipt (e-LR / Bilty)
              </h3>
              <span className="text-[11px] text-slate-500">
                Customer Consignment Copy • #{lrNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              title="Print official receipt or save as PDF"
            >
              <IndustrialIcon name="clock" size={13} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleSimulatedDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              title="Download text summary"
            >
              <span>Download Text</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              aria-label="Close receipt"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-900" id="customer-printable-receipt">
          {/* Header & Carrier Metadata */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-xs">
                  V
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900">
                  VELTRAX LOGISTICS
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                <div>National Express Freight & Multimodal Logistics Network</div>
                <div>Customer Helpdesk: 1800-266-8829 • support@veltrax.in • WhatsApp: +91 6303766064</div>
                <div className="font-mono">GSTIN: 07AAACF8829F1Z4 • PAN: AAACF8829F</div>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <div className="inline-block px-2.5 py-1 bg-slate-100 rounded text-[11px] font-mono font-bold text-slate-800 uppercase tracking-wider">
                CONSIGNMENT NOTE (e-LR)
              </div>
              <div className="text-base font-bold font-mono text-slate-900 mt-1">
                {lrNumber}
              </div>
              <div className="text-xs text-slate-500">Booking Date: {bookingDate}</div>
              <div className="text-[11px] text-slate-500 font-mono">Ref ID: {bookingId}</div>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Consignment Tracking Barcode
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {trackingNumber}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Scan at regional transit hubs for live tracking
              </span>
            </div>
            <Barcode value={trackingNumber} height={36} />
          </div>

          {/* Consignor & Consignee Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Sender / Consignor */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                Consignor (Sender)
              </div>
              <div className="font-bold text-sm text-slate-900">{senderName}</div>
              <div className="text-slate-700 font-medium">{senderCompany}</div>
              <div className="text-slate-500">{senderAddress}</div>
              <div className="text-slate-500">{senderCity}, {senderState}</div>
              <div className="text-slate-600 font-mono pt-1">
                Phone: {senderPhone} • GSTIN: {senderGstin}
              </div>
            </div>

            {/* Receiver / Consignee */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Consignee (Recipient)
              </div>
              <div className="font-bold text-sm text-slate-900">{receiverName}</div>
              <div className="text-slate-700 font-medium">{receiverCompany}</div>
              <div className="text-slate-500">{receiverAddress}</div>
              <div className="text-slate-500">{receiverCity}, {receiverState}</div>
              <div className="text-slate-600 font-mono pt-1">
                Phone: {receiverPhone} • GSTIN: {receiverGstin}
              </div>
            </div>
          </div>

          {/* Cargo Specifications Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3">Cargo Description</th>
                  <th className="py-2.5 px-3 text-center">Packages</th>
                  <th className="py-2.5 px-3 text-center">Weight</th>
                  <th className="py-2.5 px-3 text-right">Service Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {cargoType}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700">
                    {packageCount} pkgs
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                    {weightKg} kg
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-800">
                    {serviceMode}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tariff & Payment Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            {/* Delivery Authentication Box */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <IndustrialIcon name="shield" size={14} />
                <span>Delivery Handover Security</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                To confirm physical handover at destination, share the following secure 4-digit code with the delivery associate:
              </p>
              <div className="pt-1 flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-mono font-black text-base text-amber-900 shadow-2xs">
                  {deliveryOtp}
                </div>
                <span className="text-[10px] text-slate-500">
                  Non-transferable verification token
                </span>
              </div>
            </div>

            {/* Financial Ledger Calculation */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Commercial Settlement Ledger
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Freight Charge:</span>
                  <span className="font-mono font-medium text-slate-900">
                    {formatCurrency(baseRate)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Fuel Surcharge & Handling:</span>
                  <span className="font-mono font-medium text-slate-900">
                    {formatCurrency(fuelRate + handlingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Integrated Tax):</span>
                  <span className="font-mono font-medium text-slate-900">
                    {formatCurrency(gstAmount)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Amount:</span>
                  <span className="font-mono text-orange-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-slate-700">{paymentMethod} ({paymentStatus})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Footer */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed space-y-1">
            <p>
              <strong>Notice:</strong> This document is an electronic consignment note generated under Section 9 of the Carriage by Road Act 2007 and Central Motor Vehicles Rules. Goods accepted under standard carrier terms of carriage. Goods insured up to declared value.
            </p>
            <p>
              VELTRAX India Logistics Ltd. • Registered Office: Barakhamba Road, Connaught Place, New Delhi 110001.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReceiptModal;
