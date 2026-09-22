# PROMPT MASTER — SITE PREMIUM DE ENERGIA SOLAR + CMS ADMINISTRATIVO COMPLETO

Crie uma **plataforma web institucional completa, premium, multipáginas e totalmente administrável para uma empresa de energia solar**, utilizando obrigatoriamente:

* **Frontend público: React**
* **Painel Administrativo: React**
* **Backend/API: Node.js + TypeScript**
* **Banco de dados relacional**
* **Docker**
* **Docker Compose**
* Execução **100% local e containerizada**
* Arquitetura profissional, escalável e preparada para produção

O projeto não deve ser apenas um site institucional estático.

Ele deve funcionar como uma **plataforma CMS completa**, permitindo que um usuário administrador consiga **inserir, editar, excluir, ordenar, ativar, desativar e configurar praticamente 100% das informações apresentadas no frontend sem precisar alterar código**.

---

# 1. REGRA PRINCIPAL — USO OBRIGATÓRIO DE SKILLS ESPECIALIZADAS

ANTES de escrever código:

1. Analise todas as skills disponíveis no ambiente.
2. Leia as instruções das skills relevantes.
3. Utilize especialistas diferentes para cada área.
4. Não dependa apenas de conhecimento genérico caso exista uma skill especializada.
5. Após a implementação, utilize novamente as skills para realizar auditoria e melhoria.

Utilize, quando disponíveis, skills especializadas em:

* UI Design
* UX Design
* Web Design
* Design Systems
* React
* TypeScript
* Node.js
* Backend
* APIs REST
* banco de dados
* arquitetura de software
* segurança
* Docker
* DevOps
* Motion Design
* GSAP
* Framer Motion
* Three.js
* WebGL
* SEO
* SEO Local
* acessibilidade
* performance
* Core Web Vitals
* copywriting
* CRO
* analytics
* gerenciamento de imagens
* CMS
* dashboards
* autenticação
* RBAC
* testes
* segurança OWASP

O resultado deve parecer produzido por uma equipe formada por:

**Diretor de Arte + UI Designer + UX Designer + Motion Designer + Desenvolvedor React Sênior + Desenvolvedor Node.js Sênior + Arquiteto de Software + DBA + DevOps + Especialista em SEO + Especialista em CRO + Copywriter.**

---

# 2. STACK OBRIGATÓRIA

## Frontend institucional

Utilizar:

* React
* TypeScript
* Vite ou arquitetura React equivalente
* React Router
* componentes reutilizáveis
* Design System
* gerenciamento profissional de estado
* consumo da API REST
* React Query/TanStack Query quando apropriado

Pode utilizar:

* Tailwind CSS
* CSS Modules
* Styled Components

Escolher a abordagem que proporcionar melhor organização.

---

# 3. PAINEL ADMINISTRATIVO

O painel administrativo também deve ser desenvolvido em:

* React
* TypeScript

Pode existir como aplicação separada:

```text
apps/
  website/
  admin/
  api/
```

Ou estrutura equivalente.

O painel deve ser profissional e funcionar como um verdadeiro **CMS proprietário**.

---

# 4. BACKEND

Utilizar:

* Node.js
* TypeScript

Preferencialmente:

* NestJS

ou arquitetura Express/Fastify extremamente bem organizada.

Implementar:

* REST API
* arquitetura modular
* services
* controllers
* repositories
* DTOs
* validações
* middleware
* autenticação
* autorização
* logs
* tratamento global de erros
* documentação da API

Preferencialmente disponibilizar:

```text
/api/v1/
```

---

# 5. BANCO DE DADOS

Utilizar banco relacional robusto.

Preferencialmente:

**PostgreSQL**

Utilizar ORM profissional:

* Prisma

ou equivalente.

Implementar:

* migrations
* seeds
* relacionamentos
* índices
* constraints
* timestamps
* soft delete quando apropriado

---

# 6. DOCKER OBRIGATÓRIO

TODO o projeto deve funcionar através de Docker.

Não depender de instalações locais de:

* Node
* PostgreSQL
* Redis
* Nginx
* ferramentas auxiliares

Criar:

```text
docker-compose.yml
```

Com serviços como:

```text
website
admin
api
postgres
redis
nginx
```

quando aplicável.

O projeto deve subir através de um comando como:

```bash
docker compose up -d --build
```

---

# 7. HOT RELOAD EM DESENVOLVIMENTO

Mesmo dentro dos containers devem funcionar:

* React Hot Reload
* backend watch mode
* volumes
* desenvolvimento local

---

# 8. VARIÁVEIS DE AMBIENTE

Criar:

```text
.env.example
```

Nunca colocar credenciais diretamente no código.

Variáveis para:

* banco
* JWT
* storage
* SMTP
* Google Analytics
* Google Tag Manager
* Maps
* WhatsApp
* APIs externas
* URLs
* ambiente
* integrações

---

# 9. PRINCÍPIO FUNDAMENTAL DO CMS

Praticamente **nenhuma informação institucional importante deve ficar hardcoded no frontend**.

O site público deve buscar as informações através da API.

Tudo deve ser administrável.

O administrador deve conseguir alterar o site sem editar código.

---

# 10. O ADMINISTRADOR DEVE CONTROLAR 100% DO CONTEÚDO

Permitir administrar:

* textos
* títulos
* subtítulos
* descrições
* slogans
* botões
* CTAs
* links
* imagens
* vídeos
* ícones
* banners
* slides
* seções
* projetos
* serviços
* soluções
* depoimentos
* números
* estatísticas
* FAQs
* artigos
* categorias
* contatos
* redes sociais
* informações empresariais
* SEO
* identidade visual
* menus
* footer
* integrações
* configurações globais

---

# 11. IDENTIDADE VISUAL ADMINISTRÁVEL

Criar uma área:

```text
Aparência
```

O administrador deve poder modificar:

## Logotipo

* logo principal
* logo escura
* logo clara
* favicon
* ícone mobile
* logo do footer

---

# 12. CORES

Permitir configurar através de Color Picker:

* cor primária
* secundária
* accent
* fundo
* fundo escuro
* textos
* títulos
* links
* botões
* hover
* bordas

Utilizar CSS Variables.

Exemplo:

```css
--color-primary
--color-secondary
--color-accent
--color-background
```

Essas variáveis devem ser carregadas dinamicamente.

---

# 13. TIPOGRAFIA

Permitir configurar:

* fonte principal
* fonte de títulos
* tamanho base
* peso
* estilos de heading

---

# 14. CONFIGURAÇÕES DE LAYOUT

Permitir alterar quando aplicável:

* border radius
* espaçamentos
* largura máxima
* estilo de cards
* sombras
* estilo dos botões

---

# 15. PREVIEW

Criar possibilidade de visualizar alterações antes da publicação.

Idealmente:

```text
Editar
↓
Visualizar
↓
Publicar
```

---

# 16. DRAFT E PUBLICAÇÃO

Conteúdo deve possuir estados:

```text
DRAFT
PUBLISHED
SCHEDULED
ARCHIVED
```

Quando necessário.

---

# 17. VERSIONAMENTO

Implementar histórico de alterações para conteúdos relevantes.

Permitir visualizar:

* quem alterou
* quando alterou
* valor anterior
* valor novo

Preferencialmente permitir restauração de versão.

---

# 18. ADMINISTRADOR DE PÁGINAS

Criar:

```text
Conteúdo
  Páginas
```

Listagem:

* página
* URL
* status
* última modificação
* usuário responsável

Permitir:

* editar
* visualizar
* publicar
* duplicar
* desativar

---

# 19. EDITOR DE SEÇÕES

Cada página deverá possuir seções administráveis.

Exemplo:

```text
Home

Hero
Benefícios
Soluções
Simulador
Como funciona
Projetos
Estatísticas
Depoimentos
Financiamento
CTA
```

Cada seção poderá ser:

* editada
* ativada
* desativada
* ordenada

Preferencialmente implementar ordenação via:

**drag and drop.**

---

# 20. HERO ADMINISTRÁVEL

Permitir alterar:

* título
* subtítulo
* descrição
* imagem
* vídeo
* background
* badge
* botão principal
* botão secundário
* links
* indicadores

---

# 21. GERENCIADOR DE MÍDIA

Criar:

```text
Mídia
```

Biblioteca completa.

Permitir:

* upload
* exclusão
* renomeação
* busca
* filtros
* preview
* reutilização

Suportar:

* JPG
* PNG
* WEBP
* AVIF
* SVG
* vídeos

Quando seguro.

---

# 22. TRATAMENTO DE IMAGENS

Implementar:

* compressão
* thumbnails
* lazy loading
* redimensionamento
* geração WebP
* geração AVIF quando possível

---

# 23. ALT TEXT

Todas as imagens utilizadas no site devem permitir configurar:

```text
Alt Text
Título
Descrição
Legenda
```

Importante para SEO e acessibilidade.

---

# 24. DASHBOARD ADMINISTRATIVO

Criar dashboard premium mostrando:

* leads
* orçamentos
* simulações
* contatos
* usuários
* projetos
* artigos
* visualizações
* conversões

Adicionar gráficos quando existirem dados.

---

# 25. MENU DO ADMIN

Exemplo:

```text
Dashboard

Site
 ├─ Páginas
 ├─ Seções
 ├─ Menus
 └─ Footer

Conteúdo
 ├─ Soluções
 ├─ Projetos
 ├─ Depoimentos
 ├─ FAQ
 ├─ Blog
 └─ Categorias

Leads
 ├─ Leads
 ├─ Orçamentos
 ├─ Simulações
 └─ Contatos

Mídia

SEO

Marketing

Aparência
 ├─ Logo
 ├─ Cores
 ├─ Tipografia
 └─ Layout

Empresa
 ├─ Informações
 ├─ Contatos
 ├─ Endereço
 └─ Redes sociais

Integrações

Usuários

Permissões

Auditoria

Configurações
```

---

# 26. GERENCIAMENTO DE SOLUÇÕES

CRUD completo:

* adicionar
* editar
* excluir
* ativar
* desativar
* ordenar

Campos:

* título
* slug
* descrição
* resumo
* conteúdo
* imagem
* banner
* ícone
* SEO
* CTA

---

# 27. PROJETOS

CRUD completo para projetos solares.

Campos:

* nome
* cliente
* categoria
* cidade
* estado
* potência
* número de painéis
* geração
* economia
* descrição
* fotos
* vídeo
* destaque
* status

---

# 28. GALERIAS

Permitir múltiplas imagens.

Implementar:

* upload múltiplo
* drag and drop
* ordenação
* exclusão
* imagem principal

---

# 29. DEPOIMENTOS

CRUD para:

* nome
* foto
* cidade
* texto
* estrelas
* projeto
* economia
* status

---

# 30. FAQ

CRUD para perguntas.

Campos:

* pergunta
* resposta
* categoria
* ordem
* status

---

# 31. BLOG

Criar CMS completo para blog.

CRUD:

* artigos
* categorias
* autores
* tags

Editor Rich Text.

Campos:

* título
* slug
* resumo
* conteúdo
* imagem de capa
* autor
* categoria
* tags
* publicação
* SEO

---

# 32. EDITOR DE TEXTO

Utilizar editor moderno como:

* TipTap

ou equivalente.

Permitir:

* títulos
* parágrafos
* bold
* italic
* listas
* links
* imagens
* vídeos
* tabelas
* citações

---

# 33. SEO POR PÁGINA

Cada página deve possuir:

```text
Meta title
Meta description
Slug
Canonical
Robots
OG title
OG description
OG image
```

---

# 34. SEO GLOBAL

Área administrativa:

```text
SEO > Configurações
```

Permitir:

* título padrão
* descrição padrão
* imagem social
* nome da empresa
* schemas
* indexing
* robots
* sitemap

---

# 35. REDIRECIONAMENTOS

Criar gerenciamento:

```text
URL antiga → URL nova
```

Suportar principalmente:

* 301
* 302

---

# 36. MENU DO SITE

Menu totalmente administrável.

Permitir:

* adicionar item
* excluir
* editar
* ordenar
* submenu
* mega-menu
* link interno
* link externo

---

# 37. FOOTER

Footer totalmente administrável.

Permitir alterar:

* logo
* descrição
* colunas
* links
* endereço
* telefone
* WhatsApp
* redes sociais
* copyright

Adicionar:

Todos os direitos reservados. Design by <a href="https://leccorside.com.br" target="_blank" rel="noopener noreferrer" style="font-weight: bold; color: #ff9d04;">Leccorside</a>

---

# 38. REDES SOCIAIS

Administrar:

* Instagram
* Facebook
* LinkedIn
* YouTube
* TikTok
* WhatsApp
* outras

Permitir:

```text
nome
ícone
URL
ativo/inativo
ordem
```

---

# 39. CONTATOS DA EMPRESA

Administrar:

* telefone
* WhatsApp
* e-mail
* endereço
* cidade
* estado
* CEP
* horário
* coordenadas

---

# 40. WHATSAPP

Painel para configurar:

* número
* mensagem inicial
* exibição
* páginas
* posição
* horário

---

# 41. LEADS

Todo formulário deve gerar lead no banco.

Criar CRM básico.

Informações:

* nome
* telefone
* WhatsApp
* e-mail
* cidade
* estado
* consumo
* valor da conta
* origem
* campanha
* data

---

# 42. FUNIL DE LEADS

Status:

```text
Novo
Contato realizado
Qualificado
Proposta enviada
Negociação
Convertido
Perdido
```

Permitir alteração no painel.

---

# 43. NOTAS

Permitir inserir notas internas no lead.

---

# 44. FILTROS

Filtrar por:

* status
* data
* cidade
* estado
* origem
* responsável

---

# 45. SIMULADOR SOLAR

Criar simulador administrável.

Entradas:

* conta média
* consumo
* localização
* tipo de imóvel

Apresentar:

* potência recomendada
* quantidade aproximada de painéis
* produção
* economia mensal
* economia anual
* economia em 25 anos
* payback aproximado

---

# 46. PARÂMETROS DO SIMULADOR

Administrador deve poder configurar parâmetros como:

* tarifa
* custo médio
* eficiência
* inflação energética
* degradação
* vida útil

Evitar valores importantes hardcoded.

---

# 47. SITE PÚBLICO — IDENTIDADE PREMIUM

O site deve transmitir:

* tecnologia
* inovação
* confiança
* sustentabilidade
* segurança
* alto padrão
* engenharia
* eficiência

Evitar aparência de template.

---

# 48. CORES

Utilizar inicialmente combinação elegante entre:

* grafite
* preto
* branco
* verde sofisticado
* amarelo/dourado solar

Mas tudo posteriormente deverá ser modificável pelo painel.

---

# 49. ANIMAÇÕES PREMIUM

Utilizar quando fizer sentido:

* GSAP
* ScrollTrigger
* Framer Motion
* Three.js
* WebGL
* Lenis

Implementar:

* reveal
* text reveal
* stagger
* parallax
* counters
* cards
* backgrounds
* hover
* microinterações
* transições

Sem prejudicar performance.

---

# 50. HOME

Criar:

* Hero
* diferenciais
* soluções
* benefícios
* simulador
* como funciona
* projetos
* indicadores
* calculadora
* financiamento
* depoimentos
* FAQ
* CTA

---

# 51. SOLUÇÕES

Rota:

```text
/solucoes
```

---

# 52. RESIDENCIAL

```text
/solucoes/residencial
```

---

# 53. EMPRESARIAL

```text
/solucoes/empresarial
```

---

# 54. RURAL

```text
/solucoes/rural
```

---

# 55. USINAS SOLARES

```text
/solucoes/usinas-solares
```

---

# 56. PROJETOS

```text
/projetos
```

Com página individual:

```text
/projetos/:slug
```

---

# 57. EMPRESA

```text
/empresa
```

---

# 58. COMO FUNCIONA

```text
/como-funciona
```

---

# 59. FINANCIAMENTO

```text
/financiamento
```

---

# 60. BLOG

```text
/blog
/blog/:slug
```

---

# 61. FAQ

```text
/faq
```

---

# 62. CONTATO

```text
/contato
```

---

# 63. SEO LOCAL

Preparar estrutura para páginas:

```text
/energia-solar/goias
/energia-solar/caldas-novas
/energia-solar/goiania
```

O administrador deve conseguir criar novas páginas regionais.

---

# 64. AUTENTICAÇÃO ADMIN

Criar login seguro.

Implementar:

* JWT
* Refresh Token
* expiração
* logout
* recuperação de senha
* alteração de senha
* proteção de rotas

---

# 65. RBAC

Criar sistema de papéis.

Exemplo:

```text
SUPER_ADMIN
ADMIN
EDITOR
MARKETING
COMERCIAL
```

---

# 66. PERMISSÕES GRANULARES

Exemplos:

```text
pages.read
pages.create
pages.update
pages.delete

projects.read
projects.create
projects.update
projects.delete

leads.read
leads.update

settings.update

users.manage
```

---

# 67. SUPER ADMIN

SUPER_ADMIN deve possuir acesso total.

---

# 68. AUDITORIA

Registrar ações administrativas.

Salvar:

* usuário
* ação
* entidade
* ID
* IP
* data
* valores alterados

Exemplo:

```text
João alterou "Cor primária"
#00AA55 → #F5B400
```

---

# 69. SOFT DELETE

Conteúdos importantes não devem ser permanentemente eliminados imediatamente.

Implementar soft delete quando adequado.

---

# 70. SEGURANÇA

Seguir OWASP.

Implementar:

* Helmet
* CORS
* Rate Limit
* validação
* sanitização
* proteção XSS
* proteção SQL Injection
* CSRF quando necessário
* segurança de cookies
* hashing de senha
* logs

Utilizar:

```text
Argon2
```

ou bcrypt seguro.

---

# 71. RATE LIMIT

Aplicar principalmente:

* login
* recuperação de senha
* formulários
* API pública

---

# 72. UPLOAD SEGURO

Validar:

* extensão
* MIME
* tamanho
* conteúdo

Não confiar apenas no nome do arquivo.

---

# 73. STORAGE

Criar abstração para permitir:

Inicialmente:

```text
Local Storage
```

Posteriormente:

```text
Amazon S3
Cloudflare R2
MinIO
```

Sem alterar a regra de negócio.

---

# 74. ANALYTICS

Preparar configuração administrativa para:

* Google Analytics
* Google Tag Manager
* Meta Pixel
* Google Ads

---

# 75. EVENTOS

Rastrear:

* WhatsApp
* telefone
* formulário
* orçamento
* simulador
* projetos
* CTAs

---

# 76. PERFORMANCE

Objetivo:

```text
Lighthouse > 90
```

Sempre que realisticamente possível.

Otimizar:

* LCP
* CLS
* INP

---

# 77. IMAGENS

Implementar:

* lazy loading
* responsive images
* WebP
* AVIF
* srcset

---

# 78. CACHE

Implementar estratégia adequada para:

* configurações globais
* páginas
* menus
* conteúdo público

Redis poderá ser utilizado.

---

# 79. ACESSIBILIDADE

Seguir WCAG.

Implementar:

* aria
* teclado
* contraste
* focus
* alt
* HTML semântico
* reduced motion

---

# 80. RESPONSIVIDADE

Garantir funcionamento em:

```text
320
375
425
768
1024
1280
1440
1920
2560
```

---

# 81. MOBILE ADMIN

O painel administrativo também deve funcionar adequadamente em:

* desktop
* tablet
* smartphone

---

# 82. TOASTS

Criar feedback visual:

```text
Salvo com sucesso
Erro ao salvar
Registro excluído
Publicado
```

---

# 83. MODAIS DE CONFIRMAÇÃO

Ações destrutivas devem exigir confirmação.

---

# 84. BUSCA GLOBAL ADMIN

Criar busca para localizar:

* páginas
* projetos
* artigos
* leads
* configurações

---

# 85. PAGINAÇÃO

Listagens grandes devem possuir:

* paginação
* busca
* ordenação
* filtros

---

# 86. DOCUMENTAÇÃO API

Disponibilizar Swagger/OpenAPI.

Exemplo:

```text
/api/docs
```

---

# 87. HEALTH CHECK

Criar:

```text
GET /api/health
```

Verificando:

* API
* banco
* Redis quando existente

---

# 88. LOGS

Implementar logs estruturados.

Preferencialmente:

* Pino
* Winston

Registrar:

* erros
* requisições
* eventos relevantes

---

# 89. BANCO

Criar migrations e seed inicial.

Seed deverá criar:

* SUPER_ADMIN
* configurações iniciais
* páginas iniciais
* menu
* conteúdo demonstrativo

---

# 90. CREDENCIAIS INICIAIS

Nunca deixar senha fixa insegura em produção.

Utilizar variáveis como:

```text
ADMIN_INITIAL_EMAIL
ADMIN_INITIAL_PASSWORD
```

---

# 91. BACKUP

Documentar estratégia para backup do PostgreSQL.

---

# 92. TESTES

Implementar testes onde relevante.

Backend:

* unit
* integration

Frontend:

* components
* hooks
* lógica

Fluxos críticos:

* autenticação
* CRUD
* publicação
* leads
* formulários

---

# 93. ESTRUTURA SUGERIDA

```text
project/
│
├── apps/
│   ├── website/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/
│   └── config/
│
├── docker/
│
├── docker-compose.yml
├── .env.example
├── README.md
└── docs/
```

Pode melhorar essa arquitetura se uma skill especializada recomendar alternativa melhor.

---

# 94. NÃO HARDCODE

Evitar hardcode para:

* textos
* imagens
* telefone
* WhatsApp
* e-mail
* endereço
* links
* redes sociais
* logo
* cores
* banners
* estatísticas
* projetos
* depoimentos
* FAQ
* serviços
* SEO
* CTAs

Esses dados devem vir do CMS/API.

---

# 95. CONFIGURAÇÕES GLOBAIS

Criar entidade de configurações para itens globais.

Exemplo:

```text
SITE_NAME
SITE_DESCRIPTION
LOGO
FAVICON
PRIMARY_COLOR
SECONDARY_COLOR
CONTACT_PHONE
WHATSAPP
EMAIL
ADDRESS
SOCIAL_LINKS
```

---

# 96. NÃO CRIAR UM CMS SIMPLES

O painel não deve parecer apenas um CRUD visual.

Criar UX profissional semelhante a produtos SaaS modernos.

Características:

* sidebar
* breadcrumbs
* pesquisa
* filtros
* tabelas
* cards
* gráficos
* loaders
* skeletons
* estados vazios
* feedback
* atalhos

---

# 97. SITE PREMIUM

Não utilizar aparência genérica de template.

O frontend deve transmitir imediatamente:

**ENERGIA + TECNOLOGIA + ENGENHARIA + SUSTENTABILIDADE + ALTO PADRÃO.**

---

# 98. PREVIEW EM TEMPO REAL

Quando possível, criar preview visual para modificações de:

* cores
* logo
* fontes
* hero
* banners

Antes da publicação.

---

# 99. CACHE INVALIDATION

Quando uma informação for atualizada no painel, garantir que o site público reflita a alteração corretamente.

Invalidar cache quando necessário.

---

# 100. FLUXO DE PUBLICAÇÃO

Idealmente:

```text
Administrador altera conteúdo
↓
Salva rascunho
↓
Visualiza preview
↓
Publica
↓
API atualiza conteúdo público
↓
Cache é invalidado
↓
Site recebe nova informação
```

---

# 101. CONTROLE TOTAL DA HOME

O administrador deve conseguir alterar TODAS as informações da Home.

Exemplo:

```text
Hero
Título
Subtítulo
Imagem
Vídeo
CTA

Benefícios
Soluções
Indicadores
Projetos
Depoimentos
FAQ
Simulador
CTA final
```

---

# 102. CONTROLE DAS ANIMAÇÕES

Adicionar configuração para determinadas animações.

Quando possível permitir:

```text
Animação ativa
Tipo de animação
Duração
Delay
```

Sem expor configurações excessivamente técnicas para administradores comuns.

---

# 103. FORM BUILDER

Criar estrutura para administração dos formulários.

Permitir configurar:

* título
* campos
* campos obrigatórios
* mensagem de sucesso
* destinatários
* CTA

Se um Form Builder completo aumentar excessivamente a complexidade, implementar inicialmente uma arquitetura preparada para expansão.

---

# 104. CONFIGURAÇÃO DE E-MAIL

Painel:

```text
Configurações
> E-mail
```

Permitir SMTP através de variáveis seguras e parâmetros apropriados.

---

# 105. NOTIFICAÇÕES

Quando chegar novo lead:

* registrar no painel
* exibir notificação
* opcionalmente enviar e-mail

Preparar arquitetura para futuras integrações:

* WhatsApp
* Telegram
* Slack

---

# 106. PÁGINAS LEGAIS

Administráveis:

```text
/politica-de-privacidade
/termos-de-uso
/cookies
```

---

# 107. LGPD

Criar gerenciamento de cookies.

Categorias:

* necessários
* analytics
* marketing

Consentimento deve ser armazenado adequadamente.

---

# 108. PÁGINA 404

Criar 404 personalizada e administrável.

---

# 109. MANUTENÇÃO

Adicionar opção:

```text
Modo de manutenção
```

O administrador poderá ativar ou desativar.

Permitir configurar:

* título
* mensagem
* previsão
* imagem

---

# 110. REVISÃO AUTOMÁTICA COM SKILLS

ANTES de declarar o projeto concluído, executar auditorias utilizando novamente as skills disponíveis.

## UX

Verificar:

* navegação
* usabilidade
* hierarquia
* formulários

## UI

Verificar:

* consistência
* grids
* tipografia
* espaçamentos
* identidade

## Frontend

Verificar:

* componentes
* reutilização
* performance
* organização

## Backend

Verificar:

* arquitetura
* segurança
* performance
* validações

## Banco

Verificar:

* índices
* constraints
* relacionamentos
* integridade

## Docker

Verificar:

* volumes
* redes
* healthchecks
* build
* persistência

## SEO

Verificar:

* metadata
* schema
* sitemap
* robots
* canonical

## Performance

Verificar:

* bundle
* imagens
* requests
* cache

## Security

Verificar:

* autenticação
* autorização
* uploads
* rate limiting
* secrets
* OWASP

---

# 111. REGRA DE NÃO SIMPLIFICAÇÃO

NÃO:

* criar somente uma landing page;
* criar painel administrativo fictício;
* utilizar dados hardcoded quando deveriam ser administráveis;
* criar botões sem funcionalidade;
* deixar páginas vazias;
* utilizar Lorem Ipsum;
* criar somente interfaces sem backend;
* simular CRUD sem persistência;
* armazenar tudo em JSON;
* criar banco fake;
* ignorar autenticação;
* ignorar permissões;
* ignorar Docker;
* deixar funcionalidades "para depois".

Todo CRUD deve funcionar de verdade.

Toda informação editável deve persistir no banco.

---

# 112. CRITÉRIO PRINCIPAL DE ACEITAÇÃO

Considere o sistema correto somente se um administrador sem conhecimento de programação conseguir entrar no painel e modificar praticamente todo o site.

Por exemplo:

**Trocar a marca inteira sem alterar código:**

```text
Logo
↓
Nome
↓
Cores
↓
Fontes
↓
Imagens
↓
Textos
↓
Banners
↓
Menus
↓
Projetos
↓
Serviços
↓
Depoimentos
↓
Contato
↓
WhatsApp
↓
SEO
↓
Footer
```

E as modificações devem refletir corretamente no site público.

---

# 113. RESULTADO FINAL

O projeto final deverá ser composto essencialmente por:

```text
┌─────────────────────────────┐
│ SITE INSTITUCIONAL PREMIUM  │
│ React                       │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│ NODE.JS + TYPESCRIPT        │
│ API / REGRAS / CMS          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ POSTGRESQL                  │
└─────────────────────────────┘

               ▲
               │ REST API
               │
┌──────────────┴──────────────┐
│ PAINEL ADMINISTRATIVO       │
│ React                       │
│ CMS COMPLETO                │
└─────────────────────────────┘
```

Tudo executado através de:

```text
DOCKER + DOCKER COMPOSE
```

O resultado deve ser uma plataforma profissional, escalável e visualmente premium, em que o **site institucional e o painel administrativo façam parte de um único ecossistema**, permitindo administrar integralmente o conteúdo apresentado aos visitantes.

A qualidade final deve ser compatível com um produto desenvolvido por uma agência premium internacional e uma equipe de engenharia de software experiente.

Antes de finalizar qualquer etapa, utilize novamente as **skills especializadas disponíveis**, identifique oportunidades de melhoria e implemente as correções encontradas.
