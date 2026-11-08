/**
 * Server environment of the val4oss-media client. Read on each call (cheap)
 * rather than at import: `next build` imports modules whose pages may not
 * need the service. Call it from `instrumentation.ts` to fail at startup.
 */
import 'server-only';

import { z } from 'zod';

export interface Val4ossMediaConfig {
  /** Origin of the service, e.g. `https://media.val4oss.com`. */
  baseUrl: URL;
  /** `vm_<key_id>_<secret>`: never logged, never sent to the browser. */
  apiKey: string;
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

const baseUrlSchema = z
  .url({ protocol: /^https?$/ })
  .transform((value) => new URL(value))
  // The key travels in a header: plain HTTP only to this machine.
  .refine((url) => url.protocol === 'https:' || LOCAL_HOSTS.has(url.hostname), {
    message: 'must use https',
  })
  .refine((url) => url.pathname === '/' && !url.search && !url.hash, {
    message: 'must be an origin, without path',
  });

const envSchema = z.object({
  VAL4OSS_MEDIA_URL: baseUrlSchema,
  VAL4OSS_MEDIA_KEY: z.string().regex(/^vm_[A-Za-z0-9_-]+$/, 'must be a vm_ API key'),
});

/**
 * Validates the environment.
 *
 * @throws {Error} naming the invalid variables, never their values.
 */
export function val4ossMediaConfig(
  env: Readonly<Record<string, string | undefined>> = process.env
): Val4ossMediaConfig {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`);
    throw new Error(`invalid val4oss-media configuration: ${problems.join('; ')}`);
  }
  return { baseUrl: parsed.data.VAL4OSS_MEDIA_URL, apiKey: parsed.data.VAL4OSS_MEDIA_KEY };
}

/** `whsec_` and 32 bytes in base64url, as `media-cli client set-webhook` shows it. */
const webhookSecretSchema = z
  .string()
  .regex(/^whsec_[A-Za-z0-9_-]{43}$/, 'must be a whsec_ secret')
  .optional();

/**
 * Secret of the revalidation webhook, or `null` when the site has none (it
 * then refreshes by ISR only).
 *
 * @throws {Error} when it is set but malformed, never echoing it.
 */
export function val4ossMediaWebhookSecret(
  env: Readonly<Record<string, string | undefined>> = process.env
): string | null {
  const parsed = webhookSecretSchema.safeParse(env.VAL4OSS_MEDIA_WEBHOOK_SECRET || undefined);
  if (!parsed.success) {
    throw new Error(
      'invalid val4oss-media configuration: VAL4OSS_MEDIA_WEBHOOK_SECRET must be a whsec_ secret'
    );
  }
  return parsed.data ?? null;
}
