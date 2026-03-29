# Clean Architecture -- Next.js 16+ / SQLite

Showcase website with light SQLite backend. Three layers: **Domain** (business logic, zero deps) > **Data** (persistence, SQLite) > **App** (UI, Next.js).

---

## Dependency Rule

```
  app/     ──imports──>  domain/  <──implements──  data/
  scripts/ ──imports──>  domain/
  (UI)                   (business)                (persistence)

  validators/   used by app/ at system boundaries (forms, API routes)
  config/       used by all layers (env, constants, site metadata)
```

Inner layers never import from outer layers. `domain/` imports nothing. `app/` never imports from `data/`.

---

## Directory Structure

```
src/
├── domain/                           # Business logic (pure TS, zero deps)
│   ├── entities/
│   │   └── [entity]Entity.ts         #   Interface + pure domain functions
│   ├── services/
│   │   └── [entity]Service.ts        #   Use cases, orchestrate repos + entities
│   └── errors/
│       ├── notFoundError.ts
│       └── validationError.ts
│
├── data/                             # Persistence (SQLite + better-sqlite3)
│   ├── models/
│   │   └── [entity]Model.ts          #   DB-shape interface + input/update types
│   ├── mappers/
│   │   └── [entity]Mapper.ts         #   Model <-> Entity transformations
│   ├── repositories/
│   │   └── [entity]Repository.ts     #   SQL queries, row mapping, CRUD
│   ├── adapters/
│   │   └── [service]Adapter.ts       #   External integrations (email, storage)
│   └── db/
│       ├── client.ts                 #   Singleton connection (WAL, FK, auto-migrate)
│       ├── config.ts                 #   Paths + env vars
│       ├── migrations.ts             #   Migration runner
│       ├── migrations/
│       │   └── NNN_[description].sql
│       └── scripts/                  # DB infrastructure only (migration, seed, reset)
│           ├── migrate.ts
│           ├── seed.ts
│           └── reset.ts
│
├── scripts/                          # CLI entrypoints (per-entity CRUD)
│   └── [entity]                      # Calls domain services + vlidators.
│
├── validators/
│   └── [entity]Validator.ts          # Zod schemas + inferred TS types
│
├── config/
│   ├── locales.ts                    # Locale type, LocalizedText, locales[], defaultLocale
│   ├── env.ts                        # Environment variables
│   ├── constants.ts                  # App-wide constants
│   └── site.ts                       # Site metadata (name, URL, socials)
│
├── app/                              # Next.js App Router (UI layer)
│   ├── layout.tsx                    #   Root shell (fonts, global scripts, JSON-LD SEO)
│   ├── page.tsx                      #   Redirect → /{defaultLocale}
│   ├── not-found.tsx
│   ├── error.tsx                     #   Error boundary ("use client")
│   ├── loading.tsx
│   ├── globals.css
│   │
│   ├── [locale]/                     #   Routes localisées (/fr, /en, …)
│   │   ├── layout.tsx                #     I18nProvider + metadata locale (hreflang, title, canonical)
│   │   ├── page.tsx                  #     Page principale — composition uniquement, zéro logique
│   │   └── [feature]/
│   │       └── page.tsx              #     Pages secondaires (ex: /fr/artists, /en/artists)
│   │
│   ├── api/                          #   Route Handlers (REST)
│   │   └── [entity]/
│   │       ├── route.ts              #     GET (list), POST (create)
│   │       └── [id]/
│   │           └── route.ts          #     GET, PUT, DELETE
│   │
│   ├── components/
│   │   ├── layout/                   #   Navbar, Footer, Header... + index.ts
│   │   ├── sections/                 #   [Name]Section.tsx + atomic children + index.ts
│   │   ├── ui/                       #   Button, Card, Modal, Input... + index.ts
│   │   └── forms/                    #   [Entity]Form.tsx + index.ts
│   │
│   ├── hooks/                        #   useTheme, useLocale, useScrollPosition…
│   ├── providers/                    #   ThemeProvider (I18nProvider est dans [locale]/layout.tsx)
│   └── i18n/
│       ├── config.ts                 #   Noms affichés et drapeaux par locale
│       ├── provider.tsx              #   I18nProvider — reçoit initialLocale depuis l'URL
│       ├── translations.ts           #   getTranslations(locale)
│       └── locales/                  #   en.json, fr.json…
│
├── middleware.ts                      # Locale redirect, security headers
│
public/                               # Static assets
database/                             # SQLite files (gitignored)
tests/                                # Mirrors src/ structure
```

---

## Domain Layer (`src/domain/`)

Pure TypeScript. No framework, no DB, no external library.

### Entities

Business-shaped interfaces (no `createdAt`/`updatedAt`) + pure domain functions.
No imports.

```typescript
// domain/entities/[entity]Entity.ts

export interface [Entity]Entity {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Create[Entity]Data {...}
export type Update[Entity]Data = Partial<Create[Entity]Data>;

// Pure function -- business rule
export function get[Entity]Image(entity: [Entity]Entity): string {
  return entity.imageUrl ?? '/images/default.jpg';
}

```

### Services

Use cases. Call repositories, return entities. No framework code.

```typescript
// domain/services/[entity]Service.ts

import { [Entity]Repository } from '@/data/repositories/[entity]Repository';
import type { [Entity]Entity } from '@/domain/entities/[entity]Entity';

export function getAll[Entity]s(): [Entity]Entity[] {
  return new [Entity]Repository().findAll();
}

export function get[Entity]ById(id: number): [Entity]Entity | null {
  return new [entity]Repository().findById(id) ?? null;
}
```

### Errors

Typed domain errors caught at API/component level.

```typescript
// domain/errors/notFoundError.ts
export class NotFoundError extends Error {
  constructor(entity: string, id: string | number) {
    super(`${entity} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}
```

---

## Data Layer (`src/data/`)

All persistence. SQLite via better-sqlite3. Implements the data access the domain needs.

### Model vs Entity

| Concern       | Model (`data/models/`)              | Entity (`domain/entities/`)       |
|---------------|-------------------------------------|-----------------------------------|
| Shape         | Mirrors DB schema (camelCase)       | Business-relevant fields only     |
| Timestamps    | `createdAt`, `updatedAt`            | None                              |
| Input types   | None                                | `Create[Entity]Data`, `Update...` |
| Used by       | Repository, Mapper                  | Service, App components           |

```typescript
// data/models/[entity]Model.ts

export interface [Entity] {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Mappers

Centralize model <-> entity conversions. Imports from both `data/models` and `domain/entities/`.
This is the only place where both layers are known - never in line the mapper in the entity file
(domain must have zero imports).

```typescript
// data/mappers/[entity]Mapper.ts

export function to[Entity]Entity(model: [Entity]): [Entity]Entity { ... }
export function to[Entity]Entities(models: [Entity][]): [Entity}Entity[] {
```

### Repositories

SQL queries + snake_case-to-camelCase row mapping.

```typescript
// data/repositories/[entity]Repository.ts

export class [Entity]Repository {
  private db = getDb();

  findAll(): [Entity]Entity[] { ... }
  findById(id: number): [Entity]Entity | undefined { ... }
  create(data: Create[Entity]Data): [Entity]Entity { ... }
  update(id: number, data: Update[Entity]Data): [Entity]Entity | undefined { ... }
  delete(id: number): boolean { ... }
}
```

### DB Infrastructure

- `client.ts` -- Singleton `getDb()`, auto-migrates on first call, WAL mode, FK enabled
- `config.ts` -- DB path from env vars (`DATABASE_DIR`, `DATABASE_FILE`)
- `migrations/` -- `NNN_description.sql` files, tracked in `_migrations` table, atomic
- `scripts/` -- DB infrastructure only: `npm run db:migrate`, `npm run db:seed`, `npm run db:reset`
  CLI entity scripts live in `src/scripts/` (see scripts/ section)

---

## Application Layer (`src/app/`)

The only layer that knows Next.js and React.

### Component Organization

```
components/
├── layout/      Navbar, Footer, Header            (persistent, in layout.tsx)
├── sections/    [Name]Section.tsx + child atoms    (composable page blocks)
├── ui/          Button, Card, Modal, Input         (reusable, no business logic)
└── forms/       [Entity]Form.tsx                   (ui/ + validators + submit)
```

**`page.tsx` is composition only** -- import sections, render them in order, nothing else.

### Server vs Client Components

- **Server (default)**: call domain services, async data access, no hooks/events
- **Client (`"use client"`)**: interactivity, browser APIs, hooks, event handlers
- Data flows down: Server fetches, passes props to Client children

### API Routes

Boundary where validators run before calling services:

```typescript
// app/api/[entity]/route.ts
const parsed = create[Entity]Schema.parse(await req.json());  // validator
const result = create[Entity](parsed);                         // service
return Response.json(result, { status: 201 });
```

### i18n — Double couche

**Textes UI** (labels, titres, boutons) → fichiers JSON `app/i18n/locales/`
**Données DB** (bio artiste, description shop...) → tables `*_translations`

#### `src/config/locales.ts` — source de vérité unique

```typescript
export type Locale = 'fr' | 'en';
export const locales: Locale[] = ['fr', 'en'];
export const defaultLocale: Locale = 'fr';
export type LocalizedText = Record<Locale, string>;
```

Importable par **toutes les couches**. `app/i18n/config.ts` ne garde que les données UI (noms affichés, drapeaux).

#### Pattern translations tables

Chaque entité avec des champs traduits a une table principale + une table `*_translations` :

```sql
-- Table principale : données invariantes uniquement
CREATE TABLE artists (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  username        TEXT UNIQUE NOT NULL,
  profile_pic_url TEXT NULL
);

-- Table de traductions : une ligne par (entité × locale)
CREATE TABLE artist_translations (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id INTEGER NOT NULL,
  locale    TEXT    NOT NULL,
  bio       TEXT    NOT NULL DEFAULT '',
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  UNIQUE(artist_id, locale)
);
```

Règles SQL :
- **Pas** de `CHECK(locale IN ('fr','en'))` — validation dans Zod, pas en SQL (ajouter une locale = zéro migration)
- `ON DELETE CASCADE` — suppression de l'entité supprime automatiquement ses traductions
- `UNIQUE(entity_id, locale)` — permet le pattern `ON CONFLICT DO UPDATE` (upsert)

#### Pattern repository — lecture avec `json_group_object`

```typescript
// Une seule requête, toutes les traductions agrégées en JSON par SQLite
const SELECT_WITH_TRANSLATIONS = `
  SELECT
    a.*,
    json_group_object(at.locale, at.bio) AS bio_json
  FROM artists a
  LEFT JOIN artist_translations at ON a.id = at.artist_id
  GROUP BY a.id
`;
```

Le model expose un `[Entity]Row` qui étend le model de base :

```typescript
export interface ArtistRow extends Artist {
  bio_json: string | null; // null si aucune traduction en base
}
```

#### Pattern mapper — parsing + fallback

```typescript
// data/mappers/utils.ts — helper partagé entre tous les mappers
import { locales, defaultLocale } from '@/config/locales';
import type { LocalizedText } from '@/config/locales';

export function parseLocalizedText(json: string | null): LocalizedText {
  const raw: Partial<Record<string, string>> = json ? JSON.parse(json) : {};
  const fallback = raw[defaultLocale] ?? '';
  const result: Partial<LocalizedText> = {};
  for (const locale of locales) {
    result[locale] = raw[locale] ?? fallback;
  }
  return result as LocalizedText;
}
```

#### Pattern repository — écriture en transaction

```typescript
// create() : INSERT entity + INSERT traductions (une par locale) dans une transaction
// update() : UPDATE entity + UPSERT traductions (ON CONFLICT DO UPDATE SET ...)
// delete() : inchangé, CASCADE gère les traductions automatiquement
```

#### Sélection dans les composants

La locale est fournie par l'URL (`/fr`, `/en`), passée à `I18nProvider` via `[locale]/layout.tsx`,
et accessible dans tous les composants enfants via `useI18n()` — sans aucun accès à `localStorage`.

```tsx
// ✅ Dans n'importe quel Client Component
const { locale } = useI18n();
<p>{artist.bio[locale]}</p>

// ✅ Dans un Server Component (reçoit locale depuis params)
const { locale } = await params;
<p>{artist.bio[locale]}</p>

// ❌ Anti-pattern : ne jamais filtrer la locale dans le repository ou le service
findAll(locale: string) // INTERDIT — la sélection appartient à la couche UI
```

#### Ajouter une nouvelle locale

1. `src/config/locales.ts` → ajouter la locale au type et au tableau `locales[]`
2. `src/app/i18n/config.ts` → ajouter nom affiché et drapeau
3. `src/app/i18n/locales/` → créer le fichier JSON de traductions UI (`es.json`, etc.)
4. Alimenter les traductions DB via les scripts CLI (`npm run artists:update`, etc.)
5. `generateStaticParams` dans `[locale]/layout.tsx` et `[locale]/page.tsx` génère automatiquement
   la nouvelle route — **aucune autre modification de routing nécessaire**
6. **Aucune migration SQL nécessaire**

### SEO

- **Root `layout.tsx`** : JSON-LD structured data (TattooParlor, LocalBusiness…), fonts, scripts globaux
- **`[locale]/layout.tsx`** : Metadata API locale (title, description, hreflang, canonical) via `generateMetadata`
- Les `alternates.languages` dans `generateMetadata` génèrent automatiquement les balises hreflang correctes
- Site constants dans `config/site.ts`. Security headers + image optimization dans `next.config.ts`

---

## Path Aliases (`tsconfig.json`)

| Alias            | Target             |
|------------------|--------------------|
| `@/*`            | `./src/*`          |
| `@/app/*`        | `./src/app/*`      |
| `@/domain/*`     | `./src/domain/*`   |
| `@/data/*`       | `./src/data/*`     |
| `@/validators/*` | `./src/validators/*`|
| `@/config/*`     | `./src/config/*`   |

---

## Naming Conventions

### Files

| Layer     | Pattern                  | Example                 |
|-----------|--------------------------|-------------------------|
| Entity    | `[name]Entity.ts`        | `artistEntity.ts`       |
| Service   | `[name]Service.ts`       | `artistService.ts`      |
| Model     | `[name]Model.ts`         | `artistModel.ts`        |
| Mapper    | `[name]Mapper.ts`        | `artistMapper.ts`       |
| Repo      | `[name]Repository.ts`    | `artistRepository.ts`   |
| Adapter   | `[name]Adapter.ts`       | `emailAdapter.ts`       |
| Validator | `[name]Validator.ts`     | `artistValidator.ts`    |
| Error     | `[name]Error.ts`         | `notFoundError.ts`      |
| Component | `PascalCase.tsx`         | `ArtistCard.tsx`        |
| Section   | `[Name]Section.tsx`      | `HeroSection.tsx`       |
| Hook      | `use[Name].ts`           | `useTheme.ts`           |
| Provider  | `[Name]Provider.tsx`     | `ThemeProvider.tsx`      |
| Migration | `NNN_[desc].sql`         | `001_create_artists.sql` |

### Interfaces & Types

| Kind          | Pattern              | Example               |
|---------------|----------------------|-----------------------|
| Entity        | `[Name]Entity`       | `ArtistEntity`        |
| Model         | `[Name]`             | `Artist`              |
| Create input  | `Create[Name]Data`   | `CreateArtistDAta`    |
| Update input  | `Update[Name]Data`   | `UpdateArtistData`    |
| Error         | `[Name]Error`        | `NotFoundError`       |

---

## Adding a New Entity

### Sans traductions

| #  | Layer     | File to create                                                              |
|----|-----------|-----------------------------------------------------------------------------|
| 1  | Data      | `data/db/migrations/NNN_create_[entity].sql`                                |
| 2  | Data      | `data/models/[entity].ts` — interface miroir de la table DB                 |
| 3  | Domain    | `domain/entities/[entity]Entity.ts` — Entity + Create/UpdateData + fonctions|
| 4  | Data      | `data/mappers/[entity]Mapper.ts`                                            |
| 5  | Data      | `data/repositories/[entity]Repository.ts`                                   |
| 6  | Domain    | `domain/services/[entity]Service.ts`                                        |
| 7  | Validator | `validators/[entity]Validator.ts`                                           |
| 8  | App       | `app/api/[entity]/route.ts`                                                 |
| 9  | App       | Components (section, card, form) as needed                                  |
| 10 | Scripts   | `scripts/[entity]/` CLI entry points (domain services + validators)         |

### Avec traductions (champs `LocalizedText`)

Même checklist, avec ces ajouts :

| #  | Layer  | Différence                                                                                    |
|----|--------|-----------------------------------------------------------------------------------------------|
| 1  | Data   | Migration inclut aussi la table `[entity]_translations` avec FK + UNIQUE(entity_id, locale)   |
| 2  | Data   | Ajouter `[entity]Translation.ts` (model miroir) + `[Entity]Row extends [Entity]` avec `*_json`|
| 3  | Domain | Champs traduits typés `LocalizedText` dans l'entity, `Partial<LocalizedText>` dans UpdateData |
| 4  | Data   | Mapper utilise `parseLocalizedText()` de `data/mappers/utils.ts`                             |
| 5  | Data   | Repository : SELECT avec `json_group_object`, CREATE/UPDATE en transaction avec upsert        |
| 7  | Valid. | `localizedTextSchema` pour les champs traduits, `.partial()` pour les updates                |
| 10 | Scripts| CLI affiche `field.fr` / `field.en` séparément, jamais `field` directement                  |

---

## Anti-Patterns

| Do NOT                                | Do instead                                      |
|---------------------------------------|-------------------------------------------------|
| `app/lib/data/` or `app/types/`       | `data/` layer for persistence, `domain/` for types |
| Import `data/` from components        | Import `domain/services/` or `domain/entities/`  |
| Business logic in components          | Move to `domain/services/`                       |
| Validation inside services            | Use `validators/` at API/form boundary           |
| Direct DB calls in API routes         | API -> service -> repository                     |
| Catch-all `utils.ts`                  | Domain functions, hooks, or specific helpers      |
