import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { ListOrganizationsUseCase } from '../../app/organization/list-organizations.use-case';
import { GetOrganizationUseCase } from '../../app/organization/get-organization.use-case';
import { RenewPlanUseCase } from '../../app/organization/renew-plan.use-case';
import { getOrganizationSchema, renewPlanSchema, createOrganizationSchema } from '../schemas/organization.schema';
import { prisma } from '../../shared/prisma';

export class OrganizationController {
  constructor(
    private listOrganizationsUseCase: ListOrganizationsUseCase,
    private getOrganizationUseCase: GetOrganizationUseCase,
    private renewPlanUseCase: RenewPlanUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgs = await prisma.organization.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          plan: { select: { name: true } },
          users: {
            where: { role: 'ADMIN' },
            take: 1,
            select: { name: true, email: true },
          },
        },
      });

      const data = orgs.map((o) => ({
        id: o.id,
        name: o.name,
        planId: o.plan_id,
        planName: o.plan?.name || null,
        planExpiresAt: Number(o.plan_expires_at),
        createdAt: Number(o.created_at),
        updatedAt: o.updated_at ? Number(o.updated_at) : undefined,
        owner: o.users[0] ? { name: o.users[0].name, email: o.users[0].email } : null,
      }));

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  getMyOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user!.organizationId) {
        res.status(400).json({ message: 'No organization' });
        return;
      }

      const org = await prisma.organization.findUnique({
        where: { id: req.user!.organizationId },
        include: { plan: true },
      });

      if (!org) {
        res.status(404).json({ message: 'Organization not found' });
        return;
      }

      res.status(200).json({
        data: {
          id: org.id,
          name: org.name,
          planId: org.plan_id,
          planName: org.plan?.name || null,
          planExpiresAt: Number(org.plan_expires_at),
          createdAt: Number(org.created_at),
          plan: org.plan ? {
            name: org.plan.name,
            priceCents: org.plan.price_cents,
            maxUsers: org.plan.max_users,
            maxTables: org.plan.max_tables,
            maxProducts: org.plan.max_products,
            maxCategories: org.plan.max_categories,
            maxOrdersPerDay: org.plan.max_orders_per_day,
          } : null,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateMyOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.user!.organizationId;
      if (!orgId) { res.status(400).json({ message: 'Sem organização' }); return; }

      const { name } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ message: 'Nome é obrigatório' });
        return;
      }

      const updated = await prisma.organization.update({
        where: { id: orgId },
        data: { name: name.trim(), updated_at: BigInt(Date.now()) },
      });

      res.status(200).json({
        data: {
          id: updated.id,
          name: updated.name,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = getOrganizationSchema.parse(req.params);

      const organization = await this.getOrganizationUseCase.execute({
        organizationId: params.id,
      });

      res.status(200).json({ data: organization });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = createOrganizationSchema.parse(req.body);
      const now = BigInt(Date.now());
      const thirtyDays = BigInt(30 * 24 * 60 * 60 * 1000);
      const orgId = uuidv4();

      await prisma.organization.create({
        data: {
          id: orgId,
          name: body.name,
          plan_id: body.planId || null,
          plan_expires_at: now + thirtyDays,
          created_at: now,
        },
      });

      // Create default pages for the org
      const defaultPages = ['orders', 'menu', 'tables', 'users', 'reports'];
      for (const pageName of defaultPages) {
        await prisma.page.create({
          data: {
            id: uuidv4(),
            organization_id: orgId,
            name: pageName,
            created_at: now,
          },
        });
      }

      // Create admin user for the org
      const passwordHash = await bcrypt.hash(body.adminPassword, 10);
      await prisma.user.create({
        data: {
          id: uuidv4(),
          organization_id: orgId,
          name: body.adminName,
          email: body.adminEmail,
          password_hash: passwordHash,
          role: 'ADMIN',
          created_at: now,
        },
      });

      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: { plan: { select: { name: true } } },
      });

      res.status(201).json({
        data: {
          id: org!.id,
          name: org!.name,
          planId: org!.plan_id,
          planName: org!.plan?.name || null,
          planExpiresAt: Number(org!.plan_expires_at),
          createdAt: Number(org!.created_at),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  renewPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = renewPlanSchema.parse(req.params);

      const organization = await this.renewPlanUseCase.execute({
        organizationId: params.id,
      });

      res.status(200).json({ data: organization });
    } catch (error) {
      next(error);
    }
  };
}
