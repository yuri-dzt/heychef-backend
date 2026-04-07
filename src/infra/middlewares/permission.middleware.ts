import { Request, Response, NextFunction } from 'express';
import { Action as PrismaAction } from '@prisma/client';
import { prisma } from '../../shared/prisma';

export const PermissionMiddleware = (pageName: string, action: string) => {
  return async (
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

      if (user.type === 'admin' || user.role === 'ADMIN') {
        next();
        return;
      }

      const permission = await prisma.userPermission.findFirst({
        where: {
          user_id: user.id,
          page: { name: pageName },
          action: action as PrismaAction,
        },
      });

      if (!permission) {
        res.status(403).json({ message: 'You do not have permission to perform this action' });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
