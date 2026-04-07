import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const sessionRouter = Router();
const controller = new SessionController();

sessionRouter.get('/', AuthMiddleware, controller.list);
sessionRouter.delete('/:id', AuthMiddleware, controller.revoke);
sessionRouter.delete('/', AuthMiddleware, controller.revokeAll);

export { sessionRouter };
