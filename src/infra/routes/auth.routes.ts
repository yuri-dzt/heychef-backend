import { Router } from 'express';
import { makeAuthController } from '../factories/auth.factory';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';

const router: Router = Router();
const controller = makeAuthController();

router.post('/register', authRateLimiter, controller.register);
router.post('/login', authRateLimiter, controller.login);
router.get('/me', AuthMiddleware, controller.getMe);
router.patch('/change-password', AuthMiddleware, controller.changePassword);

export { router as authRoutes };
