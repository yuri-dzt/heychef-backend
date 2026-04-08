import { Request, Response, NextFunction } from 'express';
import { GetPublicMenuUseCase } from '../../app/public/get-menu.use-case';
import { CreatePublicOrderUseCase } from '../../app/public/create-public-order.use-case';
import { tableTokenParamsSchema, createPublicOrderSchema } from '../schemas/public.schema';
import { prisma } from '../../shared/prisma';
import { orderEvents } from '../events/order-events';
import { OrderStatus } from '../../domain/order';

export class PublicController {
  constructor(
    private getPublicMenuUseCase: GetPublicMenuUseCase,
    private createPublicOrderUseCase: CreatePublicOrderUseCase,
  ) {}

  getMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = tableTokenParamsSchema.parse(req.params);

      const menu = await this.getPublicMenuUseCase.execute({
        tableToken: params.tableToken,
      });

      res.status(200).json({ data: menu });
    } catch (error) {
      next(error);
    }
  };

  subscribeEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = tableTokenParamsSchema.parse(req.params);

      const table = await prisma.table.findFirst({
        where: { qr_code_token: params.tableToken },
      });

      if (!table) {
        res.status(404).json({ message: 'Table not found' });
        return;
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      orderEvents.subscribeTable(table.id, res);

      req.on('close', () => {
        orderEvents.unsubscribeTable(table.id, res);
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = tableTokenParamsSchema.parse(req.params);

      const table = await prisma.table.findFirst({
        where: { qr_code_token: params.tableToken },
      });

      if (!table) {
        res.status(200).json({ data: null });
        return;
      }

      const order = await prisma.order.findFirst({
        where: {
          table_id: table.id,
          organization_id: table.organization_id,
          status: { in: ['RECEIVED', 'PREPARING'] },
        },
        orderBy: { created_at: 'desc' },
        include: {
          items: {
            include: {
              product: true,
              addons: { include: { addon_item: true } },
            },
          },
        },
      });

      if (!order) {
        res.status(200).json({ data: null });
        return;
      }

      const data = {
        id: order.id,
        status: order.status,
        customerName: order.customer_name,
        notes: order.notes,
        totalCents: order.total_cents,
        createdAt: Number(order.created_at),
        items: order.items.map((i) => ({
          id: i.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPriceCents: i.unit_price_cents,
          totalPriceCents: i.total_price_cents,
          notes: (i as any).notes ?? undefined,
          status: (i as any).status,
          addons: i.addons.map((a) => ({
            id: a.id,
            name: a.addon_item.name,
            priceCents: a.price_cents,
          })),
        })),
      };

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = tableTokenParamsSchema.parse(req.params);
      const body = createPublicOrderSchema.parse(req.body);

      const order = await this.createPublicOrderUseCase.execute({
        tableToken: params.tableToken,
        customerName: body.customerName,
        notes: body.notes,
        items: body.items,
      });

      res.status(201).json({ data: order });
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tableToken = req.params.tableToken as string;
      const itemId = req.params.itemId as string;

      const table = await prisma.table.findFirst({
        where: { qr_code_token: tableToken },
      });

      if (!table) {
        res.status(404).json({ message: 'Table not found' });
        return;
      }

      const order = await prisma.order.findFirst({
        where: {
          table_id: table.id,
          organization_id: table.organization_id,
          status: { in: ['RECEIVED', 'PREPARING'] },
        },
        orderBy: { created_at: 'desc' },
      });

      if (!order) {
        res.status(404).json({ message: 'No active order found' });
        return;
      }

      const item = await prisma.orderItem.findUnique({
        where: { id: itemId },
      });

      if (!item || item.order_id !== order.id) {
        res.status(404).json({ message: 'Order item not found' });
        return;
      }

      const result = await prisma.$transaction(async (tx) => {
        await tx.orderItemAddon.deleteMany({ where: { order_item_id: itemId } });
        await tx.orderItem.delete({ where: { id: itemId } });

        const remainingItems = await tx.orderItem.findMany({
          where: { order_id: order.id },
          include: {
            product: true,
            addons: { include: { addon_item: true } },
          },
        });

        if (remainingItems.length === 0) {
          await tx.order.delete({ where: { id: order.id } });
          return { deleted: true, remainingItems, updatedOrder: null };
        }

        const newTotal = remainingItems.reduce((sum, i) => sum + i.total_price_cents, 0);

        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            total_cents: newTotal,
            updated_at: BigInt(Date.now()),
          },
        });

        return { deleted: false, remainingItems, updatedOrder };
      });

      if (result.deleted) {
        orderEvents.emitStatusChange({
          id: order.id,
          organizationId: order.organization_id,
          tableId: order.table_id,
          status: 'CANCELED' as OrderStatus,
          customerName: order.customer_name ?? undefined,
          notes: order.notes ?? undefined,
          totalCents: 0,
          cancelReason: 'All items removed',
          createdAt: Number(order.created_at),
          updatedAt: Number(Date.now()),
        });

        res.status(200).json({ data: null });
        return;
      }

      const updatedOrder = result.updatedOrder!;
      const remainingItems = result.remainingItems;

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

      const data = {
        id: updatedOrder.id,
        status: updatedOrder.status,
        customerName: updatedOrder.customer_name,
        notes: updatedOrder.notes,
        totalCents: updatedOrder.total_cents,
        createdAt: Number(updatedOrder.created_at),
        items: remainingItems.map((i) => ({
          id: i.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPriceCents: i.unit_price_cents,
          totalPriceCents: i.total_price_cents,
          notes: (i as any).notes ?? undefined,
          status: (i as any).status,
          addons: i.addons.map((a) => ({
            id: a.id,
            name: a.addon_item.name,
            priceCents: a.price_cents,
          })),
        })),
      };

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };
}
