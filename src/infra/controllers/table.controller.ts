import { Request, Response, NextFunction } from 'express';
import { ListTablesUseCase } from '../../app/table/list-tables.use-case';
import { CreateTableUseCase } from '../../app/table/create-table.use-case';
import { UpdateTableUseCase } from '../../app/table/update-table.use-case';
import { DeleteTableUseCase } from '../../app/table/delete-table.use-case';
import { RegenerateTokenUseCase } from '../../app/table/regenerate-token.use-case';
import { createTableSchema, updateTableSchema } from '../schemas/table.schema';
import { ValidationError } from '../../shared/errors';
import { prisma } from '../../shared/prisma';
import { logAudit } from '../../shared/audit';

export class TableController {
  constructor(
    private listTablesUseCase: ListTablesUseCase,
    private createTableUseCase: CreateTableUseCase,
    private updateTableUseCase: UpdateTableUseCase,
    private deleteTableUseCase: DeleteTableUseCase,
    private regenerateTokenUseCase: RegenerateTokenUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId!;
      const data = await this.listTablesUseCase.execute({ organizationId });
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createTableSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId!;
      const data = await this.createTableUseCase.execute({
        organizationId,
        name: parsed.data.name,
      });

      const userName = (await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } }))?.name || 'Sistema';
      await logAudit({
        organizationId,
        userId: req.user!.id,
        userName,
        action: 'CREATE',
        entity: 'table',
        entityId: data.id,
        details: `Created table ${parsed.data.name}`,
        ipAddress: req.ip || undefined,
      });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateTableSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId!;
      const data = await this.updateTableUseCase.execute({
        organizationId,
        tableId: req.params.id as string,
        name: parsed.data.name,
        active: parsed.data.active,
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId!;
      await this.deleteTableUseCase.execute({
        organizationId,
        tableId: req.params.id as string,
      });

      const userName = (await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } }))?.name || 'Sistema';
      await logAudit({
        organizationId,
        userId: req.user!.id,
        userName,
        action: 'DELETE',
        entity: 'table',
        entityId: req.params.id as string,
        details: `Deleted table ${req.params.id}`,
        ipAddress: req.ip || undefined,
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };

  regenerateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId!;
      const data = await this.regenerateTokenUseCase.execute({
        organizationId,
        tableId: req.params.id as string,
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };
}
