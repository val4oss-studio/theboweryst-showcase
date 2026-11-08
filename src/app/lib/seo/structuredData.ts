import type { Locale } from '@/config/locales';
import { OG_IMAGE, SEO_TEXT, SITE_URL, STUDIO_PLACE, localeUrl } from '@/config/seo';
import type { ArtistEntity } from '@/domain/entities/artistEntity';
import { getArtistInstagramUrl } from '@/domain/entities/artistEntity';
import type { ShopEntity } from '@/domain/entities/shopEntity';

const STUDIO_ID = `${SITE_URL}/#studio`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function artistId(artist: ArtistEntity): string {
  return `${SITE_URL}/#artist-${artist.instagramName || artist.id}`;
}

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * schema.org graph of the home page: the website, the studio and its
 * artists, each artist linked to the studio (`worksFor`) and to her
 * Instagram account, so search engines and AI agents tie them together.
 */
export function buildHomeStructuredData(
  locale: Locale,
  shop: ShopEntity,
  artists: ArtistEntity[]
): Record<string, unknown> {
  const pageUrl = localeUrl(locale);

  const people = artists.map((artist) => ({
    '@type': 'Person',
    '@id': artistId(artist),
    name: artist.username,
    ...(artist.instagramName && {
      alternateName: [artist.instagramName, `@${artist.instagramName}`],
      sameAs: [getArtistInstagramUrl(artist)],
    }),
    jobTitle: SEO_TEXT.artistJobTitle[locale],
    description: artist.bio[locale],
    ...(artist.profilePicture && { image: absoluteUrl(artist.profilePicture) }),
    worksFor: { '@id': STUDIO_ID },
    workLocation: { '@id': STUDIO_ID },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: shop.name,
        alternateName: 'The Boweryst',
        inLanguage: ['fr', 'en'],
        publisher: { '@id': STUDIO_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: SEO_TEXT.title[locale],
        description: SEO_TEXT.description[locale],
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': STUDIO_ID },
        mentions: people.map((person) => ({ '@id': person['@id'] })),
      },
      {
        '@type': 'TattooParlor',
        '@id': STUDIO_ID,
        name: shop.name,
        alternateName: ['The Boweryst', 'The Bowery Street Tattoo'],
        description: shop.description[locale],
        url: pageUrl,
        logo: absoluteUrl('/theboweryst-logo.png'),
        image: absoluteUrl(OG_IMAGE.url),
        address: {
          '@type': 'PostalAddress',
          streetAddress: shop.addressStreet,
          postalCode: shop.addressZip,
          addressLocality: shop.addressCity,
          addressRegion: STUDIO_PLACE.region,
          addressCountry: 'FR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: STUDIO_PLACE.latitude,
          longitude: STUDIO_PLACE.longitude,
        },
        hasMap: shop.mapUrl,
        areaServed: STUDIO_PLACE.areaServed.map((name) => ({ '@type': 'Place', name })),
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: STUDIO_PLACE.openingHours.days,
          opens: STUDIO_PLACE.openingHours.opens,
          closes: STUDIO_PLACE.openingHours.closes,
        },
        foundingDate: STUDIO_PLACE.foundingDate,
        sameAs: [shop.instagramUrl, shop.facebookUrl],
        employee: people.map((person) => ({ '@id': person['@id'] })),
      },
      ...people,
    ],
  };
}

/** JSON for a `<script type="application/ld+json">`: `<` escaped. */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
