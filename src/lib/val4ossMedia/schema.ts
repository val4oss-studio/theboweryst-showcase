/**
 * Runtime validation of the val4oss-media responses. The API is ours, but
 * its answer crosses the network: nothing is trusted before it parses.
 *
 * Each schema `satisfies` the type generated from the OpenAPI document
 * (`api.d.ts`): after `npm run generate:api`, a contract change that the
 * schemas miss fails the type check.
 */
import { z } from 'zod';

import type { components } from './api';

type Schemas = components['schemas'];

const unixSeconds = z.number().int().nonnegative();
const count = z.number().int().nonnegative();
/** Only Instagram pages: these URLs end up in `href` attributes. */
const instagramUrl = z.url({ protocol: /^https$/, hostname: /^www\.instagram\.com$/ });

export const mediaSchema = z.object({
  index: z.number().int().min(0).max(255),
  kind: z.enum(['image', 'video']),
  // A path of the service: `//host/...` would point the page elsewhere.
  url: z.string().startsWith('/media/'),
}) satisfies z.ZodType<Schemas['Media']>;

export const postSchema = z.object({
  shortcode: z.string().regex(/^[A-Za-z0-9_-]+$/),
  kind: z.enum(['image', 'carousel', 'reel']),
  caption: z.string(),
  posted_at: unixSeconds,
  likes: count.nullable(),
  comments: count.nullable(),
  permalink: instagramUrl,
  cover: mediaSchema,
  media: z.array(mediaSchema),
}) satisfies z.ZodType<Schemas['Post']>;

export const feedSchema = z.object({
  account: z.string().min(1),
  profile_url: instagramUrl,
  fetched_at: unixSeconds,
  posts: z.array(postSchema),
}) satisfies z.ZodType<Schemas['Feed']>;

export type MediaDto = z.infer<typeof mediaSchema>;
export type PostDto = z.infer<typeof postSchema>;
export type FeedDto = z.infer<typeof feedSchema>;
