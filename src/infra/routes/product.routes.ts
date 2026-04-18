import { Router } from 'express';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { PlanLimitsMiddleware } from '../middlewares/plan-limits.middleware';
import { makeProductController } from '../factories/product.factory';

const productRouter: Router = Router();
const controller = makeProductController();

productRouter.get(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

productRouter.get(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'READ'),
  PlanExpirationMiddleware,
  controller.getById,
);

productRouter.post(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  PlanLimitsMiddleware('products'),
  controller.create,
);

productRouter.patch(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

productRouter.delete(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

export { productRouter };
