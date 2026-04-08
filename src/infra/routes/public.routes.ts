import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { makePublicController } from '../factories/public.factory';

const publicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});

const publicRouter = Router();
const controller = makePublicController();

publicRouter.get('/menu/:tableToken', controller.getMenu);
publicRouter.get('/order/:tableToken', controller.getActiveOrder);
publicRouter.get('/events/:tableToken', controller.subscribeEvents);
publicRouter.post('/orders/:tableToken', publicRateLimiter, controller.createOrder);
publicRouter.delete('/order/:tableToken/items/:itemId', controller.removeItem);

export { publicRouter };
