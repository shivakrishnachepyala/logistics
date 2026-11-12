import React, { useState } from 'react';
import type { PhotoProof, ProblemReport } from '../../types';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';
import { addProblemReport } from '../../data/mockShipments';

interface PhotoProofCardProps {
  photoProof?: PhotoProof;
  shipmentId: string;
}

export const PhotoProofCard: React.FC<PhotoProofCardProps> = ({ photoProof, shipmentId }) => {
  const { lang } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [issueType, setIssueType] = useState<ProblemReport['issueType']>('damaged');
  const [description, setDescription] = useState('');
  const [mockPhotoName, setMockPhotoName] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const pickupPhoto = photoProof?.pickupPhotoUrl || '/assets/placeholder-pickup.png';
  const deliveryPhoto = photoProof?.deliveryPhotoUrl || '/assets/placeholder-delivery.png';
  const pickupTime = photoProof?.pickupTimestamp || '19/10/2026, 06:45 AM';
  const handedBy = photoProof?.pickupHandedBy || 'Ramesh Sharma (Sender)';
  const deliveryTime = photoProof?.deliveryTimestamp || '19/10/2026, 02:30 PM';
  const deliveredTo = photoProof?.deliveredTo || 'Amit Gupta (Receiver)';
  const otpVerified = photoProof?.otpVerified ?? true;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tktNum = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    addProblemReport({
      id: tktNum,
      shipmentId,
      issueType,
      description: description.trim() || 'Parcel damage or mismatch reported by consignee via digital proof card',
      submittedAt: new Date().toLocaleString('en-IN'),
      status: 'received'
    });
    setSubmittedTicket(tktNum);
  };

  return (
    <div className="bg-chalk border-[2px] border-asphalt p-4 sm:p-6 stamp font-body text-asphalt mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-asphalt pb-4 mb-4">
        <div>
          <div className="font-heading font-black text-xs text-orange tracking-widest uppercase">
            {lang === 'hi' ? 'डिजिटल प्रमाण (पक्का सबूत)' : 'VERIFIED PROOF OF CUSTODY'}
          </div>
          <h3 className="font-heading font-black text-2xl uppercase text-asphalt leading-tight">
            {lang === 'hi' ? 'पिकअप और डिलीवरी फोटो सबूत' : 'Photo Proof at Pickup & Delivery'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmittedTicket(null);
            setModalOpen(true);
          }}
          className="btn-industrial bg-paper text-orange border-[1.5px] border-orange hover:bg-orange hover:text-white text-xs px-3.5 py-2 stamp-sm flex items-center justify-center gap-1.5 min-h-[48px]"
        >
          <IndustrialIcon name="alert" size={16} />
          <span>{lang === 'hi' ? 'शिकायत दर्ज करें' : 'Report a problem'}</span>
        </button>
      </div>

      {/* Two Column Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pickup Photo Card */}
        <div className="border border-asphalt bg-paper p-3 rounded-[2px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-asphalt text-paper font-heading font-bold text-xs uppercase px-2 py-0.5">
                {lang === 'hi' ? '1. पिकअप फोटो' : '1. PICKUP PHOTO'}
              </span>
              <span className="font-mono text-[11px] text-teal font-bold flex items-center gap-1">
                <IndustrialIcon name="check" size={13} />
                <span>{lang === 'hi' ? 'जांच पूरी' : 'VERIFIED'}</span>
              </span>
            </div>

            {/* Photo preview with industrial technical overlay */}
            <div className="relative aspect-video bg-asphalt-soft border border-asphalt flex flex-col items-center justify-center text-paper overflow-hidden group">
              {photoProof?.pickupPhotoUrl ? (
                <img src={pickupPhoto} alt="Pickup proof" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#2A3036] flex flex-col items-center justify-center p-4 text-center">
                  <IndustrialIcon name="camera" size={32} className="text-yellow mb-2 opacity-80" />
                  <span className="font-mono text-xs text-yellow font-bold uppercase">
                    {lang === 'hi' ? 'पिकअप के समय ली गई तस्वीर' : 'PHOTO TAKEN AT SENDER LOCATION'}
                  </span>
                  <span className="text-[10px] text-steel-light mt-1 font-mono">
                    SEAL STICKER & CARTONS VERIFIED
                  </span>
                </div>
              )}
              {/* Timestamp watermarking */}
              <div className="absolute bottom-1.5 left-1.5 bg-asphalt/90 text-yellow font-mono text-[10px] px-2 py-0.5 border border-asphalt">
                GPS: DEL-OKH // {pickupTime}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-steel-border/50 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-steel">{lang === 'hi' ? 'सामान देने वाला:' : 'Handed over by:'}</span>
              <span className="font-bold text-asphalt">{handedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-steel">{lang === 'hi' ? 'पिकअप समय:' : 'Pickup time:'}</span>
              <span className="text-asphalt">{pickupTime}</span>
            </div>
          </div>
        </div>

        {/* Delivery Photo Card */}
        <div className="border border-asphalt bg-paper p-3 rounded-[2px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-asphalt text-paper font-heading font-bold text-xs uppercase px-2 py-0.5">
                {lang === 'hi' ? '2. डिलीवरी फोटो' : '2. DELIVERY PHOTO'}
              </span>
              {otpVerified ? (
                <span className="bg-teal text-white font-mono text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 border border-asphalt">
                  <IndustrialIcon name="check" size={12} />
                  <span>{lang === 'hi' ? 'ओटीपी सत्यापित' : 'OTP CONFIRMED'}</span>
                </span>
              ) : (
                <span className="text-steel text-[11px] font-mono">
                  {lang === 'hi' ? 'डिलीवरी बाकी' : 'Awaiting delivery'}
                </span>
              )}
            </div>

            {/* Delivery Photo preview */}
            <div className="relative aspect-video bg-asphalt-soft border border-asphalt flex flex-col items-center justify-center text-paper overflow-hidden">
              {photoProof?.deliveryPhotoUrl ? (
                <img src={deliveryPhoto} alt="Delivery proof" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#2A3036] flex flex-col items-center justify-center p-4 text-center">
                  <IndustrialIcon name="camera" size={32} className="text-teal mb-2 opacity-80" />
                  <span className="font-mono text-xs text-paper font-bold uppercase">
                    {lang === 'hi' ? 'डिलीवरी के समय ली गई तस्वीर' : 'PHOTO TAKEN AT DOORSTEP'}
                  </span>
                  <span className="text-[10px] text-steel-light mt-1 font-mono">
                    SAFE HANDOVER CONFIRMED
                  </span>
                </div>
              )}
              {/* Timestamp watermarking */}
              <div className="absolute bottom-1.5 left-1.5 bg-asphalt/90 text-yellow font-mono text-[10px] px-2 py-0.5 border border-asphalt">
                GPS: JPR-MAIN // {deliveryTime}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-steel-border/50 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-steel">{lang === 'hi' ? 'सामान लेने वाला:' : 'Received by:'}</span>
              <span className="font-bold text-asphalt">{deliveredTo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-steel">{lang === 'hi' ? 'डिलीवरी समय:' : 'Delivery time:'}</span>
              <span className="text-asphalt">{deliveryTime}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Report a Problem Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-asphalt/80 flex items-center justify-center p-4 select-none">
          <div className="bg-chalk border-[2px] border-asphalt max-w-lg w-full p-6 stamp-lg font-body relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-steel hover:text-asphalt font-mono text-xl font-bold w-8 h-8 flex items-center justify-center border border-asphalt bg-paper"
              aria-label="Close"
            >
              ×
            </button>

            <div className="font-heading font-black text-xs text-orange tracking-widest uppercase mb-1">
              {lang === 'hi' ? 'सहायता केंद्र' : 'CUSTOMER PROTECTION'}
            </div>
            <h3 className="font-heading font-black text-2xl uppercase text-asphalt mb-2">
              {lang === 'hi' ? 'पार्सल की समस्या दर्ज करें' : 'Report a Problem with Parcel'}
            </h3>
            <p className="text-xs text-steel mb-4">
              {lang === 'hi'
                ? 'पार्सल संख्या: ' + shipmentId + '। हम 2 घंटे में समाधान करेंगे।'
                : 'Shipment ' + shipmentId + '. Our support team investigates within 2 hours.'}
            </p>

            {submittedTicket ? (
              <div className="bg-teal text-white p-4 border border-asphalt stamp-sm space-y-2">
                <div className="flex items-center gap-2 font-heading font-black text-lg uppercase">
                  <IndustrialIcon name="check" size={20} />
                  <span>{lang === 'hi' ? 'शिकायत सफलतापूर्वक दर्ज हुई' : 'Complaint Registered'}</span>
                </div>
                <div className="font-mono text-xs">
                  {lang === 'hi' ? 'आपकी शिकायत संख्या (Ticket ID):' : 'Your Ticket Number:'}{' '}
                  <strong className="text-yellow text-sm underline">{submittedTicket}</strong>
                </div>
                <p className="text-xs text-paper/90">
                  {lang === 'hi'
                    ? 'अधिकारी का फोन आपके पास आएगा। आवश्यक होने पर पूरा रिफंड मिलेगा।'
                    : 'Our manager will contact you on your registered phone number.'}
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-industrial bg-paper text-asphalt hover:bg-chalk text-xs px-4 py-2 border border-asphalt mt-2 font-bold min-h-[44px]"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Close window'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-asphalt mb-1.5">
                    {lang === 'hi' ? 'समस्या क्या है?' : 'What is the problem?'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'damaged', label: lang === 'hi' ? 'सामान टूटा / खराब' : 'Damaged goods' },
                      { id: 'not_delivered', label: lang === 'hi' ? 'पार्सल नहीं मिला' : 'Not delivered' },
                      { id: 'wrong_parcel', label: lang === 'hi' ? 'गलत पार्सल मिला' : 'Wrong parcel' },
                      { id: 'other', label: lang === 'hi' ? 'अन्य कारण' : 'Other reason' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIssueType(opt.id as any)}
                        className={`p-2.5 text-left border-[1.5px] rounded-[2px] font-mono transition-all min-h-[44px] ${
                          issueType === opt.id
                            ? 'bg-asphalt text-paper border-asphalt font-bold stamp-sm'
                            : 'bg-paper text-asphalt border-steel-border hover:bg-chalk'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-asphalt mb-1">
                    {lang === 'hi' ? 'विवरण लिखें (छोटे शब्दों में)' : 'Details (Brief description)'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      lang === 'hi'
                        ? 'डिब्बा खुला मिला था या सामान कम था...'
                        : 'Carton was torn or seals broken...'
                    }
                    className="w-full bg-paper text-asphalt text-xs font-mono p-2.5 border-[1.5px] border-asphalt rounded-[2px] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-asphalt mb-1">
                    {lang === 'hi' ? 'खराब सामान या डिब्बे की फोटो जोड़ें' : 'Attach Photo of Goods / Box'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="problem-photo-input"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setMockPhotoName(file.name);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="problem-photo-input"
                      className="btn-industrial bg-paper text-asphalt hover:bg-chalk border border-asphalt text-xs px-3 py-2 cursor-pointer inline-flex items-center gap-1.5 min-h-[44px]"
                    >
                      <IndustrialIcon name="camera" size={16} />
                      <span>{lang === 'hi' ? 'फोटो चुनें' : 'Choose photo'}</span>
                    </label>
                    <span className="font-mono text-xs text-steel">
                      {mockPhotoName || (lang === 'hi' ? 'कोई फोटो नहीं चुनी' : 'Optional attachment')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-asphalt flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn-industrial bg-paper text-asphalt text-xs px-4 py-2 border border-asphalt hover:bg-chalk min-h-[48px]"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="btn-industrial bg-orange text-white text-xs px-5 py-2 border border-asphalt stamp-sm hover:bg-orange-hover min-h-[48px] flex items-center gap-1.5"
                  >
                    <IndustrialIcon name="check" size={16} />
                    <span>{lang === 'hi' ? 'शिकायत भेजें' : 'Submit complaint'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
