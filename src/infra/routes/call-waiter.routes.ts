import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';
import { makeCallWaiterController } from '../factories/call-waiter.factory';

const publicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});

const callWaiterRouter: Router = Router();
const controller = makeCallWaiterController();

callWaiterRouter.post(
  '/public/call-waiter/:tableToken',
  publicRateLimiter,
  controller.create,
);

callWaiterRouter.get(
  '/waiter-calls',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('orders', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

callWaiterRouter.patch(
  '/waiter-calls/:id/resolve',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('orders', 'UPDATE'),
  PlanExpirationMiddleware,
  controller.resolve,
);

export { callWaiterRouter };
