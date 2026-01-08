'use client';

import { useState, useEffect } from 'react';
import { getBrowserLanguage, type SupportedLanguage } from './types';
import { locales } from './locales';

/**
 * Hook to get the current language
 */
export function useLanguage(): SupportedLanguage {
  const [lang, setLang] = useState<SupportedLanguage>('en');

  useEffect(() => {
    setLang(getBrowserLanguage());
  }, []);

  return lang;
}

/**
 * Hook to get translations for a specific page
 */
export function useTranslations(lang: SupportedLanguage) {
  const locale = locales[lang] || locales.en;
  return {
    landing: locale.landing,
    interview: locale.interview,
    results: locale.results,
    payment: locale.payment,
    help: locale.help,
  };
}
