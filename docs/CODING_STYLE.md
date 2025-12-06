# Conventions de Code - Style Guide

> **Pour Claude Code :** Ces conventions sont **NON NÉGOCIABLES**.
> Toute suggestion de code DOIT respecter ces règles.

## 📋 Table des Matières

1. [Conventions de Nommage](#conventions-de-nommage)
2. [Formatting & Syntaxe](#formatting--syntaxe)
3. [TypeScript](#typescript)
4. [React & Next.js](#react--nextjs)
5. [Structure des Fichiers](#structure-des-fichiers)
6. [Imports](#imports)
7. [Commentaires](#commentaires)
8. [Tests](#tests)

---

## Conventions de Nommage

### Fichiers et Dossiers

```
✅ BON
components/
  UserProfile.tsx          # Composants React → PascalCase
  user-profile.module.css  # Styles → kebab-case
utils/
  formatDate.ts            # Utilitaires → camelCase
  api-client.ts            # Fichiers multi-mots → kebab-case
constants/
  API_ENDPOINTS.ts         # Constantes → SCREAMING_SNAKE_CASE

❌ MAUVAIS
components/
  userProfile.tsx          # Pas camelCase pour composants
  User_Profile.tsx         # Pas snake_case
utils/
  FormatDate.ts            # Pas PascalCase pour utilitaires
```

### Variables et Fonctions

```typescript
// ✅ BON
const userName = 'John'                    // camelCase pour variables
const MAX_RETRY_COUNT = 3                  // SCREAMING_SNAKE_CASE pour constantes
function calculateTotal() {}                // camelCase pour fonctions
const getUserById = (id: string) => {}     // camelCase pour arrow functions

// ❌ MAUVAIS
const UserName = 'John'                    // Pas PascalCase
const max_retry_count = 3                  // Pas snake_case
function CalculateTotal() {}                // Pas PascalCase
```

### React & Next.js

```typescript
// ✅ BON - Composants
export function UserProfile() {}            // PascalCase
export const Button = () => {}              // PascalCase

// ✅ BON - Hooks
export function useAuth() {}                // Préfixe "use" + camelCase
export const useLocalStorage = () => {}    // Préfixe "use" + camelCase

// ✅ BON - Types & Interfaces
interface UserProps {}                      // PascalCase + suffixe "Props" pour props
type ApiResponse = {}                       // PascalCase
interface IUserRepository {}                // PascalCase + préfixe "I" pour interfaces (optionnel)

// ❌ MAUVAIS
function userProfile() {}                   // Pas camelCase pour composants
export function UseAuth() {}                // "Use" pas en minuscule
interface userProps {}                      // Pas camelCase
```

### Classes et Objets (Domain Layer)

```typescript
// ✅ BON
class UserEntity {}                         // PascalCase
class CreateUserUseCase {}                  // PascalCase
class UserRepository {}                     // PascalCase

// Objets de configuration
const dbConfig = {}                         // camelCase
const APP_CONFIG = {}                       // SCREAMING_SNAKE_CASE si immuable

// ❌ MAUVAIS
class userEntity {}                         // Pas camelCase
class create_user_usecase {}                // Pas snake_case
```

---

## Formatting & Syntaxe

### Règles Générales

```typescript
// ✅ Quotes : SINGLE quotes partout
const name = 'John'
import { Button } from './Button'

// ❌ MAUVAIS
const name = "John"                         // Pas double quotes

// ✅ Semicolons : TOUJOURS
const x = 5;
function test() { return true; }

// ❌ MAUVAIS
const x = 5                                 // Manque semicolon

// ✅ Indentation : 2 ESPACES
function example() {
  if (true) {
    console.log('test');
  }
}

// ❌ MAUVAIS
function example() {
    if (true) {                             // 4 espaces
        console.log('test');
    }
}

// ✅ Trailing commas : OUI (sauf fonctions)
const obj = {
  name: 'test',
  age: 30,
};

const arr = [
  'one',
  'two',
];

// ❌ MAUVAIS - Trailing comma dans paramètres fonction
function test(
  param1: string,
  param2: number,  // ← À éviter
) {}
```

### Longueur de Ligne

```typescript
// Maximum 100 caractères par ligne
// ✅ BON - Découper les longues lignes
const message = 
  'Ceci est un très long message qui dépasse les 100 caractères donc ' +
  'on le découpe sur plusieurs lignes';

// Import découpage
import {
  LongComponentName,
  AnotherLongName,
  YetAnotherName,
} from './components';

// ❌ MAUVAIS
const message = 'Ceci est un très long message qui dépasse les 100 caractères et continue encore et encore sur la même ligne';
```

### Accolades et Espaces

```typescript
// ✅ BON - Accolades sur même ligne (K&R style)
if (condition) {
  doSomething();
} else {
  doSomethingElse();
}

// Espaces autour des opérateurs
const sum = a + b;
const isValid = x === y;

// Pas d'espace avant parenthèses de fonction
function test() {}
const arrow = () => {};

// ❌ MAUVAIS
if (condition) 
{                                           // Accolade sur nouvelle ligne
  doSomething();
}

const sum=a+b;                              // Manque espaces
function test () {}                         // Espace avant parenthèse
```

---

## TypeScript

### Typage Explicite

```typescript
// ✅ BON - Types explicites partout
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const userName: string = 'John';
const userAge: number = 30;
const isActive: boolean = true;

// Props React typées explicitement
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  // ...
}

// ❌ MAUVAIS - Inférence de type (sauf cas évidents)
function calculateTotal(items) {            // Manque types
  return items.reduce((sum, item) => sum + item.price, 0);
}

const userName = 'John';                    // OK pour cas simples, mais explicite préféré
```

### Any et Unknown

```typescript
// ✅ BON - Éviter 'any', préférer 'unknown'
function parseJson(json: string): unknown {
  return JSON.parse(json);
}

// Si vraiment nécessaire, documenter pourquoi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyFunction(data: any): void {  // TODO: Typer correctement
  // ...
}

// ❌ MAUVAIS
function parseJson(json: string): any {     // N'utilise pas 'any'
  return JSON.parse(json);
}
```

### Types vs Interfaces

```typescript
// ✅ Types pour : unions, intersections, primitives
type Status = 'pending' | 'active' | 'completed';
type UserWithRole = User & { role: Role };
type Callback = (value: string) => void;

// ✅ Interfaces pour : objets, contrats, classes
interface User {
  id: string;
  name: string;
  email: string;
}

interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// Préférence : Interfaces pour props React
interface ButtonProps {
  label: string;
  onClick: () => void;
}
```

### Enums

```typescript
// ✅ BON - Const enums ou union types
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

type UserRoleType = typeof UserRole[keyof typeof UserRole];

// OU union type simple
type UserRole = 'admin' | 'user' | 'guest';

// ❌ ÉVITER - Enums classiques (problèmes de bundle size)
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
```

---

## React & Next.js

### Composants Fonctionnels

```typescript
// ✅ BON - Fonction nommée avec types explicites
interface UserCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

export function UserCard({ name, email, onEdit }: UserCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
}

// ✅ BON - Arrow function aussi acceptable
export const UserCard = ({ name, email, onEdit }: UserCardProps) => {
  return (
    <div>
      {/* ... */}
    </div>
  );
};

// ❌ MAUVAIS
export default function({ name, email }) {  // Pas de nom, pas de types
  return <div>{name}</div>;
}

const UserCard = (props) => {               // Pas de destructuration
  return <div>{props.name}</div>;
}
```

### Props et Destructuration

```typescript
// ✅ BON - Destructuration en paramètres
export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ✅ BON - Props complexes
interface FormProps {
  initialValues: FormData;
  onSubmit: (data: FormData) => void;
  children: React.ReactNode;
}

export function Form({ initialValues, onSubmit, children }: FormProps) {
  // ...
}

// ❌ MAUVAIS
export function Button(props: ButtonProps) {  // Pas de destructuration
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Hooks

```typescript
// ✅ BON - Hooks au top du composant, ordre cohérent
export function UserProfile() {
  // 1. State hooks
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 2. Effect hooks
  useEffect(() => {
    loadUser();
  }, []);
  
  // 3. Custom hooks
  const { isAuthenticated } = useAuth();
  
  // 4. Callbacks et memoization
  const handleSave = useCallback(() => {
    // ...
  }, [user]);
  
  // 5. Early returns
  if (loading) return <Spinner />;
  if (!user) return <NotFound />;
  
  // 6. Render
  return <div>{user.name}</div>;
}

// ❌ MAUVAIS - Hooks conditionnels
export function UserProfile() {
  if (condition) {
    const [state, setState] = useState();  // ❌ Hook conditionnel
  }
}
```

### Server vs Client Components

```typescript
// ✅ Server Component (par défaut - pas de directive)
// src/ui/app/page.tsx
export default async function HomePage() {
  const data = await fetchData();
  
  return (
    <div>
      <h1>Home</h1>
      <ClientButton />
    </div>
  );
}

// ✅ Client Component (directive 'use client' en PREMIÈRE ligne)
// src/ui/components/ClientButton.tsx
'use client';

import { useState } from 'react';

export function ClientButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ❌ MAUVAIS
'use client'                                // Manque semicolon

import { useState } from 'react'            // 'use client' doit être en premier
'use client';
```

---

## Structure des Fichiers

### Organisation d'un Composant

```typescript
// ✅ BON - Structure standard d'un fichier composant
// src/ui/components/UserCard.tsx

// 1. Directives (si nécessaire)
'use client';

// 2. Imports externes
import { useState } from 'react';
import Link from 'next/link';

// 3. Imports internes (absolus si configuré)
import { formatDate } from '@/utils/date';
import { Button } from '@/ui/components/Button';

// 4. Types et interfaces
interface UserCardProps {
  user: User;
  onEdit: () => void;
}

// 5. Constantes locales
const DEFAULT_AVATAR = '/images/default-avatar.png';

// 6. Composant principal
export function UserCard({ user, onEdit }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      {/* ... */}
    </div>
  );
}

// 7. Composants helpers (si petits et liés)
function UserAvatar({ src }: { src: string }) {
  return <img src={src || DEFAULT_AVATAR} alt="" />;
}

// 8. Exports nommés supplémentaires (si nécessaire)
export type { UserCardProps };
```

### Un Composant = Un Fichier

```
✅ BON
components/
  UserCard.tsx
  UserCard.test.tsx
  UserCard.module.css      (si CSS modules)

✅ BON - Composant complexe avec sous-composants
components/
  UserCard/
    UserCard.tsx           (composant principal exporté)
    UserAvatar.tsx         (sous-composant si réutilisé)
    UserBadge.tsx
    types.ts               (types partagés)
    index.ts               (re-export clean)

❌ MAUVAIS
components/
  UserComponents.tsx       (plusieurs composants dans un fichier)
```

---

## Imports

### Ordre des Imports

```typescript
// ✅ BON - Ordre standardisé
// 1. React et Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 2. Librairies externes (ordre alphabétique)
import { z } from 'zod';
import clsx from 'clsx';

// 3. Imports internes - Alias @ (layers de haut en bas)
import { createUser } from '@/domain/usecases/createUser';
import { UserRepository } from '@/data/repositories/UserRepository';
import { Button } from '@/ui/components/Button';
import { formatDate } from '@/utils/date';

// 4. Imports relatifs (éviter si possible)
import { helper } from './helpers';

// 5. Styles (toujours en dernier)
import styles from './UserCard.module.css';

// ❌ MAUVAIS - Mélange aléatoire
import { Button } from '@/ui/components/Button';
import { useState } from 'react';
import styles from './UserCard.module.css';
import Link from 'next/link';
```

### Import / Export

```typescript
// ✅ BON - Exports nommés (préféré)
export function Button() {}
export const config = {};
export type ButtonProps = {};

// Import
import { Button, config, type ButtonProps } from './Button';

// ✅ BON - Default export pour pages Next.js uniquement
// app/page.tsx
export default function HomePage() {}

// ❌ ÉVITER - Default exports pour composants
export default function Button() {}         // Préférer export nommé
```

---

## Commentaires

### Quand Commenter

```typescript
// ✅ BON - Commenter le "pourquoi", pas le "quoi"

// Workaround: Safari ne supporte pas scrollIntoView avec smooth behavior
element.scrollIntoView({ behavior: 'auto' });

// HACK: Temporary fix for race condition in user loading
// TODO: Refactor with proper loading state management
await sleep(100);

/**
 * Calcule le prix total avec remise et taxes.
 * 
 * @param items - Liste des articles
 * @param discountCode - Code promo optionnel
 * @returns Prix total TTC en euros
 */
export function calculateTotal(
  items: Item[], 
  discountCode?: string
): number {
  // ...
}

// ❌ MAUVAIS - Commentaires inutiles
// Créer une variable pour le nom
const name = 'John';                        // Évident

// Boucle sur les items
items.forEach(item => {                     // Évident
  // ...
});
```

### Types de Commentaires

```typescript
// TODO: Implémenter la validation email
// FIXME: Bug avec les caractères spéciaux
// HACK: Solution temporaire, à refactorer
// NOTE: Cette fonction est appelée par le webhook externe
// @deprecated Utiliser newFunction() à la place
```

### JSDoc pour Types Complexes

```typescript
// ✅ BON - JSDoc pour fonctions publiques complexes
/**
 * Crée un nouvel utilisateur dans le système.
 * 
 * @param userData - Données de l'utilisateur
 * @param options - Options de création
 * @param options.sendEmail - Envoyer email de bienvenue (default: true)
 * @param options.role - Rôle à assigner (default: 'user')
 * @returns L'utilisateur créé avec son ID
 * @throws {ValidationError} Si les données sont invalides
 * @throws {DuplicateError} Si l'email existe déjà
 * 
 * @example
 * ```ts
 * const user = await createUser({
 *   name: 'John',
 *   email: 'john@example.com'
 * });
 * ```
 */
export async function createUser(
  userData: UserData,
  options?: CreateUserOptions
): Promise<User> {
  // ...
}
```

---

## Tests

### Nommage des Tests

```typescript
// ✅ BON - describe / it pattern
describe('UserCard', () => {
  it('should render user name', () => {
    // ...
  });
  
  it('should call onEdit when edit button is clicked', () => {
    // ...
  });
  
  it('should show loading state when data is fetching', () => {
    // ...
  });
});

// ✅ BON - test() acceptable aussi
test('UserCard renders user name', () => {
  // ...
});

// ❌ MAUVAIS
describe('UserCard', () => {
  it('renders', () => {                     // Trop vague
    // ...
  });
  
  it('test edit button', () => {            // Pas assez descriptif
    // ...
  });
});
```

### Structure d'un Test

```typescript
// ✅ BON - Pattern Arrange-Act-Assert (AAA)
it('should calculate total with discount', () => {
  // Arrange - Préparer les données
  const items = [
    { price: 10, quantity: 2 },
    { price: 20, quantity: 1 },
  ];
  const discountCode = 'SAVE10';
  
  // Act - Exécuter l'action
  const total = calculateTotal(items, discountCode);
  
  // Assert - Vérifier le résultat
  expect(total).toBe(36); // (10*2 + 20) - 10% = 36
});
```

---

## 📌 Checklist Avant Commit

- [ ] Nommage respecté (fichiers, variables, fonctions)
- [ ] Single quotes et semicolons partout
- [ ] Types TypeScript explicites (pas de any)
- [ ] Imports ordonnés correctement
- [ ] Pas de console.log oubliés
- [ ] Commentaires pertinents (pourquoi, pas quoi)
- [ ] Tests passent (si applicable)
- [ ] Pas de code mort (code commenté, imports inutilisés)
- [ ] Longueur de ligne < 100 caractères

---

**Note pour Claude Code :** En cas de doute sur une convention, consulte ce fichier EN PREMIER avant de proposer du code.

