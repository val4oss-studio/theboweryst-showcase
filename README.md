# The Boweryst — showcase

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/val4oss-studio/theboweryst-showcase">
    <img src="public/logo.jpg" alt="Logo" width="80" height="80">
  </a>

  <p align="center">
    Showcase website for <b>The boweryst</b> tattoo studio.
    <br />
    <a href="https://github.com/val4oss-studio/theboweryst-showcase"><strong>Explore the sources »</strong></a>
    <br />
    <br />
<a href="https://theboweryst.fr">View the site</a>
    &middot;
    <a href="https://github.com/val4oss-studio/theboweryst-showcase/issues/new?template=bug-report-%F0%9F%90%9B.md">Report Bug</a>
    &middot;
    <a href="https://github.com/val4oss-studio/theboweryst-showcase/issues/new?template=feature-request-%F0%9F%9A%80.md">Request Feature</a>
  </p>
</div>

## Stack

* [![Next.js][nextjs-badge]][nextjs-url]
* [![Sqlite3][sqlite-badge]][sqlite-url]
* [![tailwind css][tailwind-badge]][tailwind-url]
* [![typescript][typescript-badge]][typescript-url]

## Features

* ![theme feature][theme-badge]
* ![i18n feature][language-badge]
* ![instagram feature][instagram-badge]

## Deployment with Makefile & Podman

### 1. Build the image

```bash
make build
```

### 2. Run the project in container

```bash
make run
```

### 3. Stop and clean

```bash
make stop
make clean
```

## Local Development

```bash
npm install
npm run db:migrate   # Create tables
npm run db:seed      # Seed initial data
npm run dev          # http://localhost:3000
```

## Management Scripts (CLI)

### Database

| Command | Description |
|---|---|
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed the database with initial data |
| `npm run db:reset` | Drop and recreate the database |

### Shop (studio information)

| Command | Description |
|---|---|
| `npm run shop:get` | Display shop information |
| `npm run shop:set <args>` | Initialize the shop |
| `npm run shop:update <field> [locale] <value>` | Update a field |

Examples:
```bash
npm run shop:update name "The Bower Yst"
npm run shop:update description fr "Un studio de tatouage..."
npm run shop:update description en "A tattoo studio..."
```

### Artists

| Command | Description |
|---|---|
| `npm run artist:list` | List all artists |
| `npm run artist:get <id>` | Show artist details |
| `npm run artist:add <username> <instagramId> <bio_fr> <bio_en> [photo]` | Add an artist |
| `npm run artist:remove <id>` | Remove an artist |

### Instagram Posts

| Command | Description |
|---|---|
| `npm run post:list` | List all posts |
| `npm run post:get <id>` | Show post details |
| `npm run post:add <args>` | Add a post |
| `npm run post:remove <id>` | Remove a post |
| `npm run instagram:sync` | Sync posts from Instagram |

---

[contributors-shield]: https://img.shields.io/github/contributors/val4oss-studio/theboweryst-showcase.svg?style=for-the-badge
[contributors-url]: https://github.com/val4oss-studio/theboweryst-showcase/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/val4oss-studio/theboweryst-showcase.svg?style=for-the-badge
[forks-url]: https://github.com/val4oss-studio/theboweryst-showcase/network/forks
[stars-shield]: https://img.shields.io/github/stars/val4oss-studio/theboweryst-showcase.svg?style=for-the-badge
[stars-url]: https://github.com/val4oss-studio/theboweryst-showcase/stargazers
[issues-shield]: https://img.shields.io/github/issues/val4oss-studio/theboweryst-showcase.svg?style=for-the-badge
[issues-url]: https://github.com/val4oss-studio/theboweryst-showcase/issues
[license-shield]: https://img.shields.io/github/license/val4oss-studio/theboweryst-showcase.svg?style=for-the-badge
[license-url]: https://github.com/val4oss-studio/theboweryst-showcase/blob/main/LICENSE
[sqlite-badge]: https://img.shields.io/badge/better_SQLite_V3-003B57?style=for-the-badge&logo=sqlite&logoColor=white
[sqlite-url]: https://www.npmjs.com/package/better-sqlite3
[nextjs-badge]: https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[nextjs-url]: https://vercel.com/geist/brands#next-js
[tailwind-badge]: https://img.shields.io/badge/tailwind_css_V4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[tailwind-url]: https://tailwindcss.com/brand
[typescript-badge]: https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/branding
[theme-badge]: https://img.shields.io/badge/theme-Dark%20Light-blue?style=for-the-badge
[language-badge]: https://img.shields.io/badge/i18n-Fran%C3%A7ais_English-red?style=for-the-badge
[instagram-badge]: https://img.shields.io/badge/instagram-synchronisation_posts-FF0069?style=for-the-badge&logo=instagram
