import { defaultLocale, type Locale, type LocalizedText } from '@/config/locales';

/**
 * SEO data of the site: canonical URLs, localized titles, descriptions and
 * keywords. The studio and its artists come from `src/content/`.
 */
export const SITE_URL = 'https://theboweryst.fr';

/** Request header set by the proxy, read by the root layout for `<html lang>`. */
export const LOCALE_HEADER = 'x-locale';

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_GB',
};

/** Absolute URL of the home page in `locale` (French lives at `/`). */
export function localeUrl(locale: Locale): string {
  return locale === defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
}

export const SEO_TEXT = {
  title: {
    fr: 'The Bowery Street | Salon de tatouage à Lorient, Morbihan (56)',
    en: 'The Bowery Street | Tattoo studio in Lorient, Brittany, France',
  },
  description: {
    fr: 'Salon de tatouage à Lorient (Morbihan, 56) avec trois tatoueuses : Miss Bunny (@missbunnytattoo), Manolita (@manolita_ink) et Lisa (@lisayekita).',
    en: 'Tattoo studio in Lorient, Brittany, France, with three tattoo artists: Miss Bunny (@missbunnytattoo), Manolita (@manolita_ink) and Lisa (@lisayekita).',
  },
  socialDescription: {
    fr: 'Salon de tatouage à Lorient (56) avec trois tatoueuses : Miss Bunny, Manolita et Lisa.',
    en: 'Tattoo studio in Lorient, Brittany, with three tattoo artists: Miss Bunny, Manolita and Lisa.',
  },
  imageAlt: {
    fr: 'Logo du salon de tatouage The Bowery Street à Lorient',
    en: 'Logo of The Bowery Street tattoo studio in Lorient',
  },
  artistJobTitle: {
    fr: 'Tatoueuse',
    en: 'Tattoo artist',
  },
  guestSpot: {
    fr: 'Guest spot de {name} au salon {shop}',
    en: '{name} guest spot at {shop}',
  },
} satisfies Record<string, LocalizedText>;

export const SEO_KEYWORDS: Record<Locale, string[]> = {
  fr: [
    'tatouage lorient',
    'salon de tatouage lorient',
    'tatoueuse lorient',
    'tatoueur lorient',
    'tatouage morbihan',
    'tatouage 56',
    'tatouage bretagne',
    'the bowery street',
    'the boweryst',
    'miss bunny tattoo',
    'missbunnytattoo',
    'manolita ink',
    'lisayekita',
    'tatouage réalisme lorient',
    'tatouage néotraditionnel',
    'blackwork lorient',
  ],
  en: [
    'tattoo lorient',
    'tattoo studio lorient',
    'tattoo artist lorient',
    'tattoo morbihan',
    'tattoo brittany',
    'the bowery street',
    'the boweryst',
    'miss bunny tattoo',
    'missbunnytattoo',
    'manolita ink',
    'lisayekita',
    'realism tattoo france',
    'neo traditional tattoo',
    'blackwork tattoo',
  ],
};

/** Social image: 1200 × 630, in `public/`. */
export const OG_IMAGE = { url: '/og-image.jpg', width: 1200, height: 630 };
