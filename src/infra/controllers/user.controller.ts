import { Request, Response, NextFunction } from 'express';
import { ListUsersUseCase } from '../../app/user/list-users.use-case';
import { CreateUserUseCase } from '../../app/user/create-user.use-case';
import { UpdateUserUseCase } from '../../app/user/update-user.use-case';
import { DeleteUserUseCase } from '../../app/user/delete-user.use-case';
import { createUserSchema, updateUserSchema, userParamsSchema } from '../schemas/user.schema';
import { prisma } from '../../shared/prisma';
import { logAudit } from '../../shared/audit';

export class UserController {
  constructor(
    private listUsersUseCase: ListUsersUseCase,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.listUsersUseCase.execute({
        organizationId: req.user!.organizationId!,
      });

      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = createUserSchema.parse(req.body);

      const user = await this.createUserUseCase.execute({
        organizationId: req.user!.organizationId!,
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
      });

      const userName = (await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } }))?.name || 'Sistema';
      await logAudit({
        organizationId: req.user!.organizationId!,
        userId: req.user!.id,
        userName,
        action: 'CREATE',
        entity: 'user',
        entityId: user.id,
        details: `Created user ${body.name} (${body.email})`,
        ipAddress: req.ip || undefined,
      });

      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = userParamsSchema.parse(req.params);
      const body = updateUserSchema.parse(req.body);

      const user = await this.updateUserUseCase.execute({
        organizationId: req.user!.organizationId!,
        userId: params.id,
        ...body,
      });

      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = userParamsSchema.parse(req.params);

      await this.deleteUserUseCase.execute({
        organizationId: req.user!.organizationId!,
        userId: params.id,
      });

      const userName = (await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } }))?.name || 'Sistema';
      await logAudit({
        organizationId: req.user!.organizationId!,
        userId: req.user!.id,
        userName,
        action: 'DELETE',
        entity: 'user',
        entityId: params.id,
        details: `Deleted user ${params.id}`,
        ipAddress: req.ip || undefined,
      });

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  };
}
