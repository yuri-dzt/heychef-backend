import { prisma } from '../../shared/prisma';
import { IOrderItemRepository } from '../../contracts/order-item';
import { OrderItemMapper } from '../../contracts/order-item';
import { OrderItem } from '../../domain/order-item';

export class PrismaOrderItemRepository implements IOrderItemRepository {
  async findById(organizationId: string, id: string): Promise<OrderItem | null> {
    const record = await prisma.orderItem.findFirst({
      where: { id, organization_id: organizationId },
    });

    if (!record) return null;

    return OrderItemMapper.toDomain(record);
  }

  async findAllByOrderId(organizationId: string, orderId: string): Promise<OrderItem[]> {
    const records = await prisma.orderItem.findMany({
      where: { order_id: orderId, organization_id: organizationId },
      orderBy: { created_at: 'asc' },
    });

    return records.map(OrderItemMapper.toDomain);
  }

  async createMany(organizationId: string, items: OrderItem[]): Promise<OrderItem[]> {
    const data = items.map(OrderItemMapper.toPrisma);

    await prisma.orderItem.createMany({ data });

    return items;
  }
}
