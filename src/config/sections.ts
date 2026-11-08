export const SECTION_IDS = {
  home: 'home',
  about: 'about',
  artists: 'artists',
  gallery: 'gallery',
  contact: 'contact',
} as const;

export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];

