import type { Locale } from '@/config/locales';
import type { ArtistEntity } from '@/domain/entities/artistEntity';
import type { ShopEntity } from '@/domain/entities/shopEntity';
import {
  buildHomeStructuredData,
  serializeJsonLd,
} from '@/app/lib/seo/structuredData';

interface StructuredDataProps {
  locale: Locale;
  shop: ShopEntity;
  artists: ArtistEntity[];
}

/**
 * JSON-LD of the home page, rendered in the server HTML: crawlers and AI
 * agents that do not run JavaScript read it too.
 */
export function StructuredData({ locale, shop, artists }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildHomeStructuredData(locale, shop, artists)),
      }}
    />
  );
}
