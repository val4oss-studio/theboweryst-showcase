import type { LocalizedText } from '@/config/locales';

/**
 * The studio: what the pages, the structured data and `llms.txt` show.
 * Versioned content: a change goes through a commit and a deployment.
 */
export interface Shop {
  name: string;
  /** Other names people search for. */
  alternateNames: string[];
  description: LocalizedText;
  addressStreet: string;
  addressZip: string;
  addressCity: string;
  /** Département, for the structured data. */
  addressRegion: string;
  /** ISO 3166-2 code of the département. */
  regionCode: string;
  latitude: number;
  longitude: number;
  mapUrl: string;
  instagramUrl: string;
  instagramUsername: string;
  facebookUrl: string;
  facebookUsername: string;
  /** Opening hours, structured (schema.org days, 24 h times). */
  openingHours: { days: string[]; opens: string; closes: string };
  /** The same hours as displayed; keep both in sync. */
  scheduleWeekdays: LocalizedText;
  scheduleWeekend: LocalizedText;
  /** `YYYY-MM`. */
  foundingDate: string;
  /** Towns of the area, for `areaServed`. */
  areaServed: string[];
}

export const shop: Shop = {
  name: 'The Bowery Street',
  alternateNames: ['The Boweryst', 'The Bowery Street Tattoo'],
  description: {
    fr: 'Salon de tatouage à Lorient, dans le Morbihan (56), en Bretagne. Trois tatoueuses passionnées y créent des tatouages uniques depuis août 2024.',
    en: 'Tattoo studio in Lorient, Morbihan, Brittany, France. Three passionate tattoo artists have been creating unique tattoos there since August 2024.',
  },
  addressStreet: '6 Rue de Turenne',
  addressZip: '56100',
  addressCity: 'Lorient',
  addressRegion: 'Morbihan',
  regionCode: 'FR-56',
  // Marker of the studio's Google Maps listing.
  latitude: 47.7498903,
  longitude: -3.3606543,
  // Google Maps business listing of the studio (not the bare address).
  mapUrl: 'https://www.google.com/maps/place/The+Bowery+street/@47.7499384,-3.3605396,21z/data=!4m15!1m8!3m7!1s0x48105e575a38cb81:0xd2530f43600e6e94!2s6+Rue+Turenne,+56100+Lorient!3b1!8m2!3d47.7499308!4d-3.3606628!16s%2Fg%2F11c29xv_8y!3m5!1s0x48105f002dff4881:0xc95ddad2a928916e!8m2!3d47.7498903!4d-3.3606543!16s%2Fg%2F11lmhq23f8',
  instagramUrl: 'https://www.instagram.com/theboweryst/',
  instagramUsername: 'theboweryst',
  facebookUrl: 'https://www.facebook.com/share/1DpTvDjBrQ',
  facebookUsername: 'The Bowery Street',
  openingHours: {
    days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '11:00',
    closes: '18:00',
  },
  scheduleWeekdays: {
    fr: 'Mardi - Samedi : 11h - 18h',
    en: 'Tuesday - Saturday: 11am - 6pm',
  },
  scheduleWeekend: {
    fr: 'Dimanche - Lundi : Fermé',
    en: 'Sunday - Monday: Closed',
  },
  foundingDate: '2024-08',
  areaServed: ['Lorient', 'Lanester', 'Ploemeur', 'Larmor-Plage', 'Quéven', 'Hennebont', 'Morbihan', 'Bretagne'],
};

export function getShopAddress(): string {
  return `${shop.addressStreet}, ${shop.addressZip} ${shop.addressCity}`;
}
