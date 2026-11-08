import { SITE_URL, STUDIO_PLACE, localeUrl } from '@/config/seo';
import { getArtistInstagramUrl } from '@/domain/entities/artistEntity';
import { getAllArtists } from '@/domain/services/artistService';
import { getShop } from '@/domain/services/shopService';

/**
 * `/llms.txt`: plain Markdown summary of the studio for AI agents
 * (https://llmstxt.org), built from the database like the home page.
 */
export const revalidate = 3600;

export function GET(): Response {
  const shop = getShop();
  const artists = getAllArtists();
  if (!shop) return new Response(null, { status: 404 });

  const address = `${shop.addressStreet}, ${shop.addressZip} ${shop.addressCity}`;
  const artistLines = (locale: 'fr' | 'en', job: string) =>
    artists.map((artist) => {
      const instagram = getArtistInstagramUrl(artist);
      const handle = artist.instagramName ? ` (@${artist.instagramName})` : '';
      const link = instagram ? ` — Instagram${locale === 'fr' ? ' :' : ':'} ${instagram}` : '';
      return `- **${artist.username}**${handle}, ${job} ${shop.name}${link}\n  ${artist.bio[locale]}`;
    }).join('\n');

  const body = `# ${shop.name}

> ${shop.name} (aussi écrit « The Boweryst ») est un salon de tatouage à ${shop.addressCity}, dans le ${STUDIO_PLACE.region} (56), en Bretagne, ouvert en août 2024. ${artists.length} tatoueuses y travaillent : ${artists.map((a) => a.username).join(', ')}.

## Le salon

- Adresse : ${address}, France
- Horaires : ${shop.scheduleWeekdays.fr} ; ${shop.scheduleWeekend.fr}
- Prise de rendez-vous et contact : par message Instagram au salon ou à la tatoueuse
- Instagram : ${shop.instagramUrl}
- Facebook : ${shop.facebookUrl}
- Plan : ${shop.mapUrl}
- Site : ${localeUrl('fr')}

## Les tatoueuses du salon

${artistLines('fr', 'tatoueuse au salon')}

## In English

${shop.name} is a tattoo studio in ${shop.addressCity}, Morbihan, Brittany, France, opened in August 2024, with ${artists.length} resident tattoo artists. Address: ${address}, France. Hours: ${shop.scheduleWeekdays.en}; ${shop.scheduleWeekend.en}. Bookings by Instagram message. English site: ${localeUrl('en')}

${artistLines('en', 'tattoo artist at')}

## Pages

- [Accueil (fr)](${localeUrl('fr')}): présentation, tatoueuses, galerie, contact
- [Home (en)](${localeUrl('en')}): about, artists, gallery, contact
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
