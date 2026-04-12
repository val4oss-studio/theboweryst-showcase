import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/config/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: locale === defaultLocale ? 'https://theboweryst.fr/' : `https://theboweryst.fr/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: {
        fr: 'https://theboweryst.fr/',
        en: 'https://theboweryst.fr/en',
      },
    },
  }));
}
