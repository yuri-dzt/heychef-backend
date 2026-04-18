import { Router } from 'express';
import { RefreshController } from '../controllers/refresh.controller';

const refreshRouter: Router = Router();
const controller = new RefreshController();

refreshRouter.post('/', controller.refresh);

export { refreshRouter };
