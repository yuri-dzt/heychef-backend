import { prisma } from '../shared/prisma';
import { logger } from '../shared/logger';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PAGES = ['orders', 'menu', 'tables', 'users', 'reports'];

async function ensurePagesForOrg(organizationId: string): Promise<void> {
  for (const pageName of DEFAULT_PAGES) {
    const existing = await prisma.page.findFirst({
      where: {
        organization_id: organizationId,
        name: pageName,
      },
    });

    if (!existing) {
      await prisma.page.create({
        data: {
          id: uuidv4(),
          organization_id: organizationId,
          name: pageName,
          created_at: BigInt(Date.now()),
        },
      });
      logger.info(`Created page "${pageName}" for organization ${organizationId}`);
    }
  }
}

export async function seed(): Promise<void> {
  logger.info('Running seed...');

  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@gmail.com' },
  });

  if (existingAdmin) {
    logger.info('Super admin already exists, ensuring pages...');
    await ensurePagesForOrg(existingAdmin.organization_id);
    logger.info('Seed completed (no changes needed).');
    return;
  }

  const orgId = uuidv4();
  const now = BigInt(Date.now());
  const oneYearFromNow = BigInt(Date.now() + 365 * 24 * 60 * 60 * 1000);

  await prisma.organization.create({
    data: {
      id: orgId,
      name: 'HeyChef Admin',
      plan_expires_at: oneYearFromNow,
      created_at: now,
    },
  });
  logger.info('Created default organization "HeyChef Admin"');

  await ensurePagesForOrg(orgId);

  const passwordHash = await bcrypt.hash('1234', 10);

  await prisma.user.create({
    data: {
      id: uuidv4(),
      organization_id: orgId,
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password_hash: passwordHash,
      role: 'SUPER_ADMIN',
      created_at: now,
    },
  });
  logger.info('Created super admin user (admin@gmail.com)');

  logger.info('Seed completed successfully.');
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
