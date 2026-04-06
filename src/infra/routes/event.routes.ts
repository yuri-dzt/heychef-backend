import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { makeEventController } from '../factories/event.factory';

const eventRouter = Router();
const controller = makeEventController();

eventRouter.get(
  '/orders',
  AuthMiddleware,
  controller.subscribeOrders,
);

export { eventRouter };
