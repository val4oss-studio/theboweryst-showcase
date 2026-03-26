export const SECTION_IDS = {
  home: 'home',
  about: 'about',
  artists: 'artists',
  gallery: 'gallery',
  contact: 'contact',
} as const;

export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];

// Order used by SnapScroll
export const ORDERED_SECTIONS: SectionId[] = [
  SECTION_IDS.home,
  SECTION_IDS.about,
  SECTION_IDS.artists,
  SECTION_IDS.gallery,
  SECTION_IDS.contact,
];
