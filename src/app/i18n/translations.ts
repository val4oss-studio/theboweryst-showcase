import type { Locale } from '@/config/locales'
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';

const translations = {
  en: enTranslations,
  fr: frTranslations,
};

export type Translations = typeof enTranslations;

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en;
}

export function getNestedTranslation(
  translations: Translations,
  key: string
): string {
  const keys = key.split('.');
  let value: Translations | string | Record<string, unknown> = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value] as Translations | string | Record<string, unknown>;
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}
