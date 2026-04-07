import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RestaurantOnlyMiddleware } from '../middlewares/auth.middleware';
import { PermissionMiddleware } from '../middlewares/permission.middleware';
import { PlanExpirationMiddleware } from '../middlewares/plan-expiration.middleware';

const auditRouter = Router();
const controller = new AuditController();

auditRouter.get(
  '/',
  AuthMiddleware,
  RestaurantOnlyMiddleware,
  PermissionMiddleware('reports', 'READ'),
  PlanExpirationMiddleware,
  controller.list,
);

export { auditRouter };
