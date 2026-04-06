import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { makeCallWaiterController } from '../factories/call-waiter.factory';

const callWaiterRouter = Router();
const controller = makeCallWaiterController();

callWaiterRouter.post(
  '/public/call-waiter/:tableToken',
  controller.create,
);

callWaiterRouter.get(
  '/waiter-calls',
  AuthMiddleware,
  PermissionMiddleware('orders', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

callWaiterRouter.patch(
  '/waiter-calls/:id/resolve',
  AuthMiddleware,
  PermissionMiddleware('orders', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.resolve,
);

export { callWaiterRouter };
