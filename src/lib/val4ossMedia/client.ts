/**
 * Server-side client of the val4oss-media API. `server-only` makes a client
 * component that imports it fail the build: the API key stays on the server.
 */
import 'server-only';

import { val4ossMediaConfig } from './config';
import { feedSchema } from './schema';
import type { FeedDto } from './schema';

/**
 * ISR fallback period of the feeds; the webhook refreshes them sooner.
 * Far below the 7 days of the signed media URLs: a page never keeps
 * expired ones.
 */
export const INSTAGRAM_REVALIDATE_SECONDS = 6 * 3600;

const TIMEOUT_MS = 10_000;

export type Val4ossMediaErrorReason =
  | 'config'
  | 'network'
  | 'unauthorized'
  | 'not_found'
  | 'rate_limited'
  | 'server'
  | 'invalid_response';

/** Why a feed could not be read. The message never holds the API key. */
export class Val4ossMediaError extends Error {
  readonly reason: Val4ossMediaErrorReason;

  constructor(reason: Val4ossMediaErrorReason, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'Val4ossMediaError';
    this.reason = reason;
  }
}

export type FeedResult =
  { ok: true; feed: FeedDto; baseUrl: URL } | { ok: false; error: Val4ossMediaError };

/** Cache tag of an account feed, revalidated by the webhook. */
export function instagramTag(account: string): string {
  return `instagram:${account.toLowerCase()}`;
}

/**
 * Last synced feed of `account`, cached by Next.js under its tag.
 * Never throws: the page decides how to render without it.
 */
export async function fetchInstagramFeed(account: string): Promise<FeedResult> {
  let config;
  try {
    config = val4ossMediaConfig();
  } catch (error) {
    return failure('config', 'invalid configuration', error);
  }

  const url = new URL(`/v1/instagram/${encodeURIComponent(account)}`, config.baseUrl);
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${config.apiKey}`, Accept: 'application/json' },
      // A redirect could carry the key to another host.
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: INSTAGRAM_REVALIDATE_SECONDS, tags: [instagramTag(account)] },
    });
  } catch (error) {
    return failure('network', `request to ${url.host} failed`, error);
  }

  if (!response.ok) {
    return failure(reasonOf(response.status), `${url.pathname} answered ${response.status}`);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    return failure('invalid_response', 'response is not JSON', error);
  }
  const parsed = feedSchema.safeParse(body);
  if (!parsed.success) {
    return failure('invalid_response', 'unexpected feed shape', parsed.error);
  }
  return { ok: true, feed: parsed.data, baseUrl: config.baseUrl };
}

function reasonOf(status: number): Val4ossMediaErrorReason {
  if (status === 401) return 'unauthorized';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limited';
  return 'server';
}

function failure(reason: Val4ossMediaErrorReason, message: string, cause?: unknown): FeedResult {
  return { ok: false, error: new Val4ossMediaError(reason, message, { cause }) };
}
