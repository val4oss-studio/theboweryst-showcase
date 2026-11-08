import type { Metadata } from 'next';
import { locales, type Locale } from '@/config/locales';
import {
  OG_IMAGE,
  OPEN_GRAPH_LOCALES,
  SEO_KEYWORDS,
  SEO_TEXT,
  localeUrl,
} from '@/config/seo';

/** Metadata of the home page in `locale`, with its language alternates. */
export function buildHomeMetadata(locale: Locale): Metadata {
  const url = localeUrl(locale);
  const image = { ...OG_IMAGE, alt: SEO_TEXT.imageAlt[locale] };

  return {
    title: { absolute: SEO_TEXT.title[locale] },
    description: SEO_TEXT.description[locale],
    keywords: SEO_KEYWORDS[locale],
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localeUrl(l)])),
        'x-default': localeUrl('fr'),
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'The Bowery Street',
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => OPEN_GRAPH_LOCALES[l]),
      title: SEO_TEXT.title[locale],
      description: SEO_TEXT.socialDescription[locale],
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: SEO_TEXT.title[locale],
      description: SEO_TEXT.socialDescription[locale],
      images: [image],
    },
  };
}
