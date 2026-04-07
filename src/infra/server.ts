import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from '../shared/config';
import { prisma } from '../shared/prisma';
import { logger } from '../shared/logger';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { seed } from './seed';
import { startCronJobs } from './cron';

import { authRoutes } from './routes/auth.routes';
import { organizationRoutes } from './routes/organization.routes';
import { userRoutes } from './routes/user.routes';
import { tableRouter } from './routes/table.routes';
import { categoryRouter } from './routes/category.routes';
import { productRouter } from './routes/product.routes';
import { addonRouter } from './routes/addon.routes';
import { orderRouter } from './routes/order.routes';
import { publicRouter } from './routes/public.routes';
import { callWaiterRouter } from './routes/call-waiter.routes';
import { eventRouter } from './routes/event.routes';
import { reportRoutes } from './routes/report.routes';
import { planRouter } from './routes/plan.routes';
import { adminAuthRoutes } from './routes/admin-auth.routes';
import { sessionRouter } from './routes/session.routes';
import { auditRouter } from './routes/audit.routes';
import { uploadRouter } from './routes/upload.routes';
import { refreshRouter } from './routes/refresh.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const app = express();

app.use(
  cors({
    origin: config.allowedOrigins,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(compression({
  filter: (req, res) => {
    // Don't compress SSE responses
    if (req.headers.accept === 'text/event-stream') return false;
    return compression.filter(req, res);
  },
}));

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount routes
app.use('/auth', authRoutes);
app.use('/organizations', organizationRoutes);
app.use('/users', userRoutes);
app.use('/tables', tableRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/', addonRouter);
app.use('/orders', orderRouter);
app.use('/public', publicRouter);
app.use('/', callWaiterRouter);
app.use('/events', eventRouter);
app.use('/reports', reportRoutes);
app.use('/plans', planRouter);
app.use('/admin/auth', adminAuthRoutes);
app.use('/auth/refresh', refreshRouter);
app.use('/sessions', sessionRouter);
app.use('/audit', auditRouter);
app.use('/upload', uploadRouter);

// Health check
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Error handler must be last
app.use(ErrorHandlerMiddleware);

const server = app.listen(config.port, async () => {
  logger.info(`Server running on port ${config.port}`);

  try {
    await seed();
  } catch (error) {
    logger.error('Seed failed on startup', {
      message: (error as Error).message,
    });
  }

  startCronJobs();
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed.');
    process.exit(0);
  });
  // Force close after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason: String(reason) });
});
