# Builder stage
FROM node:26-alpine AS builder
WORKDIR /build

# Install corepack for pnpm
RUN npm install -g corepack && corepack enable pnpm

# Copy lockfile first for better layer caching
COPY pnpm-lock.yaml package.json ./

# Install all dependencies (prod + dev)
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Build TypeScript and generate Prisma client
RUN pnpm build && pnpm prisma:generate

# Runtime stage
FROM node:26-alpine
WORKDIR /app

# Install corepack for pnpm
RUN npm install -g corepack && corepack enable pnpm

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod && pnpm prisma:generate

# Copy built artifacts from builder
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/server.js"]
