# Architecture -- Next.js 16+ / static content

Showcase website of a tattoo studio. No database: the studio, its artists
and its guest spots are typed content files versioned in git. The only
external data is the Instagram feed of each artist, served by
[val4oss-media](https://media.val4oss.com).

## Structure

```
src/
├── app/                          # Next.js: routes, components, i18n, SEO
│   ├── (fr)/                     #   `/`  (French, default locale)
│   ├── [locale]/                 #   `/en` (other locales; `/xyz` is a 404)
│   ├── api/val4oss-media/        #   revalidation webhook of the feed
│   ├── components/
│   │   ├── HomePage.tsx          #   the one-page site, shared by both routes
│   │   ├── layout/               #   Navbar, Footer, cards, StructuredData
│   │   └── sections/             #   [Name]Section.tsx, in page order
│   ├── i18n/                     #   UI texts (locales/*.json) and provider
│   ├── lib/seo/                  #   metadata and JSON-LD builders
│   └── llms.txt/route.ts         #   summary for AI agents
├── config/                       # locales, section ids, SEO texts
├── content/                      # versioned content (see below)
│   ├── shop.ts                   #   the studio: address, hours, socials
│   ├── artists.ts                #   resident artists
│   ├── guests.ts                 #   guest spots, with their dates
│   ├── instagram.ts              #   props of the Instagram card
│   └── instagramFeed.ts          #   feed from val4oss-media (server only)
├── lib/val4ossMedia/             # val4oss-media client (template, server only)
├── instrumentation.ts            # checks the val4oss-media env at startup
└── proxy.ts                      # `/fr` → `/`, locale header, unknown paths → 404
public/
├── artists/                      # artist photos (`guests/` for guest spots)
└── ...                           # logos, icons, social image, video
```

## Content

Everything the site says about the studio lives in `src/content/`, as
typed TypeScript objects. Translated fields are `LocalizedText`
(`Record<Locale, string>`, from `src/config/locales.ts`).

| Change | File |
|---|---|
| Address, hours, socials, description | `src/content/shop.ts` |
| Add, edit or reorder a resident | `src/content/artists.ts` + photo in `public/artists/` |
| Announce a guest spot | `src/content/guests.ts` + photo in `public/artists/guests/` |

A change is a commit, then a new image: reviewed, versioned, reversible.

### Guest spots

A guest has the fields of an artist plus `from` and `to` (`YYYY-MM-DD`,
Europe/Paris). `getActiveGuests()` keeps those whose last day has not
passed: a guest shows from the deployment (so she can be announced ahead)
and disappears by herself after her last day, without a deployment. The
home page is rendered on request (`connection()`), `llms.txt` hourly.

Guests appear in the artists section (card with a badge and the dates),
in the JSON-LD (a `Person` and an `Event` at the studio) and in
`llms.txt`. They are not in the gallery, the contact section nor the
footer, which list the residents.

## Rendering

- **Server Components** read the content and the Instagram feed, and
  render the JSON-LD; **Client Components** (`"use client"`) handle the
  interactions and the UI texts (`useI18n()`).
- Client components may import `src/content/shop.ts`, `artists.ts`,
  `guests.ts` and `instagram.ts` (plain data). Never `instagramFeed.ts` nor
  `src/lib/val4ossMedia/`: they import `server-only` (API key).
- The page is dynamic: the gallery and the guests depend on the request
  time. The Instagram feed itself is cached (6 h, refreshed by the
  webhook).

## i18n

- UI texts: `src/app/i18n/locales/{fr,en}.json`, read with `useI18n()`.
- Content texts: `LocalizedText` fields in `src/content/`.
- `<html lang>`: set by the root layout from the `x-locale` header that
  `proxy.ts` derives from the path.

## SEO

- `src/config/seo.ts`: site URL, localized titles, descriptions, keywords.
- `src/app/lib/seo/metadata.ts`: metadata of each locale (canonical,
  hreflang, Open Graph, Twitter).
- `src/app/lib/seo/structuredData.ts`: one JSON-LD graph (website, page,
  `TattooParlor`, residents with `worksFor`, guest spots as `Event`),
  rendered in the server HTML.
- `/llms.txt`, `/sitemap.xml`, `public/robots.txt`.
