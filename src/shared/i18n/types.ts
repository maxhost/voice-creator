/**
 * Supported languages in the application
 */
export type SupportedLanguage = 'es' | 'en' | 'de' | 'fr' | 'pt' | 'pt-BR' | 'ca';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['es', 'en', 'de', 'fr', 'pt', 'pt-BR', 'ca'];

/**
 * Get the user's preferred language from the browser
 */
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language;
  if (browserLang === 'pt-BR') return 'pt-BR';

  const baseLang = browserLang.split('-')[0].toLowerCase();

  const langMap: Record<string, SupportedLanguage> = {
    es: 'es', en: 'en', de: 'de', fr: 'fr', pt: 'pt', ca: 'ca',
  };

  return langMap[baseLang] || 'en';
}
