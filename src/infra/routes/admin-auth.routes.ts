import { Router } from 'express';
import { AdminAuthController } from '../controllers/admin-auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();
const controller = new AdminAuthController();

router.post('/login', authRateLimiter, controller.login);
router.get('/me', AuthMiddleware, controller.getMe);

export { router as adminAuthRoutes };
