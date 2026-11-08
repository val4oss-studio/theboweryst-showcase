/**
 * Checks the val4oss-media environment at startup: a bad deployment answers
 * 500 to every request (and logs the wrong variable) instead of silently
 * rendering the gallery without its posts.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { val4ossMediaConfig, val4ossMediaWebhookSecret } = await import(
      '@/lib/val4ossMedia'
    );
    val4ossMediaConfig();
    val4ossMediaWebhookSecret();
  }
}
