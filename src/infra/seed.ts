import { prisma } from '../shared/prisma';
import { logger } from '../shared/logger';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PLANS = [
  {
    name: 'Básico',
    price_cents: 0,
    max_users: 3,
    max_tables: 5,
    max_products: 20,
    max_categories: 5,
    max_orders_per_day: 50,
  },
  {
    name: 'Pro',
    price_cents: 9990,
    max_users: 10,
    max_tables: 20,
    max_products: 100,
    max_categories: 20,
    max_orders_per_day: 300,
  },
  {
    name: 'Premium',
    price_cents: 19990,
    max_users: 999,
    max_tables: 999,
    max_products: 999,
    max_categories: 999,
    max_orders_per_day: 99999,
  },
];

async function ensurePlans(): Promise<void> {
  for (const planData of DEFAULT_PLANS) {
    const existing = await prisma.plan.findFirst({
      where: { name: planData.name },
    });

    if (!existing) {
      await prisma.plan.create({
        data: {
          id: uuidv4(),
          ...planData,
          created_at: BigInt(Date.now()),
        },
      });
      logger.info(`Created plan "${planData.name}"`);
    }
  }
}

export async function seed(): Promise<void> {
  logger.info('Running seed...');

  await ensurePlans();

  const existingAdmin = await prisma.admin.findFirst({
    where: { email: 'admin@gmail.com' },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        id: uuidv4(),
        name: 'Super Admin',
        email: 'admin@gmail.com',
        password_hash: await bcrypt.hash('1234', 10),
        created_at: BigInt(Date.now()),
      },
    });
    logger.info('Created super admin (admin@gmail.com)');
  }

  logger.info('Seed completed.');
}

// Run directly if called as main script
const isMain =
  require.main === module ||
  process.argv[1]?.replace(/\\/g, '/').endsWith('infra/seed.ts') ||
  process.argv[1]?.replace(/\\/g, '/').endsWith('infra/seed.js');

if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Seed failed', { message: err.message, stack: err.stack });
      process.exit(1);
    });
}
