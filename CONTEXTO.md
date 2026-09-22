# CONTEXTO.md — DJ Solar

Resumo vivo do estado do projeto. Atualizado ao final de cada implementação relevante.

## Estado atual

Fundação do monorepo concluída (Passo 1 de `PASSOS.md`):

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
- Repositório git local inicializado (sem remoto configurado).

## Histórico de implementações

**Passo 1 — Estrutura do monorepo e configs base.** Criada toda a árvore do
monorepo, configs de TypeScript/ESLint/Prettier compartilhadas, scaffolds
mínimos (porém reais e funcionais) dos 3 apps. Validado com `npm install` +
`typecheck` + `lint` + `build` rodando dentro de um container `node:20`
(ver "Erros e correções conhecidas") e smoke test manual da API compilada
(`GET /api/v1` respondendo `{"service":"dj-solar-api","status":"ok",...}`).

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

## Pendências / próximos passos

Seguir `PASSOS.md` em ordem, um passo por vez, com autorização explícita do usuário
entre cada passo. Próximo: **Passo 2 — Docker Compose de desenvolvimento**
(aguardando autorização).

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
