import { Router } from 'express';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { PlanLimitsMiddleware } from '../middlewares/plan-limits.middleware';
import { makeTableController } from '../factories/table.factory';

const tableRouter = Router();
const controller = makeTableController();

tableRouter.get(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('tables', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

tableRouter.post(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('tables', 'CREATE'),
  PlanExpirationMiddleware,
  PlanLimitsMiddleware('tables'),
  controller.create,
);

tableRouter.patch(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('tables', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

tableRouter.delete(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('tables', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

tableRouter.post(
  '/:id/regenerate-token',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('tables', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.regenerateToken,
);

export { tableRouter };
