'use client';

import { useState, useEffect } from 'react';
import { getBrowserLanguage, type SupportedLanguage } from './translations';

/**
 * Hook to get the current language and translation helper
 */
export function useLanguage() {
  const [lang, setLang] = useState<SupportedLanguage>('en');

  useEffect(() => {
    setLang(getBrowserLanguage());
  }, []);

  return lang;
}

/**
 * Get translation from a translations object
 */
export function getTranslation<T extends Record<SupportedLanguage, string>>(
  translations: T,
  lang: SupportedLanguage
): string {
  return translations[lang] || translations.en;
}
