import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise, type BranchId } from '../context/EnterpriseContext';
import { getBranches } from '../data/mockCommercial';

export const ManagerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setBranch, setRole } = useEnterprise();
  const [branches] = useState(() => getBranches());

  // Form State
  const [email, setEmail] = useState<string>('admin@veltrax.in');
  const [password, setPassword] = useState<string>('veltrax2026');
  const [selectedBranch, setSelectedBranch] = useState<string>('DEL-CENTRAL');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Store simulated auth session
      const authSession = {
        isAuthenticated: true,
        email,
        role: email.includes('dispatcher') ? 'Dispatcher' : email.includes('supervisor') ? 'Warehouse Supervisor' : 'System Administrator',
        branch: selectedBranch,
        loginTime: new Date().toISOString(),
        isSimulated: true,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('veltrax_manager_auth', JSON.stringify(authSession));
        localStorage.setItem('freightline_manager_auth', JSON.stringify(authSession));
      }

      setBranch(selectedBranch as BranchId);
      setRole(email.includes('dispatcher') ? 'dispatcher' : 'admin');
      setIsSubmitting(false);
      navigate('/manager/dashboard');
    }, 400);
  };

  const applyDemoPreset = (presetEmail: string, presetBranch: string, presetRole: 'admin' | 'dispatcher') => {
    setEmail(presetEmail);
    setPassword('veltrax2026');
    setSelectedBranch(presetBranch);

    const authSession = {
      isAuthenticated: true,
      email: presetEmail,
      role: presetRole === 'dispatcher' ? 'Regional Dispatcher' : 'System Administrator',
      branch: presetBranch,
      loginTime: new Date().toISOString(),
      isSimulated: true,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('veltrax_manager_auth', JSON.stringify(authSession));
      localStorage.setItem('freightline_manager_auth', JSON.stringify(authSession));
    }

    setBranch(presetBranch as BranchId);
    setRole(presetRole);
    navigate('/manager/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      {/* Background Graphic Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Navigation Back to Public Portal */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 px-4 flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50"
        >
          <AppIcon name="arrow-left" size={14} />
          <span>Return to Public Website</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-500">
          Internal Terminal v2.4
        </span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500 text-white font-black text-2xl shadow-lg mb-3">
            V
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            VELTRAX
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
            Logistics Management System • Operations Console
          </p>
        </div>

        {/* Academic Simulation Banner */}
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
          <span className="p-1 rounded bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
            <AppIcon name="info" size={14} />
          </span>
          <div>
            <strong className="font-semibold block text-amber-200">Academic Demo Simulation</strong>
            This is an offline frontend demonstration. Authentication is simulated client-side using localStorage.
            No real credentials are required or transmitted.
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@veltrax.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                />
                <span className="absolute left-3 top-3 text-slate-500 pointer-events-none">
                  <AppIcon name="user" size={16} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Terminal Access Key / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                />
                <span className="absolute left-3 top-3 text-slate-500 pointer-events-none">
                  <AppIcon name="shield" size={16} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Station Gateway / Branch Scope
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>Remember session</span>
              </label>
              <span className="text-slate-500 font-mono">256-Bit SSL Mock</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Terminal...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Manager Console</span>
                  <AppIcon name="arrow-right" size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login Presets */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-3 text-center">
              Quick 1-Click Demo Profiles
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => applyDemoPreset('admin@veltrax.in', 'DEL-CENTRAL', 'admin')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 hover:border-slate-600 rounded-lg text-left transition-colors text-xs text-slate-300 group"
              >
                <div>
                  <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                    Operations Administrator
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">admin@veltrax.in • National Scope</div>
                </div>
                <span className="text-xs text-orange-400 font-medium">1-Click Launch →</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemoPreset('dispatcher@veltrax.in', 'MH-MUMBAI', 'dispatcher')}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 hover:border-slate-600 rounded-lg text-left transition-colors text-xs text-slate-300 group"
              >
                <div>
                  <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                    Regional Dispatch Controller
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">dispatcher@veltrax.in • Mumbai Hub</div>
                </div>
                <span className="text-xs text-orange-400 font-medium">1-Click Launch →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          VELTRAX Enterprise LMS • Academic Showcase • Safe Local Simulation
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginPage;
