'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import am from '@/locales/am.json';
import om from '@/locales/om.json';

export type Locale = 'en' | 'am' | 'om';

type Translations = typeof en;

const translations: Record<Locale, Translations> = {
  en,
  am: am as unknown as Translations,
  om: om as unknown as Translations,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, fallback?: string) => string;
  dict: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('imaco_locale') as Locale;
    if (saved && (saved === 'en' || saved === 'am' || saved === 'om')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('imaco_locale', newLocale);
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = translations[locale] || translations['en'];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing in selected locale
        let fallbackCurrent: any = translations['en'];
        for (const fbKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackCurrent === 'string' ? fallbackCurrent : fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dict: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
