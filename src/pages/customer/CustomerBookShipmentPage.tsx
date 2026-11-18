import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { getAddressesByCustomerId, saveAddress, saveBooking } from '../../data/mockCustomers';
import { saveShipment } from '../../data/mockShipments';
import type { SavedAddress, BookingRecord } from '../../types/customer';
import type { Shipment, ServiceMode } from '../../types';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';
import { Barcode } from '../../components/common/Barcode';
import { calculatePriceBreakdown } from '../../services/pricingService';
import { formatCurrency, lookupPinCode, INDIAN_STATES } from '../../utils/indiaHelpers';

// External generator helpers (avoids React compiler purity warnings)
function generateRandomSuffix() {
  return Math.floor(1000 + Math.random() * 9000);
}
function generateOtpCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}
function generateIsoNow() {
  return new Date().toISOString();
}
function generateDisplayNow() {
  return new Date().toLocaleString('en-IN');
}
function generateEtaTwoDays() {
  return new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16).replace('T', ' ');
}
function generateTimeId() {
  return Date.now().toString();
}

export const CustomerBookShipmentPage: React.FC = () => {
  const { customer } = useCustomerAuth();
  const customerId = customer?.id || '';

  const [savedAddresses] = useState<SavedAddress[]>(() =>
    customerId ? getAddressesByCustomerId(customerId) : []
  );
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>('custom');
  const [saveReceiverToAddressBook, setSaveReceiverToAddressBook] = useState(false);
  const [receiverLabel, setReceiverLabel] = useState('');

  // Form State initialized with customer profile & default address
  const [formData, setFormData] = useState(() => {
    const list = customerId ? getAddressesByCustomerId(customerId) : [];
    const defaultSender = list.find(a => a.type === 'sender' && a.isDefault) || list.find(a => a.type === 'sender');
    return {
      // Sender Information (Auto-populated)
      senderName: defaultSender?.name || customer?.fullName || '',
      senderCompany: defaultSender?.company || customer?.company || '',
      senderMobile: defaultSender?.mobile || customer?.mobile || '',
      senderEmail: defaultSender?.email || customer?.email || '',
      senderHouseNo: defaultSender?.houseNo || '',
      senderArea: defaultSender?.area || '',
      senderLandmark: defaultSender?.landmark || '',
      senderAddress: defaultSender?.address || '',
      senderPin: defaultSender?.postalCode || '110006',
      senderCity: defaultSender?.city || 'Delhi',
      senderState: defaultSender?.state || 'Delhi',
      senderGst: customer?.gst || '',

      // Receiver Information
      receiverName: '',
      receiverCompany: '',
      receiverMobile: '',
      receiverEmail: '',
      receiverHouseNo: '',
      receiverArea: '',
      receiverLandmark: '',
      receiverAddress: '',
      receiverPin: '302001',
      receiverCity: 'Jaipur',
      receiverState: 'Rajasthan',
      receiverGst: '',

      // Parcel & Cargo Details
      cargoCategory: 'Box / Carton (Clothes & Garments)',
      itemDescription: 'Ready-made apparel, cotton shirts and fabrics',
      quantity: 1,
      weightKg: 10,
      declaredValueInr: 25000,
      specialInstructions: 'Handle with care; keep away from moisture',

      // Speed & Payment
      serviceMode: 'heavy_haul' as ServiceMode,
      deliverySpeed: 'standard', // standard, next_day, same_day
      paymentMethod: 'cod' as 'upi' | 'cod' | 'card' | 'netbanking',
    };
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    shipment: Shipment;
    booking: BookingRecord;
  } | null>(null);

  const receiverAddresses = savedAddresses.filter(a => a.type === 'receiver');

  // Handle saved receiver selection
  const handleSelectReceiver = (addrId: string) => {
    setSelectedReceiverId(addrId);
    if (addrId === 'custom') {
      return;
    }
    const match = receiverAddresses.find(a => a.id === addrId);
    if (match) {
      setFormData(prev => ({
        ...prev,
        receiverName: match.name,
        receiverCompany: match.company || '',
        receiverMobile: match.mobile,
        receiverEmail: match.email || '',
        receiverHouseNo: match.houseNo || '',
        receiverArea: match.area || '',
        receiverLandmark: match.landmark || '',
        receiverAddress: match.address,
        receiverPin: match.postalCode,
        receiverCity: match.city,
        receiverState: match.state,
      }));
    }
  };

  // PIN code auto-fill
  const handleSenderPinChange = (pin: string) => {
    const clean = pin.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => {
      const loc = clean.length === 6 ? lookupPinCode(clean) : null;
      return {
        ...prev,
        senderPin: clean,
        senderCity: loc ? loc.city : prev.senderCity,
        senderState: loc ? loc.state : prev.senderState,
      };
    });
  };

  const handleReceiverPinChange = (pin: string) => {
    const clean = pin.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => {
      const loc = clean.length === 6 ? lookupPinCode(clean) : null;
      return {
        ...prev,
        receiverPin: clean,
        receiverCity: loc ? loc.city : prev.receiverCity,
        receiverState: loc ? loc.state : prev.receiverState,
      };
    });
  };

  // Calculate dynamic transparent price breakdown
  const priceBreakdown = calculatePriceBreakdown({
    weightKg: Number(formData.weightKg) || 0,
    speed: formData.deliverySpeed,
    paymentMethod: formData.paymentMethod,
    packingType: formData.cargoCategory,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.senderName.trim() || !formData.senderMobile.trim() || !formData.senderAddress.trim()) {
      setFormError('Please provide complete sender address details.');
      return;
    }
    if (!formData.receiverName.trim() || !formData.receiverMobile.trim() || !formData.receiverAddress.trim()) {
      setFormError('Please provide complete receiver delivery address details.');
      return;
    }
    if (formData.weightKg <= 0) {
      setFormError('Weight must be greater than 0 kg.');
      return;
    }

    setIsSubmitting(true);

    try {
      const randomSuffix = generateRandomSuffix();
      const destCode = formData.receiverCity.slice(0, 3).toUpperCase() || 'DST';
      const originCode = formData.senderCity.slice(0, 3).toUpperCase() || 'ORG';
      const newTrackingId = `FLX-${randomSuffix}-${destCode}`;
      const newBookingId = `BKG-2026-${randomSuffix}`;
      const nowStr = generateIsoNow();
      const nowDisplay = generateDisplayNow();

      // Save receiver to Address Book if selected
      if (saveReceiverToAddressBook && selectedReceiverId === 'custom') {
        const newAddrId = `ADDR-${generateTimeId().slice(-4)}`;
        const newSavedAddress: SavedAddress = {
          id: newAddrId,
          customerId,
          type: 'receiver',
          label: receiverLabel.trim() || `${formData.receiverName} (${formData.receiverCity})`,
          name: formData.receiverName.trim(),
          company: formData.receiverCompany.trim(),
          mobile: formData.receiverMobile.trim(),
          email: formData.receiverEmail.trim(),
          houseNo: formData.receiverHouseNo.trim(),
          area: formData.receiverArea.trim(),
          landmark: formData.receiverLandmark.trim(),
          address: formData.receiverAddress.trim(),
          city: formData.receiverCity.trim(),
          state: formData.receiverState.trim(),
          postalCode: formData.receiverPin.trim(),
          isDefault: false,
          createdAt: nowStr,
        };
        saveAddress(newSavedAddress);
      }

      // 1. Create Shipment Object
      const newShipment: Shipment = {
        id: newTrackingId,
        customerId,
        bookingId: newBookingId,
        billOfLading: `LR-2026-${randomSuffix}`,
        bookingRef: `BKG-${originCode}-${destCode}-${randomSuffix.toString().slice(-2)}`,
        originHub: `${formData.senderCity} Regional Hub`,
        originHubCode: `${originCode}-HUB`,
        destinationHub: `${formData.receiverCity} Delivery Centre`,
        destinationHubCode: `${destCode}-MAIN`,
        serviceMode: formData.serviceMode,
        status: 'pending',
        progressPercent: 5,
        eta: generateEtaTwoDays(),
        dispatchedAt: nowStr,
        carrier: 'VELTRAX Express Dedicated Network',
        priorityLevel: formData.deliverySpeed === 'same_day' ? 'critical_overnight' : 'standard',
        customsStatus: 'pre_approved',
        paymentMethod: formData.paymentMethod,
        whatsappUpdates: true,
        deliveryTimeEstimate: `Expected delivery in 1-2 days (${formData.receiverCity})`,
        deliveryOtp: generateOtpCode(),
        sender: {
          name: formData.senderName,
          company: formData.senderCompany || 'N/A',
          houseNo: formData.senderHouseNo,
          area: formData.senderArea,
          landmark: formData.senderLandmark,
          address: formData.senderAddress,
          city: formData.senderCity,
          state: formData.senderState,
          country: 'India',
          postalCode: formData.senderPin,
          contactEmail: formData.senderEmail || 'N/A',
          contactPhone: formData.senderMobile,
          taxIdOrEori: formData.senderGst,
        },
        receiver: {
          name: formData.receiverName,
          company: formData.receiverCompany || 'N/A',
          houseNo: formData.receiverHouseNo,
          area: formData.receiverArea,
          landmark: formData.receiverLandmark,
          address: formData.receiverAddress,
          city: formData.receiverCity,
          state: formData.receiverState,
          country: 'India',
          postalCode: formData.receiverPin,
          contactEmail: formData.receiverEmail || 'N/A',
          contactPhone: formData.receiverMobile,
          taxIdOrEori: formData.receiverGst,
        },
        cargo: {
          type: formData.cargoCategory,
          quantity: Number(formData.quantity) || 1,
          weightKg: Number(formData.weightKg) || 1,
          volumeCbm: 0.25,
          declaredValueInr: Number(formData.declaredValueInr) || 0,
          hazardous: false,
          sealNumber: `SEAL-${randomSuffix}`,
          temperatureControlled: false,
        },
        checkpoints: [
          {
            id: `CP-1-${randomSuffix}`,
            location: `${formData.senderCity} Consignment Desk`,
            city: formData.senderCity,
            country: 'India',
            timestamp: nowDisplay,
            status: 'pending',
            facilityCode: `${originCode}-DESK`,
            description: 'Online customer consignment manifest generated. Scheduled for line-haul dispatch.',
            completed: true,
            isCurrent: true,
          },
        ],
        documents: [
          {
            id: `DOC-BOL-${randomSuffix}`,
            title: 'Electronic Lorry Receipt (e-LR)',
            type: 'Bill of Lading',
            docNumber: `LR-2026-${randomSuffix}`,
            issuedDate: nowDisplay,
            fileSize: '142 KB',
            status: 'verified',
          },
        ],
        activities: [
          {
            id: `ACT-${generateTimeId()}`,
            timestamp: nowDisplay,
            actor: customer?.fullName || 'Customer User',
            role: 'Verified Customer',
            event: 'Self-service shipment consignment booked online via VELTRAX Customer Portal.',
            terminalCode: `${originCode}-HUB`,
          },
        ],
        priceBreakdown: {
          baseCharge: priceBreakdown.baseCharge,
          fuelCharge: priceBreakdown.fuelCharge,
          packingCharge: priceBreakdown.packingCharge,
          pickupCharge: priceBreakdown.pickupCharge,
          codFee: priceBreakdown.codFee,
          gstAmount: priceBreakdown.gstAmount,
          total: priceBreakdown.total,
        },
      };

      // 2. Create Customer Booking Record
      const newBookingRecord: BookingRecord = {
        bookingId: newBookingId,
        trackingId: newTrackingId,
        customerId,
        bookingDate: nowStr,
        originCity: formData.senderCity,
        destinationCity: formData.receiverCity,
        originState: formData.senderState,
        destinationState: formData.receiverState,
        cargoDescription: formData.itemDescription || formData.cargoCategory,
        cargoCategory: formData.cargoCategory,
        weightKg: Number(formData.weightKg) || 1,
        quantity: Number(formData.quantity) || 1,
        paymentMethod: formData.paymentMethod,
        totalAmount: priceBreakdown.total,
        status: 'confirmed',
        notes: formData.specialInstructions,
      };

      // 3. Save into central data layers
      saveShipment(newShipment);
      saveBooking(newBookingRecord);

      setConfirmedBooking({
        shipment: newShipment,
        booking: newBookingRecord,
      });
    } catch {
      setFormError('Failed to record consignment. Please check all fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully booked, render confirmation screen
  if (confirmedBooking) {
    const { shipment, booking } = confirmedBooking;
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-saas-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
            <IndustrialIcon name="check" size={32} />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Booking Confirmed & Manifest Created
          </span>

          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-2">
            Consignment Registered!
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Your shipment has been assigned to VELTRAX's domestic express corridor and linked to your customer account.
          </p>

          {/* Barcode & Key Identifiers */}
          <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tracking Number</div>
                <div className="text-2xl font-mono font-bold text-slate-900 tracking-tight">
                  {shipment.id}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Booking ID: {booking.bookingId} • LR: {shipment.billOfLading}
                </div>
              </div>

              <div className="bg-white p-2 border border-slate-200 rounded-lg shrink-0">
                <Barcode value={shipment.id} height={40} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Origin</span>
                <span className="font-bold text-slate-800">{shipment.sender.city}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Destination</span>
                <span className="font-bold text-slate-800">{shipment.receiver.city}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Delivery OTP</span>
                <span className="font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                  {shipment.deliveryOtp}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                <span className="font-bold text-slate-900">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/track?id=${shipment.id}`}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <IndustrialIcon name="search" size={14} />
              <span>Track Parcel Live</span>
            </Link>

            <Link
              to="/account/shipments"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <IndustrialIcon name="box" size={14} />
              <span>Go to My Shipments</span>
            </Link>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                setFormData(prev => ({
                  ...prev,
                  receiverName: '',
                  receiverCompany: '',
                  receiverMobile: '',
                  receiverAddress: '',
                }));
              }}
              className="w-full sm:w-auto border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all"
            >
              Book Another Consignment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
          Book Self-Service Shipment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Auto-populated sender information, saved address selection & transparent freight pricing
        </p>
      </div>

      {formError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3.5 flex items-start gap-2">
          <span className="text-rose-600 shrink-0 mt-0.5">
            <IndustrialIcon name="alert" size={15} />
          </span>
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: SENDER INFORMATION (Auto-populated from customer profile) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-wider">
                Sender Information (Dispatch Origin)
              </h2>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <IndustrialIcon name="check" size={11} />
              <span>Auto-filled from Profile</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sender Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Company / Shop Name
              </label>
              <input
                type="text"
                value={formData.senderCompany}
                onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.senderMobile}
                onChange={(e) => setFormData({ ...formData, senderMobile: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Street Address / Premises <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shop 44, Katra Neel, Chandni Chowk"
                value={formData.senderAddress}
                onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.senderPin}
                onChange={(e) => handleSenderPinChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.senderCity}
                onChange={(e) => setFormData({ ...formData, senderCity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State</label>
              <select
                value={formData.senderState}
                onChange={(e) => setFormData({ ...formData, senderState: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sender GST Number</label>
              <input
                type="text"
                placeholder="Optional"
                value={formData.senderGst}
                onChange={(e) => setFormData({ ...formData, senderGst: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg uppercase text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: RECEIVER INFORMATION & SAVED ADDRESS SELECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-wider">
                Receiver & Delivery Destination
              </h2>
            </div>

            {/* Saved Address Book Selector */}
            {receiverAddresses.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Select from Address Book:</span>
                <select
                  value={selectedReceiverId}
                  onChange={(e) => handleSelectReceiver(e.target.value)}
                  className="bg-orange-50 text-orange-900 border border-orange-200 text-xs px-2.5 py-1.5 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="custom">+ Enter New Receiver Address</option>
                  {receiverAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label} ({addr.city})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Receiver Contact Person <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amit Gupta"
                value={formData.receiverName}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Receiver Firm / Shop Name
              </label>
              <input
                type="text"
                placeholder="e.g. Gupta Cloth Emporium"
                value={formData.receiverCompany}
                onChange={(e) => setFormData({ ...formData, receiverCompany: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Receiver Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="9414088210"
                value={formData.receiverMobile}
                onChange={(e) => setFormData({ ...formData, receiverMobile: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Complete Delivery Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Shop No., Street, Market / Commercial Complex"
                value={formData.receiverAddress}
                onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Delivery PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.receiverPin}
                onChange={(e) => handleReceiverPinChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={formData.receiverCity}
                onChange={(e) => setFormData({ ...formData, receiverCity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State <span className="text-rose-500">*</span></label>
              <select
                value={formData.receiverState}
                onChange={(e) => setFormData({ ...formData, receiverState: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Landmark</label>
              <input
                type="text"
                placeholder="e.g. Near Sanganeri Gate"
                value={formData.receiverLandmark}
                onChange={(e) => setFormData({ ...formData, receiverLandmark: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Option to Save to Address Book */}
          {selectedReceiverId === 'custom' && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={saveReceiverToAddressBook}
                  onChange={(e) => setSaveReceiverToAddressBook(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span>Save this receiver to my Address Book for future quick bookings</span>
              </label>

              {saveReceiverToAddressBook && (
                <input
                  type="text"
                  placeholder="Address Label (e.g. Jaipur Depot)"
                  value={receiverLabel}
                  onChange={(e) => setReceiverLabel(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: PARCEL & CARGO SPECIFICATIONS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-wider">
              Cargo & Parcel Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cargo Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.cargoCategory}
                onChange={(e) => setFormData({ ...formData, cargoCategory: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="Box / Carton (Clothes & Garments)">Box / Carton (Clothes & Garments)</option>
                <option value="Textile Rolls & Yarn Bales">Textile Rolls & Yarn Bales</option>
                <option value="Electronics & IT Hardware">Electronics & IT Hardware</option>
                <option value="Industrial Spare Parts & Hardware">Industrial Spare Parts & Hardware</option>
                <option value="FMCG & Packaged Dry Goods">FMCG & Packaged Dry Goods</option>
                <option value="Printed Stationery & Books">Printed Stationery & Books</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Weight in Kilograms (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Number of Packages (Units) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Contents Description
              </label>
              <input
                type="text"
                placeholder="e.g. 5 boxes containing formal shirts and dress fabric"
                value={formData.itemDescription}
                onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Declared Invoice Value (₹)
              </label>
              <input
                type="number"
                value={formData.declaredValueInr}
                onChange={(e) => setFormData({ ...formData, declaredValueInr: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SPEED, PRICING & PAYMENT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-wider">
              Transit Priority, Pricing & Payment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speed & Mode Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Delivery Priority
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'standard', name: 'Standard Surface Cargo', time: '2-3 Business Days', rate: 'Regular' },
                    { id: 'next_day', name: 'Express Line-Haul Priority', time: 'Next Day Guarantee', rate: '+15%' },
                    { id: 'same_day', name: 'Critical Overnight Cargo', time: 'Earliest Morning Hub', rate: '+30%' },
                  ].map((speed) => (
                    <label
                      key={speed.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.deliverySpeed === speed.id
                          ? 'border-orange-500 bg-orange-50/50 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="deliverySpeed"
                          value={speed.id}
                          checked={formData.deliverySpeed === speed.id}
                          onChange={(e) => setFormData({ ...formData, deliverySpeed: e.target.value })}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{speed.name}</div>
                          <div className="text-[11px] text-slate-500">{speed.time}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded">
                        {speed.rate}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'cod', label: 'Cash on Delivery (COD)' },
                    { id: 'upi', label: 'UPI Instant (GPay / PhonePe)' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'netbanking', label: 'Corporate Netbanking' },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        formData.paymentMethod === pm.id
                          ? 'border-orange-500 bg-orange-50/60 text-orange-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={formData.paymentMethod === pm.id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMethod: e.target.value as 'upi' | 'cod' | 'card' | 'netbanking',
                          })
                        }
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span>{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Transparent Pricing Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Transparent Freight Tariff</span>
                  <span className="text-[10px] text-slate-400 font-normal">GST 18% Included</span>
                </div>

                <div className="space-y-2 text-xs border-b border-slate-200 pb-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Freight ({formData.weightKg} kg):</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(priceBreakdown.baseCharge)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fuel Surcharge:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(priceBreakdown.fuelCharge)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Doorstep Pickup Handling:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(priceBreakdown.pickupCharge)}</span>
                  </div>
                  {priceBreakdown.codFee > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Cash Handling Fee (COD):</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(priceBreakdown.codFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18% Integrated Tax):</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(priceBreakdown.gstAmount)}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Total Payable Amount</div>
                    <div className="text-[10px] text-slate-500">Official Waybill Receipt Guarantee</div>
                  </div>
                  <div className="text-2xl font-heading font-black text-slate-900">
                    {formatCurrency(priceBreakdown.total)}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Registering Consignment & Dispatch...</span>
                  </>
                ) : (
                  <>
                    <IndustrialIcon name="box" size={16} />
                    <span>Confirm Booking & Generate LR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerBookShipmentPage;
