import { Request, Response, NextFunction } from 'express';
import { CreateCallUseCase } from '../../app/call-waiter/create-call.use-case';
import { ListCallsUseCase } from '../../app/call-waiter/list-calls.use-case';
import { ResolveCallUseCase } from '../../app/call-waiter/resolve-call.use-case';
import {
  callWaiterParamsSchema,
  callWaiterQuerySchema,
  callWaiterTokenParamsSchema,
} from '../schemas/call-waiter.schema';
import { CallWaiterStatus } from '../../domain/call-waiter-event';
import { prisma } from '../../shared/prisma';

export class CallWaiterController {
  constructor(
    private createCallUseCase: CreateCallUseCase,
    private listCallsUseCase: ListCallsUseCase,
    private resolveCallUseCase: ResolveCallUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = callWaiterTokenParamsSchema.parse(req.params);

      const call = await this.createCallUseCase.execute({
        tableToken: params.tableToken,
      });

      res.status(201).json({ data: call });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = callWaiterQuerySchema.parse(req.query);
      const organizationId = req.user!.organizationId!;

      const where: Record<string, unknown> = { organization_id: organizationId };
      if (query.status) {
        where.status = query.status;
      }

      const records = await prisma.callWaiterEvent.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: { table: true },
      });

      const data = records.map((r) => ({
        id: r.id,
        organizationId: r.organization_id,
        tableId: r.table_id,
        tableName: r.table.name,
        status: r.status,
        createdAt: Number(r.created_at),
        resolvedAt: r.resolved_at ? Number(r.resolved_at) : undefined,
      }));

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  resolve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = callWaiterParamsSchema.parse(req.params);

      const call = await this.resolveCallUseCase.execute({
        organizationId: req.user!.organizationId!,
        callId: params.id,
      });

      res.status(200).json({ data: call });
    } catch (error) {
      next(error);
    }
  };
}
