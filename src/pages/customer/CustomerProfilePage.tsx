import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { getAddressesByCustomerId } from '../../data/mockCustomers';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';

export const CustomerProfilePage: React.FC = () => {
  const { customer, updateProfile, logout } = useCustomerAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(customer?.fullName || '');
  const [mobile, setMobile] = useState(customer?.mobile || '');
  const [company, setCompany] = useState(customer?.company || '');
  const [gst, setGst] = useState(customer?.gst || '');

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const customerId = customer?.id || '';
  const addresses = getAddressesByCustomerId(customerId);
  const defaultSender = addresses.find(a => a.type === 'sender' && a.isDefault) || addresses.find(a => a.type === 'sender');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName.trim()) {
      setMessage({ text: 'Full name is required.', type: 'error' });
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setMessage({ text: 'Mobile number must be at least 10 digits.', type: 'error' });
      return;
    }

    setIsSaving(true);
    const res = updateProfile({
      fullName: fullName.trim(),
      mobile: cleanMobile,
      company: company.trim(),
      gst: gst.trim(),
    });

    setIsSaving(false);
    if (res.success) {
      setMessage({ text: 'Profile information updated successfully!', type: 'success' });
    } else {
      setMessage({ text: res.error || 'Failed to update profile.', type: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Customer Profile & Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, company tax credentials and session settings
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <IndustrialIcon name="shield" size={14} />
          <span>Sign Out of Account</span>
        </button>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span className="shrink-0 mt-0.5">
            <IndustrialIcon name={message.type === 'success' ? 'check' : 'alert'} size={15} />
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* 2. Main Profile Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-sm">
            {customer?.fullName
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'CU'}
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">{customer?.fullName}</div>
            <div className="text-xs text-slate-500">
              Customer ID: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{customer?.id}</code> • Member since {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2026'}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address <span className="text-slate-400 font-normal">(Primary Login Key)</span>
              </label>
              <input
                type="email"
                disabled
                value={customer?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                title="Email identifier cannot be modified in demonstration mode"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Company / Trade Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sharma Textiles"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                placeholder="07AAACS1102K1Z5"
                value={gst}
                onChange={(e) => setGst(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg uppercase text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <IndustrialIcon name="check" size={14} />
                  <span>Update Profile Information</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Primary Dispatch Hub Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Primary Default Dispatch Hub
        </div>
        <p className="text-xs text-slate-500 mb-4">
          This address is automatically pre-filled as the origin sender when you create new consignments.
        </p>

        {defaultSender ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900">{defaultSender.label}</span>
              <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                Default Sender
              </span>
            </div>
            <div className="text-slate-700">{defaultSender.address}</div>
            <div className="text-slate-500">
              {defaultSender.city}, {defaultSender.state} - {defaultSender.postalCode}
            </div>
            <div className="text-slate-600 font-mono mt-1">Phone: {defaultSender.mobile}</div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl text-center">
            No default sender address configured. You can mark one in your Saved Addresses book.
          </div>
        )}
      </div>

      {/* 4. Academic Architecture & Security Disclosure */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <IndustrialIcon name="shield" size={14} className="text-orange-500" />
          <span>Security & Demonstration Disclosure</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          This system uses browser-side simulated authentication utilizing the Web Crypto API (SHA-256) and localStorage for session state persistence. In accordance with academic prototype constraints, no production backend or server identity verification is present. All database operations are mocked for demonstration fidelity.
        </p>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
