import React, { useState, useRef, useEffect } from 'react';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { AppIcon } from './AppIcon';

interface ThemeToggleProps {
  variant?: 'dropdown' | 'segmented' | 'cards' | 'icon-button';
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'dropdown',
  className = '',
  showLabels = false,
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Options metadata
  const themeOptions: Array<{
    mode: ThemeMode;
    label: string;
    sublabel: string;
    icon: 'sun' | 'moon' | 'monitor';
  }> = [
    {
      mode: 'light',
      label: 'Light Mode',
      sublabel: 'Crisp slate canvas & white surfaces',
      icon: 'sun',
    },
    {
      mode: 'dark',
      label: 'Dark Mode',
      sublabel: 'High-contrast midnight navy theme',
      icon: 'moon',
    },
    {
      mode: 'system',
      label: 'System Default',
      sublabel: 'Synchronize with operating system',
      icon: 'monitor',
    },
  ];

  // Active icon based on mode
  const currentIcon: 'sun' | 'moon' | 'monitor' =
    theme === 'system' ? 'monitor' : theme === 'dark' ? 'moon' : 'sun';

  // ---------------------------------------------------------------------------
  // VARIANT 1: Dropdown (Compact for Navigation Headers)
  // ---------------------------------------------------------------------------
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
            dropdownOpen
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
          }`}
          title={`Appearance: ${theme === 'system' ? `System (${resolvedTheme})` : theme.toUpperCase()}`}
          aria-label="Toggle theme appearance"
          aria-expanded={dropdownOpen}
        >
          <AppIcon
            name={currentIcon}
            size={16}
            className={
              resolvedTheme === 'dark'
                ? 'text-orange-400'
                : 'text-amber-500'
            }
          />
          {showLabels && (
            <span className="capitalize hidden sm:inline">
              {theme === 'system' ? 'System' : theme}
            </span>
          )}
          <AppIcon name="chevron-down" size={12} className="text-slate-400 dark:text-slate-500" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-saas-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/80 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Interface Appearance
              </span>
            </div>

            {themeOptions.map((opt) => {
              const isSelected = theme === opt.mode;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => {
                    setTheme(opt.mode);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-1 rounded-md ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <AppIcon name={opt.icon} size={14} />
                    </span>
                    <span>{opt.label}</span>
                  </div>

                  {isSelected && (
                    <span className="text-orange-500 dark:text-orange-400">
                      <AppIcon name="check" size={14} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 2: Segmented Pill Toggle
  // ---------------------------------------------------------------------------
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-1 rounded-xl text-xs ${className}`}
        role="group"
        aria-label="Theme mode selector"
      >
        {themeOptions.map((opt) => {
          const isSelected = theme === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setTheme(opt.mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs border border-slate-200/80 dark:border-slate-700 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={opt.label}
              aria-pressed={isSelected}
            >
              <AppIcon name={opt.icon} size={14} />
              {showLabels && <span>{opt.mode.charAt(0).toUpperCase() + opt.mode.slice(1)}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 3: Single Icon Quick Toggle Button (Simple One-Click)
  // ---------------------------------------------------------------------------
  if (variant === 'icon-button') {
    return (
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${className}`}
        title={`Current: ${resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'} (Click to toggle)`}
        aria-label="Toggle light/dark mode"
      >
        <AppIcon
          name={resolvedTheme === 'dark' ? 'moon' : 'sun'}
          size={16}
          className={resolvedTheme === 'dark' ? 'text-orange-400' : 'text-amber-500'}
        />
      </button>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 4: Cards Selector (For Settings Page & Profile Screens)
  // ---------------------------------------------------------------------------
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 ${className}`}>
      {themeOptions.map((opt) => {
        const isSelected = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            onClick={() => setTheme(opt.mode)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all cursor-pointer group ${
              isSelected
                ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            aria-pressed={isSelected}
          >
            {/* Active Checkmark Pill */}
            {isSelected && (
              <span className="absolute top-3 right-3 p-1 rounded-full bg-orange-500 text-white shadow-xs">
                <AppIcon name="check" size={12} />
              </span>
            )}

            {/* Icon & Title */}
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className={`p-2 rounded-lg ${
                  isSelected
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:text-orange-500 transition-colors'
                }`}
              >
                <AppIcon name={opt.icon} size={18} />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {opt.label}
                </div>
                {opt.mode === 'system' && (
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">
                    Auto ({resolvedTheme})
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              {opt.sublabel}
            </p>

            {/* Visual Mini Preview Bar */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-750">
              {opt.mode === 'light' && (
                <>
                  <span className="w-5 h-5 rounded bg-[#F8FAFC] border border-slate-300" title="Canvas" />
                  <span className="w-5 h-5 rounded bg-[#FFFFFF] border border-slate-300" title="Surface" />
                  <span className="w-5 h-5 rounded bg-[#0F172A]" title="Navy Text" />
                  <span className="w-5 h-5 rounded bg-[#F97316]" title="Orange Accent" />
                </>
              )}
              {opt.mode === 'dark' && (
                <>
                  <span className="w-5 h-5 rounded bg-[#0B1220] border border-slate-700" title="Canvas" />
                  <span className="w-5 h-5 rounded bg-[#1E293B] border border-slate-700" title="Surface" />
                  <span className="w-5 h-5 rounded bg-[#F8FAFC]" title="Light Text" />
                  <span className="w-5 h-5 rounded bg-[#F97316]" title="Orange Accent" />
                </>
              )}
              {opt.mode === 'system' && (
                <>
                  <span className="w-5 h-5 rounded bg-gradient-to-r from-[#F8FAFC] to-[#0B1220] border border-slate-400" title="Adaptive" />
                  <span className="w-5 h-5 rounded bg-gradient-to-r from-[#FFFFFF] to-[#1E293B] border border-slate-400" title="Adaptive Surface" />
                  <span className="w-5 h-5 rounded bg-slate-400" title="Dynamic Text" />
                  <span className="w-5 h-5 rounded bg-[#F97316]" title="Orange Accent" />
                </>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
