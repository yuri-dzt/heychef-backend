import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../shared/prisma';
import { createPlanSchema, updatePlanSchema } from '../schemas/plan.schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlan(plan: any) {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    priceCents: plan.price_cents,
    maxUsers: plan.max_users,
    maxTables: plan.max_tables,
    maxProducts: plan.max_products,
    maxCategories: plan.max_categories,
    maxOrdersPerDay: plan.max_orders_per_day,
    active: plan.active,
    createdAt: Number(plan.created_at),
    updatedAt: plan.updated_at !== null ? Number(plan.updated_at) : null,
    ...(plan._count !== undefined && { organizationCount: plan._count.organizations }),
  };
}

export class PlanController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.type !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const plans = await prisma.plan.findMany({
        orderBy: { created_at: 'desc' },
      });

      res.status(200).json({ data: plans.map(mapPlan) });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.type !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const id = req.params.id as string;

      const plan = await prisma.plan.findUnique({
        where: { id },
        include: { _count: { select: { organizations: true } } },
      });

      if (!plan) {
        res.status(404).json({ message: 'Plan not found' });
        return;
      }

      res.status(200).json({ data: mapPlan(plan) });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.type !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const body = createPlanSchema.parse(req.body);

      const plan = await prisma.plan.create({
        data: {
          id: uuidv4(),
          name: body.name,
          description: body.description ?? null,
          price_cents: body.priceCents,
          max_users: body.maxUsers,
          max_tables: body.maxTables,
          max_products: body.maxProducts,
          max_categories: body.maxCategories,
          max_orders_per_day: body.maxOrdersPerDay,
          created_at: BigInt(Date.now()),
        },
      });

      res.status(201).json({ data: mapPlan(plan) });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.type !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const id = req.params.id as string;
      const body = updatePlanSchema.parse(req.body);

      const existing = await prisma.plan.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ message: 'Plan not found' });
        return;
      }

      const plan = await prisma.plan.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.priceCents !== undefined && { price_cents: body.priceCents }),
          ...(body.maxUsers !== undefined && { max_users: body.maxUsers }),
          ...(body.maxTables !== undefined && { max_tables: body.maxTables }),
          ...(body.maxProducts !== undefined && { max_products: body.maxProducts }),
          ...(body.maxCategories !== undefined && { max_categories: body.maxCategories }),
          ...(body.maxOrdersPerDay !== undefined && { max_orders_per_day: body.maxOrdersPerDay }),
          ...(body.active !== undefined && { active: body.active }),
          updated_at: BigInt(Date.now()),
        },
      });

      res.status(200).json({ data: mapPlan(plan) });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.type !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const id = req.params.id as string;

      const plan = await prisma.plan.findUnique({
        where: { id },
        include: { _count: { select: { organizations: true } } },
      });

      if (!plan) {
        res.status(404).json({ message: 'Plan not found' });
        return;
      }

      if (plan._count.organizations > 0) {
        res.status(409).json({
          message: `Cannot delete plan: ${plan._count.organizations} organization(s) are using it`,
        });
        return;
      }

      await prisma.plan.delete({ where: { id } });

      res.status(200).json({ data: { id } });
    } catch (error) {
      next(error);
    }
  };

  assignToOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.type !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const { organizationId, planId } = req.body;

      if (!organizationId || !planId) {
        res.status(400).json({ message: 'organizationId and planId are required' });
        return;
      }

      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) {
        res.status(404).json({ message: 'Plan not found' });
        return;
      }

      const organization = await prisma.organization.update({
        where: { id: organizationId },
        data: {
          plan_id: planId,
          updated_at: BigInt(Date.now()),
        },
      });

      res.status(200).json({
        data: {
          organizationId: organization.id,
          planId: organization.plan_id,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
