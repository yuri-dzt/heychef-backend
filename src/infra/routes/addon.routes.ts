import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { makeAddonGroupController } from '../factories/addon-group.factory';
import { makeAddonItemController } from '../factories/addon-item.factory';

const addonRouter = Router();
const groupController = makeAddonGroupController();
const itemController = makeAddonItemController();

addonRouter.post(
  '/products/:id/addon-groups',
  AuthMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  groupController.create,
);

addonRouter.post(
  '/addon-groups/:id/items',
  AuthMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  itemController.create,
);

addonRouter.patch(
  '/addon-groups/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  groupController.update,
);

addonRouter.patch(
  '/addon-items/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  itemController.update,
);

addonRouter.delete(
  '/addon-groups/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  groupController.delete,
);

addonRouter.delete(
  '/addon-items/:id',
  AuthMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  itemController.delete,
);

export { addonRouter };
