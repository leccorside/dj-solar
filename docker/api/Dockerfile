# Dockerfile de desenvolvimento — API (NestJS)
FROM node:20-alpine

# OpenSSL é exigido em runtime pelo query engine do Prisma no Alpine (musl).
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/website/package.json apps/website/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json
# O postinstall do apps/api roda `prisma generate`, que precisa do schema já
# presente durante o `npm install` (antes do COPY . . completo abaixo).
COPY apps/api/prisma apps/api/prisma

RUN npm install

COPY . .

WORKDIR /app/apps/api

EXPOSE 3333

CMD ["npm", "run", "start:dev"]
