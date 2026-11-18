import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { saveShipment } from '../data/mockShipments';
import type { Shipment, ServiceMode } from '../types';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { Barcode } from '../components/common/Barcode';
import { PriceBreakdown } from '../components/common/PriceBreakdown';
import { calculatePriceBreakdown } from '../services/pricingService';
import { useTranslation, InfoTooltip } from '../context/LanguageContext';
import { formatCurrency, lookupPinCode, INDIAN_STATES } from '../utils/indiaHelpers';

export const CreateShipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isManagerRoute = location.pathname.startsWith('/manager');
  const { lang, t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState('');

  // Form State with real Indian defaults (lazy initialized for purity)
  const [formData, setFormData] = useState(() => ({
    // Step 1: Sender (jo parcel bhej raha hai)
    senderName: 'Ramesh Sharma',
    senderCompany: 'Sharma Textiles & Garments',
    senderMobile: '9811044291',
    senderHouseNo: 'Shop No. 44',
    senderArea: 'Katra Neel, Chandni Chowk',
    senderLandmark: 'Near Town Hall',
    senderAddress: 'Shop No. 44, Katra Neel, Chandni Chowk',
    senderPin: '110006',
    senderCity: 'Delhi',
    senderState: 'Delhi',
    senderEmail: 'ramesh.sharma@sharmatextiles.in',
    senderGst: '07AAACS1102K1Z5',

    // Step 2: Receiver (jisko parcel milega)
    receiverName: 'Amit Gupta',
    receiverCompany: 'Gupta Cloth Emporium',
    receiverMobile: '9414088210',
    receiverHouseNo: 'Shop No. 12',
    receiverArea: 'Johari Bazar',
    receiverLandmark: 'Opposite Sanganeri Gate',
    receiverAddress: 'Shop No. 12, Johari Bazar',
    receiverPin: '302001',
    receiverCity: 'Jaipur',
    receiverState: 'Rajasthan',
    receiverEmail: 'amit.gupta@guptacloth.com',
    receiverGst: '',

    // Step 3: Parcel items & Weight
    cargoType: 'Box / Carton (Clothes & Garments)',
    itemDescription: 'Cotton shirts, sarees and dress materials',
    quantity: 12,
    weightKg: 45,
    weightGrams: 0,
    declaredValueInr: 65000,
    hazardous: false,
    temperatureControlled: false,
    sealNumber: `SEAL-FLX-${Math.floor(10000 + Math.random() * 90000)}`,

    // Step 4: Speed & Payment
    serviceMode: 'heavy_haul' as ServiceMode,
    priorityLevel: 'standard' as const,
    deliverySpeed: 'next_day', // standard, next_day, same_day
    paymentMethod: 'cod' as 'upi' | 'cod' | 'card' | 'netbanking',
    whatsappUpdates: true,
  }));

  const steps = [
    { num: 1, title: lang === 'hi' ? '1. भेजने वाला' : '1. SENDER' },
    { num: 2, title: lang === 'hi' ? '2. पाने वाला' : '2. RECEIVER' },
    { num: 3, title: lang === 'hi' ? '3. सामान व वजन' : '3. PARCEL WEIGHT' },
    { num: 4, title: lang === 'hi' ? '4. गति व भुगतान' : '4. PAYMENT' },
    { num: 5, title: lang === 'hi' ? '5. रसीद जांचें' : '5. CONFIRM' },
  ];

  // Dynamic price calculation based on transparent freight formulas
  const currentPriceBreakdown = calculatePriceBreakdown({
    weightKg: Number(formData.weightKg) || 0,
    weightGrams: Number(formData.weightGrams) || 0,
    speed: formData.deliverySpeed,
    paymentMethod: formData.paymentMethod,
    packingType: formData.cargoType,
  });

  // Auto-fill City & State on PIN code change
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

  const validateCurrentStep = (): boolean => {
    setFormError('');
    if (currentStep === 1) {
      if (!formData.senderName.trim()) {
        setFormError(lang === 'hi' ? 'कृपया भेजने वाले का नाम लिखें।' : 'Please enter the sender name.');
        return false;
      }
      if (formData.senderMobile.replace(/\D/g, '').length < 10) {
        setFormError(lang === 'hi' ? 'कृपया भेजने वाले का 10 अंकों का सही मोबाइल नंबर दर्ज करें।' : 'Please enter a 10 digit mobile number for sender.');
        return false;
      }
      if (formData.senderPin.length < 6) {
        setFormError(lang === 'hi' ? 'कृपया 6 अंकों का पिन कोड दर्ज करें।' : 'Please enter a 6-digit PIN code.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.receiverName.trim()) {
        setFormError(lang === 'hi' ? 'कृपया पार्सल पाने वाले का नाम लिखें।' : 'Please enter the receiver name.');
        return false;
      }
      if (formData.receiverMobile.replace(/\D/g, '').length < 10) {
        setFormError(lang === 'hi' ? 'कृपया पाने वाले का 10 अंकों का सही मोबाइल नंबर दर्ज करें।' : 'Please enter a 10 digit mobile number for receiver.');
        return false;
      }
      if (formData.receiverPin.length < 6) {
        setFormError(lang === 'hi' ? 'कृपया 6 अंकों का पिन कोड दर्ज करें।' : 'Please enter a 6-digit PIN code for receiver.');
        return false;
      }
    } else if (currentStep === 3) {
      if (formData.weightKg <= 0 && formData.weightGrams <= 0) {
        setFormError(lang === 'hi' ? 'कृपया पार्सल का वजन दर्ज करें (कम से कम 1 किलो या 500 ग्राम)।' : 'Please enter parcel weight.');
        return false;
      }
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setFormError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    const randomIdSuffix = Math.floor(1000 + Math.random() * 9000);
    const destCode = (formData.receiverCity || 'JPR').slice(0, 3).toUpperCase();
    const newId = `FLX-${randomIdSuffix}-${destCode}`;
    const newBol = `LR-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const totalWeightKg = Number(formData.weightKg) + (Number(formData.weightGrams) / 1000);

    const newShipment: Shipment = {
      id: newId,
      billOfLading: newBol,
      bookingRef: `BKG-${destCode}-${Math.floor(10000 + Math.random() * 90000)}`,
      originHub: `${formData.senderCity} Parcel Centre (${formData.senderArea || formData.senderPin})`,
      originHubCode: `${formData.senderCity.slice(0, 3).toUpperCase()}-HUB`,
      destinationHub: `${formData.receiverCity} Delivery Centre (${formData.receiverArea || formData.receiverPin})`,
      destinationHubCode: `${destCode}-MAIN`,
      serviceMode: formData.serviceMode,
      status: 'pending',
      progressPercent: 5,
      eta: '2026-10-21 16:00',
      dispatchedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      carrier: 'VELTRAX Express Cargo India',
      vesselOrFlight: 'Tata 407 (Doorstep Collection Vehicle)',
      priorityLevel: formData.priorityLevel,
      customsStatus: 'pre_approved',
      paymentMethod: formData.paymentMethod,
      whatsappUpdates: formData.whatsappUpdates,
      deliveryTimeEstimate: lang === 'hi' ? 'कल शाम तक पहुंचेगा (21/10/2026)' : 'Reaches by tomorrow evening (21/10/2026)',
      sender: {
        name: formData.senderName,
        company: formData.senderCompany || formData.senderName,
        houseNo: formData.senderHouseNo,
        area: formData.senderArea,
        landmark: formData.senderLandmark,
        address: `${formData.senderHouseNo}, ${formData.senderArea}, ${formData.senderLandmark}`,
        city: formData.senderCity,
        state: formData.senderState,
        country: 'India',
        postalCode: formData.senderPin,
        contactEmail: formData.senderEmail || 'support@veltrax.in',
        contactPhone: `+91 ${formData.senderMobile}`,
        taxIdOrEori: formData.senderGst,
      },
      receiver: {
        name: formData.receiverName,
        company: formData.receiverCompany || formData.receiverName,
        houseNo: formData.receiverHouseNo,
        area: formData.receiverArea,
        landmark: formData.receiverLandmark,
        address: `${formData.receiverHouseNo}, ${formData.receiverArea}, ${formData.receiverLandmark}`,
        city: formData.receiverCity,
        state: formData.receiverState,
        country: 'India',
        postalCode: formData.receiverPin,
        contactEmail: formData.receiverEmail || 'support@veltrax.in',
        contactPhone: `+91 ${formData.receiverMobile}`,
        taxIdOrEori: formData.receiverGst,
      },
      cargo: {
        type: formData.cargoType,
        quantity: Number(formData.quantity) || 1,
        weightKg: totalWeightKg,
        weightGrams: Number(formData.weightGrams) || 0,
        volumeCbm: 1.5,
        declaredValueInr: Number(formData.declaredValueInr) || 10000,
        hazardous: formData.hazardous,
        sealNumber: formData.sealNumber,
        temperatureControlled: formData.temperatureControlled,
      },
      checkpoints: [
        {
          id: 'CP-NEW-1',
          location: `${formData.senderCity} Booking & Collection Centre`,
          city: formData.senderCity,
          country: 'India',
          timestamp: 'Scheduled Today',
          status: 'pending',
          facilityCode: `${formData.senderCity.slice(0, 3).toUpperCase()}-01`,
          description: lang === 'hi' ? 'पार्सल बुकिंग दर्ज हुई। डिलीवरी साथी पिकअप के लिए रवाना हो रहा है।' : 'Parcel booking confirmed. Pickup partner assigned to collect from your address.',
          completed: true,
          isCurrent: true,
        },
        {
          id: 'CP-NEW-2',
          location: `${formData.receiverCity} Delivery Centre`,
          city: formData.receiverCity,
          country: 'India',
          timestamp: 'Expected Tomorrow',
          status: 'pending',
          facilityCode: `${destCode}-01`,
          description: lang === 'hi' ? 'पाने वाले व्यक्ति को सुरक्षित डिलीवरी और हस्ताक्षर पावती।' : 'Doorstep delivery to receiver and delivery proof sign-off.',
          completed: false,
        },
      ],
      documents: [
        {
          id: 'DOC-NEW-1',
          title: 'Parcel Delivery Receipt (Bilty / LR)',
          type: 'Bill of Lading',
          docNumber: newBol,
          issuedDate: new Date().toLocaleDateString('en-IN'),
          fileSize: '340 KB',
          status: 'verified',
        },
      ],
      activities: [
        {
          id: 'ACT-NEW-1',
          timestamp: 'Just now',
          actor: 'Online Booking Desk',
          role: 'Customer Care',
          event: `Parcel booked successfully. Bilty LR number ${newBol} generated.`,
          terminalCode: `${formData.senderCity.slice(0, 3).toUpperCase()}-WEB`,
        },
      ],
      priceBreakdown: currentPriceBreakdown,
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      deliveryPromise: {
        confidencePercent: 92,
        promisedDay: formData.deliverySpeed === 'same_day' ? 'Today' : 'Tomorrow',
        promisedDate: '21/10/2026',
        description: 'Estimated on-time performance on this route',
      },
      photoProof: {
        pickupTimestamp: 'Scheduled today upon doorstep collection',
        pickupHandedBy: formData.senderName,
        deliveryTimestamp: 'Expected tomorrow',
        deliveredTo: formData.receiverName,
        otpVerified: false,
      },
    };

    saveShipment(newShipment);
    navigate(isManagerRoute ? `/manager/shipment/${newId}` : `/track?id=${newId}`);
  };

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
              {t('create.sub')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {t('create.title')}
            </h1>
          </div>
          <Link
            to={isManagerRoute ? '/manager/shipments' : '/'}
            className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <span>← {lang === 'hi' ? 'रद्द करें / वापस' : 'Cancel & Back'}</span>
          </Link>
        </div>

        {/* Step Banner */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl text-sm font-semibold flex items-center justify-between mb-4 shadow-xs">
          <span>
            {currentStep === 1 && t('create.step1')}
            {currentStep === 2 && t('create.step2')}
            {currentStep === 3 && t('create.step3')}
            {currentStep === 4 && t('create.step4')}
            {currentStep === 5 && t('create.step5')}
          </span>
          <span className="text-orange-400 text-xs font-mono font-bold">
            STEP {currentStep} / 5
          </span>
        </div>

        {/* Multi-Step Indicator Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px]">
            {steps.map((st, idx) => {
              const isPast = st.num < currentStep;
              const isCurrent = st.num === currentStep;

              return (
                <React.Fragment key={st.num}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-orange-500 text-white shadow-xs'
                          : isPast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPast ? '✓' : `0${st.num}`}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-slate-900' : isPast ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="h-[2px] w-6 sm:w-10 bg-slate-200"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error notification banner if any */}
        {formError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-6 flex items-center gap-2 text-rose-700 text-xs font-semibold">
            <IndustrialIcon name="alert" size={18} className="text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleNext}>
            
            {/* STEP 1: SENDER (JO PARCEL BHEJ RAHA HAI) */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-asphalt pb-3 mb-4">
                  <h2 className="font-heading font-black text-xl uppercase text-asphalt flex items-center gap-2">
                    <span>{t('term.sender')}</span>
                    <InfoTooltip text="The person or business sending the parcel. We will collect from this address." />
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-steel mt-0.5 font-medium">
                    {t('term.senderHelper')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'भेजने वाले का नाम *' : 'Sender Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'hi' ? 'जैसे: रमेश शर्मा' : 'E.G. RAMESH SHARMA'}
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {lang === 'hi' ? 'जिस व्यक्ति से पार्सल लिया जाएगा' : 'Person from whom parcel will be collected'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number (for Pickup Call) *'}
                      <InfoTooltip text="Our driver will call this number when arriving for collection." />
                    </label>
                    <div className="flex">
                      <span className="bg-[#EAE5D9] text-asphalt px-2.5 py-2.5 border-[1.5px] border-r-0 border-asphalt font-mono text-xs flex items-center font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98110 44291"
                        value={formData.senderMobile}
                        onChange={(e) => setFormData({ ...formData, senderMobile: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-r-[2px] font-mono focus:outline-none focus:bg-white min-h-[44px]"
                      />
                    </div>
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {lang === 'hi' ? '10 अंकों का फोन नंबर (पिकअप के समय फोन आएगा)' : '10-digit mobile number for pickup call'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'दुकान या व्यापार का नाम (वैकल्पिक)' : 'Shop or Business Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'जैसे: शर्मा वस्त्र भंडार' : 'E.G. SHARMA TEXTILES'}
                      value={formData.senderCompany}
                      onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {t('term.gstOptional')}
                    </label>
                    <input
                      type="text"
                      placeholder="07AAACS1102K1Z5"
                      value={formData.senderGst}
                      onChange={(e) => setFormData({ ...formData, senderGst: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {lang === 'hi' ? 'यदि आप व्यापारी हैं तो जीएसटी भरें, आम नागरिक खाली छोड़ सकते हैं' : 'Only if you need GST tax invoice; otherwise leave blank'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'मकान / दुकान नंबर *' : 'House / Shop No. *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Shop No. 44"
                      value={formData.senderHouseNo}
                      onChange={(e) => setFormData({ ...formData, senderHouseNo: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'गली / इलाका / बाजार *' : 'Area / Street / Market *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Katra Neel, Chandni Chowk"
                      value={formData.senderArea}
                      onChange={(e) => setFormData({ ...formData, senderArea: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'पहचान स्थल (Landmark)' : 'Landmark (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="Near Town Hall"
                      value={formData.senderLandmark}
                      onChange={(e) => setFormData({ ...formData, senderLandmark: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? '6-अंकों का पिन कोड *' : '6-Digit PIN Code *'}
                      <InfoTooltip text="Enter PIN code to automatically detect your city and state." />
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="110006"
                      value={formData.senderPin}
                      onChange={(e) => handleSenderPinChange(e.target.value)}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-sm uppercase focus:outline-none focus:bg-white font-bold min-h-[44px]"
                    />
                    <span className="text-[10px] text-teal font-bold mt-0.5 block">
                      {lang === 'hi' ? 'पिन डालते ही शहर अपने आप भर जाएगा' : 'City & State auto-filled from PIN'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'शहर / जिला *' : 'City / District *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Delhi"
                      value={formData.senderCity}
                      onChange={(e) => setFormData({ ...formData, senderCity: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'राज्य *' : 'State *'}
                    </label>
                    <select
                      value={formData.senderState}
                      onChange={(e) => setFormData({ ...formData, senderState: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs focus:outline-none focus:bg-white min-h-[44px]"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: RECEIVER (JISKO PARCEL MILEGA) */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-asphalt pb-3 mb-4">
                  <h2 className="font-heading font-black text-xl uppercase text-asphalt flex items-center gap-2">
                    <span>{t('term.receiver')}</span>
                    <InfoTooltip text="The person who will receive the parcel and sign for it." />
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-steel mt-0.5 font-medium">
                    {t('term.receiverHelper')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'पाने वाले का नाम *' : 'Receiver Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'hi' ? 'जैसे: अमित गुप्ता' : 'E.G. AMIT GUPTA'}
                      value={formData.receiverName}
                      onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {lang === 'hi' ? 'जिस व्यक्ति को पार्सल सौंपा जाएगा' : 'Person who will receive parcel at destination'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'पाने वाले का मोबाइल नंबर *' : 'Receiver Mobile (for Delivery Call) *'}
                      <InfoTooltip text="Driver will call this number before reaching delivery address." />
                    </label>
                    <div className="flex">
                      <span className="bg-[#EAE5D9] text-asphalt px-2.5 py-2.5 border-[1.5px] border-r-0 border-asphalt font-mono text-xs flex items-center font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="94140 88210"
                        value={formData.receiverMobile}
                        onChange={(e) => setFormData({ ...formData, receiverMobile: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-r-[2px] font-mono focus:outline-none focus:bg-white min-h-[44px]"
                      />
                    </div>
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {lang === 'hi' ? 'डिलीवरी के समय ओटीपी और कॉल इसी नंबर पर आएगा' : 'Delivery call and OTP will be sent to this number'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'दुकान या व्यापार का नाम (वैकल्पिक)' : 'Shop or Business Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'जैसे: गुप्ता वस्त्र भंडार' : 'E.G. GUPTA CLOTH EMPORIUM'}
                      value={formData.receiverCompany}
                      onChange={(e) => setFormData({ ...formData, receiverCompany: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {t('term.gstOptional')}
                    </label>
                    <input
                      type="text"
                      placeholder="08AAACG4928R1ZK"
                      value={formData.receiverGst}
                      onChange={(e) => setFormData({ ...formData, receiverGst: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'मकान / दुकान नंबर *' : 'House / Shop No. *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Shop No. 12"
                      value={formData.receiverHouseNo}
                      onChange={(e) => setFormData({ ...formData, receiverHouseNo: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'गली / इलाका / बाजार *' : 'Area / Street / Market *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Johari Bazar"
                      value={formData.receiverArea}
                      onChange={(e) => setFormData({ ...formData, receiverArea: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'पहचान स्थल (Landmark)' : 'Landmark (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="Near Sanganeri Gate"
                      value={formData.receiverLandmark}
                      onChange={(e) => setFormData({ ...formData, receiverLandmark: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? '6-अंकों का पिन कोड *' : '6-Digit PIN Code *'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="302001"
                      value={formData.receiverPin}
                      onChange={(e) => handleReceiverPinChange(e.target.value)}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-sm uppercase focus:outline-none focus:bg-white font-bold min-h-[44px]"
                    />
                    <span className="text-[10px] text-teal font-bold mt-0.5 block">
                      {lang === 'hi' ? 'पिन डालते ही शहर अपने आप भर जाएगा' : 'City & State auto-filled from PIN'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'शहर / जिला *' : 'City / District *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jaipur"
                      value={formData.receiverCity}
                      onChange={(e) => setFormData({ ...formData, receiverCity: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'राज्य *' : 'State *'}
                    </label>
                    <select
                      value={formData.receiverState}
                      onChange={(e) => setFormData({ ...formData, receiverState: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs focus:outline-none focus:bg-white min-h-[44px]"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PARCEL ITEMS & WEIGHT */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-asphalt pb-3 mb-4">
                  <h2 className="font-heading font-black text-xl uppercase text-asphalt">
                    {lang === 'hi' ? 'पार्सल में क्या सामान है और कितना वजन है?' : 'PARCEL DETAILS & WEIGHT'}
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-steel mt-0.5 font-medium">
                    {lang === 'hi' ? 'सटीक वजन बताएं ताकि गाड़ी में सही जगह मिल सके।' : 'Enter weight in kilograms (kg) and grams.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'पैकिंग का प्रकार *' : 'Packing Type *'}
                    </label>
                    <select
                      value={formData.cargoType}
                      onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs focus:outline-none focus:bg-white min-h-[44px]"
                    >
                      <option value="Box / Carton (Clothes, Hardware, Books)">Box / Carton (Clothes, Hardware, Books)</option>
                      <option value="Gunny Sack / Bori (Grain, Seeds, Flour)">Gunny Sack / Bori (Grain, Seeds, Flour)</option>
                      <option value="Wooden Box (Tools, Fragile Machinery)">Wooden Box (Tools, Fragile Machinery)</option>
                      <option value="Cold Storage Box (Medicines, Fruits)">Cold Storage Box (Medicines, Fruits)</option>
                      <option value="Small Truck Load (Tata 407 / Eicher)">Small Truck Load (Tata 407 / Eicher)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'बक्सों / बोरियों की संख्या *' : 'Number of Boxes / Bags *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs focus:outline-none focus:bg-white min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'वजन (किलोग्राम / KG) *' : 'Weight in Kilograms (KG) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs focus:outline-none focus:bg-white min-h-[44px]"
                    />
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {lang === 'hi' ? 'जैसे: 45 किलोग्राम' : 'e.g. 45 kg'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'अतिरिक्त ग्राम (Grams)' : 'Extra Grams (Optional)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      step="50"
                      value={formData.weightGrams}
                      onChange={(e) => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs focus:outline-none focus:bg-white min-h-[44px]"
                    />
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {lang === 'hi' ? 'जैसे: 500 ग्राम' : 'e.g. 500 grams'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                      {lang === 'hi' ? 'सामान का घोषित मूल्य (₹) *' : 'Value of Goods (₹ INR) *'}
                      <InfoTooltip text="Approximate value of goods for safety receipt and transit insurance." />
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.declaredValueInr}
                      onChange={(e) => setFormData({ ...formData, declaredValueInr: Number(e.target.value) })}
                      className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs focus:outline-none focus:bg-white min-h-[44px]"
                    />
                    <span className="text-[10px] text-steel mt-0.5 block">
                      {formatCurrency(formData.declaredValueInr || 0)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-1">
                    {lang === 'hi' ? 'पार्सल में क्या सामान है? (विवरण)' : 'What is inside the parcel?'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? 'जैसे: सूती कमीजें, साड़ियां, किराना सामान' : 'E.G. COTTON SHIRTS, SAREES, GROCERY'}
                    value={formData.itemDescription}
                    onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                    className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt font-mono text-xs uppercase focus:outline-none focus:bg-white min-h-[44px]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer font-heading font-bold text-xs uppercase text-asphalt">
                    <input
                      type="checkbox"
                      checked={formData.hazardous}
                      onChange={(e) => setFormData({ ...formData, hazardous: e.target.checked })}
                      className="w-4 h-4 rounded-none border border-asphalt text-orange focus:ring-0"
                    />
                    <span>{lang === 'hi' ? 'बैटरी / केमिकल या कांच का सामान (विशेष देखभाल)' : 'Items needing special care (battery, chemical, glass)'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-heading font-bold text-xs uppercase text-asphalt">
                    <input
                      type="checkbox"
                      checked={formData.temperatureControlled}
                      onChange={(e) => setFormData({ ...formData, temperatureControlled: e.target.checked })}
                      className="w-4 h-4 rounded-none border border-asphalt text-teal focus:ring-0"
                    />
                    <span>{lang === 'hi' ? 'ठंडा तापमान जरूरी है (दवाएं / फल)' : 'Keep Cold (Medicines / Fruits)'}</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: SPEED & PAYMENT */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-asphalt pb-3 mb-4">
                  <h2 className="font-heading font-black text-xl uppercase text-asphalt">
                    {lang === 'hi' ? 'डिलीवरी की गति और भुगतान का तरीका' : 'DELIVERY SPEED & PAYMENT METHOD'}
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-steel mt-0.5 font-medium">
                    {lang === 'hi' ? 'चुनें कि पार्सल कब पहुंचाना है और भुगतान कैसे करेंगे।' : 'Choose when you want the parcel delivered and how to pay.'}
                  </p>
                </div>

                {/* Delivery Speed Options */}
                <div>
                  <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-2">
                    {lang === 'hi' ? 'डिलीवरी की गति चुनें:' : 'SELECT DELIVERY SPEED:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'next_day', title: lang === 'hi' ? 'अगले दिन डिलीवरी' : 'Next Day Delivery', time: '1 Day (Standard)', price: '₹650' },
                      { id: 'standard', title: lang === 'hi' ? 'किफायती सामान्य गति' : 'Standard Economy', time: '2 to 3 Days', price: '₹420' },
                      { id: 'same_day', title: lang === 'hi' ? 'उसी दिन सुपरफास्ट' : 'Same Day Express', time: '12 Hours (Selected cities)', price: '₹950' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, deliverySpeed: opt.id })}
                        className={`p-3.5 border-[1.5px] text-left transition-all duration-150 rounded-[2px] min-h-[64px] ${
                          formData.deliverySpeed === opt.id
                            ? 'bg-asphalt text-paper border-asphalt stamp-sm'
                            : 'bg-paper text-asphalt border-steel-border hover:bg-chalk'
                        }`}
                      >
                        <div className="font-heading font-black text-sm uppercase">{opt.title}</div>
                        <div className="font-mono text-xs text-steel mt-0.5">{opt.time} • <strong className="text-yellow">{opt.price}</strong></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block font-heading font-bold uppercase text-xs text-asphalt mb-2">
                    {lang === 'hi' ? 'भुगतान का तरीका चुनें:' : 'SELECT PAYMENT OPTION:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'cod', title: lang === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery (COD)', desc: lang === 'hi' ? 'सामान मिलने पर नकद दें' : 'Pay when delivered' },
                      { id: 'upi', title: 'UPI (GPay / PhonePe / Paytm)', desc: lang === 'hi' ? 'ऑनलाइन मोबाइल से तुरंत' : 'Instant phone payment' },
                      { id: 'card', title: 'Debit / Credit Card', desc: lang === 'hi' ? 'कार्ड द्वारा भुगतान' : 'Pay via ATM card' },
                      { id: 'netbanking', title: 'Net Banking', desc: lang === 'hi' ? 'सीधे बैंक खाते से' : 'Direct bank transfer' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: m.id as any })}
                        className={`p-3 border-[1.5px] text-left transition-all duration-150 rounded-[2px] min-h-[64px] ${
                          formData.paymentMethod === m.id
                            ? 'bg-orange text-white border-asphalt stamp-sm'
                            : 'bg-paper text-asphalt border-steel-border hover:bg-chalk'
                        }`}
                      >
                        <div className="font-heading font-black text-xs uppercase">{m.title}</div>
                        <div className={`font-body text-[11px] mt-0.5 ${formData.paymentMethod === m.id ? 'text-white/90' : 'text-steel'}`}>
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Updates Checkbox */}
                <div className="bg-[#EAF3F1] border-[1.5px] border-teal p-3.5 rounded-[2px] flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.whatsappUpdates}
                      onChange={(e) => setFormData({ ...formData, whatsappUpdates: e.target.checked })}
                      className="w-4 h-4 rounded-none border border-teal text-teal focus:ring-0"
                    />
                    <span className="font-heading font-bold text-xs uppercase text-teal">
                      {t('term.whatsapp')}
                    </span>
                  </label>
                  <span className="font-mono text-[11px] text-teal font-semibold hidden sm:inline">
                    +91 {formData.senderMobile || '98110 44291'}
                  </span>
                </div>

                {/* Fully Transparent Price Breakdown (Phase 1 Requirement) */}
                <div className="pt-2">
                  <PriceBreakdown
                    breakdown={currentPriceBreakdown}
                    isCod={formData.paymentMethod === 'cod'}
                  />
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & ISSUE RECEIPT */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-asphalt pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading font-black text-xl uppercase text-asphalt">
                        {lang === 'hi' ? 'पार्सल रसीद की जांच करें (पक्की बिलती)' : 'REVIEW PARCEL RECEIPT DETAILS (BILTY)'}
                      </h2>
                      <p className="font-body text-xs sm:text-sm text-steel mt-0.5 font-medium">
                        {lang === 'hi' ? 'सभी जानकारी जांचें। पुष्टि करने पर रसीद नंबर जारी होगा।' : 'Check all details carefully before booking.'}
                      </p>
                    </div>
                    <span className="bg-yellow text-asphalt font-mono text-xs px-2.5 py-1 font-bold border border-asphalt">
                      {lang === 'hi' ? 'तैयार है' : 'READY TO BOOK'}
                    </span>
                  </div>
                </div>

                {/* Printed Bill of Lading Manifest Preview Card */}
                <div className="bg-paper border-[2px] border-asphalt p-6 stamp font-mono text-xs relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-asphalt pb-4 mb-4 gap-4">
                    <div>
                      <div className="font-heading font-black text-2xl uppercase tracking-tight text-asphalt">
                        VELTRAX PARCEL RECEIPT // पक्की बिल्टी
                      </div>
                      <div className="text-[11px] text-steel">
                        SAFE PARCEL CARRIAGE UNDER GOODS TRANSPORT RULES
                      </div>
                    </div>
                    <Barcode value="FLXNEWPARCEL" subtext="VERIFIED RECEIPT" height={34} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-asphalt pb-4 mb-4">
                    <div className="border-r sm:border-r border-steel-border pr-2">
                      <div className="font-heading font-bold uppercase text-[11px] text-steel mb-1">
                        1. {t('term.sender')}
                      </div>
                      <div className="font-bold text-asphalt">{formData.senderName} ({formData.senderCompany})</div>
                      <div>{formData.senderHouseNo}, {formData.senderArea}</div>
                      <div>{formData.senderCity}, {formData.senderState} - {formData.senderPin}</div>
                      <div className="text-steel">PHONE: +91 {formData.senderMobile}</div>
                      {formData.senderGst && <div className="text-teal font-semibold">GST: {formData.senderGst}</div>}
                    </div>

                    <div>
                      <div className="font-heading font-bold uppercase text-[11px] text-steel mb-1">
                        2. {t('term.receiver')}
                      </div>
                      <div className="font-bold text-asphalt">{formData.receiverName} ({formData.receiverCompany})</div>
                      <div>{formData.receiverHouseNo}, {formData.receiverArea}</div>
                      <div>{formData.receiverCity}, {formData.receiverState} - {formData.receiverPin}</div>
                      <div className="text-steel">PHONE: +91 {formData.receiverMobile}</div>
                      {formData.receiverGst && <div className="text-teal font-semibold">GST: {formData.receiverGst}</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-asphalt pb-4 mb-4">
                    <div>
                      <div className="text-[10px] text-steel uppercase font-heading font-bold">{lang === 'hi' ? 'कहाँ से' : 'FROM CITY'}</div>
                      <div className="font-bold text-asphalt mt-0.5">{formData.senderCity}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-steel uppercase font-heading font-bold">{lang === 'hi' ? 'कहाँ तक' : 'TO CITY'}</div>
                      <div className="font-bold text-asphalt mt-0.5">{formData.receiverCity}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-steel uppercase font-heading font-bold">{lang === 'hi' ? 'कुल वजन' : 'TOTAL WEIGHT'}</div>
                      <div className="font-bold text-asphalt mt-0.5">{formData.weightKg} KG {formData.weightGrams ? `+ ${formData.weightGrams}g` : ''}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-steel uppercase font-heading font-bold">{lang === 'hi' ? 'भुगतान तरीका' : 'PAYMENT'}</div>
                      <div className="font-bold text-teal mt-0.5 uppercase">
                        {formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI Online'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <div className="text-[10px] text-steel uppercase font-heading font-bold">{lang === 'hi' ? 'सामान' : 'ITEMS'}</div>
                      <div className="font-bold text-asphalt mt-0.5">{formData.cargoType} ({formData.quantity} Units)</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-steel uppercase font-heading font-bold">{lang === 'hi' ? 'घोषित मूल्य' : 'DECLARED VALUE'}</div>
                      <div className="font-bold text-asphalt mt-0.5">{formatCurrency(formData.declaredValueInr)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-steel uppercase font-heading font-bold">{lang === 'hi' ? 'व्हाट्सएप अपडेट' : 'WHATSAPP'}</div>
                      <div className="font-bold text-teal mt-0.5">ACTIVE ON +91 {formData.senderMobile}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-asphalt flex items-center justify-between text-[10px] text-steel">
                    <div>{lang === 'hi' ? 'गारंटी: सुरक्षित डोरस्टेप डिलीवरी और फोटो रसीद।' : 'Doorstep collection & digital photo proof guaranteed.'}</div>
                    <div className="font-bold text-asphalt">DIGITAL BILTY READY</div>
                  </div>
                </div>

                {/* Transparent Price Breakdown on Confirm Step (Phase 1 Requirement) */}
                <PriceBreakdown
                  breakdown={currentPriceBreakdown}
                  isCod={formData.paymentMethod === 'cod'}
                />
              </div>
            )}

            {/* Bottom Form Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-asphalt flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-industrial bg-paper text-asphalt text-xs px-5 py-3 border-[1.5px] border-asphalt hover:bg-chalk min-h-[48px] flex items-center gap-1.5"
                >
                  <span>{t('create.prev')}</span>
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                className="btn-industrial bg-orange text-white text-xs px-6 py-3 border-[1.5px] border-asphalt stamp-sm hover:bg-orange-hover flex items-center gap-2 min-h-[48px]"
              >
                {currentStep === 5 ? (
                  <>
                    <IndustrialIcon name="check" size={16} />
                    <span>{t('create.confirm')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('create.next')}</span>
                    <IndustrialIcon name="arrow-right" size={14} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
