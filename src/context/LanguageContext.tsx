/* oxlint-disable react/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../i18n/translations';
export { useTranslation } from './useTranslation';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('freightline_lang') as Language;
      if (saved === 'en' || saved === 'hi') return saved;
    }
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('freightline_lang', newLang);
    } catch (e) {
      console.error('Failed to save language in localStorage', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[lang] || translations.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="relative group inline-block ml-1 cursor-help align-middle select-none">
      <span className="w-4 h-4 rounded-full bg-asphalt text-paper text-[10px] font-bold flex items-center justify-center border border-asphalt">
        ?
      </span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 sm:w-56 p-2 bg-asphalt text-paper text-[11px] font-body rounded-[2px] shadow-lg z-50 pointer-events-none leading-tight border border-paper">
        {text}
      </span>
    </span>
  );
};
