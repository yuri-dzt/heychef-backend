import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/prisma';

type LimitResource = 'users' | 'tables' | 'products' | 'categories' | 'orders';

const limitCache = new Map<string, { count: number; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedCount(key: string): number | null {
  const cached = limitCache.get(key);
  if (!cached || cached.expiresAt < Date.now()) {
    limitCache.delete(key);
    return null;
  }
  return cached.count;
}

function setCachedCount(key: string, count: number): void {
  limitCache.set(key, { count, expiresAt: Date.now() + CACHE_TTL });
}

export function PlanLimitsMiddleware(resource: LimitResource) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Admin bypasses limits
      if (req.user?.type === 'admin') return next();

      const orgId = req.user?.organizationId;
      if (!orgId) return next();

      // Get org with plan
      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: { plan: true },
      });

      // If no plan assigned, allow (no limits)
      if (!org?.plan) return next();

      const plan = org.plan;
      let maxAllowed = 0;

      const cacheKey = `${orgId}:${resource}`;
      const cachedCount = getCachedCount(cacheKey);
      let currentCount: number;

      if (cachedCount !== null) {
        currentCount = cachedCount;
      } else {
        currentCount = 0;

        switch (resource) {
          case 'users':
            currentCount = await prisma.user.count({ where: { organization_id: orgId } });
            break;
          case 'tables':
            currentCount = await prisma.table.count({ where: { organization_id: orgId } });
            break;
          case 'products':
            currentCount = await prisma.product.count({ where: { organization_id: orgId } });
            break;
          case 'categories':
            currentCount = await prisma.category.count({ where: { organization_id: orgId } });
            break;
          case 'orders':
            // Count orders created today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            currentCount = await prisma.order.count({
              where: {
                organization_id: orgId,
                created_at: { gte: BigInt(startOfDay.getTime()) },
              },
            });
            break;
        }

        setCachedCount(cacheKey, currentCount);
      }

      switch (resource) {
        case 'users':
          maxAllowed = plan.max_users;
          break;
        case 'tables':
          maxAllowed = plan.max_tables;
          break;
        case 'products':
          maxAllowed = plan.max_products;
          break;
        case 'categories':
          maxAllowed = plan.max_categories;
          break;
        case 'orders':
          maxAllowed = plan.max_orders_per_day;
          break;
      }

      if (currentCount >= maxAllowed) {
        res.status(403).json({
          message: `Limite do plano atingido. Seu plano permite no máximo ${maxAllowed} ${resource}. Faça upgrade para continuar.`,
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
