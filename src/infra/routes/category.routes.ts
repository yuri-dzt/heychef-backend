import { Router } from 'express';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { PlanLimitsMiddleware } from '../middlewares/plan-limits.middleware';
import { makeCategoryController } from '../factories/category.factory';

const categoryRouter: Router = Router();
const controller = makeCategoryController();

categoryRouter.get(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

categoryRouter.post(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  PlanLimitsMiddleware('categories'),
  controller.create,
);

categoryRouter.patch(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

categoryRouter.delete(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

export { categoryRouter };
