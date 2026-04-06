Crie uma aplicação backend completa chamada HeyChef, um sistema SaaS de Cardápio Digital + Pedidos por QR Code para restaurantes, lanchonetes e hamburguerias.

Objetivo do sistema

O cliente escaneia um QR Code na mesa e acessa um cardápio web. Ele monta o pedido e envia. A cozinha recebe em tempo real no painel interno, podendo atualizar o status do pedido.

O sistema deve ser multi-tenant: cada restaurante é uma organização separada, com isolamento total por organization_id.

Stack obrigatória
Node.js + TypeScript
Express
Prisma ORM
PostgreSQL
JWT Auth + bcrypt
Zod validation
Clean Architecture (4 camadas)
Repository Pattern
Factory Pattern
Mapper Pattern (Domain ↔ DTO ↔ Prisma)
Middlewares (Auth → Permission → PlanExpiration → Controller)
Estrutura do projeto (obrigatória)

Organize o projeto com esta estrutura:

src/
├── domain/          → Entidades de negócio (sem dependências)
├── app/             → Use cases (lógica de negócio)
├── contracts/       → Interfaces, DTOs, Mappers
├── infra/           → Express, Prisma, Controllers, Routes, Middlewares
└── shared/          → Utilities, Prisma Client, Logger, Config

Fluxo de request obrigatório:

Route → AuthMiddleware → PermissionMiddleware → PlanMiddleware → Controller → UseCase → Repository → Prisma → DB

Regras gerais do projeto
Cada entidade deve ter seus arquivos separados seguindo o padrão:
entity no domain
dto + mapper + repository interface em contracts
repository prisma em infra
use-cases em app
controllers, factories, schemas, routes em infra
Todas as validações devem ser feitas com Zod
Strings sempre com limites máximos
Erros: retornar mensagens genéricas para o cliente e log detalhado internamente
Banco usa timestamps como BigInt (milissegundos)
Domain usa timestamps como number
Mapper converte BigInt ↔ number
updated_at pode ser null no banco, e undefined no domain
Multi-tenancy obrigatório

Todas as tabelas principais devem ter organization_id.
Todas as queries precisam filtrar por organization_id.
SUPER_ADMIN pode acessar qualquer organização.

Auth e Permissões

Criar sistema de autenticação com:

JWT
bcrypt
Roles: SUPER_ADMIN, SUPPORT, ADMIN, USER

Permissões devem funcionar por:

Page (ex: "orders", "menu", "tables", "users", "reports")
Action (CREATE, READ, UPDATE, DELETE)
UserPermission

ADMIN bypassa permissões internas.
SUPER_ADMIN bypassa tudo.

Plano (assinatura)

Cada organização possui um plano com expiração mensal.
Criar middleware PlanExpirationMiddleware que bloqueia acesso caso o plano esteja expirado (exceto SUPER_ADMIN e rota de pagamento fictícia).

Cron jobs obrigatórios

Criar cron jobs:

00:00 → marcar pedidos antigos como arquivados (ex: 30 dias)
01:00 → gerar relatórios diários agregados (ex: total de pedidos por dia)
Seed obrigatório

Ao iniciar o projeto:

criar páginas e permissões padrão automaticamente
criar SUPER_ADMIN inicial se não existir
Health check obrigatório

Criar rota:
GET /health
Que testa conexão com banco via Prisma.

CORS configurável

Usar variável ALLOWED_ORIGINS para permitir domínios.

Rate limit obrigatório

Aplicar rate limit em:

login
register
Ex: 10 tentativas a cada 15 minutos.
Entidades principais do HeyChef

Criar as entidades abaixo:

Organization
id
name
plan_expires_at
created_at
updated_at
User
id
organization_id
name
email
password_hash
role
created_at
updated_at
Table (Mesa)
id
organization_id
name (ex: Mesa 01)
qr_code_token (string única)
active
created_at
updated_at
Category
id
organization_id
name
order_index
active
created_at
updated_at
Product
id
organization_id
category_id
name
description
price_cents
image_url (opcional)
active
created_at
updated_at
ProductAddonGroup
id
organization_id
product_id
name (ex: "Adicionais", "Molhos")
min_select
max_select
created_at
updated_at
ProductAddonItem
id
organization_id
addon_group_id
name
price_cents
created_at
updated_at
Order
id
organization_id
table_id
status (RECEIVED, PREPARING, READY, DELIVERED, CANCELED)
customer_name (opcional)
notes (opcional)
total_cents
created_at
updated_at
OrderItem
id
organization_id
order_id
product_id
quantity
unit_price_cents
total_price_cents
created_at
OrderItemAddon
id
organization_id
order_item_id
addon_item_id
price_cents
created_at
CallWaiterEvent (chamar garçom)
id
organization_id
table_id
status (OPEN, RESOLVED)
created_at
resolved_at
ReportDaily
id
organization_id
date (YYYY-MM-DD)
total_orders
total_revenue_cents
created_at
Regras de negócio obrigatórias
Pedido só pode ser criado se a mesa estiver ativa
Produto inativo não pode ser pedido
Ao criar pedido, calcular total_cents automaticamente
Status do pedido segue fluxo:
RECEIVED → PREPARING → READY → DELIVERED
e pode ser CANCELED a qualquer momento
Ao cancelar pedido, registrar motivo opcional
Addons respeitam min/max do grupo
Funcionalidades obrigatórias (Endpoints)

Criar rotas REST completas com CRUD quando fizer sentido.

Auth
POST /auth/register
POST /auth/login
GET /auth/me
Organizations
GET /organizations (apenas SUPER_ADMIN)
GET /organizations/:id (SUPER_ADMIN)
PATCH /organizations/:id/renew-plan (SUPER_ADMIN)
Users
GET /users
POST /users
PATCH /users/:id
DELETE /users/:id
Tables
GET /tables
POST /tables
PATCH /tables/:id
DELETE /tables/:id
POST /tables/:id/regenerate-token
Menu
GET /categories
POST /categories
PATCH /categories/:id
DELETE /categories/:id
GET /products
POST /products
PATCH /products/:id
DELETE /products/:id
Addons
POST /products/:id/addon-groups
POST /addon-groups/:id/items
PATCH /addon-groups/:id
PATCH /addon-items/:id
DELETE /addon-groups/:id
DELETE /addon-items/:id
Orders (Painel interno)
GET /orders?status=RECEIVED
GET /orders/:id
PATCH /orders/:id/status
PATCH /orders/:id/cancel
Public (Cliente QR Code - sem login)

Essas rotas devem usar qr_code_token e retornar apenas dados da organização da mesa:

GET /public/menu/:tableToken
POST /public/orders/:tableToken
Call Waiter
POST /public/call-waiter/:tableToken
GET /waiter-calls
PATCH /waiter-calls/:id/resolve
Reports
GET /reports/daily?from=YYYY-MM-DD&to=YYYY-MM-DD
Realtime (importante)

Implementar sistema de atualização em tempo real para cozinha via:

SSE (Server Sent Events) ou WebSocket
Criar rota:
GET /events/orders (autenticado)
Que envia eventos quando pedidos são criados ou status muda.
Prisma Schema obrigatório

Criar schema completo com relacionamentos, índices e constraints:

índice em organization_id em todas tabelas
unique para email dentro de organization_id
unique para qr_code_token
cascades apropriados
Qualidade do código
Separar bem responsabilidades
Controllers apenas chamam use case
Use cases não podem importar Express nem Prisma diretamente
Repositories Prisma implementam interfaces de contracts
Factories constroem controllers com dependências
Criar logger em shared (console + estrutura)
Criar AppError base e erros específicos por use case
Entrega final

Gerar o projeto completo com:

código fonte completo
rotas configuradas
Prisma schema
middlewares (auth, permission, plan, error handler)
seed script
cron jobs
documentação básica no README (como rodar, env vars, migrate, seed)

Faça o projeto pronto para rodar com:

npm run dev
npm run migrate
npm run seed
npm run cron

O código deve ser organizado, escalável e seguir rigorosamente o padrão da arquitetura definida acima.

Se possível, adicionar exemplos de .env:

DATABASE_URL
JWT_SECRET
ALLOWED_ORIGINS
PORT

IMPORTANTE: mantenha o padrão de arquivos por entidade (entity, dto, mapper, repository interface, prisma repository, use case, input, error, controller, factory, schema, routes).
Não precisa usar exatamente os mesmos nomes, mas deve manter o mesmo conceito e separação.