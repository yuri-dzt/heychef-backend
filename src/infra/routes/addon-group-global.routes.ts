import { Router } from 'express';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { AddonGroupGlobalController } from '../controllers/addon-group-global.controller';

const addonGroupGlobalRouter: Router = Router();
const controller = new AddonGroupGlobalController();

addonGroupGlobalRouter.get(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

addonGroupGlobalRouter.post(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  controller.create,
);

addonGroupGlobalRouter.patch(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

addonGroupGlobalRouter.delete(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

addonGroupGlobalRouter.post(
  '/:groupId/items',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  controller.createItem,
);

addonGroupGlobalRouter.patch(
  '/items/:itemId',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.updateItem,
);

addonGroupGlobalRouter.delete(
  '/items/:itemId',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  controller.deleteItem,
);

addonGroupGlobalRouter.post(
  '/:groupId/link',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'CREATE'),
  PlanExpirationMiddleware,
  controller.linkToProduct,
);

addonGroupGlobalRouter.delete(
  '/:groupId/link/:productId',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('menu', 'DELETE'),
  PlanExpirationMiddleware,
  controller.unlinkFromProduct,
);

export { addonGroupGlobalRouter };
