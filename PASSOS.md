# PASSOS — DJ Solar (Site Institucional Premium + CMS Administrativo)

Checklist de execução do projeto completo especificado em `PROMPT.md` (113 itens),
organizado em 30 passos, em ordem de prioridade. Cada passo só é marcado `[x]` quando
está funcional de ponta a ponta (persistência real em banco, refletindo no site
público quando aplicável) e coberto pelos testes gerais da etapa.

**Fluxo por passo:** implementar → testar (build/lint/typecheck/testes automatizados
+ `docker compose up -d --build` quando aplicável) → marcar `[x]` → resumo para o
usuário → mensagem de commit → **aguardar autorização** para o próximo passo.

Entre colchetes ao final de cada passo, os itens do `PROMPT.md` cobertos.

---

## Fundação

- [x] **Passo 1 — Estrutura do monorepo e configs base**
  `apps/website`, `apps/admin`, `apps/api`, `packages/types`, `packages/config`,
  npm workspaces, TypeScript/ESLint/Prettier base, `README.md` inicial.
  `[93]`

- [x] **Passo 2 — Docker Compose de desenvolvimento**
  Dockerfiles dev (hot reload) para `api`/`website`/`admin`, serviços `postgres` e
  `redis`, `docker-compose.yml`, `.env.example` completo (banco, JWT, storage, SMTP,
  GA/GTM, Maps, WhatsApp, integrações, URLs, ambiente).
  `[6][7][8]`

- [x] **Passo 3 — Prisma + schema inicial + seed**
  `User`, `Role`, `Permission`, `RolePermission`, `RefreshToken`. Migrations + seed
  do `SUPER_ADMIN` via `ADMIN_INITIAL_EMAIL`/`ADMIN_INITIAL_PASSWORD`.
  `[5][65][66][67][89][90]`

## Autenticação & RBAC

- [x] **Passo 4 — Auth API**
  Login, refresh token (rotação), logout, recuperação de senha, alteração de senha,
  proteção de rotas, rate limit em login/recuperação, Argon2.
  `[64][70][71]`

- [ ] **Passo 5 — Usuários, papéis, permissões e auditoria**
  CRUD de usuários e papéis no admin, atribuição de permissões granulares,
  `AuditLog` (interceptor global registrando usuário/ação/entidade/ID/IP/data/
  valores alterados).
  `[65][66][67][68]`

## Configurações & Aparência

- [ ] **Passo 6 — Módulo Settings (API)**
  Entidade de configurações globais (empresa, contatos, endereço, redes sociais,
  cores/tipografia/layout, analytics, SMTP, modo manutenção, parâmetros do
  simulador), cache Redis com invalidação ao salvar.
  `[8][39][40][74][95][99]`

- [ ] **Passo 7 — Admin: Aparência, Empresa, SEO global**
  Telas de logo (variantes/favicon), color picker com CSS variables, tipografia,
  layout (radius/espaçamento/largura/cards/sombras/botões), dados da empresa/
  contatos/redes sociais, SEO global, com preview ao vivo antes de salvar.
  `[11][12][13][14][15][34][38][39]`

- [ ] **Passo 8 — Tema dinâmico no site público**
  `ThemeProvider` carregando CSS variables da API, header/footer básicos e
  identidade visual (logo/cores/fontes) consumidos dinamicamente — nada
  hardcoded.
  `[94][96(parcial)]`

## Mídia

- [ ] **Passo 9 — Biblioteca de mídia**
  Upload real (multer), processamento via `sharp` (thumbnail, WebP, AVIF),
  `StorageProvider` (Local + S3/R2 via `@aws-sdk/client-s3`), grid com busca/
  filtros/renomear/excluir, alt/título/descrição/legenda, seletor reutilizável.
  `[21][22][23][72][73][77]`

## Páginas, Seções, Menu, Footer

- [ ] **Passo 10 — Páginas e Seções (API)**
  `Page`+`PageSection` com draft/published/scheduled/archived, SEO por página,
  `ContentVersion` genérica com restore.
  `[16][17][18][19][33]`

- [ ] **Passo 11 — Admin: editor de páginas/seções**
  Listagem de páginas (status/URL/última modificação/responsável), editor com
  ativar/desativar/ordenar seções via drag-and-drop, publicar/duplicar/desativar,
  fluxo editar → visualizar → publicar.
  `[15][18][19]`

- [ ] **Passo 12 — Menu e Footer administráveis**
  `Menu`/`MenuItem` (submenu, mega-menu, link interno/externo) e Footer
  (logo/descrição/colunas/links/endereço/telefone/WhatsApp/redes sociais/
  copyright com crédito Leccorside), consumidos pelo header/footer público.
  `[36][37]`

## Conteúdo institucional

- [ ] **Passo 13 — Soluções**
  CRUD completo (título/slug/descrição/resumo/conteúdo/imagem/banner/ícone/SEO/
  CTA) + `/solucoes`, `/solucoes/residencial`, `/solucoes/empresarial`,
  `/solucoes/rural`, `/solucoes/usinas-solares`.
  `[26][51][52][53][54][55]`

- [ ] **Passo 14 — Projetos**
  CRUD completo (nome/cliente/categoria/cidade/estado/potência/painéis/geração/
  economia/descrição/vídeo/destaque/status) + galeria (upload múltiplo, drag-and-
  drop, ordenação, imagem principal) + `/projetos` e `/projetos/:slug`.
  `[27][28][56]`

- [ ] **Passo 15 — Depoimentos e FAQ**
  CRUD de depoimentos (nome/foto/cidade/texto/estrelas/projeto/economia/status) e
  FAQ (pergunta/resposta/categoria/ordem/status) + seções públicas.
  `[29][30]`

- [ ] **Passo 16 — Blog completo**
  Categorias/tags/autores/artigos, editor TipTap (títulos/parágrafos/bold/
  italic/listas/links/imagens/vídeos/tabelas/citações), SEO por artigo,
  `/blog` e `/blog/:slug`.
  `[31][32][60]`

## Simulador Solar

- [ ] **Passo 17 — Simulador administrável**
  Parâmetros configuráveis (tarifa/custo médio/eficiência/inflação energética/
  degradação/vida útil), cálculo (potência/painéis/produção/economia mensal/
  anual/25 anos/payback), componente público + seção "Simulador" no editor.
  `[45][46]`

## Leads / CRM

- [ ] **Passo 18 — Form Builder e formulários dinâmicos**
  `FormDefinition` (campos/obrigatoriedade/mensagem de sucesso/destinatários/CTA)
  + `FormSubmission`, `<DynamicForm>` no site público gerando `Lead`.
  `[41][103]`

- [ ] **Passo 19 — CRM de leads e dashboard**
  Funil de status (Novo → Convertido/Perdido), notas internas, filtros (status/
  data/cidade/estado/origem/responsável), paginação/busca/ordenação, notificação
  in-app de novo lead + e-mail via SMTP configurável, dashboard com gráficos
  (leads/orçamentos/simulações/contatos/usuários/projetos/artigos/visualizações/
  conversões).
  `[24][42][43][44][75][82][84][85][104][105(email)]`

## SEO técnico e páginas finais

- [ ] **Passo 20 — Home 100% orientada por seções**
  Hero, Benefícios, Soluções, Simulador, Como funciona, Projetos, Estatísticas,
  Depoimentos, Financiamento, FAQ, CTA — todas administráveis via editor de
  seções.
  `[20][50][101]`

- [ ] **Passo 21 — Páginas institucionais, legais e SEO local**
  `/empresa`, `/como-funciona`, `/financiamento`, `/contato`, páginas legais
  (`/politica-de-privacidade`, `/termos-de-uso`, `/cookies`) via `Page` genérica,
  páginas de SEO local criáveis pelo admin (`/energia-solar/:regiao`), 404
  personalizada e administrável.
  `[57][58][59][61][62][63][106][108]`

- [ ] **Passo 22 — Redirecionamentos e SEO técnico**
  CRUD de redirects 301/302 com resolução real (Nginx→API em produção,
  resolver client-side em dev), `sitemap.xml` e `robots.txt` dinâmicos.
  `[35]`

- [ ] **Passo 23 — LGPD e modo de manutenção**
  Banner de cookies (categorias necessários/analytics/marketing, consentimento
  persistido) e modo de manutenção (toggle/título/mensagem/previsão/imagem).
  `[107][109]`

## UI Premium

- [ ] **Passo 24 — Design system visual e animações**
  Componentes reutilizáveis, Framer Motion + GSAP ScrollTrigger (reveal, text
  reveal, stagger, parallax, counters, hover, microinterações), configuração por
  seção (ativa/tipo/duração/delay) respeitando `prefers-reduced-motion`.
  `[47][48][49][96][97][102]`

## Qualidade final

- [ ] **Passo 25 — Segurança (revisão OWASP)**
  Helmet, CORS, rate limit (login/recuperação/formulários/API pública),
  sanitização, proteção XSS/SQLi, CSRF (cookies de refresh), cookies seguros.
  `[70][71][72]`

- [ ] **Passo 26 — Documentação, health check e logs**
  Swagger em `/api/docs`, `GET /api/health` (API+banco+Redis), logs estruturados
  (Pino) para erros/requisições/eventos relevantes.
  `[86][87][88]`

- [ ] **Passo 27 — Testes automatizados**
  Backend: unit + integration (auth, CRUD, publicação, leads). Frontend:
  componentes, hooks, lógica de simulador/formulários.
  `[92]`

- [ ] **Passo 28 — Acessibilidade, responsividade e performance**
  ARIA, teclado, contraste, foco, alt, HTML semântico, breakpoints (320 a 2560),
  lazy loading, imagens responsivas (srcset/WebP/AVIF), cache de configurações/
  páginas/menus, meta de Lighthouse > 90 quando realista.
  `[76][77][78][79][80][81]`

- [ ] **Passo 29 — Auditoria final com skills especializadas**
  Nova rodada de revisão (UX, UI, Frontend, Backend, Banco, Docker, SEO,
  Performance, Security) e correção dos achados antes de considerar concluído.
  `[1][110]`

- [ ] **Passo 30 — Produção, README final e CONTEXTO.md**
  `docker-compose` de produção (build multiestágio + Nginx servindo assets e
  atuando como proxy/redirect resolver), `README.md` final, `CONTEXTO.md`
  consolidado, estratégia de backup do PostgreSQL documentada.
  `[91][93][113]`

---

**Critério de aceitação final (item 112):** um administrador sem conhecimento de
programação deve conseguir, apenas pelo painel, trocar logo/nome/cores/fontes/
imagens/textos/banners/menus/projetos/serviços/depoimentos/contato/WhatsApp/SEO/
footer — e ver tudo refletido corretamente no site público.
