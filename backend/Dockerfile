# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# Install all dependencies (postinstall scripts like prisma generate need dev deps)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY . .
# Copy all node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build

# ---- Runner ----
FROM base AS runner

# Copy production dependencies only
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy Prisma schema for runtime access
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
