import { Router, Request, Response, NextFunction } from 'express';
import { makeOrganizationController } from '../factories/organization.factory';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ForbiddenError } from '../../shared/errors';

const router = Router();
const controller = makeOrganizationController();

const superAdminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'SUPER_ADMIN') {
    next(new ForbiddenError('Only SUPER_ADMIN can access this resource'));
    return;
  }
  next();
};

router.get('/', AuthMiddleware, superAdminOnly, controller.list);
router.get('/:id', AuthMiddleware, superAdminOnly, controller.getById);
router.patch('/:id/renew-plan', AuthMiddleware, superAdminOnly, controller.renewPlan);

export { router as organizationRoutes };
