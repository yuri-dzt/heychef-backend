import { Router } from 'express';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { makeEventController } from '../factories/event.factory';

const eventRouter = Router();
const controller = makeEventController();

eventRouter.get(
  '/orders',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  controller.subscribeOrders,
);

export { eventRouter };
