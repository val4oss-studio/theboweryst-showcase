# ---------------------
# Stage 1: Dependencies
# ---------------------
FROM docker.io/library/node:22-slim AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# ----------------
# Stage 2: Builder
# ----------------
FROM docker.io/library/node:22-slim AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_DIR=/app/database

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run database migrations and seed data (remove and add 
# export const dynamic = 'force-dynamic' in [locale]/page.tsx
RUN npm run db:migrate
RUN npm run db:seed
RUN npm run build

# Compile scripts admin in JS
RUN npx esbuild \
      src/scripts/artist/add.ts \
      src/scripts/artist/list.ts \
      src/scripts/artist/get.ts \
      src/scripts/artist/remove.ts \
      --bundle --platform=node \
      --external:better-sqlite3 \
      --outdir=dist/scripts && \
    npx esbuild \
      src/data/db/scripts/migrate.ts \
      src/data/db/scripts/seed.ts \
      src/data/db/scripts/reset.ts \
      --bundle --platform=node \
      --external:better-sqlite3 \
      --outdir=dist/scripts/db

# ---------------
# Stage 3: Runner
# ---------------
FROM docker.io/library/node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_DIR=/app/database

# Create app user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/dist/scripts ./scripts

COPY --from=builder --chown=nextjs:nodejs /app/public/artists ./public/artists
COPY --from=builder --chown=nextjs:nodejs /app/public/logo.jpg ./public
COPY --from=builder --chown=nextjs:nodejs /app/public/theboweryst-logo.png ./public
COPY --from=builder --chown=nextjs:nodejs /app/public/default-avatar.jpg ./public
COPY --from=builder --chown=nextjs:nodejs /app/public/robots.txt ./public
COPY --from=builder --chown=nextjs:nodejs /app/public/icon-192.png ./public
COPY --from=builder --chown=nextjs:nodejs /app/public/icon-512.png ./public
COPY --from=builder --chown=nextjs:nodejs /app/public/theboweryst_background_web.webm ./public

# Create necessary directories and set permissions
# .next/cache holds the image cache and the Instagram feed cache (fetch-cache)
RUN mkdir -p /app/database /app/.next/cache/images && \
    chown -R nextjs:nodejs /app/database /app/.next/cache

USER nextjs

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Start Next.js
ENTRYPOINT ["sh", "./entrypoint.sh"]
