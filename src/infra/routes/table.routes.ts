import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { makeTableController } from '../factories/table.factory';

const tableRouter = Router();
const controller = makeTableController();

tableRouter.get(
  '/',
  AuthMiddleware,
  PermissionMiddleware('tables', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

tableRouter.post(
  '/',
  AuthMiddleware,
  PermissionMiddleware('tables', 'CREATE'),
  PlanExpirationMiddleware,
  controller.create,
);

tableRouter.patch(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('tables', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

tableRouter.delete(
  '/:id',
  AuthMiddleware,
  PermissionMiddleware('tables', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

tableRouter.post(
  '/:id/regenerate-token',
  AuthMiddleware,
  PermissionMiddleware('tables', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.regenerateToken,
);

export { tableRouter };
