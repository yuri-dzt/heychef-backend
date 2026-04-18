import { Router } from 'express';
import { AdminSetupController } from '../controllers/admin-setup.controller';

const router: Router = Router();
const controller = new AdminSetupController();

router.post('/', controller.setup);

export { router as adminSetupRoutes };
