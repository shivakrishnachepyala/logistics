import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../common/AppIcon';
import { ThemeToggle } from '../common/ThemeToggle';
import { useEnterprise, BRANCH_NAMES, type BranchId } from '../../context/EnterpriseContext';

interface TopBarProps {
  onToggleSidebar?: () => void;
  onOpenMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileSidebar,
}) => {
  const navigate = useNavigate();
  const { branch, setBranch } = useEnterprise();

  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toUpperCase();
    navigate(`/track?id=${encodeURIComponent(query)}`);
    setSearchQuery('');
  };

  const sampleNotifications = [
    {
      id: 1,
      title: 'Consignment Arrived',
      desc: 'FLX-8829-JPR reached Jaipur Central Hub safely.',
      time: '12m ago',
      type: 'success',
    },
    {
      id: 2,
      title: 'Delivery Slot Confirmed',
      desc: 'Consignee chosen 2:00 PM – 5:00 PM doorstep slot.',
      time: '45m ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Route Delay Alert',
      desc: 'NH-48 fog slowdown reported near Kotputli corridor.',
      time: '2h ago',
      type: 'warning',
    },
  ];

  return (
    <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-700/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-saas-sm transition-colors">
      {/* Left: Sidebar Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Open mobile navigation"
        >
          <AppIcon name="menu" size={20} />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <AppIcon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by Consignment ID (e.g. FLX-8829-JPR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-2xs">
                Enter
              </kbd>
            </div>
          </div>
        </form>
      </div>

      {/* Right: Hub Selector, Theme Toggle, Notifications & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hub / Branch Selector */}
        <div className="relative flex items-center">
          <label htmlFor="hub-select" className="sr-only">
            Select Active Hub
          </label>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <AppIcon name="branches" size={15} className="text-orange-500 hidden sm:inline" />
            <select
              id="hub-select"
              value={branch}
              onChange={(e) => setBranch(e.target.value as BranchId)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="dark:bg-slate-800">National Network (All Hubs)</option>
              <option value="DEL-CENTRAL" className="dark:bg-slate-800">Delhi Sorting Hub (DEL)</option>
              <option value="MH-MUMBAI" className="dark:bg-slate-800">Mumbai Central Godown (BOM)</option>
              <option value="JPR-MAIN" className="dark:bg-slate-800">Jaipur Delivery Centre (JPR)</option>
              <option value="GJ-SURAT" className="dark:bg-slate-800">Surat Textile Cargo Hub (SUR)</option>
              <option value="KA-BLR" className="dark:bg-slate-800">Bengaluru Tech Park (BLR)</option>
              <option value="WB-KOL" className="dark:bg-slate-800">Kolkata Eastern Gateway (CCU)</option>
              <option value="HYD" className="dark:bg-slate-800">Hyderabad Regional Hub (HYD)</option>
              <option value="MAA" className="dark:bg-slate-800">Chennai Coromandel Hub (MAA)</option>
              <option value="AMD" className="dark:bg-slate-800">Ahmedabad Sabarmati Hub (AMD)</option>
            </select>
          </div>
        </div>

        {/* Quick Theme Selector Dropdown */}
        <ThemeToggle variant="dropdown" />

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
            title="System notifications"
            aria-label="View notifications"
          >
            <AppIcon name="bell" size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-saas-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-800/60">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/70 max-h-80 overflow-y-auto">
                {sampleNotifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{notif.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-center">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            aria-label="User account menu"
          >
            <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-heading font-bold text-xs ring-2 ring-slate-100 dark:ring-slate-700">
              SK
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">Shiva K.</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Fleet Admin</span>
            </div>
            <AppIcon name="chevron-down" size={14} className="text-slate-400 hidden lg:inline" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-saas-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Shiva Krishna</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">chepyalashivakrishna@gmail.com</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40 rounded-full">
                  System Administrator
                </span>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/manager/settings');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <AppIcon name="settings" size={14} className="text-slate-400" />
                  Account Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/manager/branches');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <AppIcon name="branches" size={14} className="text-slate-400" />
                  {BRANCH_NAMES[branch]?.name || 'Branch Locations'}
                </button>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700/80 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <AppIcon name="external-link" size={14} className="text-slate-400" />
                  Go to Public Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    localStorage.removeItem('freightline_manager_auth');
                    navigate('/manager/login');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <AppIcon name="log-out" size={14} className="text-rose-500" />
                  Sign Out / Lock Terminal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
