import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { makeOrderController } from '../factories/order.factory';

const orderRouter = Router();
const controller = makeOrderController();

orderRouter.get(
  '/',
  AuthMiddleware,
  PermissionMiddleware('orders', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

orderRouter.get(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('orders', 'READ'),
  PlanExpirationMiddleware,
  controller.get,
);

orderRouter.patch(
  '/:id/status',
  AuthMiddleware,
  PermissionMiddleware('orders', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.updateStatus,
);

orderRouter.patch(
  '/:id/cancel',
  AuthMiddleware,
  PermissionMiddleware('orders', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.cancel,
);

orderRouter.patch(
  '/items/:itemId/status',
  AuthMiddleware,
  PermissionMiddleware('orders', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.updateItemStatus,
);

orderRouter.delete(
  '/items/:itemId',
  AuthMiddleware,
  PermissionMiddleware('orders', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.removeItem,
);

export { orderRouter };
