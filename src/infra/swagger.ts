export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'HeyChef API',
    version: '1.0.0',
    description: 'API do sistema HeyChef — Cardápio Digital + Pedidos por QR Code',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Desenvolvimento' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // ── Auth ──
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login de usuário do restaurante',
        security: [],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, organizationId: { type: 'string', format: 'uuid' } }, required: ['email', 'password'] } } } },
        responses: { '200': { description: 'Token JWT + dados do usuário' }, '401': { description: 'Credenciais inválidas' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar nova organização + admin',
        security: [],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, organizationName: { type: 'string' } }, required: ['name', 'email', 'password', 'organizationName'] } } } },
        responses: { '201': { description: 'Usuário criado' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Dados do usuário autenticado',
        responses: { '200': { description: 'Dados do usuário + permissões' } },
      },
    },
    '/admin/auth/login': {
      post: {
        tags: ['Admin Auth'],
        summary: 'Login do administrador da plataforma',
        security: [],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } } } },
        responses: { '200': { description: 'Token JWT + dados do admin' }, '401': { description: 'Credenciais inválidas' } },
      },
    },
    // ── Organizations ──
    '/organizations': {
      get: { tags: ['Organizations'], summary: 'Listar organizações (admin)', responses: { '200': { description: 'Lista de organizações' } } },
      post: { tags: ['Organizations'], summary: 'Criar organização (admin)', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, adminName: { type: 'string' }, adminEmail: { type: 'string' }, adminPassword: { type: 'string' }, planId: { type: 'string' } }, required: ['name', 'adminName', 'adminEmail', 'adminPassword'] } } } }, responses: { '201': { description: 'Organização criada' } } },
    },
    '/organizations/{id}/renew-plan': {
      patch: { tags: ['Organizations'], summary: 'Renovar plano (+30 dias)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Plano renovado' } } },
    },
    // ── Plans ──
    '/plans': {
      get: { tags: ['Plans'], summary: 'Listar planos', responses: { '200': { description: 'Lista de planos' } } },
      post: { tags: ['Plans'], summary: 'Criar plano (admin)', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, priceCents: { type: 'integer' }, maxUsers: { type: 'integer' }, maxTables: { type: 'integer' }, maxProducts: { type: 'integer' }, maxCategories: { type: 'integer' }, maxOrdersPerDay: { type: 'integer' } }, required: ['name', 'priceCents', 'maxUsers', 'maxTables', 'maxProducts', 'maxCategories', 'maxOrdersPerDay'] } } } }, responses: { '201': { description: 'Plano criado' } } },
    },
    // ── Users ──
    '/users': {
      get: { tags: ['Users'], summary: 'Listar usuários da organização', responses: { '200': { description: 'Lista de usuários' } } },
      post: { tags: ['Users'], summary: 'Criar usuário', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['ADMIN', 'SUPPORT', 'USER'] } }, required: ['name', 'email', 'password', 'role'] } } } }, responses: { '201': { description: 'Usuário criado' } } },
    },
    '/users/{id}': {
      patch: { tags: ['Users'], summary: 'Atualizar usuário', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Atualizado' } } },
      delete: { tags: ['Users'], summary: 'Remover usuário', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Removido' } } },
    },
    // ── Tables ──
    '/tables': {
      get: { tags: ['Tables'], summary: 'Listar mesas', responses: { '200': { description: 'Lista de mesas' } } },
      post: { tags: ['Tables'], summary: 'Criar mesa', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } } } }, responses: { '201': { description: 'Mesa criada' } } },
    },
    '/tables/{id}': {
      patch: { tags: ['Tables'], summary: 'Atualizar mesa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Atualizada' } } },
      delete: { tags: ['Tables'], summary: 'Remover mesa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Removida' } } },
    },
    '/tables/{id}/regenerate-token': {
      post: { tags: ['Tables'], summary: 'Regenerar QR token da mesa', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Token regenerado' } } },
    },
    // ── Categories ──
    '/categories': {
      get: { tags: ['Menu'], summary: 'Listar categorias', responses: { '200': { description: 'Lista' } } },
      post: { tags: ['Menu'], summary: 'Criar categoria', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, orderIndex: { type: 'integer' } }, required: ['name'] } } } }, responses: { '201': { description: 'Criada' } } },
    },
    // ── Products ──
    '/products': {
      get: { tags: ['Menu'], summary: 'Listar produtos (com paginação)', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }], responses: { '200': { description: 'Lista paginada' } } },
      post: { tags: ['Menu'], summary: 'Criar produto', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, priceCents: { type: 'integer' }, categoryId: { type: 'string' }, imageUrl: { type: 'string' } }, required: ['name', 'priceCents', 'categoryId'] } } } }, responses: { '201': { description: 'Criado' } } },
    },
    // ── Addons ──
    '/products/{id}/addon-groups': {
      post: { tags: ['Menu'], summary: 'Criar grupo de adicionais', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '201': { description: 'Grupo criado' } } },
    },
    '/addon-groups/{id}/items': {
      post: { tags: ['Menu'], summary: 'Criar item adicional', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '201': { description: 'Item criado' } } },
    },
    // ── Global Addon Groups ──
    '/addon-groups': {
      get: { tags: ['Addon Groups'], summary: 'List global addon groups', responses: { '200': { description: 'List of global addon groups with items and linked products' } } },
      post: { tags: ['Addon Groups'], summary: 'Create global addon group', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, minSelect: { type: 'integer' }, maxSelect: { type: 'integer' } }, required: ['name', 'minSelect', 'maxSelect'] } } } }, responses: { '201': { description: 'Addon group created' } } },
    },
    '/addon-groups/{id}': {
      patch: { tags: ['Addon Groups'], summary: 'Update global addon group', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, minSelect: { type: 'integer' }, maxSelect: { type: 'integer' } } } } } }, responses: { '200': { description: 'Addon group updated' } } },
      delete: { tags: ['Addon Groups'], summary: 'Delete global addon group', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Addon group deleted' } } },
    },
    '/addon-groups/{groupId}/items': {
      post: { tags: ['Addon Groups'], summary: 'Create addon item in global group', parameters: [{ name: 'groupId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, priceCents: { type: 'integer' } }, required: ['name', 'priceCents'] } } } }, responses: { '201': { description: 'Addon item created' } } },
    },
    '/addon-groups/items/{itemId}': {
      patch: { tags: ['Addon Groups'], summary: 'Update addon item in global group', parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, priceCents: { type: 'integer' } } } } } }, responses: { '200': { description: 'Addon item updated' } } },
      delete: { tags: ['Addon Groups'], summary: 'Delete addon item in global group', parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Addon item deleted' } } },
    },
    '/addon-groups/{groupId}/link': {
      post: { tags: ['Addon Groups'], summary: 'Link addon group to product', parameters: [{ name: 'groupId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { productId: { type: 'string', format: 'uuid' } }, required: ['productId'] } } } }, responses: { '201': { description: 'Link created' } } },
    },
    '/addon-groups/{groupId}/link/{productId}': {
      delete: { tags: ['Addon Groups'], summary: 'Unlink addon group from product', parameters: [{ name: 'groupId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Link removed' } } },
    },
    // ── Orders ──
    '/orders': {
      get: { tags: ['Orders'], summary: 'Listar pedidos (com paginação)', parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED'] } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { '200': { description: 'Lista paginada' } } },
    },
    '/orders/{id}': {
      get: { tags: ['Orders'], summary: 'Detalhes do pedido', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Pedido com itens' } } },
    },
    '/orders/{id}/status': {
      patch: { tags: ['Orders'], summary: 'Atualizar status do pedido', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED'] } } } } } }, responses: { '200': { description: 'Status atualizado' } } },
    },
    '/orders/{id}/cancel': {
      patch: { tags: ['Orders'], summary: 'Cancelar pedido', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Cancelado' } } },
    },
    '/orders/items/{itemId}/status': {
      patch: { tags: ['Orders'], summary: 'Atualizar status de um item', parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['PENDING', 'PREPARING', 'READY'] } } } } } }, responses: { '200': { description: 'Item atualizado' } } },
    },
    // ── Public (QR Code) ──
    '/public/menu/{tableToken}': {
      get: { tags: ['Public'], summary: 'Cardápio da mesa (sem auth)', security: [], parameters: [{ name: 'tableToken', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Menu com categorias e produtos' } } },
    },
    '/public/orders/{tableToken}': {
      post: { tags: ['Public'], summary: 'Criar pedido (sem auth)', security: [], parameters: [{ name: 'tableToken', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { customerName: { type: 'string' }, notes: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { productId: { type: 'string' }, quantity: { type: 'integer' }, addonItemIds: { type: 'array', items: { type: 'string' } } } } } } } } } }, responses: { '201': { description: 'Pedido criado' } } },
    },
    '/public/order/{tableToken}': {
      get: { tags: ['Public'], summary: 'Pedido ativo da mesa (sem auth)', security: [], parameters: [{ name: 'tableToken', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Pedido ativo ou null' } } },
    },
    '/public/call-waiter/{tableToken}': {
      post: { tags: ['Public'], summary: 'Chamar garçom (sem auth)', security: [], parameters: [{ name: 'tableToken', in: 'path', required: true, schema: { type: 'string' } }], responses: { '201': { description: 'Chamado criado' } } },
    },
    // ── Waiter Calls ──
    '/waiter-calls': {
      get: { tags: ['Waiter Calls'], summary: 'Listar chamados', responses: { '200': { description: 'Lista' } } },
    },
    '/waiter-calls/{id}/resolve': {
      patch: { tags: ['Waiter Calls'], summary: 'Resolver chamado', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Resolvido' } } },
    },
    // ── Events (SSE) ──
    '/events/orders': {
      get: { tags: ['Events'], summary: 'SSE — pedidos e chamados em tempo real', parameters: [{ name: 'token', in: 'query', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Stream de eventos' } } },
    },
    // ── Reports ──
    '/reports/daily': {
      get: { tags: ['Reports'], summary: 'Relatórios diários', parameters: [{ name: 'from', in: 'query', required: true, schema: { type: 'string', format: 'date' } }, { name: 'to', in: 'query', required: true, schema: { type: 'string', format: 'date' } }], responses: { '200': { description: 'Lista de relatórios' } } },
    },
    '/reports/generate': {
      post: { tags: ['Reports'], summary: 'Gerar relatórios manualmente', responses: { '200': { description: 'Relatórios gerados' } } },
    },
    // ── Sessions ──
    '/sessions': {
      get: { tags: ['Sessions'], summary: 'Listar sessões ativas', responses: { '200': { description: 'Lista de sessões' } } },
      delete: { tags: ['Sessions'], summary: 'Revogar todas as outras sessões', responses: { '200': { description: 'Sessões revogadas' } } },
    },
    '/sessions/{id}': {
      delete: { tags: ['Sessions'], summary: 'Revogar uma sessão', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Sessão revogada' } } },
    },
    // ── Audit ──
    '/audit': {
      get: { tags: ['Audit'], summary: 'Log de auditoria da organização', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { '200': { description: 'Lista paginada de ações' } } },
    },
    // ── Upload ──
    '/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Upload de imagem para Supabase',
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } },
        responses: { '200': { description: '{ url: string }' } },
      },
    },
    // ── Health ──
    '/health': {
      get: { tags: ['System'], summary: 'Health check', security: [], responses: { '200': { description: '{ status: "ok" }' } } },
    },
  },
};
