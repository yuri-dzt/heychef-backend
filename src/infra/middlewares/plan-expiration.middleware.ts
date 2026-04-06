import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/prisma';

export const PlanExpirationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (user.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    const organization = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { plan_expires_at: true },
    });

    if (!organization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }

    if (
      organization.plan_expires_at &&
      Number(organization.plan_expires_at) < Date.now()
    ) {
      res.status(403).json({ message: 'Plan expired' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
