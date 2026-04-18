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

    if (user.type === 'admin') {
      next();
      return;
    }

    // Only check on write operations — reads are allowed when expired
    if (req.method === 'GET') {
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
      res.status(403).json({
        message:
          'Seu plano expirou. Entre em contato com o suporte para renovar. Você ainda pode visualizar os dados mas não pode criar ou alterar.',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
