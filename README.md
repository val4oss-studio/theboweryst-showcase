# The Boweryst — showcase

Bilingual (FR/EN) showcase website for **The Boweryst** tattoo studio.

**Production:** https://theboweryst.fr

---

## Stack

- **Next.js 16** (App Router, Server Components)
- **SQLite3** via `better-sqlite3` (local database mounted as a volume)
- **Tailwind CSS v4**
- **TypeScript**

---

## Local Development

```bash
npm install
npm run db:migrate   # Create tables
npm run db:seed      # Seed initial data (optional)
npm run dev          # http://localhost:3000
```

---

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

## Deployment with Podman

### 1. Build the image (locally)

```bash
podman build -t theboweryst -f Containerfile .
```

### 2. Export the image as a tar archive

```bash
podman save -o theboweryst.tar theboweryst
```

### 3. Transfer to the server

```bash
scp theboweryst.tar user@monserveur:/home/user/
```

### 4. Load on the server

```bash
# Connect to the server
ssh user@monserveur.fr

# Load the image
podman load -i theboweryst.tar
```

### 5. Run the container

```bash
podman run -d \
  --name theboweryst \
  --restart=unless-stopped \
  -p 3000:3000 \
  -v /data/theboweryst/database:/app/database \
  theboweryst
```

> The `/data/theboweryst/database` directory must exist on the server and contain `app.db`.
> First install: initialize the database inside the container.

---

## Scripts inside the container

CLI scripts are compiled into the image at `/app/scripts/`:

```bash
# Artists
podman exec theboweryst node scripts/artist/list.js
podman exec theboweryst node scripts/artist/get.js <id>
podman exec theboweryst node scripts/artist/add.js <username> <igId> <bio_fr> <bio_en>
podman exec theboweryst node scripts/artist/remove.js <id>

# Posts
podman exec theboweryst node scripts/post/list.js
podman exec theboweryst node scripts/post/get.js <id>
podman exec theboweryst node scripts/post/remove.js <id>
```
