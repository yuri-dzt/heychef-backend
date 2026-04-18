import { Router } from 'express';
import { PlanController } from '../controllers/plan.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const planRouter: Router = Router();
const controller = new PlanController();

planRouter.get('/', AuthMiddleware, controller.list);
planRouter.post('/', AuthMiddleware, controller.create);
planRouter.patch('/assign', AuthMiddleware, controller.assignToOrg);
planRouter.get('/:id', AuthMiddleware, controller.getById);
planRouter.patch('/:id', AuthMiddleware, controller.update);
planRouter.delete('/:id', AuthMiddleware, controller.delete);

export { planRouter };
