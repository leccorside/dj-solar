# Dockerfile de desenvolvimento — painel administrativo (React + Vite)
FROM node:20-alpine

# É um monorepo com npm workspaces: `npm install` na raiz dispara o postinstall
# de TODOS os workspaces, incluindo o `prisma generate` do apps/api — por isso
# openssl e o schema do Prisma precisam estar presentes mesmo em imagens que
# não usam o Prisma diretamente.
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/website/package.json apps/website/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json
COPY apps/api/prisma apps/api/prisma

RUN npm install

COPY . .

WORKDIR /app/apps/admin

EXPOSE 5174

CMD ["npm", "run", "dev"]
