# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 mattercircle \
  && adduser --system --uid 1001 mattercircle

COPY --from=builder /app/public ./public
COPY --from=builder --chown=mattercircle:mattercircle /app/.next/standalone ./
COPY --from=builder --chown=mattercircle:mattercircle /app/.next/static ./.next/static

USER mattercircle
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
