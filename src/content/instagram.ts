/**
 * Instagram posts: props of the card. Its interface texts live in the
 * i18n dictionaries (`gallery.post`).
 * Imported by the client card, so it must never import the feed itself:
 * the data lives in `instagramFeed.ts`, for Server Components only.
 */
import type { Locale } from '@/config/locales';

export type InstagramPostType = 'image' | 'carousel' | 'reel';

export interface InstagramMedia {
  kind: 'image' | 'video';
  /** Absolute URL of the file. */
  src: string;
}

export interface InstagramPost {
  shortcode: string;
  /** Post page on instagram.com. */
  url: string;
  type: InstagramPostType;
  caption: string;
  /** ISO 8601 date. */
  postedAt: string;
  /** `null` when the account hides its like counts. */
  likes: number | null;
  comments: number;
  /** Cover image (the thumbnail, also the poster of a reel). */
  cover: string;
  media: InstagramMedia[];
}

export interface InstagramFeed {
  account: string;
  profileUrl: string;
  fetchedAt: string;
  posts: InstagramPost[];
}

/** Counts in the page locale (`fr`: 12 345, `en`: 12,345). */
export function formatInstagramCount(count: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(count);
}
