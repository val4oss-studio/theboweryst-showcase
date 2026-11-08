import { MetadataRoute } from 'next'
import { locales } from '@/config/locales';
import { localeUrl } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(locales.map((locale) => [locale, localeUrl(locale)])),
    'x-default': localeUrl('fr'),
  };

  return locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages },
  }));
}
