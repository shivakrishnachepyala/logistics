import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/useCustomerAuth';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { Footer } from '../components/common/Footer';

export const CustomerLayout: React.FC = () => {
  const { customer, isAuthenticated, isLoading, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center animate-spin">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
          </div>
          <div>
            <div className="font-heading font-bold text-sm text-slate-900">Restoring Customer Session...</div>
            <div className="text-xs text-slate-500">FreightLine Self-Service Portal</div>
          </div>
        </div>
      </div>
    );
  }

  // Enforce customer authentication
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/account', icon: 'gauge' as const, end: true },
    { label: 'My Shipments', path: '/account/shipments', icon: 'box' as const },
    { label: 'Book Shipment', path: '/account/book', icon: 'plus' as const },
    { label: 'Saved Addresses', path: '/account/addresses', icon: 'pin' as const },
    { label: 'Booking History', path: '/account/history', icon: 'clock' as const },
    { label: 'My Profile', path: '/account/profile', icon: 'user' as const },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-orange-500 selection:text-white antialiased">
      {/* 1. Academic Disclaimer & Network Corridors Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-orange-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Verified Customer Session: {customer?.fullName} ({customer?.id})
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Simulated Client-Side Authentication (SHA-256)
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <Link
              to="/"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              title="Return to Public Website"
            >
              <span>Public Portal</span>
              <IndustrialIcon name="arrow-right" size={10} />
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              to="/manager/login"
              className="text-slate-400 hover:text-orange-400 transition-colors"
              title="Staff / Ops Console"
            >
              Manager Login
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Customer Top Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Portal Tag */}
            <div className="flex items-center gap-3">
              <Link to="/account" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:bg-orange-600 transition-all">
                  <IndustrialIcon name="box" size={22} />
                </div>
                <div>
                  <div className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-1 leading-tight">
                    FREIGHTLINE
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-orange-600 uppercase flex items-center gap-1.5">
                    <span>Customer Portal</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-normal">Self-Service</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Quick Actions & User Pill (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/account/book"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <IndustrialIcon name="plus" size={14} />
                <span>Book Shipment</span>
              </Link>

              <div className="h-6 w-[1px] bg-slate-200"></div>

              {/* User Profile Card */}
              <div className="flex items-center gap-3 pl-1">
                <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-200">
                  {customer?.fullName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'CU'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {customer?.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {customer?.company || customer?.email}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                  title="Sign Out of Customer Portal"
                >
                  <IndustrialIcon name="shield" size={16} />
                </button>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/account/book"
                className="p-2 bg-orange-500 text-white rounded-lg"
                title="Book Shipment"
              >
                <IndustrialIcon name="plus" size={18} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle menu"
              >
                <IndustrialIcon name={mobileMenuOpen ? 'alert' : 'gauge'} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Sub-Navigation Tabs Bar (Enterprise Customer SaaS Sub-Nav) */}
        <div className="border-t border-slate-100 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Customer Tabs">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-orange-600 shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IndustrialIcon
                        name={item.icon}
                        size={14}
                        className={isActive ? 'text-orange-500' : 'text-slate-400'}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
                {customer?.fullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'CU'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{customer?.fullName}</div>
                <div className="text-xs text-slate-500 truncate">{customer?.email}</div>
              </div>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <IndustrialIcon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center text-xs font-semibold text-rose-600 hover:bg-rose-50 py-2 rounded-lg border border-rose-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 4. Main Customer Page Content */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* 5. Minimal Customer Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
