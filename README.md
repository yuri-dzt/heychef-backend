# HeyChef Backend

Sistema SaaS de Cardápio Digital + Pedidos por QR Code para restaurantes, lanchonetes e hamburguerias.

## Stack

- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- JWT Auth + bcrypt
- Zod validation
- Clean Architecture (4 camadas)

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando
- npm ou yarn

## Setup

1. Clone e instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/heychef?schema=public"
JWT_SECRET="sua-chave-secreta-jwt"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
PORT=3333
```

3. Gere o Prisma Client e execute as migrations:

```bash
npx prisma generate
npm run migrate
```

4. Execute o seed (cria SUPER_ADMIN e páginas padrão):

```bash
npm run seed
```

5. Inicie o servidor:

```bash
npm run dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento (hot reload) |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia versão compilada |
| `npm run migrate` | Executa Prisma migrations |
| `npm run seed` | Seed do banco (SUPER_ADMIN + páginas) |
| `npm run cron` | Inicia cron jobs separadamente |
| `npm run generate` | Gera Prisma Client |

## Seed padrão

- **SUPER_ADMIN**: `admin@heychef.com` / `Admin@123`
- **Organização**: HeyChef Admin (plano 1 ano)
- **Páginas**: orders, menu, tables, users, reports

## Arquitetura

```
src/
├── domain/          → Entidades de negócio (sem dependências)
├── app/             → Use cases (lógica de negócio)
├── contracts/       → Interfaces, DTOs, Mappers
├── infra/           → Express, Prisma, Controllers, Routes, Middlewares
└── shared/          → Utilities, Prisma Client, Logger, Config
```

### Fluxo de Request

```
Route → AuthMiddleware → PermissionMiddleware → PlanMiddleware → Controller → UseCase → Repository → Prisma → DB
```

## API Endpoints

### Auth
- `POST /auth/register` - Registrar nova organização + admin
- `POST /auth/login` - Login (retorna JWT)
- `GET /auth/me` - Dados do usuário autenticado

### Organizations (SUPER_ADMIN)
- `GET /organizations` - Listar todas
- `GET /organizations/:id` - Detalhes
- `PATCH /organizations/:id/renew-plan` - Renovar plano

### Users
- `GET /users` - Listar usuários da organização
- `POST /users` - Criar usuário
- `PATCH /users/:id` - Atualizar
- `DELETE /users/:id` - Remover

### Tables
- `GET /tables` - Listar mesas
- `POST /tables` - Criar mesa
- `PATCH /tables/:id` - Atualizar
- `DELETE /tables/:id` - Remover
- `POST /tables/:id/regenerate-token` - Regenerar QR token

### Menu (Categories + Products)
- `GET /categories` | `POST` | `PATCH /:id` | `DELETE /:id`
- `GET /products` | `POST` | `PATCH /:id` | `DELETE /:id`

### Addons
- `POST /products/:id/addon-groups` - Criar grupo de adicionais
- `POST /addon-groups/:id/items` - Criar item adicional
- `PATCH /addon-groups/:id` | `DELETE`
- `PATCH /addon-items/:id` | `DELETE`

### Orders (Painel Interno)
- `GET /orders?status=RECEIVED` - Listar pedidos
- `GET /orders/:id` - Detalhes do pedido
- `PATCH /orders/:id/status` - Atualizar status
- `PATCH /orders/:id/cancel` - Cancelar pedido

### Public (QR Code - sem login)
- `GET /public/menu/:tableToken` - Cardápio da mesa
- `POST /public/orders/:tableToken` - Criar pedido
- `POST /public/call-waiter/:tableToken` - Chamar garçom

### Call Waiter
- `GET /waiter-calls` - Listar chamados
- `PATCH /waiter-calls/:id/resolve` - Resolver chamado

### Reports
- `GET /reports/daily?from=YYYY-MM-DD&to=YYYY-MM-DD` - Relatórios diários

### Realtime (SSE)
- `GET /events/orders` - Server-Sent Events para pedidos

### Health
- `GET /health` - Verifica conexão com o banco

## Multi-tenancy

Todas as tabelas possuem `organization_id`. Todas as queries filtram por organização. `SUPER_ADMIN` acessa qualquer organização.

## Roles

| Role | Descrição |
|------|-----------|
| SUPER_ADMIN | Acesso total a tudo |
| SUPPORT | Suporte (com permissões) |
| ADMIN | Admin da organização (bypass de permissões internas) |
| USER | Usuário comum (permissões por página) |

## Rate Limiting

Login e registro limitados a 10 tentativas a cada 15 minutos.

## Cron Jobs

- **00:00** - Arquiva pedidos com mais de 30 dias
- **01:00** - Gera relatórios diários agregados
