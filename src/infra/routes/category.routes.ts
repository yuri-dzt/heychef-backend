import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { makeCategoryController } from '../factories/category.factory';

const categoryRouter = Router();
const controller = makeCategoryController();

categoryRouter.get(
  '/',
  AuthMiddleware,
  PermissionMiddleware('menu', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

categoryRouter.post(
  '/',
  AuthMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  controller.create,
);

categoryRouter.patch(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

categoryRouter.delete(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

export { categoryRouter };
