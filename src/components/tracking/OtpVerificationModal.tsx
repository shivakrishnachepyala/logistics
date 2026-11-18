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
          : 'Incorrect delivery code. Please verify with consignee.'
      );
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Receiver Instruction */}
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <IndustrialIcon name="lock" size={14} />
            <span>{lang === 'hi' ? 'ओटीपी सुरक्षित डिलीवरी कोड' : 'Consignee Security Handover'}</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {lang === 'hi' ? 'डिलीवरी कोड (केवल पार्सल मिलने पर बताएं)' : 'Secure Handover Delivery OTP'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            {lang === 'hi'
              ? 'यह 4-अंकों का कोड डिलीवरी साथी को तभी बताएं जब पार्सल आपके हाथ में आ जाए और जांच लें।'
              : 'Provide this 4-digit security code to the driver only upon physical receipt and verification.'}
          </p>
        </div>

        {/* Right: Code Display Badge & Simulation Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-center shadow-2xs min-w-[120px]">
            <div className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
              {lang === 'hi' ? 'आपका कोड' : 'YOUR OTP'}
            </div>
            <div className="font-mono text-2xl font-black text-slate-900 dark:text-white tracking-widest">
              {deliveryOtp}
            </div>
          </div>

          {isDelivered ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <IndustrialIcon name="check" size={16} />
              <span>{lang === 'hi' ? 'ओटीपी सत्यापित' : 'Handover Verified'}</span>
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
              className="bg-slate-900 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <IndustrialIcon name="check" size={14} />
              <span>{lang === 'hi' ? 'डिलीवरी टेस्ट करें' : 'Simulate Delivery OTP'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Driver Simulation Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-800 dark:text-slate-200">
            <button
              onClick={() => setTestModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>

            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'डिलीवरी साथी स्क्रीन (डेमो)' : 'Delivery Driver Interface (Simulation)'}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'hi' ? 'ग्राहक का डिलीवरी कोड दर्ज करें' : 'Verify Consignee Handover OTP'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {lang === 'hi'
                ? `ग्राहक से कोड पूछें (डेमो कोड: ${deliveryOtp})`
                : `Enter the code shared by the customer (Demo OTP: ${deliveryOtp})`}
            </p>

            {success ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-base text-emerald-800 dark:text-emerald-300">
                  <IndustrialIcon name="check" size={20} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'hi' ? 'पार्सल सफलतापूर्वक डिलीवर हुआ!' : 'Consignment Handover Confirmed!'}</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  {lang === 'hi'
                    ? 'ओटीपी मिलान सफल। भेजने वाले और पाने वाले दोनों को डिजिटल रसीद और व्हाट्सएप सूचना भेज दी गई है।'
                    : 'Security OTP confirmed. Digital receipt e-POD archived and dispatch status marked as Delivered.'}
                </p>
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2 transition-colors shadow-2xs cursor-pointer"
                >
                  {lang === 'hi' ? 'पूर्ण' : 'Close & Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? '4 अंकों का ओटीपी कोड *' : '4-Digit Delivery Code *'}
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="4829"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-2xl font-mono text-center tracking-widest p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 font-bold transition-all"
                  />
                  {errorMsg && (
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                      <IndustrialIcon name="alert" size={14} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(false)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <IndustrialIcon name="check" size={16} />
                    <span>{lang === 'hi' ? 'पुष्टि करें (Confirm)' : 'Verify Handover'}</span>
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
