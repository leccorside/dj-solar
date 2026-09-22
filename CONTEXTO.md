# CONTEXTO.md — DJ Solar

Resumo vivo do estado do projeto. Atualizado ao final de cada implementação relevante.

## Estado atual

Fundação do monorepo + Docker Compose + banco de dados com schema inicial e seed
concluídos (Passos 1 a 3 de `PASSOS.md`). Projeto sobe inteiro do zero (schema
aplicado e SUPER_ADMIN criado automaticamente) com `docker compose up -d --build`:

- `PROMPT.md` — especificação completa original (113 requisitos).
- `PASSOS.md` — checklist de execução em 30 passos, em ordem de prioridade,
  mapeando cada passo aos itens do `PROMPT.md` que ele cobre.
- Ativos de marca fornecidos: `logo-dj-solar.png`, `favicon.png`, `favicon.ico`
  (marca "DJ Solar — Energia Solar": sol laranja/dourado, painéis azuis, folha
  verde, tipografia branca/dourada sobre fundo escuro/grafite). Copiados para
  `apps/website/public/` e `apps/admin/public/`.
- Monorepo com npm workspaces: `apps/website` (React+Vite+TS+Tailwind, porta
  5173), `apps/admin` (idem, porta 5174), `apps/api` (NestJS+TS, porta 3333,
  prefixo `/api/v1`), `packages/types` (tipos compartilhados: `ContentStatus`,
  `PaginationParams`/`PaginatedResult`), `packages/config` (tsconfig/eslint
  compartilhados).
- Repositório git local inicializado (sem remoto configurado). Commits são
  feitos manualmente pelo usuário — eu apenas preparo o texto da mensagem ao
  final de cada passo, nunca executo `git commit`.
- `docker-compose.yml` com 5 serviços (`postgres`, `redis`, `api`, `website`,
  `admin`), Dockerfiles de desenvolvimento em `docker/{website,admin,api}/`,
  `.env.example` completo (banco, JWT, storage, SMTP, analytics, Maps,
  WhatsApp, integrações futuras) e `.dockerignore`.
- Prisma configurado em `apps/api`: schema com `User`, `Role`, `Permission`,
  `RolePermission`, `RefreshToken` (relacionamentos, índices, soft delete em
  `User.deletedAt`), migration inicial commitada em
  `apps/api/prisma/migrations/`, `PrismaService`/`PrismaModule` (global) e
  seed idempotente (`apps/api/prisma/seed.ts`) que cria as 5 roles do item 65,
  as 12 permissões de exemplo do item 66, dá acesso total ao `SUPER_ADMIN`
  (item 67) e cria o usuário inicial a partir de `ADMIN_INITIAL_EMAIL`/
  `ADMIN_INITIAL_PASSWORD` (senha com hash Argon2). O serviço `api` do
  `docker-compose.yml` roda `prisma migrate deploy && prisma db seed` antes
  de iniciar — ambiente novo já sobe com banco populado, sem passo manual.

## Histórico de implementações

**Passo 1 — Estrutura do monorepo e configs base.** Criada toda a árvore do
monorepo, configs de TypeScript/ESLint/Prettier compartilhadas, scaffolds
mínimos (porém reais e funcionais) dos 3 apps. Validado com `npm install` +
`typecheck` + `lint` + `build` rodando dentro de um container `node:20`
(ver "Erros e correções conhecidas") e smoke test manual da API compilada
(`GET /api/v1` respondendo `{"service":"dj-solar-api","status":"ok",...}`).

**Passo 2 — Docker Compose de desenvolvimento.** Criados os 3 Dockerfiles de
dev (`node:20-alpine`, cada um instala o monorepo inteiro via workspaces e
sobe seu respectivo app com watch/hot reload), `docker-compose.yml` com
`postgres:16-alpine` e `redis:7-alpine` (com healthcheck), volumes anônimos
para `node_modules` (garante que a imagem builda com dependências mesmo sem
`node_modules` no host) e `.env.example` cobrindo todas as categorias do
item 8 do `PROMPT.md`. Validado de ponta a ponta: `docker compose up -d
--build` subiu os 5 serviços, os 3 endpoints responderam (API `/api/v1`,
website e admin em HTTP 200), e o hot reload foi confirmado **ao vivo** nos
3 apps (edição de arquivo no host refletida sem rebuild/restart — ver
"Erros e correções conhecidas" sobre o ajuste necessário no watch da API).

**Passo 3 — Prisma + schema inicial + seed.** Schema com `User`/`Role`/
`Permission`/`RolePermission`/`RefreshToken`, migration inicial gerada via
`prisma migrate dev --name init` e commitada, `PrismaService`/`PrismaModule`
plugados no `AppModule`, seed idempotente do RBAC + `SUPER_ADMIN`, e o
`docker-compose.yml` passou a rodar `prisma migrate deploy && prisma db seed`
automaticamente antes de subir a API. Validado de ponta a ponta com
`docker compose down -v` (zera os volumes, simulando ambiente 100% novo)
seguido de `docker compose up -d --build`: o banco foi criado, a migration
aplicada e o seed rodou sozinho — `GET /api/v1/db-check` confirmou
`{"database":"connected","roles":5,"permissions":12,"users":1}` sem nenhum
passo manual.

## Erros e correções conhecidas

- **`npm install` corrompendo o `node_modules` quando rodado direto no Windows
  host.** Múltiplas tentativas de `npm install` na raiz do projeto (fora de
  container) falharam de forma intermitente e silenciosa — em alguns casos o
  processo retornava código de saída aparentemente ok (quando o log era
  filtrado por `tail`, o que mascarava o exit code real do npm), mas o
  `node_modules` ficava incompleto (pacotes com escopo como `@nestjs/core`,
  `@types/node`, `@types/react`, `@tanstack/react-query` simplesmente
  ausentes), causando falhas de `tsc`/`eslint` do tipo "cannot find module".
  Nos logs de erro reais apareciam `EPERM`/`ENOENT` durante `chmod`/`rmdir` de
  arquivos dentro de `node_modules` — sintoma clássico de antivírus/Windows
  Defender fazendo scan em tempo real e brevemente travando arquivos enquanto
  o npm tenta escrevê-los/linká-los.
  **Correção:** parar de instalar dependências diretamente no host Windows.
  A instalação (e a validação de `typecheck`/`lint`/`build`) passou a ser
  feita dentro de um container `node:20` com bind mount do projeto — o que
  além de resolver o problema, está alinhado com a exigência do projeto de
  rodar 100% em Docker. **Nunca mais rodar `npm install` direto no host deste
  projeto** — sempre via container (esse padrão será formalizado no Passo 2
  com o `docker-compose.yml` de desenvolvimento).
  - Nota lateral: ao usar `docker run` a partir do Git Bash no Windows, o
    Git Bash reescreve automaticamente argumentos que começam com `/` como
    caminhos do Windows (ex.: `-w /app` virava `-w C:/Program Files/Git/app`).
    É necessário prefixar o comando com `MSYS_NO_PATHCONV=1` para desabilitar
    essa conversão ao passar paths de container para o Docker.
- **`outDir` compartilhado em `packages/config/typescript/node-library.json`
  resolvendo no lugar errado.** O build da API (`nest build`) não gerava
  erro nenhum, mas também não gerava `apps/api/dist/` — o TypeScript resolve
  caminhos relativos de opções como `outDir` definidos num tsconfig **base**
  relativos à localização do próprio arquivo base quando herdado via
  `extends`, não relativos ao projeto que o estende. Resultado: o `outDir:
  "./dist"` do `node-library.json` compilava para
  `packages/config/typescript/dist`, não para `apps/api/dist`.
  **Correção:** removido `outDir` do tsconfig compartilhado; cada projeto que
  precisa definir `outDir` (por enquanto só `apps/api`) o declara no seu
  próprio `tsconfig.json`. Vale como regra geral para os próximos passos:
  nunca definir `outDir`/`rootDir` em tsconfigs compartilhados de
  `packages/config` — sempre no tsconfig do projeto consumidor.
- **Watch da API (`nest start --watch`) não detectava mudanças de arquivo no
  bind mount do Docker Desktop no Windows.** O `watchOptions` inicial
  (`useFsEventsWithFallbackDynamicPolling`) depende de primeiro tentar
  eventos nativos do filesystem e só cair para polling depois — nesse tipo de
  bind mount (Windows → Docker Desktop → Linux container) os eventos nativos
  nunca chegam, e o fallback demorou demais/não disparou de forma confiável.
  **Correção:** trocado para `dynamicPriorityPolling` em `watchFile` e
  `watchDirectory` no `apps/api/tsconfig.json`, forçando polling direto sem
  depender de detecção de eventos nativos. Confirmado funcionando com teste
  real (edição de arquivo refletida em ~3s sem reiniciar o container). Vale
  como padrão para qualquer processo Node com watch mode rodando em
  container com bind mount neste projeto (Vite já usa `usePolling: true`
  equivalente desde o Passo 1).
- **`prisma generate` (postinstall do `apps/api`) quebrando o build das
  imagens `website` e `admin`.** Por ser monorepo com npm workspaces, `npm
  install` na raiz dispara o postinstall de **todos** os workspaces — incluindo
  o `prisma generate` do `apps/api` — mesmo em Dockerfiles que não usam
  Prisma. Como esses Dockerfiles não copiavam `apps/api/prisma/` nem
  instalavam `openssl`, o build de `website`/`admin` falhava com "Could not
  find Prisma Schema" logo depois de um aviso sobre libssl não encontrado.
  **Correção:** os 3 Dockerfiles (`docker/website`, `docker/admin`,
  `docker/api`) agora instalam `openssl` e copiam `apps/api/prisma/` antes do
  `RUN npm install`. Vale como regra geral: qualquer novo pacote com
  postinstall pesado/com dependência de arquivo específico dentro de um
  workspace precisa ter esse arquivo copiado em **todos** os Dockerfiles do
  monorepo, não só no do serviço que o usa.

## Pendências / próximos passos

Seguir `PASSOS.md` em ordem, um passo por vez, com autorização explícita do usuário
entre cada passo. Próximo: **Passo 4 — Auth API** (login/refresh/logout/
recuperação de senha, rate limit, Argon2 — aguardando autorização).

## Limitações conhecidas / decisões deliberadas de escopo

- **Notificações Slack/Telegram/WhatsApp**: apenas arquitetura preparada
  (`NotificationChannel` com providers plugáveis); somente Email (SMTP) e in-app
  serão implementados de fato. Isso segue o próprio item 105 do `PROMPT.md`, que
  pede explicitamente só a preparação da arquitetura para essas integrações.
- **Form Builder**: versão focada (schema de campos + submissions), não um
  construtor visual genérico completo — conforme o próprio item 103 permite
  quando a complexidade total seria desproporcional.
- Demais decisões de arquitetura (stack, ORM, storage, etc.) estão documentadas no
  plano aprovado em `PASSOS.md` e serão referenciadas por passo conforme
  implementadas.
