import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/prisma';
import { paginationSchema, getPaginationParams } from '../../shared/pagination';

export class AuditController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId!;
      const pagination = paginationSchema.parse(req.query);
      const { skip, take, page, limit } = getPaginationParams(pagination);

      const where = { organization_id: organizationId };

      const [records, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip,
          take,
        }),
        prisma.auditLog.count({ where }),
      ]);

      const data = records.map((r) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        action: r.action,
        entity: r.entity,
        entityId: r.entity_id,
        details: r.details,
        ipAddress: r.ip_address,
        createdAt: Number(r.created_at),
      }));

      res.status(200).json({ data, total, page, limit });
    } catch (error) {
      next(error);
    }
  };
}
