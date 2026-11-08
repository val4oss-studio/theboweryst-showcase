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

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------------
# Stage 3: Runner
# ---------------
FROM docker.io/library/node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create app user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create necessary directories and set permissions
# .next/cache holds the image cache and the Instagram feed cache (fetch-cache)
RUN mkdir -p /app/.next/cache/images && \
    chown -R nextjs:nodejs /app/.next/cache

USER nextjs

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Start Next.js
CMD ["node", "server.js"]
