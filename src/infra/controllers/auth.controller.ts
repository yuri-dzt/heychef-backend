import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../app/auth/register.use-case';
import { LoginUseCase } from '../../app/auth/login.use-case';
import { GetMeUseCase } from '../../app/auth/get-me.use-case';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { prisma } from '../../shared/prisma';
import { createSession } from '../../shared/session';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private getMeUseCase: GetMeUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = registerSchema.parse(req.body);

      const user = await this.registerUseCase.execute({
        name: body.name,
        email: body.email,
        password: body.password,
        organizationName: body.organizationName,
      });

      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = loginSchema.parse(req.body);

      const result = await this.loginUseCase.execute({
        email: body.email,
        password: body.password,
        organizationId: body.organizationId,
      });

      try {
        const ua = req.headers['user-agent'];
        await createSession({
          userId: result.user.id,
          organizationId: result.user.organizationId,
          userType: 'user',
          token: result.refreshToken,
          deviceInfo: Array.isArray(ua) ? ua[0] : ua,
          ipAddress: req.ip || req.socket.remoteAddress || undefined,
        });
      } catch {
        // Session creation failure should not block login
      }

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.type === 'admin') {
        const admin = await prisma.admin.findUnique({ where: { id: req.user!.id } });
        if (!admin) {
          res.status(404).json({ message: 'Admin not found' });
          return;
        }
        res.status(200).json({ data: { id: admin.id, name: admin.name, email: admin.email } });
        return;
      }

      const user = await this.getMeUseCase.execute({
        userId: req.user!.id,
        organizationId: req.user!.organizationId!,
      });

      // Load user permissions (pages + actions)
      const permissions = await prisma.userPermission.findMany({
        where: { user_id: req.user!.id },
        include: { page: true },
      });

      const permissionMap: Record<string, string[]> = {};
      for (const p of permissions) {
        if (!permissionMap[p.page.name]) {
          permissionMap[p.page.name] = [];
        }
        permissionMap[p.page.name].push(p.action);
      }

      // Determine onboarding status
      const categoryCount = await prisma.category.count({ where: { organization_id: req.user!.organizationId! } });
      const tableCount = await prisma.table.count({ where: { organization_id: req.user!.organizationId! } });
      const onboardingComplete = categoryCount > 0 && tableCount > 0;

      res.status(200).json({
        data: {
          ...user,
          permissions: permissionMap,
          onboardingComplete,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
