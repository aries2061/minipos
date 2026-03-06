'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import React from 'react';
import en, { type TranslationKey } from './translations/en';
import my from './translations/my';
import th from './translations/th';

export type Language = 'en' | 'my' | 'th';

export interface LanguageOption {
  code: Language;
  label: string;
  shortCode: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', label: 'English', shortCode: 'EN' },
  { code: 'my', label: 'မြန်မာ', shortCode: 'MY' },
  { code: 'th', label: 'ไทย', shortCode: 'TH' },
];

const translations: Record<Language, Record<string, string>> = { en, my, th };

const STORAGE_KEY = 'minipos-language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language]?.[key] || translations.en[key] || key;
    },
    [language]
  );

  if (!mounted) {
    // SSR/hydration: render with English to avoid mismatch
    const tDefault = (key: TranslationKey) => translations.en[key] || key;
    return React.createElement(
      LanguageContext.Provider,
      { value: { language: 'en', setLanguage, t: tDefault } },
      children
    );
  }

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
