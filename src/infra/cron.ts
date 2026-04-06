import cron from 'node-cron';
import { prisma } from '../shared/prisma';
import { logger } from '../shared/logger';
import { v4 as uuidv4 } from 'uuid';

async function archiveOldOrders(): Promise<void> {
  logger.info('Cron: archiving old orders...');

  const thirtyDaysAgo = BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await prisma.order.updateMany({
    where: {
      created_at: { lt: thirtyDaysAgo },
      status: { not: 'CANCELED' },
    },
    data: {
      status: 'CANCELED',
      cancel_reason: 'Archived',
      updated_at: BigInt(Date.now()),
    },
  });

  logger.info(`Cron: archived ${result.count} old orders.`);
}

async function generateReportForDate(dateStr: string): Promise<void> {
  const startOfDay = new Date(dateStr + 'T00:00:00.000Z').getTime();
  const endOfDay = new Date(dateStr + 'T23:59:59.999Z').getTime();

  const organizations = await prisma.organization.findMany({
    select: { id: true },
  });

  for (const org of organizations) {
    const orders = await prisma.order.findMany({
      where: {
        organization_id: org.id,
        created_at: {
          gte: BigInt(startOfDay),
          lte: BigInt(endOfDay),
        },
        status: { not: 'CANCELED' },
      },
      select: { total_cents: true },
    });

    const totalOrders = orders.length;
    const totalRevenueCents = orders.reduce((sum, o) => sum + o.total_cents, 0);

    if (totalOrders > 0) {
      await prisma.reportDaily.upsert({
        where: {
          organization_id_date: {
            organization_id: org.id,
            date: dateStr,
          },
        },
        create: {
          id: uuidv4(),
          organization_id: org.id,
          date: dateStr,
          total_orders: totalOrders,
          total_revenue_cents: totalRevenueCents,
          created_at: BigInt(Date.now()),
        },
        update: {
          total_orders: totalOrders,
          total_revenue_cents: totalRevenueCents,
        },
      });

      logger.info(`Cron: report for ${dateStr} org ${org.id}: ${totalOrders} orders, ${totalRevenueCents} cents`);
    }
  }
}

export async function generateDailyReports(): Promise<void> {
  logger.info('Cron: generating daily reports...');

  const now = new Date();

  // Generate for yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  await generateReportForDate(yesterday.toISOString().split('T')[0]);

  // Generate for today too
  await generateReportForDate(now.toISOString().split('T')[0]);

  logger.info('Cron: daily reports generation completed.');
}

export function startCronJobs(): void {
  // Every day at 00:00 - archive old orders
  cron.schedule('0 0 * * *', async () => {
    try {
      await archiveOldOrders();
    } catch (error) {
      logger.error('Cron: failed to archive old orders', {
        message: (error as Error).message,
      });
    }
  });

  // Every day at 01:00 - generate daily reports
  cron.schedule('0 1 * * *', async () => {
    try {
      await generateDailyReports();
    } catch (error) {
      logger.error('Cron: failed to generate daily reports', {
        message: (error as Error).message,
      });
    }
  });

  logger.info('Cron jobs started.');
}

// Run directly if called as main script
const isMain =
  require.main === module ||
  process.argv[1]?.replace(/\\/g, '/').endsWith('infra/cron.ts') ||
  process.argv[1]?.replace(/\\/g, '/').endsWith('infra/cron.js');

if (isMain) {
  logger.info('Running reports now and starting cron jobs...');
  generateDailyReports()
    .then(() => {
      logger.info('Reports generated. Cron jobs running...');
      startCronJobs();
    })
    .catch((err) => {
      logger.error('Failed to generate reports', { message: err.message });
      process.exit(1);
    });
}
