'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import React from 'react';
import { useTranslation, type Language } from '@/lib/i18n';

export type Currency = 'USD' | 'MMK' | 'THB';

export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface AppSettings {
  currency: Currency;
  defaultLanguage: Language;
  theme: ThemeColors;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  defaultLanguage: 'en',
  theme: {
    primary: '#3182CE',
    secondary: '#718096',
    text: '#1A202C',
  },
};

const STORAGE_KEY = 'minipos-settings';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
});

function applyThemeColors(theme: ThemeColors) {
  document.documentElement.style.setProperty('--minipos-primary', theme.primary);
  document.documentElement.style.setProperty('--minipos-secondary', theme.secondary);
  document.documentElement.style.setProperty('--minipos-text', theme.text);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);
  const { setLanguage } = useTranslation();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppSettings;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        applyThemeColors(parsed.theme || DEFAULT_SETTINGS.theme);
        if (parsed.defaultLanguage) {
          setLanguage(parsed.defaultLanguage);
        }
      } else {
        applyThemeColors(DEFAULT_SETTINGS.theme);
      }
    } catch {
      applyThemeColors(DEFAULT_SETTINGS.theme);
    }
    setMounted(true);
  }, [setLanguage]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      if (updates.theme) {
        next.theme = { ...prev.theme, ...updates.theme };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (updates.theme) {
        applyThemeColors(next.theme);
      }
      return next;
    });
  }, []);

  if (!mounted) {
    return React.createElement(
      SettingsContext.Provider,
      { value: { settings: DEFAULT_SETTINGS, updateSettings } },
      children
    );
  }

  return React.createElement(
    SettingsContext.Provider,
    { value: { settings, updateSettings } },
    children
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export const currencyConfig: Record<Currency, { locale: string; currency: string }> = {
  USD: { locale: 'en-US', currency: 'USD' },
  MMK: { locale: 'my-MM', currency: 'MMK' },
  THB: { locale: 'th-TH', currency: 'THB' },
};
