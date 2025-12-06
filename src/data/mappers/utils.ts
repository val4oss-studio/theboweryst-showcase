import type { LocalizedText } from '@/config/locales';
import { locales, defaultLocale } from '@/config/locales';

/**
 * Parse JSON from json_group_object and apply defaultLocale fallback if no
 * transaltion
 */
export function parseLocalizedText(json: string | null): LocalizedText {
  const raw: Partial<Record<string, string>> = json ? JSON.parse(json) : {};
  const fallback = raw[defaultLocale] ?? '';
  const result: Partial<LocalizedText> = {};
  for (const locale of locales) {
    result[locale] = raw[locale] ?? fallback;
  }
  return result as LocalizedText;
}
