/**
 * Instagram feed, for Server Components only: pages pass each post to the
 * client card as a prop, so only the displayed posts reach the browser.
 *
 * Replaces the static `src/data/instagram.json` import: the feed now comes
 * from val4oss-media and its media from signed URLs of the service.
 */
import 'server-only';

import { connection } from 'next/server';

import type { InstagramFeed, InstagramMedia, InstagramPost } from '@/content/instagram';
import { fetchInstagramFeed } from '@/lib/val4ossMedia';
import type { FeedDto, MediaDto, PostDto } from '@/lib/val4ossMedia';

/**
 * Feed of `account`, or `null` when the service cannot give it: the page
 * keeps rendering, without its gallery. The cause goes to the server logs.
 */
export async function getInstagramFeed(account: string): Promise<InstagramFeed | null> {
  // Rendered on request, never at build: the image is built without the
  // API key, and a page prerendered without its feed would stay so. The
  // feed itself stays cached (tag and revalidate of `fetchInstagramFeed`).
  await connection();
  const result = await fetchInstagramFeed(account);
  if (!result.ok) {
    console.error(
      `instagram feed of ${account} unavailable (${result.error.reason})`,
      result.error
    );
    return null;
  }
  return toInstagramFeed(result.feed, result.baseUrl);
}

/** Maps the API feed to the card props; media URLs become absolute. */
export function toInstagramFeed(feed: FeedDto, baseUrl: URL): InstagramFeed {
  return {
    account: feed.account,
    profileUrl: feed.profile_url,
    fetchedAt: isoDate(feed.fetched_at),
    posts: feed.posts.map((post) => toInstagramPost(post, baseUrl)),
  };
}

function toInstagramPost(post: PostDto, baseUrl: URL): InstagramPost {
  return {
    shortcode: post.shortcode,
    url: post.permalink,
    type: post.kind,
    caption: post.caption,
    postedAt: isoDate(post.posted_at),
    likes: post.likes,
    // The card always shows a count: unknown reads as none.
    comments: post.comments ?? 0,
    cover: absoluteUrl(post.cover, baseUrl),
    // Empty for a reel (videos are not stored): the card links to Instagram.
    media: post.media.map((media) => toInstagramMedia(media, baseUrl)),
  };
}

function toInstagramMedia(media: MediaDto, baseUrl: URL): InstagramMedia {
  return { kind: media.kind, src: absoluteUrl(media, baseUrl) };
}

function absoluteUrl(media: MediaDto, baseUrl: URL): string {
  return new URL(media.url, baseUrl).toString();
}

function isoDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString();
}
