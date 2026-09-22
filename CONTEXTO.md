# CONTEXTO.md — DJ Solar

Resumo vivo do estado do projeto. Atualizado ao final de cada implementação relevante.

## Estado atual

Fundação do monorepo + Docker Compose + banco de dados com schema/seed + Auth API +
CRUD de usuários/papéis/permissões com auditoria concluídos (Passos 1 a 5 de
`PASSOS.md`). Projeto sobe inteiro do zero com `docker compose up -d --build`, a
API autentica e autoriza de ponta a ponta, e o painel admin já tem tela de login
funcional e telas reais de Usuários/Papéis/Auditoria:

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
- Auth completo em `apps/api/src/auth/`: login, refresh (com rotação),
  logout, recuperação de senha (forgot/reset), troca de senha autenticada e
  `GET /auth/me`. Guard JWT global (`APP_GUARD`) protege todas as rotas por
  padrão — usar `@Public()` para isentar. Rate limit via `@nestjs/throttler`
  (global + limites mais restritos em login/forgot-password). Helmet, CORS
  restrito às origens do `.env` e `ValidationPipe` global habilitados em
  `main.ts`. `PasswordResetToken` adicionado ao schema Prisma.
- CRUD de usuários (`apps/api/src/users/`) e papéis (`apps/api/src/roles/`)
  com atribuição de permissões, `PermissionsGuard`/`@RequirePermissions()`
  (autorização granular via `APP_GUARD`), `AuditLogInterceptor` global
  (`APP_INTERCEPTOR`) registrando quem alterou o quê/quando/de onde com diff
  campo a campo, e `GET /audit-logs`. Painel admin (`apps/admin`) ganhou
  cliente HTTP com refresh automático (`axios` + interceptor de retry em
  401), store de autenticação (`zustand`), rotas protegidas, e telas reais
  de Login, Dashboard (autenticado), Usuários, Papéis (com editor de
  permissões) e Auditoria.

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

**Passo 4 — Auth API.** Login (Argon2 + JWT access de curta duração),
refresh token com rotação (armazenado como hash SHA-256, nunca em texto
puro), logout, recuperação de senha (token de uso único, expira em 1h,
logado via `Logger` em dev — envio real por SMTP fica para o Passo 19/104),
troca de senha autenticada (revoga todas as sessões existentes), `GET
/auth/me`. Guard `JwtAuthGuard` global via `APP_GUARD` + decorator
`@Public()` para as rotas de entrada (login/refresh/logout/forgot/reset).
Rate limit via `@nestjs/throttler` (100 req/min global; 5/min em login e
reset; 3/min em forgot-password). Helmet, CORS restrito a
`VITE_SITE_URL`/`VITE_ADMIN_URL` com `credentials: true`, e `ValidationPipe`
global (whitelist + transform) habilitados em `main.ts`. Cookie de refresh
token: `httpOnly`, `sameSite: strict`, `path: /api/v1/auth` — decisão
consciente de **não** implementar um esquema de CSRF token separado (ver
"Limitações conhecidas") dado o baixo impacto prático de um CSRF nessas
duas rotas específicas.

Testado de ponta a ponta via `curl` num ambiente 100% novo
(`docker compose down -v` + `up -d --build`): login retorna accessToken +
seta cookie; `/auth/me` autenticado funciona e sem token dá 401; refresh
rotaciona o cookie (token antigo passa a ser rejeitado); logout revoga o
token corrente; rate limit do login bloqueia a 6ª tentativa em 60s com 429;
forgot-password sempre responde genérico e loga o link; reset-password
rejeita senha fraca, aceita senha válida, rejeita reuso do token, e a nova
senha passa a funcionar no login (senha antiga para de funcionar); e
change-password troca a senha de fato (senha anterior para de logar, a nova
funciona).

**Passo 5 — Usuários, papéis, permissões e auditoria.** Backend:
`PermissionsGuard` (autorização granular, lê `RolePermission` por
`roleId`), `AuditLogInterceptor` global (age só em rotas com
`@AuditEntity(...)`, faz diff campo a campo antes/depois via snapshot
genérico do model Prisma, nunca loga `passwordHash`), CRUD completo de
`User` (soft delete, impede autoexclusão) e `Role` (impede excluir/alterar
permissões do `SUPER_ADMIN`, impede excluir role com usuários vinculados),
`PUT /roles/:id/permissions` com auditoria explícita (o diff genérico não
enxerga a relação Role→Permission, então o service grava o registro
manualmente com o before/after real das chaves de permissão — exatamente
no formato do exemplo do item 68 do `PROMPT.md`). Frontend: `apiClient`
(axios) com interceptor de refresh automático em 401, `useAuthStore`
(zustand) com `bootstrap()` restaurando sessão via cookie no load da
página, `ProtectedRoute`, `AdminLayout`+`Sidebar` (cresce só com módulos
reais, nada de item de menu fantasma), telas de Login, Dashboard, Usuários
(tabela + modal de criar/editar + exclusão com confirmação), Papéis
(cards + modal de permissões com checkboxes + criação) e Auditoria
(tabela com filtro por entidade).

Testado de ponta a ponta via `curl` em ambiente 100% novo: login,
`GET/POST /users` (usuário EDITOR criado), `GET /roles` (5 roles seedadas,
`SUPER_ADMIN` com as 12 permissões), `PUT /roles/:id/permissions`
(atribuição real), `POST /roles` (nova role SUPORTE), `GET /audit-logs`
(3 registros corretos, incluindo diff de permissões), bloqueios de
autorização (`EDITOR` sem `users.manage` → 403; sem token → 401) e
proteções do `SUPER_ADMIN` (`DELETE`/`PUT permissions` → 403). Admin:
`typecheck`+`lint`+`build` passando limpos, bundle de produção gerado
(642 kB — acima do aviso padrão de 500 kB do Vite; otimização de
performance/code-splitting fica para o Passo 76/77, não é bug).

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
- **`POST /auth/logout` retornando 401 mesmo com o cookie de refresh
  correto.** A rota não tinha `@Public()`, então caía sob o guard JWT global
  e exigia um access token válido no header `Authorization` — que o teste
  (corretamente) não estava enviando, já que logout deveria funcionar só com
  o cookie de refresh, inclusive com o access token expirado.
  **Correção:** `logout` marcado como `@Public()` — a prova de autorização
  da ação é a posse do cookie httpOnly do refresh token, não do access
  token. Vale como padrão para futuras rotas: nem toda rota que manipula
  dados sensíveis do usuário precisa do guard de access token, se ela já
  valida posse de outro credential (cookie, token de reset, etc.).
- **Campo `changes` do `AuditLog` (Json opcional) rejeitando `null`
  explícito.** O Prisma Client tipa campos `Json?` como aceitando
  `NullableJsonNullValueInput | InputJsonValue | undefined` — passar `null`
  diretamente (em vez de omitir a chave) não compila. Em seguida, o diff
  genérico (`Record<string, {before,after}>`) também não é estruturalmente
  `InputJsonValue` por conter valores `unknown`. **Correção:** usar
  `changes ?? undefined` (omite a chave quando não há diff) e fazer cast
  explícito para `Prisma.InputJsonValue | undefined` no ponto de escrita.
  Padrão a repetir sempre que gravar JSON dinâmico em campos `Json?` do
  Prisma.
- **`react-hook-form` não permite `register()` genérico em formulários com
  dois schemas Zod diferentes (criar vs. editar usuário).** Quando `form`
  é `UseFormReturn<CreateForm> | UseFormReturn<UpdateForm>`, chamar
  `form.register('name')` (campo comum aos dois schemas) não compila —
  TypeScript não unifica as sobrecargas de `register` entre os dois tipos
  genéricos. **Correção:** cast pontual do `register` para uma assinatura
  mais simples (`(name: string) => ReturnType<typeof createForm.register>`)
  nos 2 campos afetados (`name`, `roleId`) em `UserFormModal.tsx`. Os
  campos exclusivos de cada modo (email/senha no create, isActive no
  update) continuam usando a instância de formulário concreta
  (`createForm`/`updateForm`) diretamente, sem cast.
- **ESLint (`jsx-a11y/label-has-associated-control`) barrando o build do
  admin.** Todos os `<label>` dos formulários (Login, criar usuário, criar
  papel) estavam sem `htmlFor`/`id` associando ao campo — falha real de
  acessibilidade (item 79 do `PROMPT.md`), não só lint chato. **Correção:**
  adicionado `id` em cada input/select e `htmlFor` correspondente em cada
  label, em `LoginPage`, `UserFormModal` e `RoleFormModal`.
- **`docker compose exec` num container de dev já rodando (`nest start
  --watch`) quebrou o servidor ao vivo.** Para validar `typecheck`/`lint`/
  `build` da API isoladamente, rodei `docker compose exec api sh -c "...;
  rm -rf dist; npx nest build"` — o `rm -rf dist` apagou o diretório que o
  processo `nest start --watch` (rodando como PID 1 do mesmo container)
  estava usando em paralelo, quebrando o dev server (`Cannot find module
  '/app/apps/api/dist/main'` em loop a cada novo file-change). Precisou de
  `docker compose restart api` pra recuperar.
  **Correção/regra permanente:** nunca rodar `docker compose exec <serviço
  de dev> sh -c "rm -rf dist && ..."` ou qualquer comando que mexa em
  `dist`/artefatos de build num container que já tem um processo de
  watch/dev rodando como processo principal. Para validação isolada de
  build, usar `docker compose run --rm --no-deps <serviço> sh -c "..."`
  (container novo e descartável) — foi exatamente esse padrão que já vinha
  sendo usado para gerar migrations do Prisma desde o Passo 3, só não
  tinha sido generalizado para outros comandos até este passo.
- **Falhas intermitentes de conexão (`curl` retornando `HTTP_000`) em
  requisições `POST` durante os testes**, mesmo com a operação
  completando corretamente no servidor (confirmado relistando o recurso
  logo em seguida). Padrão consistente com instabilidade pontual do proxy
  de rede do Docker Desktop no Windows sob carga (muitas requisições/execs
  em sequência), não um bug de aplicação — depois de cada ocorrência, uma
  nova requisição de leitura confirmou que o dado tinha sido persistido
  corretamente. Não requereu correção de código; só reforça o hábito de
  sempre confirmar com uma leitura quando uma escrita reportar erro de
  conexão neste ambiente de desenvolvimento.

## Pendências / próximos passos

Seguir `PASSOS.md` em ordem, um passo por vez, com autorização explícita do usuário
entre cada passo. Próximo: **Passo 6 — Módulo Settings (API)** (configurações
globais: empresa, redes sociais, cores/tipografia/layout, analytics, SMTP,
manutenção, parâmetros do simulador — com cache Redis; aguardando autorização).

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
- **CSRF token dedicado (double-submit cookie) não implementado.** Decisão
  consciente no Passo 4: o cookie de refresh token usa `sameSite: strict`
  (mitigação forte para o cenário real de ameaça), e as ações realmente
  sensíveis (change-password, futuras rotas protegidas) exigem o access
  token via header `Authorization` — imune a CSRF por natureza, já que um
  site malicioso não consegue ler/anexar esse token de outra origem. Revisar
  se algum formulário público futuro passar a depender de cookie de sessão
  para ações que causem dano real.
- **Renomear um papel (`Role.name`) não é permitido pela API** — só
  `description` é editável via `PATCH /roles/:id`. Decisão deliberada: o
  nome do papel é usado como identidade em comparações no código (ex.:
  `role.name === 'SUPER_ADMIN'`) e potencialmente no JWT; permitir rename
  livre abriria brecha para quebrar essas comparações. Criar um novo papel
  com o nome certo é o caminho, não renomear um existente.
- **Bundle de produção do admin (642 kB) acima do limite de aviso do
  Vite (500 kB).** Não é bug — otimização de bundle (code-splitting,
  lazy loading de rotas) é escopo do Passo 76/77 (Performance), não deste
  passo. Registrar aqui só para não ser confundido com regressão nos
  próximos passos, quando o bundle só vai crescer (Blog com TipTap, mídia,
  etc.).
