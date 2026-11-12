import React, { useState } from 'react';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';

interface OtpVerificationModalProps {
  deliveryOtp?: string;
  isDelivered?: boolean;
  onDelivered?: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  deliveryOtp = '4829',
  isDelivered = false,
  onDelivered,
}) => {
  const { lang } = useTranslation();
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() === deliveryOtp) {
      setSuccess(true);
      setErrorMsg('');
      if (onDelivered) {
        onDelivered();
      }
    } else {
      setErrorMsg(
        lang === 'hi'
          ? 'गलत ओटीपी कोड दर्ज किया गया। कृपया पार्सल पाने वाले से पूछें।'
          : 'Incorrect delivery code. Please check with receiver.'
      );
    }
  };

  return (
    <div className="bg-chalk border-[2px] border-asphalt p-4 sm:p-5 stamp mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Receiver Instruction */}
        <div className="space-y-1">
          <div className="font-heading font-black text-xs uppercase tracking-wider text-teal flex items-center gap-1.5">
            <IndustrialIcon name="lock" size={14} />
            <span>{lang === 'hi' ? 'ओटीपी सुरक्षित डिलीवरी कोड' : 'OTP SECURE DELIVERY CODE'}</span>
          </div>
          <h4 className="font-heading font-black text-xl text-asphalt uppercase leading-tight">
            {lang === 'hi' ? 'डिलीवरी कोड (केवल पार्सल मिलने पर बताएं)' : 'Delivery Code for Handover'}
          </h4>
          <p className="font-body text-xs text-steel max-w-md">
            {lang === 'hi'
              ? 'यह 4-अंकों का कोड डिलीवरी साथी को तभी बताएं जब पार्सल आपके हाथ में आ जाए।'
              : 'Tell this code to the delivery person only when you get your parcel.'}
          </p>
        </div>

        {/* Right: Code Display Badge & Simulation Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-paper border-2 border-asphalt px-4 py-2 text-center stamp-sm">
            <div className="text-[10px] text-steel font-heading font-bold uppercase">
              {lang === 'hi' ? 'आपका गुप्त कोड' : 'YOUR 4-DIGIT CODE'}
            </div>
            <div className="font-mono text-2xl font-black text-asphalt tracking-widest">
              {deliveryOtp}
            </div>
          </div>

          {isDelivered ? (
            <div className="bg-teal text-white border border-asphalt px-3.5 py-2.5 stamp-sm text-xs font-mono font-bold flex items-center gap-1.5 min-h-[48px]">
              <IndustrialIcon name="check" size={16} />
              <span>{lang === 'hi' ? 'ओटीपी सत्यापित' : 'OTP VERIFIED'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setInputCode('');
                setErrorMsg('');
                setTestModalOpen(true);
              }}
              className="btn-industrial bg-asphalt text-paper hover:bg-orange text-xs px-3.5 py-2.5 border border-asphalt stamp-sm min-h-[48px] flex items-center gap-1.5"
            >
              <IndustrialIcon name="check" size={14} />
              <span>{lang === 'hi' ? 'डिलीवरी टेस्ट करें' : 'Test Delivery OTP'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Driver Simulation Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-asphalt/80 flex items-center justify-center p-4 select-none">
          <div className="bg-chalk border-[2px] border-asphalt max-w-md w-full p-6 stamp-lg font-body relative">
            <button
              onClick={() => setTestModalOpen(false)}
              className="absolute top-4 right-4 text-steel hover:text-asphalt font-mono text-xl font-bold w-8 h-8 flex items-center justify-center border border-asphalt bg-paper"
              aria-label="Close"
            >
              ×
            </button>

            <div className="font-heading font-black text-xs text-orange tracking-widest uppercase mb-1">
              {lang === 'hi' ? 'डिलीवरी साथी स्क्रीन (डेमो)' : 'DELIVERY DRIVER SCREEN (DEMO)'}
            </div>
            <h3 className="font-heading font-black text-2xl uppercase text-asphalt mb-2">
              {lang === 'hi' ? 'डिलीवरी कोड दर्ज करें' : 'Enter Customer OTP Code'}
            </h3>
            <p className="text-xs text-steel mb-4">
              {lang === 'hi'
                ? `ग्राहक से कोड पूछें (डेमो कोड: ${deliveryOtp})`
                : `Ask customer for code (Demo code: ${deliveryOtp})`}
            </p>

            {success ? (
              <div className="bg-teal text-white p-4 border border-asphalt stamp-sm space-y-2">
                <div className="flex items-center gap-2 font-heading font-black text-lg uppercase">
                  <IndustrialIcon name="check" size={20} />
                  <span>{lang === 'hi' ? 'पार्सल सफलतापूर्वक डिलीवर हुआ!' : 'Parcel Successfully Delivered!'}</span>
                </div>
                <p className="text-xs text-paper/90">
                  {lang === 'hi'
                    ? 'ओटीपी मिलान सफल। भेजने वाले और पाने वाले दोनों को एसएमएस और व्हाट्सएप रसीद भेज दी गई है।'
                    : 'OTP matched. Digital receipt and WhatsApp SMS alert sent to sender and receiver.'}
                </p>
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="btn-industrial bg-paper text-asphalt hover:bg-chalk text-xs px-4 py-2 border border-asphalt mt-2 font-bold min-h-[44px]"
                >
                  {lang === 'hi' ? 'पूर्ण' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-asphalt mb-1">
                    {lang === 'hi' ? '4 अंकों का ओटीपी कोड *' : '4-Digit Delivery Code *'}
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="4829"
                    className="w-full bg-paper text-asphalt text-2xl font-mono text-center tracking-widest p-3 border-[2px] border-asphalt rounded-[2px] focus:outline-none focus:bg-white font-bold min-h-[48px]"
                  />
                  {errorMsg && (
                    <div className="text-xs text-orange font-mono font-bold mt-1.5 flex items-center gap-1">
                      <IndustrialIcon name="alert" size={14} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-asphalt flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(false)}
                    className="btn-industrial bg-paper text-asphalt text-xs px-4 py-2 border border-asphalt hover:bg-chalk min-h-[48px]"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="btn-industrial bg-orange text-white text-xs px-5 py-2 border border-asphalt stamp-sm hover:bg-orange-hover min-h-[48px] flex items-center gap-1.5"
                  >
                    <IndustrialIcon name="check" size={16} />
                    <span>{lang === 'hi' ? 'पुष्टि करें (Confirm)' : 'Confirm Delivery'}</span>
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
