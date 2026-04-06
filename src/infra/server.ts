import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
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

const app = express();

app.use(
  cors({
    origin: config.allowedOrigins,
  }),
);

app.use(express.json());

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

app.listen(config.port, async () => {
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
