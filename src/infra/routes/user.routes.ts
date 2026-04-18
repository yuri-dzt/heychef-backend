import { Router } from 'express';
import { makeUserController } from '../factories/user.factory';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { PlanLimitsMiddleware } from '../middlewares/plan-limits.middleware';

const router: Router = Router();
const controller = makeUserController();

router.get(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('users', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

router.post(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('users', 'CREATE'),
  PlanExpirationMiddleware,
  PlanLimitsMiddleware('users'),
  controller.create,
);

router.patch(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('users', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.update,
);

router.delete(
  '/:id',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('users', 'DELETE'),
  PlanExpirationMiddleware,
  controller.delete,
);

export { router as userRoutes };
