# ---------- Base ----------
FROM oven/bun:latest AS base
WORKDIR /app

# ---------- Install deps (cached) ----------
FROM base AS deps

# Copy root config
COPY package.json bun.lock turbo.json ./

# 🔥 IMPORTANT: copy FULL workspace structure
COPY packages ./packages
COPY apps ./apps

RUN bun install --frozen-lockfile

# ---------- Build ----------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build only API + its dependencies
RUN bunx turbo run build --filter=api...

# ---------- Runtime ----------
FROM oven/bun:latest AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built output + deps
COPY --from=builder /app ./

EXPOSE 3000

CMD ["bun", "apps/api/src/server.ts"]