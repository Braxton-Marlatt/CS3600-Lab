
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# -- Sebastjan (for Mac I can not make it work with npm)
#FROM oven/bun:1-alpine AS frontend-builder
#WORKDIR /app
#COPY frontend/package.json frontend/bun.lock ./
#RUN bun install --frozen-lockfile
#COPY frontend/ .
#RUN bun run build
# --


FROM node:22-alpine AS backend-builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build


FROM node:22-alpine AS production
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY --from=backend-builder /app/dist ./dist
COPY --from=frontend-builder /app/dist ./public
RUN mkdir -p data

EXPOSE 3000
CMD ["node", "dist/server.js"]
