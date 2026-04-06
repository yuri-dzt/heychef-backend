import { prisma } from '../../shared/prisma';
import { IOrderRepository } from '../../contracts/order';
import { OrderMapper } from '../../contracts/order';
import { Order, OrderStatus } from '../../domain/order';

export class PrismaOrderRepository implements IOrderRepository {
  async findById(organizationId: string, id: string): Promise<Order | null> {
    const record = await prisma.order.findFirst({
      where: { id, organization_id: organizationId },
      include: {
        items: {
          include: {
            addons: true,
          },
        },
      },
    });

    if (!record) return null;

    return OrderMapper.toDomain(record);
  }

  async findAllByOrg(organizationId: string, filters?: { status?: OrderStatus }): Promise<Order[]> {
    const where: Record<string, unknown> = { organization_id: organizationId };

    if (filters?.status) {
      where.status = filters.status;
    }

    const records = await prisma.order.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return records.map(OrderMapper.toDomain);
  }

  async create(organizationId: string, order: Order): Promise<Order> {
    const data = OrderMapper.toPrisma(order);

    const record = await prisma.order.create({ data });

    return OrderMapper.toDomain(record);
  }

  async updateStatus(organizationId: string, id: string, status: OrderStatus): Promise<Order> {
    const record = await prisma.order.update({
      where: { id },
      data: {
        status,
        updated_at: BigInt(Date.now()),
      },
    });

    return OrderMapper.toDomain(record);
  }

  async archiveOldOrders(organizationId: string, beforeTimestamp: number): Promise<number> {
    const result = await prisma.order.updateMany({
      where: {
        organization_id: organizationId,
        created_at: { lt: BigInt(beforeTimestamp) },
        status: { notIn: ['CANCELED', 'DELIVERED'] },
      },
      data: {
        status: 'CANCELED',
        updated_at: BigInt(Date.now()),
      },
    });

    return result.count;
  }
}
