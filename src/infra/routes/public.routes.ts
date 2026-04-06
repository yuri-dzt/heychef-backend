import { Router } from 'express';
import { makePublicController } from '../factories/public.factory';

const publicRouter = Router();
const controller = makePublicController();

publicRouter.get('/menu/:tableToken', controller.getMenu);
publicRouter.get('/order/:tableToken', controller.getActiveOrder);
publicRouter.post('/orders/:tableToken', controller.createOrder);
publicRouter.delete('/order/:tableToken/items/:itemId', controller.removeItem);

export { publicRouter };
