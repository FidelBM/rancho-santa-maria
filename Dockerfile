# ===== deps (cache por lockfile) =====
FROM node:20-alpine AS deps
WORKDIR /app

# Si usas npm:
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# (Si usas yarn o pnpm, cambia este bloque)

# ===== build =====
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ===== runtime (prod-only deps) =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Instala solo deps de producción
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copia artefactos de build y assets públicos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Si usas next.config con images o i18n, no hace falta copiar toda la app;
# next start con .next + node_modules es suficiente.
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD wget -qO- http://localhost:${PORT}/ || exit 1

CMD ["npm", "run", "start", "--", "-p", "3000"]
