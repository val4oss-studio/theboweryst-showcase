import type { Locale } from '@/config/locales';
import type { Artist } from '@/content/artists';
import type { Guest } from '@/content/guests';
import {
  buildHomeStructuredData,
  serializeJsonLd,
} from '@/app/lib/seo/structuredData';

interface StructuredDataProps {
  locale: Locale;
  residents: Artist[];
  guests: Guest[];
}

/**
 * JSON-LD of the home page, rendered in the server HTML: crawlers and AI
 * agents that do not run JavaScript read it too.
 */
export function StructuredData({ locale, residents, guests }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildHomeStructuredData(locale, residents, guests)),
      }}
    />
  );
}
