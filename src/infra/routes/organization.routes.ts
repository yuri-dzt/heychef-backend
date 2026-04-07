import { Router, Request, Response, NextFunction } from 'express';
import { makeOrganizationController } from '../factories/organization.factory';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ForbiddenError } from '../../shared/errors';

const router = Router();
const controller = makeOrganizationController();

const superAdminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.type !== 'admin') {
    next(new ForbiddenError('Only admins can access this resource'));
    return;
  }
  next();
};

router.get('/', AuthMiddleware, superAdminOnly, controller.list);
router.post('/', AuthMiddleware, superAdminOnly, controller.create);
router.get('/me', AuthMiddleware, controller.getMyOrg);
router.get('/:id', AuthMiddleware, superAdminOnly, controller.getById);
router.patch('/:id/renew-plan', AuthMiddleware, superAdminOnly, controller.renewPlan);

export { router as organizationRoutes };
