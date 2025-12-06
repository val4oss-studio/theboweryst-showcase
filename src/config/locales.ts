export type Locale = 'fr' | 'en';

export const locales: Locale[] = ['fr', 'en'];

export const defaultLocale: Locale = 'fr';

// Shared type : each locale have this translation
export type LocalizedText = Record<Locale, string>;
