# Guidelines Next.js 16+

> **Pour Claude Code :** Ce fichier contient les patterns et bonnes pratiques obligatoires pour Next.js.  
> **Consulte-le systématiquement** avant toute suggestion de code Next.js/React.

## 📋 Table des Matières

1. [Version et Nouveautés](#version-et-nouveautés)
2. [App Router](#app-router)
3. [Server vs Client Components](#server-vs-client-components)
4. [Data Fetching](#data-fetching)
5. [Server Actions](#server-actions)
6. [Routing et Navigation](#routing-et-navigation)
7. [Internationalisation (i18n)](#internationalisation-i18n)
8. [Metadata et SEO](#metadata-et-seo)
9. [Performance](#performance)
10. [Patterns Anti-Patterns](#patterns-anti-patterns)

---

## Version et Nouveautés

### Next.js 16 - Nouveautés Clés

```typescript
// ✅ Nouveautés à utiliser systématiquement

// 1. Partial Prerendering (PPR) - Pages mixtes static/dynamic
// next.config.ts
export default {
  experimental: {
    ppr: true, // Active PPR par défaut
  },
};

// 2. use cache - Cache granulaire au niveau fonction
'use cache';
export async function getProduct(id: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  return product;
}

// 3. Async Request APIs - cookies(), headers() sont async
import { cookies } from 'next/headers';

export async function getUserSession() {
  const cookieStore = await cookies(); // ← ASYNC maintenant
  const session = cookieStore.get('session');
  return session;
}

// 4. Turbopack - Activer en dev
// package.json
{
  "scripts": {
    "dev": "next dev --turbo" // ← Plus rapide
  }
}
```

### Configuration Recommandée

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Experimental features
  experimental: {
    ppr: true,              // Partial Prerendering
    reactCompiler: true,    // React Compiler (optimisation auto)
  },
  
  // Images optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default config;
```

---

## App Router

### Structure Obligatoire

```
✅ BON - App Router avec i18n URL-based (OBLIGATOIRE)
src/app/
├── layout.tsx              # Root shell (fonts, JSON-LD global)
├── page.tsx                # Redirect → /{defaultLocale}
├── error.tsx               # Error boundary
├── not-found.tsx           # 404 page
│
├── [locale]/               # Routes localisées (/fr, /en, ...)
│   ├── layout.tsx          # I18nProvider + metadata locale (hreflang, canonical)
│   ├── page.tsx            # Page principale — composition uniquement
│   └── artists/            # Pages secondaires → /fr/artists, /en/artists
│       └── page.tsx
│
└── api/                    # API routes (non localisées)
    └── users/
        └── route.ts

src/middleware.ts            # ← à la racine de src/ (pas dans app/)

❌ INTERDIT - Pages Router
pages/
├── index.tsx               # NE PAS UTILISER
├── about.tsx
└── api/
    └── users.ts
```

### Layouts

```typescript
// ✅ src/app/layout.tsx - Root Shell (fonts, JSON-LD global, scripts)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Mon App',
    template: '%s | Mon App',
  },
  description: 'Description de mon application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning : le lang est mis à jour dynamiquement par [locale]/layout.tsx
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

// ✅ src/app/[locale]/layout.tsx - Layout localisé (I18nProvider + metadata)
// Voir section Internationalisation (i18n) pour le code complet

// ✅ Layout imbriqué
// src/ui/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

### Pages

```typescript
// ✅ Page Server Component (par défaut)
// src/ui/app/products/page.tsx
export default async function ProductsPage() {
  // Data fetching direct dans le composant
  const products = await getProducts();
  
  return (
    <div>
      <h1>Products</h1>
      <ProductList products={products} />
    </div>
  );
}

// ✅ Page avec params dynamiques
// src/ui/app/products/[id]/page.tsx
interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound(); // Affiche not-found.tsx
  }
  
  return <ProductDetail product={product} />;
}

// ✅ Génération des metadata dynamiques
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  return {
    title: product.name,
    description: product.description,
  };
}
```

### Loading et Error States

```typescript
// ✅ src/ui/app/products/loading.tsx
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner" />
    </div>
  );
}

// ✅ src/ui/app/products/error.tsx
'use client'; // Error components DOIVENT être Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// ✅ src/ui/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

---

## Server vs Client Components

### Quand Utiliser Quoi

```typescript
// ✅ SERVER COMPONENT (par défaut) - Utiliser pour :
// - Data fetching
// - Accès backend (DB, APIs)
// - Logique serveur
// - SEO-critical content
// - Pas d'interactivité

export default async function ProductList() {
  const products = await db.query.products.findMany();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ✅ CLIENT COMPONENT - Utiliser UNIQUEMENT pour :
// - Hooks React (useState, useEffect, etc.)
// - Event handlers (onClick, onChange, etc.)
// - Browser APIs (window, localStorage, etc.)
// - Interactivité utilisateur
// - Context providers

'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Composition Optimale

```typescript
// ✅ BON - Server Component parent avec Client Component enfant
// src/ui/app/products/page.tsx (Server Component)
export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>Products</h1>
      {/* Server Component peut rendre Client Component */}
      <ProductFilters />
      <ProductList products={products} />
    </div>
  );
}

// src/ui/components/ProductFilters.tsx (Client Component)
'use client';

export function ProductFilters() {
  const [filter, setFilter] = useState('');
  // Interactivité ici
}

// ❌ MAUVAIS - Client Component parent avec Server Component enfant
'use client';

export function ProductsPage() {
  const [filter, setFilter] = useState('');
  
  return (
    <div>
      {/* ❌ Ne peut pas rendre async Server Component ici */}
      <ProductList />
    </div>
  );
}

// ✅ SOLUTION - Props children ou composition
'use client';

export function ProductsPageLayout({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState('');
  
  return (
    <div>
      <FilterBar value={filter} onChange={setFilter} />
      {/* children peut être un Server Component */}
      {children}
    </div>
  );
}
```

### Directives

```typescript
// ✅ 'use client' en PREMIÈRE ligne du fichier
'use client';

import { useState } from 'react';

export function Component() {
  // ...
}

// ✅ 'use server' pour Server Actions
'use server';

export async function createUser(formData: FormData) {
  // ...
}

// ❌ MAUVAIS
import { useState } from 'react';

'use client'; // ❌ Trop tard, doit être en premier

export function Component() {
  // ...
}
```

---

## Data Fetching

### Dans Server Components

```typescript
// ✅ BON - Fetch direct dans le composant
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch automatiquement cached
  const product = await fetch(`https://api.example.com/products/${id}`)
    .then(res => res.json());
  
  return <ProductDetail product={product} />;
}

// ✅ BON - Avec Drizzle/Prisma
export default async function UsersPage() {
  const users = await db.query.users.findMany();
  
  return <UserList users={users} />;
}

// ✅ BON - Requests parallèles
export default async function DashboardPage() {
  // S'exécutent en parallèle
  const [users, products, stats] = await Promise.all([
    getUsers(),
    getProducts(),
    getStats(),
  ]);
  
  return (
    <div>
      <UserStats stats={stats} />
      <UserList users={users} />
      <ProductList products={products} />
    </div>
  );
}
```

### Cache Configuration

```typescript
// ✅ Cache par défaut (recommended)
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  // Cache: 'force-cache' par défaut
  return res.json();
}

// ✅ Revalidation périodique
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // Revalider toutes les heures
  });
  return res.json();
}

// ✅ Pas de cache (données changeant constamment)
async function getCurrentStock() {
  const res = await fetch('https://api.example.com/stock', {
    cache: 'no-store',
  });
  return res.json();
}

// ✅ Avec use cache (Next.js 16)
'use cache';
export async function getProduct(id: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  return product;
}
```

### Streaming avec Suspense

```typescript
// ✅ BON - Streaming de contenu
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Rendu immédiat */}
      <QuickStats />
      
      {/* Streaming - affiche Skeleton pendant le chargement */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

// Composant qui fetch des données lentes
async function RevenueChart() {
  const data = await getRevenueData(); // Peut être lent
  return <Chart data={data} />;
}
```

---

## Server Actions

### Définition et Usage

```typescript
// ✅ Fichier dédié aux Server Actions
// src/domain/usecases/user-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  // Validation
  if (!name || !email) {
    return { error: 'Name and email are required' };
  }
  
  // Business logic via domain layer
  const user = await userRepository.create({ name, email });
  
  // Revalidation du cache
  revalidatePath('/users');
  
  // Redirection
  redirect(`/users/${user.id}`);
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  
  await userRepository.update(id, { name });
  
  revalidatePath(`/users/${id}`);
  revalidatePath('/users');
  
  return { success: true };
}

export async function deleteUser(id: string) {
  await userRepository.delete(id);
  
  revalidatePath('/users');
  redirect('/users');
}
```

### Dans les Composants

```typescript
// ✅ BON - Formulaire avec Server Action
// src/ui/components/CreateUserForm.tsx
import { createUser } from '@/domain/usecases/user-actions';

export function CreateUserForm() {
  return (
    <form action={createUser}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}

// ✅ BON - Avec useActionState pour état client
'use client';

import { useActionState } from 'react';
import { createUser } from '@/domain/usecases/user-actions';

export function CreateUserForm() {
  const [state, formAction] = useActionState(createUser, null);
  
  return (
    <form action={formAction}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
      
      <button type="submit">Create User</button>
    </form>
  );
}

// ✅ BON - Action programmatique
'use client';

export function DeleteButton({ userId }: { userId: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await deleteUser(userId);
    }
  };
  
  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
}
```

### Avec Zod Validation

```typescript
// ✅ BON - Validation avec Zod
'use server';

import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.coerce.number().min(18),
});

export async function createUser(formData: FormData) {
  // Parse et valide
  const result = createUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    age: formData.get('age'),
  });
  
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }
  
  const user = await userRepository.create(result.data);
  
  revalidatePath('/users');
  redirect(`/users/${user.id}`);
}
```

---

## Routing et Navigation

### Link Component

```typescript
// ✅ BON - Navigation avec Link
import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/products">Products</Link>
      
      {/* Prefetch désactivé si nécessaire */}
      <Link href="/admin" prefetch={false}>
        Admin
      </Link>
    </nav>
  );
}

// ❌ MAUVAIS
export function Navigation() {
  return (
    <nav>
      <a href="/">Home</a> {/* ❌ Recharge complète de la page */}
    </nav>
  );
}
```

### Programmatic Navigation

```typescript
// ✅ BON - useRouter pour navigation programmatique
'use client';

import { useRouter } from 'next/navigation';

export function SearchForm() {
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query');
    
    router.push(`/search?q=${query}`);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="search" name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Parallel Routes

```typescript
// ✅ Structure pour parallel routes
app/
├── layout.tsx
├── page.tsx
├── @modal/           # Slot modal
│   └── (..)photo/
│       └── [id]/
│           └── page.tsx
└── photo/
    └── [id]/
        └── page.tsx

// src/ui/app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

### Intercepting Routes

```typescript
// ✅ Intercepting route pattern
// src/ui/app/@modal/(.)photo/[id]/page.tsx
export default function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  // Modal qui intercepte /photo/[id]
  return <Modal>...</Modal>;
}
```

---

## Internationalisation (i18n)

### Principe : locale dans l'URL

La locale fait partie de l'URL (`/fr`, `/en`). Chaque version linguistique est une route distincte,
indexée séparément par Google. Pas de `localStorage`, pas de cookies — la locale est une donnée serveur.

```
/          → redirect vers /{defaultLocale}  (middleware ou page.tsx)
/fr        → version française (indexée par Google)
/en        → version anglaise (indexée par Google)
/fr/artists → page artistes en français
/en/artists → page artistes en anglais
```

### Structure des fichiers

```
src/
├── app/
│   ├── page.tsx                    # redirect('/fr')
│   ├── [locale]/
│   │   ├── layout.tsx              # I18nProvider + generateMetadata
│   │   └── page.tsx                # page principale
│   └── i18n/
│       ├── provider.tsx            # Context — reçoit initialLocale en prop
│       └── locales/
│           ├── fr.json
│           └── en.json
├── config/
│   └── locales.ts                  # Source de vérité unique (type, tableau, defaultLocale)
└── middleware.ts                   # Détection langue navigateur → redirect automatique
```

### `[locale]/layout.tsx` — layout localisé

```typescript
import type { Locale } from '@/config/locales'
import { locales } from '@/config/locales'
import { I18nProvider } from '@/app/i18n/provider'
import type { Metadata } from 'next'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: Locale }> }
): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: {
      canonical: `https://example.com/${locale}`,
      languages: {
        fr: 'https://example.com/fr',
        en: 'https://example.com/en',
        'x-default': 'https://example.com/fr',
      },
    },
  }
}

// Génère /fr et /en au build — ajouter une locale dans locales[] suffit
export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  return (
    <I18nProvider initialLocale={locale}>
      {children}
    </I18nProvider>
  )
}
```

### `I18nProvider` — locale depuis l'URL, changement par navigation

```typescript
'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/config/locales'
import { getTranslations, type Translations } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: React.ReactNode
  initialLocale: Locale  // ← vient de l'URL, jamais de localStorage
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const router = useRouter()
  const [locale] = useState<Locale>(initialLocale)
  const [translations] = useState<Translations>(getTranslations(initialLocale))

  // Changer de langue = naviguer vers la nouvelle URL
  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale) router.push(`/${newLocale}`)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within an I18nProvider')
  return context
}
```

### Middleware — détection automatique de la langue

```typescript
// src/middleware.ts  (à la racine de src/, PAS dans app/)
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/config/locales'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Laisser passer les assets et API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Déjà sur une route avec locale → laisser passer
  const hasLocale = locales.some(
    l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  )
  if (hasLocale) return NextResponse.next()

  // Détecter la langue du navigateur, fallback sur defaultLocale
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferredLocale =
    locales.find(l => acceptLanguage.toLowerCase().includes(l)) ?? defaultLocale

  return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
```

### Ajouter une nouvelle page localisée

Créer simplement le fichier dans `[locale]/` — routing et SEO suivent automatiquement :

```
src/app/[locale]/artists/page.tsx  →  /fr/artists  et  /en/artists
```

`generateStaticParams` dans le layout parent génère toutes les combinaisons au build.
Aucune modification du middleware ou du routing nécessaire.

### ❌ Anti-patterns i18n

```typescript
// ❌ Locale dans localStorage
useEffect(() => {
  const locale = localStorage.getItem('locale') // Ne jamais faire ça
}, [])

// ❌ Une seule URL pour toutes les langues
// → Google ne peut pas indexer les deux versions séparément
// → hreflang sans routes distinctes = erreur SEO

// ❌ Passer locale en prop à travers tous les composants
<Section locale={locale} />  // Utiliser useI18n() à la place dans les Client Components
```

---

## Metadata et SEO

### Static Metadata

```typescript
// ✅ src/ui/app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
  openGraph: {
    title: 'About Us',
    description: 'Learn more about our company',
    images: ['/og-image.jpg'],
  },
};

export default function AboutPage() {
  return <div>About</div>;
}
```

### Dynamic Metadata

```typescript
// ✅ src/ui/app/products/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}
```

---

## Performance

### Images

```typescript
// ✅ BON - Next.js Image component
import Image from 'next/image';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        priority={false} // true pour above-the-fold images
      />
    </div>
  );
}
```

### Fonts

```typescript
// ✅ BON - next/font pour optimisation auto
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Patterns Anti-Patterns

### ✅ À FAIRE

```typescript
// Server Components pour data fetching
export default async function Page() {
  const data = await getData();
  return <Content data={data} />;
}

// Client Components minimalistes
'use client';
export function InteractiveButton() {
  const [clicked, setClicked] = useState(false);
  return <button onClick={() => setClicked(true)}>Click</button>;
}

// Composition Server + Client
export default async function Page() {
  const data = await getData();
  return (
    <div>
      <StaticContent data={data} />
      <InteractiveWidget />
    </div>
  );
}
```

### ❌ À ÉVITER

```typescript
// ❌ Fetch côté client sans raison
'use client';
export function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(/* ... */); // Mauvais: faire côté serveur
  }, []);
}

// ❌ Tout en Client Component
'use client';
export default function Page() {
  // Tout le contenu devient client-side inutilement
  return <div>Static content</div>;
}

// ❌ getServerSideProps (Pages Router)
export async function getServerSideProps() { // N'existe plus dans App Router
  // ...
}
```

---

**Note pour Claude Code :** Toujours privilégier Server Components par défaut, n'utiliser Client Components que pour l'interactivité nécessaire.
