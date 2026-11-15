import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IndustrialIcon } from './IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';
import { useCustomerAuth } from '../../context/useCustomerAuth';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useTranslation();
  const { customer, logout } = useCustomerAuth();
  const [quickTrackId, setQuickTrackId] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackId.trim()) return;
    navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    setQuickTrackId('');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: lang === 'hi' ? 'होम' : 'Home', path: '/', icon: 'box' as const },
    { label: t('nav.track'), path: '/track', icon: 'search' as const },
    { label: lang === 'hi' ? 'पार्सल भेजें' : 'Send Parcel', path: '/create', icon: 'plus' as const },
    { label: lang === 'hi' ? 'हमारे बारे में' : 'About Us', path: '/#about', icon: 'compass' as const },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 select-none shadow-sm">
      {/* Top verified announcement & support bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <span className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {lang === 'hi' ? 'क्षेत्रीय स्टेशन नेटवर्क (दिल्ली, जयपुर, सूरत, मुंबई, बेंगलुरु, कोलकाता)' : 'FreightLine LMS • 6 Regional Corridors: Delhi • Jaipur • Surat • Mumbai • Bengaluru • Kolkata'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-slate-400 text-[11px] hidden md:inline">
              {lang === 'hi' ? 'डेमोंस्ट्रेशन पोर्टल' : 'Demonstration Platform'}
            </span>

            <span className="text-slate-700 hidden md:inline">|</span>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-md p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded transition-colors font-medium ${
                  lang === 'en' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded transition-colors font-medium ${
                  lang === 'hi' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="हिंदी में बदलें"
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:bg-orange-600 transition-all">
              <IndustrialIcon name="box" size={22} />
            </div>
            <div>
              <div className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-1 leading-tight">
                FREIGHTLINE
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
              </div>
              <div className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                {lang === 'hi' ? 'एक्सप्रेस लॉजिस्टिक्स' : 'Express Logistics'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium px-3.5 py-2 rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IndustrialIcon
                    name={link.icon}
                    size={15}
                    className={isActive ? 'text-orange-500' : 'text-slate-400'}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Tracking Search Box & Action */}
          <div className="hidden lg:flex items-center gap-3">
            <form onSubmit={handleQuickTrack} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'रसीद / पार्सल नंबर...' : 'Track parcel ID...'}
                  value={quickTrackId}
                  onChange={(e) => setQuickTrackId(e.target.value)}
                  className="bg-slate-50 text-slate-900 text-xs font-mono px-3 py-2 w-44 border border-slate-200 rounded-l-lg uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white h-9"
                />
                <span className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none">
                  <IndustrialIcon name="barcode" size={14} />
                </span>
              </div>
              <button
                type="submit"
                className="bg-slate-900 text-white hover:bg-slate-800 border border-l-0 border-slate-900 px-3 py-2 text-xs font-medium rounded-r-lg transition-colors h-9 flex items-center gap-1"
                title="Search Parcel Number"
              >
                <IndustrialIcon name="search" size={13} />
                <span>{lang === 'hi' ? 'खोजें' : 'Track'}</span>
              </button>
            </form>

            <div className="h-6 w-[1px] bg-slate-200"></div>

            {/* Customer Authentication State / Buttons */}
            {customer ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 transition-all shadow-xs h-9"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
                    {customer.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate">{customer.fullName}</span>
                  <IndustrialIcon name="compass" size={12} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{customer.fullName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{customer.email}</div>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    >
                      <IndustrialIcon name="gauge" size={13} className="text-orange-500" />
                      <span>Customer Dashboard</span>
                    </Link>
                    <Link
                      to="/account/shipments"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    >
                      <IndustrialIcon name="box" size={13} className="text-slate-400" />
                      <span>My Shipments</span>
                    </Link>
                    <Link
                      to="/account/book"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    >
                      <IndustrialIcon name="plus" size={13} className="text-slate-400" />
                      <span>Book Consignment</span>
                    </Link>
                    <Link
                      to="/account/addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    >
                      <IndustrialIcon name="pin" size={13} className="text-slate-400" />
                      <span>Saved Addresses</span>
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50"
                    >
                      <IndustrialIcon name="shield" size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold px-3 py-2 rounded-lg transition-all h-9 flex items-center gap-1.5 shadow-xs"
                  title="Customer Sign In & Self-Service"
                >
                  <IndustrialIcon name="user" size={14} className="text-orange-500" />
                  <span>{lang === 'hi' ? 'ग्राहक लॉगिन' : 'Customer Login'}</span>
                </Link>
              </div>
            )}

            {/* Outlined Manager Login Link */}
            <Link
              to="/manager/login"
              className="border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold px-3 py-2 rounded-lg transition-all h-9 flex items-center gap-1.5 shadow-xs"
              title="Access internal FreightLine LMS console"
            >
              <IndustrialIcon name="shield" size={14} className="text-slate-500" />
              <span>{lang === 'hi' ? 'मैनेजर' : 'Manager'}</span>
            </Link>

            {/* Book Now Primary Button */}
            <Link
              to={customer ? '/account/book' : '/create'}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-orange-500/20 hover:shadow transition-all h-9 flex items-center gap-1.5 shrink-0"
            >
              <IndustrialIcon name="plus" size={14} />
              <span>{lang === 'hi' ? 'पार्सल बुक करें' : 'Book Shipment'}</span>
            </Link>
          </div>

          {/* Mobile Buttons: Search & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/track"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Track Parcel"
            >
              <IndustrialIcon name="search" size={20} />
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-5 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <form onSubmit={handleQuickTrack} className="flex items-center w-full">
            <input
              type="text"
              placeholder={lang === 'hi' ? 'रसीद या पार्सल नंबर लिखें...' : 'Enter parcel tracking ID...'}
              value={quickTrackId}
              onChange={(e) => setQuickTrackId(e.target.value)}
              className="bg-slate-50 text-slate-900 text-sm font-mono px-3.5 py-2.5 border border-slate-200 rounded-l-lg uppercase w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2.5 font-medium text-xs rounded-r-lg shrink-0 flex items-center gap-1 hover:bg-orange-600"
            >
              <IndustrialIcon name="search" size={14} />
              <span>{lang === 'hi' ? 'खोजें' : 'Track'}</span>
            </button>
          </form>

          <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 transition-colors ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <IndustrialIcon name={link.icon} size={16} />
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {customer ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-orange-50 border border-orange-200 text-orange-900 text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-between"
                  >
                    <span>Customer Account: {customer.fullName}</span>
                    <IndustrialIcon name="arrow-right" size={14} />
                  </Link>
                  <Link
                    to="/account/book"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center flex items-center justify-center gap-2 shadow-xs"
                  >
                    <IndustrialIcon name="plus" size={15} />
                    <span>{lang === 'hi' ? 'पार्सल बुक करें' : 'Book a Shipment'}</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5"
                    >
                      <IndustrialIcon name="user" size={14} className="text-orange-500" />
                      <span>Customer Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-2.5 rounded-lg text-center"
                    >
                      Register Account
                    </Link>
                  </div>
                  <Link
                    to="/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center flex items-center justify-center gap-2 shadow-xs"
                  >
                    <IndustrialIcon name="plus" size={15} />
                    <span>{lang === 'hi' ? 'नया पार्सल बुक करें' : 'Book a Shipment'}</span>
                  </Link>
                </>
              )}

              <Link
                to="/manager/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <IndustrialIcon name="shield" size={15} className="text-orange-400" />
                <span>{lang === 'hi' ? 'मैनेजर व स्टाफ लॉगिन' : 'Manager & Staff Portal'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
