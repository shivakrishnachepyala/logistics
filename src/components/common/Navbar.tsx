import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IndustrialIcon } from './IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';
import { useEnterprise, ROLE_LABELS } from '../../context/EnterpriseContext';
import type { UserRole, BranchId } from '../../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useTranslation();
  const { role, setRole, branch, setBranch } = useEnterprise();
  const [quickTrackId, setQuickTrackId] = useState('');
  const [currentTimeUtc, setCurrentTimeUtc] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatted in Indian standard 12h time
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setCurrentTimeUtc(`${dateStr}, ${timeStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackId.trim()) return;
    navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    setQuickTrackId('');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t('nav.track'), path: '/track', icon: 'search' as const },
    { label: t('nav.dashboard'), path: '/dashboard', icon: 'box' as const },
    { label: t('nav.newShipment'), path: '/create', icon: 'plus' as const },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper border-b-[2px] border-asphalt select-none">
      {/* Top telemetry bar */}
      <div className="bg-asphalt text-paper text-[11px] font-mono px-4 py-1.5 flex items-center justify-between overflow-x-auto border-b border-asphalt-muted gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1.5 text-yellow font-bold">
            <span className="inline-block w-2 h-2 bg-yellow rounded-full animate-pulse"></span>
            {t('app.status')}
          </span>
          <span className="text-steel hidden lg:inline">|</span>
          <span className="text-steel hidden lg:inline">
            LIVE TIME: <span className="text-paper font-semibold">{currentTimeUtc || '19/10/2026, 11:40 AM IST'}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-steel text-[11px]">
          {/* Enterprise Role Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-asphalt-soft border border-paper/30 px-2 py-0.5 rounded-[2px]">
            <span className="text-[10px] text-yellow font-bold uppercase tracking-wider">ROLE:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-paper text-[10px] font-mono font-bold uppercase focus:outline-none cursor-pointer"
              aria-label="Switch User Role"
            >
              <option value="admin" className="bg-asphalt text-paper">Admin</option>
              <option value="dispatcher" className="bg-asphalt text-paper">Dispatcher</option>
              <option value="driver" className="bg-asphalt text-paper">Driver</option>
              <option value="customer" className="bg-asphalt text-paper">Customer</option>
            </select>
          </div>

          {/* Logistics Hub Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-asphalt-soft border border-paper/30 px-2 py-0.5 rounded-[2px]">
            <span className="text-[10px] text-yellow font-bold uppercase tracking-wider">HUB:</span>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as BranchId)}
              className="bg-transparent text-paper text-[10px] font-mono font-bold uppercase focus:outline-none cursor-pointer"
              aria-label="Switch Logistics Hub"
            >
              <option value="all" className="bg-asphalt text-paper">ALL HUBS</option>
              <option value="DEL-CENTRAL" className="bg-asphalt text-paper">DELHI HUB</option>
              <option value="JPR-MAIN" className="bg-asphalt text-paper">JAIPUR HUB</option>
              <option value="GJ-SURAT" className="bg-asphalt text-paper">SURAT HUB</option>
              <option value="MH-MUMBAI" className="bg-asphalt text-paper">MUMBAI HUB</option>
              <option value="TN-CHENNAI" className="bg-asphalt text-paper">CHENNAI HUB</option>
            </select>
          </div>

          <span className="hidden xl:inline font-mono text-yellow">{t('app.supportLine')}</span>
          
          {/* Language Switcher Button (English / हिंदी) */}
          <div className="flex items-center border border-paper/40 rounded-[2px] overflow-hidden bg-asphalt-soft">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 text-[11px] font-heading font-bold uppercase transition-colors ${
                lang === 'en' ? 'bg-orange text-white' : 'text-paper hover:bg-asphalt-muted'
              }`}
              title="Switch to English"
            >
              ENGLISH
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2 py-0.5 text-[11px] font-heading font-bold transition-colors ${
                lang === 'hi' ? 'bg-orange text-white' : 'text-paper hover:bg-asphalt-muted'
              }`}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-asphalt text-orange p-2 border-[1.5px] border-asphalt group-hover:bg-orange group-hover:text-asphalt transition-colors duration-150 stamp-sm">
              <IndustrialIcon name="box" size={24} />
            </div>
            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-asphalt flex items-center gap-1 leading-none">
                FREIGHTLINE
                <span className="inline-block w-2 h-2 bg-orange"></span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-steel font-bold mt-0.5">
                {lang === 'hi' ? 'सरल पार्सल सेवा' : 'SIMPLE PARCEL SERVICE'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-heading font-bold text-sm uppercase px-3 py-2 transition-all duration-150 border-[1.5px] flex items-center gap-1.5 min-h-[44px] ${
                    isActive
                      ? 'bg-asphalt text-paper border-asphalt stamp-sm'
                      : 'text-asphalt border-transparent hover:border-asphalt hover:bg-chalk'
                  }`}
                >
                  <IndustrialIcon name={link.icon} size={14} className={isActive ? 'text-yellow' : 'text-steel'} />
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
                  placeholder={t('nav.quickSearchPlaceholder')}
                  value={quickTrackId}
                  onChange={(e) => setQuickTrackId(e.target.value)}
                  className="bg-chalk text-asphalt text-xs font-mono px-3 py-2 w-48 border-[1.5px] border-asphalt rounded-l-[2px] uppercase placeholder:text-steel focus:outline-none focus:bg-white min-h-[44px]"
                />
                <span className="absolute right-2.5 top-3 text-steel pointer-events-none">
                  <IndustrialIcon name="barcode" size={14} />
                </span>
              </div>
              <button
                type="submit"
                className="bg-orange text-white border-[1.5px] border-l-0 border-asphalt px-3 py-2 hover:bg-orange-hover text-xs font-heading font-bold uppercase transition-colors min-h-[44px] flex items-center gap-1"
                title="Search Parcel Number"
              >
                <IndustrialIcon name="search" size={14} />
                <span>{t('nav.quickTrack')}</span>
              </button>
            </form>

            <Link
              to="/create"
              className="btn-industrial bg-orange text-white text-xs px-4 py-2 border-[1.5px] border-asphalt stamp-sm hover:bg-orange-hover flex items-center gap-1.5 min-h-[44px]"
            >
              <IndustrialIcon name="plus" size={14} />
              <span>{t('nav.bookNow')}</span>
            </Link>
          </div>

          {/* Mobile buttons: Language toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center border border-asphalt rounded-[2px] overflow-hidden text-xs font-bold">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 ${lang === 'en' ? 'bg-asphalt text-paper' : 'bg-chalk text-asphalt'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 ${lang === 'hi' ? 'bg-asphalt text-paper' : 'bg-chalk text-asphalt'}`}
              >
                हिंदी
              </button>
            </div>
            <Link
              to="/track"
              className="bg-chalk p-2.5 border-[1.5px] border-asphalt text-asphalt min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Track Parcel"
            >
              <IndustrialIcon name="search" size={18} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-asphalt text-paper p-2.5 border-[1.5px] border-asphalt min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <IndustrialIcon name={mobileMenuOpen ? 'alert' : 'gauge'} size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-chalk border-b-[2px] border-asphalt px-4 py-4 space-y-3">
          {/* Mobile Enterprise Role & Hub Switcher */}
          <div className="p-2.5 bg-paper border border-asphalt rounded-[2px] space-y-2">
            <div className="text-[10px] font-mono font-bold text-steel uppercase flex items-center justify-between">
              <span>ACTIVE ROLE & HUB</span>
              <span className="text-orange">{ROLE_LABELS[role]}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono font-bold text-asphalt uppercase mb-0.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-chalk border border-asphalt px-2 py-1 text-xs font-mono font-bold uppercase text-asphalt rounded-[2px]"
                >
                  <option value="admin">Admin</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="driver">Driver</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-asphalt uppercase mb-0.5">Hub Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as BranchId)}
                  className="w-full bg-chalk border border-asphalt px-2 py-1 text-xs font-mono font-bold uppercase text-asphalt rounded-[2px]"
                >
                  <option value="all">All Hubs</option>
                  <option value="DEL-CENTRAL">Delhi Hub</option>
                  <option value="JPR-MAIN">Jaipur Hub</option>
                  <option value="GJ-SURAT">Surat Hub</option>
                  <option value="MH-MUMBAI">Mumbai Hub</option>
                  <option value="TN-CHENNAI">Chennai Hub</option>
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={handleQuickTrack} className="flex items-center w-full">
            <input
              type="text"
              placeholder={t('nav.quickSearchPlaceholder')}
              value={quickTrackId}
              onChange={(e) => setQuickTrackId(e.target.value)}
              className="bg-paper text-asphalt text-xs font-mono px-3 py-2.5 border-[1.5px] border-asphalt rounded-l-[2px] uppercase w-full min-h-[48px]"
            />
            <button
              type="submit"
              className="bg-orange text-white border-[1.5px] border-l-0 border-asphalt px-4 py-2.5 font-heading font-bold uppercase text-xs shrink-0 min-h-[48px] flex items-center gap-1"
            >
              <IndustrialIcon name="search" size={14} />
              <span>{t('nav.quickTrack')}</span>
            </button>
          </form>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-steel-border">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-heading font-bold text-base px-3 py-2.5 border-[1.5px] flex items-center gap-2 min-h-[48px] ${
                  location.pathname === link.path
                    ? 'bg-asphalt text-paper border-asphalt'
                    : 'text-asphalt border-transparent hover:bg-paper'
                }`}
              >
                <IndustrialIcon name={link.icon} size={16} />
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-industrial bg-orange text-white text-sm px-4 py-3 border-[1.5px] border-asphalt text-center mt-2 flex items-center justify-center gap-1.5 min-h-[48px]"
            >
              <IndustrialIcon name="plus" size={16} />
              <span>{t('nav.bookNow')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Hazard stripe accent bottom line */}
      <div className="h-1.5 w-full hazard-stripes"></div>
    </header>
  );
};
