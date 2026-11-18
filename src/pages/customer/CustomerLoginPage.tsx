import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, login, loginAsDemo, isAuthenticated, logout } = useCustomerAuth();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ email: email.trim(), password });
      if (res.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setError(res.error || 'Failed to authenticate.');
      }
    } catch {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (demoId: 'CUST-001' | 'CUST-002') => {
    loginAsDemo(demoId);
    navigate(redirectPath, { replace: true });
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
            to="/"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Public Home</span>
            <IndustrialIcon name="arrow-right" size={12} />
          </Link>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-saas-md p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 mb-3 border border-orange-100 dark:border-orange-800">
              <IndustrialIcon name="user" size={24} />
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              Customer Sign In
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Access your VELTRAX self-service shipments, address book & bookings
            </p>
          </div>

          {/* Active Session Notice if already logged in */}
          {isAuthenticated && customer && (
            <div className="mb-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
              <div>
                <span className="font-semibold">Signed in as:</span> {customer.fullName} ({customer.id})
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="font-bold text-blue-700 dark:text-blue-400 hover:underline"
                >
                  Dashboard →
                </Link>
                <span className="text-blue-300 dark:text-blue-700">|</span>
                <button
                  type="button"
                  onClick={logout}
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Academic Simulation Notice */}
          <div className="mb-5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-700/60 rounded-xl p-3 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <span className="text-amber-600 dark:text-orange-400 shrink-0 mt-0.5">
              <IndustrialIcon name="shield" size={14} />
            </span>
            <div>
              <span className="font-bold">Academic Demonstration:</span> Simulated client-side session using browser SHA-256 hash & local storage. Not a production backend.
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl p-3 flex items-start gap-2">
              <span className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <IndustrialIcon name="alert" size={14} />
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm shadow-orange-500/20 hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <IndustrialIcon name="arrow-right" size={13} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Shortcut Section */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/80">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Customer Logins
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('CUST-001')}
                className="p-2.5 text-left border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-orange-50/50 dark:hover:bg-slate-700/60 rounded-xl transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-400 flex items-center justify-between">
                  <span>Ramesh Sharma</span>
                  <span className="text-[10px] bg-slate-200/80 dark:bg-slate-700 group-hover:bg-orange-200 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">Demo 1</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">customer@veltrax.in</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                  <span>2 shipments • Delhi Hub</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('CUST-002')}
                className="p-2.5 text-left border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-orange-50/50 dark:hover:bg-slate-700/60 rounded-xl transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-400 flex items-center justify-between">
                  <span>Priya Patel</span>
                  <span className="text-[10px] bg-slate-200/80 dark:bg-slate-700 group-hover:bg-orange-200 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">Demo 2</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">priya@veltrax.in</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                  <span>1 shipment • Surat Mill</span>
                </div>
              </button>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
              Default password for all demo accounts: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono">Demo@123</code>
            </div>
          </div>

          {/* Links to Register & Manager Login */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex flex-col gap-2.5 text-center text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Don't have an account yet? </span>
              <Link to="/register" className="font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700">
                Register New Customer
              </Link>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              Are you an internal logistics supervisor?{' '}
              <Link to="/manager/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium underline underline-offset-2">
                Manager Login ↗
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer note */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1E293B]">
        VELTRAX Logistics • Customer Self-Service Portal • MOVING BEYOND MILES.
      </footer>
    </div>
  );
};

export default CustomerLoginPage;
