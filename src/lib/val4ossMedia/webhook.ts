/**
 * Verification of the revalidation webhook that val4oss-media sends after
 * each sync:
 *
 *   POST {"event":"instagram.feed.updated","account":"<account>"}
 *   X-Val4oss-Timestamp: <Unix seconds>
 *   X-Val4oss-Signature: base64url(HMAC-SHA256(secret, "<timestamp>.<raw body>"))
 *
 * The signature proves the request comes from the service; the timestamp
 * window stops a captured request from being replayed later.
 */
import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

import { z } from 'zod';

export const TIMESTAMP_HEADER = 'x-val4oss-timestamp';
export const SIGNATURE_HEADER = 'x-val4oss-signature';
/** Oldest (and furthest in the future, for clock skew) accepted timestamp. */
export const MAX_AGE_SECONDS = 5 * 60;
/** The real body is about 70 bytes. */
export const MAX_BODY_BYTES = 1024;

const eventSchema = z.object({
  event: z.literal('instagram.feed.updated'),
  account: z.string().regex(/^[a-z0-9_][a-z0-9._]{0,29}$/),
});

export type WebhookEvent = z.infer<typeof eventSchema>;

/** For the server logs only: the sender always gets the same answer. */
export type WebhookRejection = 'malformed_headers' | 'bad_signature' | 'stale' | 'invalid_body';

export type WebhookResult =
  { ok: true; event: WebhookEvent } | { ok: false; reason: WebhookRejection };

export interface WebhookRequest {
  timestamp: string | null;
  signature: string | null;
  /** The body exactly as received: the signature covers its bytes. */
  body: string;
  secret: string;
  /** Current time, in Unix seconds. */
  now: number;
}

/** Checks the signature, then the timestamp, then the body. */
export function verifyWebhook({
  timestamp,
  signature,
  body,
  secret,
  now,
}: WebhookRequest): WebhookResult {
  // Strict formats: `Number(' 1e9 ')` or a lenient base64 decoding would
  // accept values the service never sends.
  if (!timestamp || !/^\d{1,12}$/.test(timestamp) || !signature) {
    return { ok: false, reason: 'malformed_headers' };
  }
  if (!signatureMatches(secret, `${timestamp}.${body}`, signature)) {
    return { ok: false, reason: 'bad_signature' };
  }
  // After the signature: the timestamp of a forged request means nothing.
  if (Math.abs(now - Number(timestamp)) > MAX_AGE_SECONDS) {
    return { ok: false, reason: 'stale' };
  }
  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return { ok: false, reason: 'invalid_body' };
  }
  const parsed = eventSchema.safeParse(json);
  return parsed.success ? { ok: true, event: parsed.data } : { ok: false, reason: 'invalid_body' };
}

function signatureMatches(secret: string, message: string, signature: string): boolean {
  if (!/^[A-Za-z0-9_-]{43}$/.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(message).digest();
  const received = Buffer.from(signature, 'base64url');
  // Constant time: the comparison must not reveal how many bytes match.
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/**
 * The body as text, or `null` when it exceeds `maxBytes`. Reads the
 * stream itself: `Content-Length` may be missing or lie.
 */
export async function readBodyLimited(request: Request, maxBytes: number): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}
