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

> ⚠️ O projeto é 100% containerizado. A partir do Passo 2 (Docker Compose), todo o
> desenvolvimento roda via:
>
> ```bash
> docker compose up -d --build
> ```
>
> Sem depender de instalação local de Node, PostgreSQL, Redis ou Nginx.

Enquanto o Docker Compose ainda não existe (fundação em andamento), é possível
validar cada workspace localmente com Node.js >= 20:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

- Website: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:3333/api/v1
