import { Router } from 'express';
import { makeReportController } from '../factories/report.factory';
import { AuthMiddleware, RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';

const router = Router();
const controller = makeReportController();

router.post(
  '/generate',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('reports', 'CREATE'),
  PlanExpirationMiddleware,
  controller.generate,
);

router.get(
  '/daily',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('reports', 'READ'),
  PlanExpirationMiddleware,
  controller.getDailyReports,
);

export { router as reportRoutes };
