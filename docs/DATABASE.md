# Database - SQLite3

> **Pour Claude Code :** Bonnes pratiques et patterns obligatoires pour SQLite3.

## 📋 Table des Matières

1. [Pourquoi SQLite3](#pourquoi-sqlite3)
2. [Installation et Setup](#installation-et-setup)
3. [Configuration Optimale](#configuration-optimale)
4. [Schéma de Base de Données](#schéma-de-base-de-données)
5. [Migrations](#migrations)
6. [i18n — Tables de Traductions](#i18n--tables-de-traductions)
7. [Queries SQL](#queries-sql)
8. [Transactions](#transactions)
9. [Indexation](#indexation)
10. [Best Practices](#best-practices)

---

## Pourquoi SQLite3

### Avantages

✅ **Pour sites vitrines et projets simples :**
- Zéro configuration serveur (pas de PostgreSQL, MySQL à installer)
- Fichier local simple (pas de Docker, pas de serveur DB)
- Excellent pour <100k rows
- Idéal pour prototypage rapide
- Déploiement facile (fichier DB inclus dans le projet)
- Performance excellente pour usage single-user ou low-traffic
- Transactions ACID complètes
- Full-featured SQL database
- Très léger (~600KB compilé)

❌ **Ne PAS utiliser si :**
- Application avec trafic intense (>1000 req/sec d'écriture)
- Multi-utilisateurs simultanés critiques (beaucoup d'écritures concurrentes)
- Besoin de réplication master-slave
- Données distribuées sur plusieurs serveurs
- Besoin de procédures stockées complexes
- Base de données >140TB (limite théorique)

### Cas d'Usage Idéaux

- Sites vitrines avec formulaires de contact
- Blogs personnels ou d'entreprise
- CMS simples
- Applications de gestion interne (petite équipe)
- Prototypes et MVPs
- Applications Electron/desktop
- Applications mobiles (React Native avec expo-sqlite)
- Outils CLI avec persistance
- Cache local ou session storage

---

## Installation et Setup

### Installation

```bash
# better-sqlite3 (recommandé pour Node.js)
npm install better-sqlite3
npm install -D @types/better-sqlite3

# OU avec Bun (si tu utilises Bun)
bun add bun:sqlite
```

### Pourquoi better-sqlite3 ?

- **Synchrone** : Simplifie le code (pas de async/await partout)
- **Performant** : Plus rapide que node-sqlite3 (async)
- **Type-safe** : Excellent support TypeScript
- **Mature** : Package bien maintenu et stable
- **Compatible** : Fonctionne avec Node.js et Electron
- **Simple** : API claire et directe

### Client SQLite

```typescript
// ✅ src/data/db/client.ts
import Database from 'better-sqlite3';

// Singleton instance
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Créer/ouvrir la base de données
    db = new Database('local.db', {
      // verbose: console.log, // Décommenter pour debug SQL
    });
    
    // Configuration optimale (voir section suivante)
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('foreign_keys = ON');
    db.pragma('temp_store = MEMORY');
  }
  
  return db;
}

// Export pour utilisation directe
export const db = getDb();

// Fermeture propre (important pour cleanup)
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Hook de cleanup pour Next.js
if (typeof process !== 'undefined') {
  process.on('exit', closeDb);
  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));
}
```

### Structure Fichiers Recommandée

```
src/data/db/
├── client.ts           # Client SQLite (ci-dessus)
├── schema.sql          # Schéma initial
├── migrations/         # Migrations SQL
│   ├── 001_init.sql
│   ├── 002_addUsers.sql
│   └── 003_addProducts.sql
├── migrate.ts          # Script d'exécution migrations
└── seed.ts            # Données initiales (optionnel)
```

---

## Configuration Optimale

### PRAGMAs Essentiels

Les PRAGMAs SQLite sont des commandes de configuration qui optimisent les performances et le comportement de la base de données.

```typescript
// ✅ Configuration optimale dans client.ts
import Database from 'better-sqlite3';

export function getDb(): Database.Database {
  if (!db) {
    db = new Database('local.db');
    
    // 1. WAL Mode (Write-Ahead Logging)
    // Améliore la concurrence lecture/écriture
    // Meilleure performance globale
    db.pragma('journal_mode = WAL');
    
    // 2. Synchronous Normal
    // Balance entre sécurité et performance
    // FULL = plus sûr mais lent, OFF = rapide mais risqué
    db.pragma('synchronous = NORMAL');
    
    // 3. Foreign Keys ON
    // Active les contraintes de clés étrangères
    // IMPORTANT : désactivé par défaut dans SQLite
    db.pragma('foreign_keys = ON');
    
    // 4. Temp Store en mémoire
    // Tables temporaires en RAM (plus rapide)
    db.pragma('temp_store = MEMORY');
    
    // 5. Cache Size (optionnel)
    // Cache de 10000 pages (~40MB avec pages 4KB)
    db.pragma('cache_size = 10000');
    
    // 6. Memory-mapped I/O (optionnel, pour grandes DB)
    // 30GB max en mmap (améliore lecture)
    db.pragma('mmap_size = 30000000000');
  }
  
  return db;
}
```

### Explication des PRAGMAs

| PRAGMA | Valeur | Raison |
|--------|--------|--------|
| `journal_mode` | `WAL` | Permet lectures pendant écritures, améliore concurrence |
| `synchronous` | `NORMAL` | Équilibre sécurité/performance (FULL trop lent, OFF risqué) |
| `foreign_keys` | `ON` | Active intégrité référentielle (**désactivé par défaut !**) |
| `temp_store` | `MEMORY` | Tables temporaires en RAM (plus rapide) |
| `cache_size` | `10000` | Cache plus grand = moins d'I/O disque |
| `mmap_size` | `30GB` | Memory-mapped I/O pour lecture rapide (grandes DB) |

### Configuration par Environnement

```typescript
// ✅ Configuration selon environnement
export function getDb(): Database.Database {
  if (!db) {
    const isProduction = process.env.NODE_ENV === 'production';
    const dbPath = isProduction 
      ? process.env.DATABASE_PATH || '/data/production.db'
      : 'local.db';
    
    db = new Database(dbPath, {
      verbose: !isProduction ? console.log : undefined,
    });
    
    // PRAGMAs de base (toujours)
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    if (isProduction) {
      // Production : plus de cache, mmap
      db.pragma('synchronous = NORMAL');
      db.pragma('cache_size = 20000');
      db.pragma('mmap_size = 30000000000');
    } else {
      // Dev : verbose pour debug
      db.pragma('synchronous = FULL'); // Plus sûr en dev
      db.pragma('cache_size = 5000');
    }
    
    db.pragma('temp_store = MEMORY');
  }
  
  return db;
}
```

---

## Schéma de Base de Données

### Types de Données SQLite

SQLite utilise un système de typage dynamique avec 5 classes de stockage :

| Type SQL | Storage Class | TypeScript | Exemple |
|----------|---------------|------------|---------|
| `TEXT` | TEXT | `string` | 'John Doe' |
| `INTEGER` | INTEGER | `number` | 42 |
| `REAL` | REAL | `number` | 3.14 |
| `BLOB` | BLOB | `Buffer` | Binary data |
| `NULL` | NULL | `null` | null |

**Important :** SQLite stocke les dates comme INTEGER (timestamp) ou TEXT (ISO 8601).

### Schema SQL Complet

```sql
-- ✅ src/data/db/schema.sql

-- Table Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' 
    CHECK(role IN ('admin', 'user', 'guest')),
  is_active INTEGER NOT NULL DEFAULT 1 
    CHECK(is_active IN (0, 1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Index pour email (recherches fréquentes)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Table Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK(price >= 0), -- Prix en centimes
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  image_url TEXT,
  category_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) 
    REFERENCES categories(id) 
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category 
  ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Table Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Table Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK(status IN (
      'pending', 
      'processing', 
      'shipped', 
      'delivered', 
      'cancelled'
    )),
  total_amount INTEGER NOT NULL CHECK(total_amount >= 0),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- Table Order Items (many-to-many)
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  price_at_purchase INTEGER NOT NULL CHECK(price_at_purchase >= 0),
  FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE CASCADE,
  FOREIGN KEY (product_id) 
    REFERENCES products(id) 
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_order_items_order 
  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product 
  ON order_items(product_id);
```

### Conventions Importantes

**1. Primary Keys**
- Utiliser `TEXT` avec UUID/ULID plutôt qu'`INTEGER AUTOINCREMENT`
- Plus flexible, évite les collisions en cas de merge de DBs

**2. Booleans**
- SQLite n'a pas de type BOOLEAN natif
- Utiliser `INTEGER` avec CHECK(0 ou 1)
- `0 = false`, `1 = true`

**3. Dates/Timestamps**
- Utiliser `INTEGER` pour stocker Unix timestamp (millisecondes)
- Facile à manipuler en JavaScript : `Date.now()`

**4. Prix/Montants**
- Toujours en `INTEGER` (centimes, pas euros)
- Évite les problèmes de précision avec REAL

**5. Enums**
- Utiliser `TEXT` avec `CHECK(column IN (...))`
- Type-safe au niveau DB

---

## Migrations

### Structure d'une Migration

```sql
-- ✅ src/data/db/migrations/001_init.sql

-- Up Migration
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_users_email ON users(email);

-- Down Migration (dans commentaire ou fichier séparé)
-- DROP INDEX idx_users_email;
-- DROP TABLE users;
```

### Script d'Exécution Migrations

```typescript
// ✅ src/data/db/migrate.ts
import { db } from './client';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Table de suivi des migrations
function createMigrationsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      executed_at INTEGER NOT NULL
    )
  `);
}

// Exécuter les migrations
export function runMigrations() {
  createMigrationsTable();
  
  const migrationsDir = join(__dirname, 'migrations');
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  const executed = db
    .prepare('SELECT filename FROM migrations')
    .all() as { filename: string }[];
  
  const executedSet = new Set(executed.map(m => m.filename));
  
  for (const file of files) {
    if (executedSet.has(file)) {
      console.log(`✓ Migration ${file} already executed`);
      continue;
    }
    
    console.log(`→ Running migration ${file}...`);
    
    const sql = readFileSync(join(migrationsDir, file), 'utf-8');
    
    db.transaction(() => {
      db.exec(sql);
      db.prepare(
        'INSERT INTO migrations (filename, executed_at) VALUES (?, ?)'
      ).run(file, Date.now());
    })();
    
    console.log(`✓ Migration ${file} completed`);
  }
  
  console.log('All migrations completed!');
}

// Exécution si script direct
if (require.main === module) {
  runMigrations();
  process.exit(0);
}
```

### Utilisation

```bash
# Exécuter migrations
node -r tsx src/data/db/migrate.ts

# Ou ajouter script package.json
"scripts": {
  "db:migrate": "tsx src/data/db/migrate.ts"
}
```

---

## i18n — Tables de Traductions

### Principe : Tables Séparées par Entité

Pour les champs multilingues, **ne pas** ajouter une colonne par locale (`name_fr`, `name_en`). Utiliser une table de traductions séparée, ce qui permet d'ajouter une nouvelle locale sans modifier le schéma SQL.

```
✅ Pattern recommandé :
  [entity]                        [entity]_translations
  ────────────────                ──────────────────────────────────────
  id TEXT PRIMARY KEY      ←─     entity_id TEXT NOT NULL (FK ON DELETE CASCADE)
  ... champs invariants ...       locale TEXT NOT NULL
                                  ... champs traduisibles ...
                                  UNIQUE(entity_id, locale)
```

### Schéma SQL

```sql
-- Table principale : champs identiques dans toutes les langues
CREATE TABLE IF NOT EXISTS artists (
  id          TEXT    NOT NULL PRIMARY KEY,
  username    TEXT    NOT NULL UNIQUE,
  ig_id       TEXT    NOT NULL UNIQUE,
  profile_pic_url TEXT,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

-- Table de traductions : champs localisés
CREATE TABLE IF NOT EXISTS artist_translations (
  id        TEXT    NOT NULL PRIMARY KEY,
  artist_id TEXT    NOT NULL,
  locale    TEXT    NOT NULL,
  bio       TEXT    NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  UNIQUE(artist_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_artist_translations_artist_id
  ON artist_translations(artist_id);
```

**Pourquoi pas de `CHECK(locale IN ('fr', 'en'))` ?**
SQLite ne permet pas `ALTER TABLE` pour modifier un CHECK constraint — il faudrait recréer la table entière. En validant la locale uniquement via Zod, ajouter une nouvelle locale ne nécessite **aucune migration SQL**.

### Source de Vérité des Locales

```typescript
// ✅ src/config/locales.ts — importé par TOUTES les couches
export type Locale = 'fr' | 'en';
export const locales: Locale[] = ['fr', 'en'];
export const defaultLocale: Locale = 'fr';
export type LocalizedText = Record<Locale, string>;
```

Ce fichier est placé dans `src/config/` (pas dans `app/i18n/`) pour être accessible depuis la couche `data` et `domain`.

### Lecture : `json_group_object`

Utiliser l'agrégat SQLite `json_group_object` pour récupérer toutes les traductions en **une seule requête JOIN**, sans N+1 queries.

```typescript
// ✅ src/data/repositories/artistRepository.ts
const SELECT_WITH_TRANSLATIONS = `
  SELECT
    a.*,
    json_group_object(at.locale, at.bio) AS bio_json
  FROM artists a
  LEFT JOIN artist_translations at ON a.id = at.artist_id
  GROUP BY a.id
`;

// Résultat de bio_json : '{"fr":"Mon texte","en":"My text"}'
```

Le modèle `ArtistRow` étend `Artist` avec les champs `*_json` :

```typescript
// ✅ src/data/models/artist.ts
export interface Artist {
  id: string;
  username: string;
  ig_id: string;
  profile_pic_url: string | null;
  created_at: number;
  updated_at: number;
}

// Résultat brut de la query JOIN — bio_json est null si aucune traduction
export interface ArtistRow extends Artist {
  bio_json: string | null;
}
```

### Helper : `parseLocalizedText`

```typescript
// ✅ src/data/mappers/utils.ts
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

- Si `json` est `null` (aucune traduction) → retourne `{ fr: '', en: '' }`
- Si une locale est absente → fallback sur `defaultLocale`
- Robuste à l'ajout d'une nouvelle locale sans modification

### Écriture : Transaction INSERT + INSERT traductions

```typescript
// ✅ src/data/repositories/artistRepository.ts
export function create(data: CreateArtistData): ArtistEntity {
  const id = crypto.randomUUID();
  const now = Date.now();

  const insertArtist = db.prepare(`
    INSERT INTO artists (id, username, ig_id, profile_pic_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertTranslation = db.prepare(`
    INSERT INTO artist_translations (id, artist_id, locale, bio)
    VALUES (?, ?, ?, ?)
  `);

  db.transaction(() => {
    insertArtist.run(id, data.username, data.instagramId, data.profilePicture ?? null, now, now);

    for (const locale of locales) {
      insertTranslation.run(crypto.randomUUID(), id, locale, data.bio[locale]);
    }
  })();

  return findById(id)!;
}
```

### Mise à Jour : UPSERT avec `ON CONFLICT DO UPDATE`

Pour mettre à jour une seule locale sans écraser les autres :

```typescript
// ✅ UPSERT — insert si absent, update si existant
const upsertTranslation = db.prepare(`
  INSERT INTO artist_translations (id, artist_id, locale, bio)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(artist_id, locale) DO UPDATE SET
    bio = excluded.bio
`);

// Mettre à jour uniquement les locales fournies
if (data.bio) {
  for (const [locale, value] of Object.entries(data.bio)) {
    upsertTranslation.run(crypto.randomUUID(), id, locale, value);
  }
}
```

Le type `UpdateArtistData` utilise `Partial<LocalizedText>` pour permettre la mise à jour d'une seule locale :

```typescript
// ✅ src/domain/entities/artistEntity.ts
export interface UpdateArtistData {
  username?: string;
  bio?: Partial<LocalizedText>; // { fr: '...' } sans toucher 'en'
  instagramId?: string;
  profilePicture?: string;
}
```

### Sélection de la Locale dans les Composants

**Règle critique :** Ne jamais sélectionner la locale dans la couche `data` ou `domain`. Les entités retournent toujours `LocalizedText` complet.

```typescript
// ❌ MAUVAIS — sélection dans le repository
const bio = artist.bio[defaultLocale]; // Non !

// ✅ BON — sélection dans le Client Component
'use client';
import { useI18n } from '@/app/i18n/provider';

export function ArtistCard({ artist }: { artist: ArtistEntity }) {
  const { locale } = useI18n();
  return <p>{artist.bio[locale]}</p>;
}
```

### Ajouter une Nouvelle Locale

1. **`src/config/locales.ts`** — ajouter la locale au type et au tableau :
   ```typescript
   export type Locale = 'fr' | 'en' | 'de';
   export const locales: Locale[] = ['fr', 'en', 'de'];
   ```
2. **`src/app/i18n/config.ts`** — ajouter le nom et le drapeau
3. **`src/data/db/scripts/seed.ts`** — ajouter les valeurs pour la nouvelle locale
4. **Aucune migration SQL nécessaire** — la table `*_translations` accepte n'importe quelle valeur de locale
5. Lancer `npm run db:migrate && npm run db:seed` pour repeupler

### Scripts npm

```bash
# Réinitialiser et migrer la base
npm run db:migrate

# Peupler avec données initiales
npm run db:seed

# Consulter le shop
npm run shop:get

# Modifier un champ invariant du shop (ex: name)
npm run shop:update name "The Bower Yst"

# Modifier un champ traduit du shop (ex: description, locale fr)
npm run shop:update description fr "Un salon de tatouage..."

# Lister les artistes
npm run artists:list

# Ajouter un artiste
npm run artists:add <username> <instagramId> <bio_fr> <bio_en> [profilePicture]
```

---

## Queries SQL

### Prepared Statements (Recommandé)

```typescript
// ✅ Utiliser TOUJOURS des prepared statements
import { db } from '@/data/db/client';

// SELECT
interface User {
  id: string;
  name: string;
  email: string;
  created_at: number;
}

export function getUserById(id: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | undefined;
}

export function getAllUsers(): User[] {
  const stmt = db.prepare(
    'SELECT * FROM users ORDER BY created_at DESC'
  );
  return stmt.all() as User[];
}

export function getUsersByRole(role: string): User[] {
  const stmt = db.prepare('SELECT * FROM users WHERE role = ?');
  return stmt.all(role) as User[];
}

// INSERT
export function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): User {
  const id = crypto.randomUUID();
  const now = Date.now();
  
  const stmt = db.prepare(`
    INSERT INTO users (
      id, 
      name, 
      email, 
      password_hash, 
      created_at, 
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id, 
    data.name, 
    data.email, 
    data.passwordHash, 
    now, 
    now
  );
  
  return getUserById(id)!;
}

// UPDATE
export function updateUser(id: string, data: {
  name?: string;
  email?: string;
}): User | undefined {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  
  if (data.email !== undefined) {
    updates.push('email = ?');
    values.push(data.email);
  }
  
  if (updates.length === 0) return getUserById(id);
  
  updates.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);
  
  const stmt = db.prepare(`
    UPDATE users 
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  
  stmt.run(...values);
  
  return getUserById(id);
}

// DELETE
export function deleteUser(id: string): void {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
}
```

### Queries Complexes

```typescript
// ✅ JOIN avec pagination
export function getOrdersWithItems(
  userId: string, 
  page = 1, 
  limit = 20
) {
  const offset = (page - 1) * limit;
  
  const stmt = db.prepare(`
    SELECT 
      o.id as order_id,
      o.status,
      o.total_amount,
      o.created_at,
      oi.quantity,
      oi.price_at_purchase,
      p.name as product_name
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(userId, limit, offset);
}

// ✅ Aggregation
export function getOrderStats(userId: string) {
  const stmt = db.prepare(`
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_spent,
      AVG(total_amount) as avg_order
    FROM orders
    WHERE user_id = ?
  `);
  
  return stmt.get(userId);
}

// ✅ Recherche full-text (simple)
export function searchProducts(query: string) {
  const stmt = db.prepare(`
    SELECT * FROM products
    WHERE name LIKE ? OR description LIKE ?
    LIMIT 20
  `);
  
  const pattern = `%${query}%`;
  return stmt.all(pattern, pattern);
}
```

### Paramètres Nommés (Alternative)

```typescript
// ✅ Paramètres nommés (plus lisible pour queries complexes)
export function createOrder(data: {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  const orderId = crypto.randomUUID();
  const now = Date.now();
  
  // Calculer total
  const total = data.items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product.price * item.quantity);
  }, 0);
  
  const stmt = db.prepare(`
    INSERT INTO orders (
      id, 
      user_id, 
      status, 
      total_amount, 
      created_at, 
      updated_at
    )
    VALUES (:id, :userId, :status, :total, :now, :now)
  `);
  
  stmt.run({
    id: orderId,
    userId: data.userId,
    status: 'pending',
    total,
    now,
  });
  
  return orderId;
}
```

---

## Transactions

### Transaction Simple

```typescript
// ✅ Transaction avec rollback automatique si erreur
export function transferFunds(
  fromUserId: string, 
  toUserId: string, 
  amount: number
) {
  const transaction = db.transaction(() => {
    // Débit
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?')
      .run(amount, fromUserId);
    
    // Crédit
    db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
      .run(amount, toUserId);
  });
  
  transaction(); // Exécute la transaction
}
```

### Transaction Complexe

```typescript
// ✅ Créer une commande avec items (transaction complète)
export function createOrderWithItems(data: {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  const createOrder = db.transaction(() => {
    const orderId = crypto.randomUUID();
    const now = Date.now();
    let totalAmount = 0;
    
    // 1. Créer l'ordre
    db.prepare(`
      INSERT INTO orders (
        id, 
        user_id, 
        status, 
        total_amount, 
        created_at, 
        updated_at
      )
      VALUES (?, ?, 'pending', 0, ?, ?)
    `).run(orderId, data.userId, now, now);
    
    // 2. Pour chaque item
    for (const item of data.items) {
      // Récupérer le produit
      const product = db.prepare(
        'SELECT * FROM products WHERE id = ?'
      ).get(item.productId) as any;
      
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      
      // Créer order item
      db.prepare(`
        INSERT INTO order_items (
          id, 
          order_id, 
          product_id, 
          quantity, 
          price_at_purchase
        )
        VALUES (?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        orderId,
        product.id,
        item.quantity,
        product.price
      );
      
      // Décrémenter le stock
      db.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ?'
      ).run(item.quantity, product.id);
      
      totalAmount += product.price * item.quantity;
    }
    
    // 3. Update total amount
    db.prepare('UPDATE orders SET total_amount = ? WHERE id = ?')
      .run(totalAmount, orderId);
    
    return orderId;
  });
  
  return createOrder(); // Exécute et retourne orderId
}
```

### Gestion d'Erreurs

```typescript
// ✅ Try-catch avec transaction
export function safeCreateOrder(data: any) {
  try {
    const orderId = createOrderWithItems(data);
    return { success: true, orderId };
  } catch (error) {
    // Transaction automatiquement rollback
    console.error('Order creation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

---

## Indexation

### Types d'Index

```sql
-- ✅ Index simple (colonne unique)
CREATE INDEX idx_users_email ON users(email);

-- ✅ Index composé (plusieurs colonnes)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- ✅ Index UNIQUE
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- ✅ Index conditionnel (partial index)
CREATE INDEX idx_active_users ON users(email) WHERE is_active = 1;

-- ✅ Index sur expression
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
```

### Quand Créer un Index

✅ **Créer index si :**
- Colonne dans WHERE clause fréquemment
- Colonne dans JOIN conditions
- Colonne dans ORDER BY
- Foreign keys (améliore performance JOINs)
- Colonnes unique (email, username)

❌ **Ne PAS indexer si :**
- Table très petite (<1000 rows)
- Colonne rarement utilisée dans queries
- Colonne avec peu de valeurs distinctes (booléens)
- Trop d'index ralentit les INSERT/UPDATE

### Analyser Performance

```typescript
// ✅ EXPLAIN QUERY PLAN
const plan = db.prepare(
  'EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?'
).all('test@example.com');
console.log(plan);

// Chercher "SCAN" (mauvais) vs "SEARCH" (bon)
// SCAN TABLE = pas d'index utilisé
// SEARCH TABLE USING INDEX = index utilisé ✓
```

---

## Best Practices

### 1. Toujours Utiliser Transactions pour Opérations Multiples

```typescript
// ❌ MAUVAIS - Pas atomique
function badTransfer(from: string, to: string, amount: number) {
  db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?')
    .run(amount, from);
  db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
    .run(amount, to);
  // Si erreur entre les deux = données corrompues!
}

// ✅ BON - Atomique
function goodTransfer(from: string, to: string, amount: number) {
  const transfer = db.transaction(() => {
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?')
      .run(amount, from);
    db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
      .run(amount, to);
  });
  
  transfer();
}
```

### 2. Utiliser Prepared Statements (Sécurité + Performance)

```typescript
// ❌ MAUVAIS - SQL Injection possible
function badQuery(email: string) {
  return db.exec(`SELECT * FROM users WHERE email = '${email}'`);
  // email = "'; DROP TABLE users; --" = catastrophe
}

// ✅ BON - Sécurisé
function goodQuery(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?')
    .get(email);
}
```

### 3. Stocker Prix en Centimes (Integer)

```typescript
// ✅ BON
const product = {
  price: 1999, // 19.99€
};

// Affichage
const displayPrice = (price: number) => (price / 100).toFixed(2);

// ❌ MAUVAIS - Floats = imprécision
const product = {
  price: 19.99, // Problèmes de précision
};
```

### 4. Timestamps en Integer (Unix Timestamp)

```typescript
// ✅ BON
const now = Date.now(); // 1705334400000
db.prepare('INSERT INTO users (created_at) VALUES (?)')
  .run(now);

// Lecture
const user = db.prepare('SELECT created_at FROM users WHERE id = ?')
  .get(id);
const date = new Date(user.created_at);

// ❌ MAUVAIS - TEXT compliqué à manipuler
db.prepare('INSERT INTO users (created_at) VALUES (?)')
  .run(new Date().toISOString());
```

### 5. Validation dans `validator/` aux frontiéres (API routes, scripts CLI), pas dans les services ou repositories

```typescript
// ❌ MAUVAIS - Validation dans repository
class UserRepository {
  createUser(data: any) {
    if (!data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    // ...
  }
}

// ✅ BON - Validation dans script ou api
const parsed = create[Entity]Schema.safeParse({
  username,
  ig_id,
  description,
  profile_pic_url,
});

if (!parsed.success) {
  console.error('Validation error:');
  parsed.error.issues.forEach(issue => {
    console.error(`- ${issue.path.join('.')} : ${issue.message}`);
  });
  process.exit(1);
}
```

### 6. Créer Indexes pour Foreign Keys

```sql
-- ✅ BON - Index sur foreign key
CREATE TABLE orders (
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
-- Améliore performance des JOINs
```

### 7. Utiliser CHECK Constraints

```sql
-- ✅ BON - Validation au niveau DB
CREATE TABLE products (
  price INTEGER NOT NULL CHECK(price >= 0),
  stock INTEGER NOT NULL CHECK(stock >= 0),
  status TEXT CHECK(status IN ('active', 'inactive', 'deleted'))
);
```

### 8. Backup Réguliers

```typescript
// ✅ Script de backup
import { copyFileSync } from 'fs';

export function backupDatabase() {
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, '-');
  const backupPath = `./backups/db_${timestamp}.db`;
  
  // Fermer connections
  closeDb();
  
  // Copier le fichier
  copyFileSync('local.db', backupPath);
  
  console.log(`Backup created: ${backupPath}`);
  
  // Réouvrir
  getDb();
}
```

### 9. Ne PAS Commit la DB en Git

```gitignore
# .gitignore
*.db
*.db-shm
*.db-wal
/backups/
```

### 10. Utiliser WAL Mode en Production

```typescript
// ✅ TOUJOURS activer WAL mode
db.pragma('journal_mode = WAL');

// Crée 3 fichiers :
// - local.db (données)
// - local.db-wal (write-ahead log)
// - local.db-shm (shared memory)
```

---

**Note pour Claude Code :** Toujours respecter ces patterns lors de suggestions de code database. Utiliser SQLite3 pur avec better-sqlite3, pas d'ORM.

**Rappel des règles critiques :**
1. ✅ **Transactions** pour opérations multiples
2. ✅ **Prepared statements** toujours
3. ✅ **Prix en centimes** (INTEGER)
4. ✅ **Timestamps en INTEGER** (Unix ms)
5. ✅ **Foreign keys ON** (pragma)
6. ✅ **WAL mode** en production
7. ✅ **Indexes** sur colonnes fréquemment queryées
