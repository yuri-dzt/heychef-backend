import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { makeProductController } from '../factories/product.factory';

const productRouter = Router();
const controller = makeProductController();

productRouter.get(
  '/',
  AuthMiddleware,
  PermissionMiddleware('menu', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

productRouter.get(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'READ'),
  PlanExpirationMiddleware,
  controller.getById,
);

productRouter.post(
  '/',
  AuthMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  controller.create,
);

productRouter.patch(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

productRouter.delete(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

export { productRouter };
