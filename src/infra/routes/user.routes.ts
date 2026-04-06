import { Router } from 'express';
import { makeUserController } from '../factories/user.factory';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';

const router = Router();
const controller = makeUserController();

router.get(
  '/',
  AuthMiddleware,
  PlanExpirationMiddleware,
  PermissionMiddleware('users', 'READ'),
  controller.list,
);

router.post(
  '/',
  AuthMiddleware,
  PlanExpirationMiddleware,
  PermissionMiddleware('users', 'CREATE'),
  controller.create,
);

router.patch(
  '/:id',
  AuthMiddleware,
  PlanExpirationMiddleware,
  PermissionMiddleware('users', 'UPDATE'),
  controller.update,
);

router.delete(
  '/:id',
  AuthMiddleware,
  PlanExpirationMiddleware,
  PermissionMiddleware('users', 'DELETE'),
  controller.delete,
);

export { router as userRoutes };
