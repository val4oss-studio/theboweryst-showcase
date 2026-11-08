import type { Artist } from '@/content/artists';

/** An artist visiting the studio for a guest spot. */
export interface Guest extends Artist {
  /** First day at the studio, `YYYY-MM-DD` (Europe/Paris). */
  from: string;
  /** Last day at the studio, `YYYY-MM-DD` (Europe/Paris). */
  to: string;
}

/**
 * Guest spots. A guest shows from the deployment until her last day, then
 * disappears by herself: no deployment needed to remove her. Put her
 * photo in `public/artists/guests/`.
 *
 * @example
 * {
 *   id: 'jane',
 *   name: 'Jane',
 *   instagram: 'jane_tattoo',
 *   bio: { fr: 'Blackwork et ornemental.', en: 'Blackwork and ornamental.' },
 *   photo: '/artists/guests/jane.jpeg',
 *   from: '2026-12-01',
 *   to: '2026-12-14',
 * }
 */
export const guests: Guest[] = [];

const STUDIO_TIME_ZONE = 'Europe/Paris';

/** Today at the studio, `YYYY-MM-DD`. */
function studioToday(now: Date): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: STUDIO_TIME_ZONE }).format(now);
}

/** Current and upcoming guests, by first day. */
export function getActiveGuests(now: Date = new Date()): Guest[] {
  const today = studioToday(now);
  return guests
    .filter((guest) => guest.to >= today)
    .toSorted((a, b) => a.from.localeCompare(b.from));
}

/** `1–14 décembre` / `December 1 – 14`, in the studio's time zone. */
export function formatGuestDates(guest: Guest, locale: string): string {
  // Noon UTC: the same calendar day in Europe/Paris.
  const day = (date: string) => new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: STUDIO_TIME_ZONE,
  }).formatRange(day(guest.from), day(guest.to));
}
