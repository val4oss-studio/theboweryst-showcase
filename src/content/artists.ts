import type { LocalizedText } from '@/config/locales';

/** A tattoo artist of the studio, resident or guest. */
export interface Artist {
  /** Stable slug: React keys, structured data ids. */
  id: string;
  name: string;
  /** Instagram account, without `@`; also the account synced by val4oss-media. */
  instagram: string;
  bio: LocalizedText;
  /** Path in `public/`. */
  photo?: string;
}

/** Resident artists, in display order. */
export const artists: Artist[] = [
  {
    id: 'miss-bunny',
    name: 'Miss Bunny',
    instagram: 'missbunnytattoo',
    bio: {
      fr: 'Souvent contactée pour des projets en réalisme, principalement animalier et portrait, mais je fais aussi beaucoup de petits motifs comme du floral',
      en: 'Often approached for realism projects, mainly animal and portrait, but I also do a lot of small designs like florals',
    },
    photo: '/artists/missbunny.jpeg',
  },
  {
    id: 'manolita',
    name: 'Manolita',
    instagram: 'manolita_ink',
    bio: {
      fr: 'Je réalise toutes sortes de style mais mes domaines de prédilection sont le neotraditionnel couleur et le blackwork!',
      en: 'I work in all styles but my specialties are color neotraditional and blackwork!',
    },
    photo: '/artists/manolita.jpeg',
  },
  {
    id: 'lisa',
    name: 'Lisa',
    instagram: 'lisayekita',
    bio: {
      fr: 'Mon travail est inspiré des codes du tatouage traditionnel américain, européen et ornemental.',
      en: 'My work is inspired by the codes of American traditional, European, and ornamental tattooing.',
    },
    photo: '/artists/lisa.jpeg',
  },
];

export function getArtistInstagramUrl(artist: Artist): string {
  return `https://www.instagram.com/${artist.instagram}/`;
}

export function getArtistPhoto(artist: Artist): string {
  return artist.photo || '/default-avatar.jpg';
}
