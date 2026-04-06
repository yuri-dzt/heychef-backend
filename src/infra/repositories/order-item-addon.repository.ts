import { prisma } from '../../shared/prisma';
import { IOrderItemAddonRepository } from '../../contracts/order-item-addon';
import { OrderItemAddonMapper } from '../../contracts/order-item-addon';
import { OrderItemAddon } from '../../domain/order-item-addon';

export class PrismaOrderItemAddonRepository implements IOrderItemAddonRepository {
  async findById(organizationId: string, id: string): Promise<OrderItemAddon | null> {
    const record = await prisma.orderItemAddon.findFirst({
      where: { id, organization_id: organizationId },
    });

    if (!record) return null;

    return OrderItemAddonMapper.toDomain(record);
  }

  async findAllByOrderItemId(organizationId: string, orderItemId: string): Promise<OrderItemAddon[]> {
    const records = await prisma.orderItemAddon.findMany({
      where: { order_item_id: orderItemId, organization_id: organizationId },
      orderBy: { created_at: 'asc' },
    });

    return records.map(OrderItemAddonMapper.toDomain);
  }

  async createMany(organizationId: string, addons: OrderItemAddon[]): Promise<OrderItemAddon[]> {
    const data = addons.map(OrderItemAddonMapper.toPrisma);

    await prisma.orderItemAddon.createMany({ data });

    return addons;
  }
}
