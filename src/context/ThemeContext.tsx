import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const THEME_STORAGE_KEY = 'veltrax_theme';
const LEGACY_STORAGE_KEY = 'freightline_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemPreference(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // Graceful fallback
  }
  return 'system';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemPreference);

  // Compute resolved theme
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;
  const isDark = resolvedTheme === 'dark';

  // Apply class to HTML element
  const applyThemeToDOM = useCallback((resolved: ResolvedTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, []);

  // Update theme setting
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      localStorage.setItem(LEGACY_STORAGE_KEY, newTheme);
      window.dispatchEvent(new CustomEvent('veltrax_theme_change', { detail: newTheme }));
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Listen to OS system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleMediaChange = (e: MediaQueryListEvent) => {
      const nextSystem = e.matches ? 'dark' : 'light';
      setSystemTheme(nextSystem);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Sync DOM with resolved theme
  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
  }, [resolvedTheme, applyThemeToDOM]);

  // Listen for storage events across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
        const val = e.newValue as ThemeMode;
        if (val === 'light' || val === 'dark' || val === 'system') {
          setThemeState(val);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
