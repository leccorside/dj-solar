# Dockerfile de desenvolvimento — site público (React + Vite)
# Build de produção fica para o Passo 30 (docker-compose de produção).
FROM node:20-alpine

WORKDIR /app

# Copia apenas os manifests primeiro para aproveitar o cache de camadas do Docker
COPY package.json package-lock.json ./
COPY apps/website/package.json apps/website/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json

RUN npm install

# Código-fonte real vem via bind mount no docker-compose (hot reload);
# copiamos aqui também para permitir `docker run` isolado sem o compose.
COPY . .

WORKDIR /app/apps/website

EXPOSE 5173

CMD ["npm", "run", "dev"]
