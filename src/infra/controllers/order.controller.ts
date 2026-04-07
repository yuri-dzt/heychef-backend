import { Request, Response, NextFunction } from 'express';
import { ListOrdersUseCase } from '../../app/order/list-orders.use-case';
import { GetOrderUseCase } from '../../app/order/get-order.use-case';
import { UpdateOrderStatusUseCase } from '../../app/order/update-order-status.use-case';
import { CancelOrderUseCase } from '../../app/order/cancel-order.use-case';
import {
  orderParamsSchema,
  orderQuerySchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
} from '../schemas/order.schema';
import { OrderStatus } from '../../domain/order';
import { prisma } from '../../shared/prisma';
import { orderEvents } from '../events/order-events';
import { paginationSchema, getPaginationParams } from '../../shared/pagination';
import { logAudit } from '../../shared/audit';

export class OrderController {
  constructor(
    private listOrdersUseCase: ListOrdersUseCase,
    private getOrderUseCase: GetOrderUseCase,
    private updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = orderQuerySchema.parse(req.query);
      const pagination = paginationSchema.parse(req.query);
      const { skip, take, page, limit } = getPaginationParams(pagination);
      const organizationId = req.user!.organizationId!;

      const where: Record<string, unknown> = { organization_id: organizationId };
      if (query.status) {
        where.status = query.status;
      }

      const [records, total] = await Promise.all([
        prisma.order.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip,
          take,
          include: {
            table: true,
            items: {
              include: {
                product: true,
                addons: {
                  include: { addon_item: true },
                },
              },
            },
          },
        }),
        prisma.order.count({ where }),
      ]);

      const data = records.map((r) => ({
        id: r.id,
        organizationId: r.organization_id,
        tableId: r.table_id,
        status: r.status,
        customerName: r.customer_name ?? undefined,
        notes: r.notes ?? undefined,
        totalCents: r.total_cents,
        cancelReason: r.cancel_reason ?? undefined,
        createdAt: Number(r.created_at),
        updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
        table: {
          id: r.table.id,
          name: r.table.name,
        },
        items: r.items.map((i) => ({
          id: i.id,
          productId: i.product_id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPriceCents: i.unit_price_cents,
          totalPriceCents: i.total_price_cents,
          status: (i as any).status,
          addons: i.addons.map((a) => ({
            id: a.id,
            name: a.addon_item.name,
            priceCents: a.price_cents,
          })),
        })),
      }));

      res.status(200).json({ data, total, page, limit });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = orderParamsSchema.parse(req.params);

      const order = await this.getOrderUseCase.execute({
        organizationId: req.user!.organizationId!,
        orderId: params.id,
      });

      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = orderParamsSchema.parse(req.params);
      const body = updateOrderStatusSchema.parse(req.body);

      const order = await this.updateOrderStatusUseCase.execute({
        organizationId: req.user!.organizationId!,
        orderId: params.id,
        status: body.status as OrderStatus,
      });

      const userName = (await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } }))?.name || 'Sistema';
      await logAudit({
        organizationId: req.user!.organizationId!,
        userId: req.user!.id,
        userName,
        action: 'STATUS_CHANGE',
        entity: 'order',
        entityId: params.id,
        details: `Status changed to ${body.status}`,
        ipAddress: req.ip || undefined,
      });

      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = orderParamsSchema.parse(req.params);
      const body = cancelOrderSchema.parse(req.body);

      const order = await this.cancelOrderUseCase.execute({
        organizationId: req.user!.organizationId!,
        orderId: params.id,
        reason: body.reason,
      });

      const userName = (await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } }))?.name || 'Sistema';
      await logAudit({
        organizationId: req.user!.organizationId!,
        userId: req.user!.id,
        userName,
        action: 'DELETE',
        entity: 'order',
        entityId: params.id,
        details: 'Order cancelled',
        ipAddress: req.ip || undefined,
      });

      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  };

  updateItemStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const itemId = req.params.itemId as string;
      const { status } = req.body;
      const organizationId = req.user!.organizationId!;

      const validStatuses = ['PENDING', 'PREPARING', 'READY'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: 'Invalid status. Must be one of: PENDING, PREPARING, READY' });
        return;
      }

      const item = await (prisma.orderItem as any).findUnique({
        where: { id: itemId },
        include: { order: true },
      });

      if (!item || item.order.organization_id !== organizationId) {
        res.status(404).json({ message: 'Order item not found' });
        return;
      }

      const updatedItem = await (prisma.orderItem as any).update({
        where: { id: itemId },
        data: { status },
      });

      const order = await prisma.order.findUnique({
        where: { id: item.order_id },
        include: { table: true },
      });

      if (order) {
        orderEvents.emitStatusChange({
          id: order.id,
          organizationId: order.organization_id,
          tableId: order.table_id,
          status: order.status as OrderStatus,
          customerName: order.customer_name ?? undefined,
          notes: order.notes ?? undefined,
          totalCents: order.total_cents,
          cancelReason: order.cancel_reason ?? undefined,
          createdAt: Number(order.created_at),
          updatedAt: order.updated_at ? Number(order.updated_at) : undefined,
        });
      }

      res.status(200).json({
        data: {
          id: updatedItem.id,
          orderId: updatedItem.order_id,
          productId: updatedItem.product_id,
          quantity: updatedItem.quantity,
          unitPriceCents: updatedItem.unit_price_cents,
          totalPriceCents: updatedItem.total_price_cents,
          status: updatedItem.status,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const itemId = req.params.itemId as string;
      const organizationId = req.user!.organizationId!;

      const item = await (prisma.orderItem as any).findUnique({
        where: { id: itemId },
        include: { order: true },
      });

      if (!item || item.order.organization_id !== organizationId) {
        res.status(404).json({ message: 'Order item not found' });
        return;
      }

      await prisma.orderItemAddon.deleteMany({ where: { order_item_id: itemId } });
      await prisma.orderItem.delete({ where: { id: itemId } });

      const remainingItems = await prisma.orderItem.findMany({
        where: { order_id: item.order_id },
      });

      if (remainingItems.length === 0) {
        await prisma.order.delete({ where: { id: item.order_id } });

        orderEvents.emitStatusChange({
          id: item.order.id,
          organizationId: item.order.organization_id,
          tableId: item.order.table_id,
          status: 'CANCELED' as OrderStatus,
          customerName: item.order.customer_name ?? undefined,
          notes: item.order.notes ?? undefined,
          totalCents: 0,
          cancelReason: 'All items removed',
          createdAt: Number(item.order.created_at),
          updatedAt: Number(Date.now()),
        });
      } else {
        const newTotal = remainingItems.reduce((sum, i) => sum + i.total_price_cents, 0);

        const updatedOrder = await prisma.order.update({
          where: { id: item.order_id },
          data: {
            total_cents: newTotal,
            updated_at: BigInt(Date.now()),
          },
        });

        orderEvents.emitStatusChange({
          id: updatedOrder.id,
          organizationId: updatedOrder.organization_id,
          tableId: updatedOrder.table_id,
          status: updatedOrder.status as OrderStatus,
          customerName: updatedOrder.customer_name ?? undefined,
          notes: updatedOrder.notes ?? undefined,
          totalCents: updatedOrder.total_cents,
          cancelReason: updatedOrder.cancel_reason ?? undefined,
          createdAt: Number(updatedOrder.created_at),
          updatedAt: updatedOrder.updated_at ? Number(updatedOrder.updated_at) : undefined,
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
