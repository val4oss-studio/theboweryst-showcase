/**
 * Revalidation webhook of val4oss-media: `POST /api/val4oss-media/webhook`,
 * the URL given to `media-cli client set-webhook`. Refreshes the cached feed
 * of the synced account.
 */
import { revalidateTag } from 'next/cache';

import {
  instagramTag,
  MAX_BODY_BYTES,
  readBodyLimited,
  SIGNATURE_HEADER,
  TIMESTAMP_HEADER,
  val4ossMediaWebhookSecret,
  verifyWebhook,
} from '@/lib/val4ossMedia';

// `node:crypto` is not available in the edge runtime.
export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  let secret: string | null;
  try {
    secret = val4ossMediaWebhookSecret();
  } catch (error) {
    console.error('val4oss-media webhook disabled', error);
    return new Response(null, { status: 500 });
  }
  // No secret, no webhook: nothing reveals that the route exists.
  if (!secret) return new Response(null, { status: 404 });

  const body = await readBodyLimited(request, MAX_BODY_BYTES);
  if (body === null) return new Response(null, { status: 413 });

  const result = verifyWebhook({
    timestamp: request.headers.get(TIMESTAMP_HEADER),
    signature: request.headers.get(SIGNATURE_HEADER),
    body,
    secret,
    now: Math.floor(Date.now() / 1000),
  });
  if (!result.ok) {
    console.warn(`val4oss-media webhook rejected (${result.reason})`);
    return new Response(null, { status: 401 });
  }

  // 'max': the next visit gets the cached page and triggers its refresh.
  revalidateTag(instagramTag(result.event.account), 'max');
  return new Response(null, { status: 204 });
}
