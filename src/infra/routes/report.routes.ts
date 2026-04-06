import { Router } from 'express';
import { makeReportController } from '../factories/report.factory';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';

const router = Router();
const controller = makeReportController();

router.post(
  '/generate',
  AuthMiddleware,
  PlanExpirationMiddleware,
  PermissionMiddleware('reports', 'CREATE'),
  controller.generate,
);

router.get(
  '/daily',
  AuthMiddleware,
  PlanExpirationMiddleware,
  PermissionMiddleware('reports', 'READ'),
  controller.getDailyReports,
);

export { router as reportRoutes };
