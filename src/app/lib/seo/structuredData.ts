import type { Locale } from '@/config/locales';
import { OG_IMAGE, SEO_TEXT, SITE_URL, localeUrl } from '@/config/seo';
import { getArtistInstagramUrl, type Artist } from '@/content/artists';
import type { Guest } from '@/content/guests';
import { shop } from '@/content/shop';

const STUDIO_ID = `${SITE_URL}/#studio`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

type Node = { '@id': string } & Record<string, unknown>;

function person(artist: Artist, locale: Locale): Node {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#artist-${artist.id}`,
    name: artist.name,
    alternateName: [artist.instagram, `@${artist.instagram}`],
    sameAs: [getArtistInstagramUrl(artist)],
    jobTitle: SEO_TEXT.artistJobTitle[locale],
    description: artist.bio[locale],
    ...(artist.photo && { image: absoluteUrl(artist.photo) }),
  };
}

/**
 * schema.org graph of the home page: the website, the studio, its resident
 * artists (each linked to the studio by `worksFor` and to her Instagram)
 * and the guest spots as events at the studio, so search engines and AI
 * agents tie them together.
 */
export function buildHomeStructuredData(
  locale: Locale,
  residents: Artist[],
  guests: Guest[]
): Record<string, unknown> {
  const pageUrl = localeUrl(locale);
  const studio = { '@id': STUDIO_ID };

  const residentNodes = residents.map((artist) => ({
    ...person(artist, locale),
    worksFor: studio,
    workLocation: studio,
  }));
  const guestNodes = guests.map((guest) => person(guest, locale));
  const guestSpots = guests.map((guest, index) => ({
    '@type': 'Event',
    '@id': `${SITE_URL}/#guest-${guest.id}-${guest.from}`,
    name: SEO_TEXT.guestSpot[locale]
      .replace('{name}', guest.name)
      .replace('{shop}', shop.name),
    startDate: guest.from,
    endDate: guest.to,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: studio,
    organizer: studio,
    performer: { '@id': guestNodes[index]['@id'] },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: shop.name,
        alternateName: shop.alternateNames[0],
        inLanguage: ['fr', 'en'],
        publisher: studio,
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: SEO_TEXT.title[locale],
        description: SEO_TEXT.description[locale],
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
        about: studio,
        mentions: [...residentNodes, ...guestNodes].map((node) => ({ '@id': node['@id'] })),
      },
      {
        '@type': 'TattooParlor',
        '@id': STUDIO_ID,
        name: shop.name,
        alternateName: shop.alternateNames,
        description: shop.description[locale],
        url: pageUrl,
        logo: absoluteUrl('/theboweryst-logo.png'),
        image: absoluteUrl(OG_IMAGE.url),
        address: {
          '@type': 'PostalAddress',
          streetAddress: shop.addressStreet,
          postalCode: shop.addressZip,
          addressLocality: shop.addressCity,
          addressRegion: shop.addressRegion,
          addressCountry: 'FR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: shop.latitude,
          longitude: shop.longitude,
        },
        hasMap: shop.mapUrl,
        areaServed: shop.areaServed.map((name) => ({ '@type': 'Place', name })),
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: shop.openingHours.days,
          opens: shop.openingHours.opens,
          closes: shop.openingHours.closes,
        },
        foundingDate: shop.foundingDate,
        sameAs: [shop.instagramUrl, shop.facebookUrl],
        employee: residentNodes.map((node) => ({ '@id': node['@id'] })),
        ...(guestSpots.length > 0 && {
          event: guestSpots.map((spot) => ({ '@id': spot['@id'] })),
        }),
      },
      ...residentNodes,
      ...guestNodes,
      ...guestSpots,
    ],
  };
}

/** JSON for a `<script type="application/ld+json">`: `<` escaped. */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
