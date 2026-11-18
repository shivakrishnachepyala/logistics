import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppIcon } from '../common/AppIcon';
import { NAVIGATION_GROUPS } from '../../config/navigation';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const sidebarContent = (
    <div className="h-full flex flex-col bg-navy-900 text-slate-300 border-r border-navy-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-navy-800/80 bg-navy-950/40">
        <NavLink
          to="/manager/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden group"
          title="VELTRAX LMS Home"
        >
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-heading font-black text-lg shadow-sm group-hover:bg-orange-600 transition-colors shrink-0">
            V
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-bold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
                VELTRAX
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mt-1">
                Enterprise LMS
              </span>
            </div>
          )}
        </NavLink>

        {/* Desktop Collapse Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <AppIcon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size={16} />
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
          aria-label="Close sidebar"
        >
          <AppIcon name="x" size={18} />
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-navy-700">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            {/* Group Label */}
            {!isCollapsed ? (
              <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {group.label}
              </div>
            ) : (
              <div className="h-2 border-b border-navy-800/60 my-2 mx-1" />
            )}

            {/* Group Items */}
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <AppIcon
                      name={item.icon}
                      size={18}
                      className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-navy-900/60 text-white'
                            : item.badgeColor === 'orange'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-navy-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-navy-950 text-white text-xs rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-navy-800">
                        {item.name}
                        {item.badge && ` (${item.badge})`}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Footer Area: System Status & Public Link */}
      <div className="p-3 border-t border-navy-800/80 bg-navy-950/30">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-lg bg-navy-800/50 border border-navy-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-300 font-medium">All Systems Live</span>
            </div>
            <NavLink
              to="/"
              className="text-[11px] text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 hover:underline"
              title="Open public portal"
            >
              Public
              <AppIcon name="external-link" size={12} />
            </NavLink>
          </div>
        ) : (
          <div className="flex justify-center" title="All Systems Live">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-200 ease-in-out z-30 ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Canvas */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-navy-900 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
