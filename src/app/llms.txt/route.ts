import { SITE_URL, localeUrl } from '@/config/seo';
import { artists, getArtistInstagramUrl, type Artist } from '@/content/artists';
import { formatGuestDates, getActiveGuests } from '@/content/guests';
import { getShopAddress, shop } from '@/content/shop';

/**
 * `/llms.txt`: plain Markdown summary of the studio for AI agents
 * (https://llmstxt.org), from the same content as the home page.
 * Regenerated hourly: guest spots come and go with the date.
 */
export const revalidate = 3600;

type Locale = 'fr' | 'en';

const COLON: Record<Locale, string> = { fr: ' :', en: ':' };

function artistLine(artist: Artist, locale: Locale, role: string): string {
  return `- **${artist.name}** (@${artist.instagram}), ${role} — Instagram${COLON[locale]} ${getArtistInstagramUrl(artist)}\n  ${artist.bio[locale]}`;
}

export function GET(): Response {
  const guests = getActiveGuests();
  const address = `${getShopAddress()}, France`;

  const guestSection = (locale: Locale, title: string, role: string) =>
    guests.length === 0
      ? ''
      : `\n## ${title}\n\n${guests
          .map((guest) => artistLine(guest, locale, `${role} (${formatGuestDates(guest, locale)})`))
          .join('\n')}\n`;

  const body = `# ${shop.name}

> ${shop.name} (aussi écrit « ${shop.alternateNames[0]} ») est un salon de tatouage à ${shop.addressCity}, dans le ${shop.addressRegion} (56), en Bretagne, ouvert en août 2024. ${artists.length} tatoueuses y travaillent : ${artists.map((a) => a.name).join(', ')}.

## Le salon

- Adresse : ${address}
- Horaires : ${shop.scheduleWeekdays.fr} ; ${shop.scheduleWeekend.fr}
- Prise de rendez-vous et contact : par message Instagram au salon ou à la tatoueuse
- Instagram : ${shop.instagramUrl}
- Facebook : ${shop.facebookUrl}
- Plan : ${shop.mapUrl}
- Site : ${localeUrl('fr')}

## Les tatoueuses du salon

${artists.map((artist) => artistLine(artist, 'fr', `tatoueuse au salon ${shop.name}`)).join('\n')}
${guestSection('fr', 'Tatoueuses en guest', `en guest au salon ${shop.name}`)}
## In English

${shop.name} is a tattoo studio in ${shop.addressCity}, Morbihan, Brittany, France, opened in August 2024, with ${artists.length} resident tattoo artists. Address: ${address}. Hours: ${shop.scheduleWeekdays.en}; ${shop.scheduleWeekend.en}. Bookings by Instagram message. English site: ${localeUrl('en')}

${artists.map((artist) => artistLine(artist, 'en', `tattoo artist at ${shop.name}`)).join('\n')}
${guestSection('en', 'Guest artists', `guest artist at ${shop.name}`)}
## Pages

- [Accueil (fr)](${localeUrl('fr')}): présentation, tatoueuses, galerie, contact
- [Home (en)](${localeUrl('en')}): about, artists, gallery, contact
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
