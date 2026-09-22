# DJ Solar — Plataforma Web + CMS Administrativo

Plataforma institucional premium para a DJ Solar (energia solar), com painel
administrativo (CMS) completo. Especificação integral em [`PROMPT.md`](./PROMPT.md);
execução acompanhada passo a passo em [`PASSOS.md`](./PASSOS.md); estado vivo do
projeto em [`CONTEXTO.md`](./CONTEXTO.md).

## Arquitetura (monorepo)

```
apps/
  website/   → site público (React + Vite + TypeScript + Tailwind)
  admin/     → painel administrativo / CMS (React + Vite + TypeScript + Tailwind)
  api/       → API REST (NestJS + TypeScript)
packages/
  types/     → tipos/DTOs compartilhados entre website, admin e api
  config/    → configurações compartilhadas de TypeScript e ESLint
```

## Execução

> ⚠️ O projeto é 100% containerizado. Não é necessário instalar Node, PostgreSQL,
> Redis ou Nginx localmente — tudo roda via Docker.

```bash
cp .env.example .env
docker compose up -d --build
```

- Website: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:3333/api/v1
- PostgreSQL: localhost:5432 (ver credenciais em `.env`)
- Redis: localhost:6379

Hot reload está ativo nos três serviços de aplicação (Vite para website/admin,
`nest start --watch` para a API) — editar o código no host reflete direto nos
containers via bind mount, sem precisar reconstruir a imagem.

Para acompanhar logs de um serviço específico:

```bash
docker compose logs -f api
```

Para derrubar tudo (mantendo os volumes de dados do Postgres/Redis):

```bash
docker compose down
```

**Importante:** nunca rode `npm install` diretamente no host Windows deste
projeto — instalações diretas no Windows já se mostraram instáveis (antivírus
corrompendo `node_modules`, ver `CONTEXTO.md`). Toda instalação de dependências
acontece dentro dos containers, automaticamente, via `docker compose up --build`.
