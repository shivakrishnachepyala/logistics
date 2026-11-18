import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';

export const CustomerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useCustomerAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    company: '',
    gst: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Mobile number must be at least 10 digits.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your confirmation password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: cleanMobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        company: formData.company.trim(),
        gst: formData.gst.trim(),
      });

      if (res.success) {
        navigate('/account', { replace: true });
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch {
      setError('An error occurred while creating your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex flex-col justify-between selection:bg-orange-500 selection:text-white transition-colors">
      {/* Top minimal bar */}
      <header className="bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-700 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
              <IndustrialIcon name="box" size={18} />
            </div>
            <div className="font-heading font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              VELTRAX
            </div>
          </Link>
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Customer Sign In</span>
            <IndustrialIcon name="arrow-right" size={12} />
          </Link>
        </div>
      </header>

      {/* Main Registration Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-saas-md p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 mb-3 border border-orange-100 dark:border-orange-800">
              <IndustrialIcon name="plus" size={24} />
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              Create Customer Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Join VELTRAX for express booking, live status notifications and saved addresses
            </p>
          </div>

          {/* Academic Simulation Notice */}
          <div className="mb-5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-700/60 rounded-xl p-3 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <span className="text-amber-600 dark:text-orange-400 shrink-0 mt-0.5">
              <IndustrialIcon name="shield" size={14} />
            </span>
            <div>
              <span className="font-bold">Academic Demonstration:</span> Account created in browser localStorage with SHA-256 password hash. Safe for academic demo testing.
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl p-3 flex items-start gap-2">
              <span className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <IndustrialIcon name="alert" size={14} />
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="e.g. Ramesh Sharma"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ramesh@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  maxLength={10}
                  placeholder="9811044291"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Shop Name <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Sharma Textiles"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GST Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="gst"
                  maxLength={15}
                  placeholder="07AAACS1102K1Z5"
                  value={formData.gst}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm shadow-orange-500/20 hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Creating Customer Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Sign In</span>
                  <IndustrialIcon name="arrow-right" size={13} />
                </>
              )}
            </button>
          </form>

          {/* Existing account link */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/80 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have a customer account?{' '}
            <Link to="/login" className="font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700">
              Sign In Here
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1E293B]">
        VELTRAX Logistics • Customer Self-Service Portal • MOVING BEYOND MILES.
      </footer>
    </div>
  );
};

export default CustomerRegisterPage;
