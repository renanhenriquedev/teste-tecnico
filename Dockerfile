# deps com prod-only
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# build de TS -> JS
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# runner final
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# node_modules só de prod
COPY --from=deps /app/node_modules ./node_modules
# artefatos buildados
COPY --from=builder /app/dist ./dist
# opcional: copiar openapi.json se usado em runtime
COPY src/app/openapi.json ./dist/app/openapi.json
# opcional: copiar .env (ou prefira env_file no compose)
# COPY .env ./.env
EXPOSE 3000
CMD ["node", "dist/app/server.js"]
