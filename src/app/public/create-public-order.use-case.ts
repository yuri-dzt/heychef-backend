import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../shared/prisma';
import { IOrderRepository } from '../../contracts/order';
import { OrderMapper } from '../../contracts/order';
import { OrderDTO } from '../../contracts/order/dto';
import { IOrderItemRepository } from '../../contracts/order-item';
import { OrderItemMapper } from '../../contracts/order-item';
import { IOrderItemAddonRepository } from '../../contracts/order-item-addon';
import { OrderItemAddonMapper } from '../../contracts/order-item-addon';
import { Order, OrderStatus } from '../../domain/order';
import { OrderItem } from '../../domain/order-item';
import { OrderItemAddon } from '../../domain/order-item-addon';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { orderEvents } from '../../infra/events/order-events';

interface OrderItemInput {
  productId: string;
  quantity: number;
  addonItemIds?: string[];
}

interface CreatePublicOrderInput {
  tableToken: string;
  customerName?: string;
  notes?: string;
  items: OrderItemInput[];
}

export class CreatePublicOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private orderItemRepository: IOrderItemRepository,
    private orderItemAddonRepository: IOrderItemAddonRepository,
  ) {}

  async execute(input: CreatePublicOrderInput): Promise<OrderDTO> {
    const table = await prisma.table.findFirst({
      where: { qr_code_token: input.tableToken },
    });

    if (!table) {
      throw new NotFoundError('Table');
    }

    if (!table.active) {
      throw new ValidationError('Table is not active');
    }

    const organizationId = table.organization_id;

    if (!input.items || input.items.length === 0) {
      throw new ValidationError('Order must have at least one item');
    }

    const productIds = [...new Set(input.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        organization_id: organizationId,
      },
    });

    if (products.length !== productIds.length) {
      throw new ValidationError('One or more products not found');
    }

    for (const product of products) {
      if (!product.active) {
        throw new ValidationError(`Product "${product.name}" is not active`);
      }
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const allAddonItemIds: string[] = [];
    for (const item of input.items) {
      if (item.addonItemIds && item.addonItemIds.length > 0) {
        allAddonItemIds.push(...item.addonItemIds);
      }
    }

    const addonItems = allAddonItemIds.length > 0
      ? await prisma.productAddonItem.findMany({
          where: {
            id: { in: allAddonItemIds },
            organization_id: organizationId,
          },
          include: {
            addon_group: true,
          },
        })
      : [];

    const addonItemMap = new Map(addonItems.map((a) => [a.id, a]));

    if (addonItems.length !== new Set(allAddonItemIds).size) {
      throw new ValidationError('One or more addon items not found');
    }

    for (const item of input.items) {
      if (!item.addonItemIds || item.addonItemIds.length === 0) continue;

      const product = productMap.get(item.productId)!;
      const itemAddonIds = item.addonItemIds;

      const addonsByGroup = new Map<string, string[]>();
      for (const addonId of itemAddonIds) {
        const addon = addonItemMap.get(addonId)!;
        if (addon.addon_group.product_id !== product.id) {
          throw new ValidationError(
            `Addon item "${addon.name}" does not belong to product "${product.name}"`,
          );
        }
        const groupId = addon.addon_group_id;
        if (!addonsByGroup.has(groupId)) {
          addonsByGroup.set(groupId, []);
        }
        addonsByGroup.get(groupId)!.push(addonId);
      }

      for (const [groupId, ids] of addonsByGroup) {
        const group = addonItems.find((a) => a.addon_group_id === groupId)!.addon_group;
        if (ids.length < group.min_select) {
          throw new ValidationError(
            `Addon group "${group.name}" requires at least ${group.min_select} selections`,
          );
        }
        if (ids.length > group.max_select) {
          throw new ValidationError(
            `Addon group "${group.name}" allows at most ${group.max_select} selections`,
          );
        }
      }
    }

    const now = Date.now();

    // Build new items and addons
    const newItemsDomain: OrderItem[] = [];
    const newAddonsDomain: OrderItemAddon[] = [];
    let newItemsTotalCents = 0;

    for (const item of input.items) {
      const product = productMap.get(item.productId)!;
      const orderItemId = uuidv4();

      let addonsTotalCents = 0;
      if (item.addonItemIds && item.addonItemIds.length > 0) {
        for (const addonId of item.addonItemIds) {
          const addon = addonItemMap.get(addonId)!;
          addonsTotalCents += addon.price_cents;

          newAddonsDomain.push(
            new OrderItemAddon({
              id: uuidv4(),
              organizationId,
              orderItemId,
              addonItemId: addon.id,
              priceCents: addon.price_cents,
              createdAt: now,
            }),
          );
        }
      }

      const unitPriceCents = product.price_cents + addonsTotalCents;
      const totalPriceCents = unitPriceCents * item.quantity;

      newItemsDomain.push(
        new OrderItem({
          id: orderItemId,
          organizationId,
          orderId: '', // will be set below
          productId: product.id,
          quantity: item.quantity,
          unitPriceCents,
          totalPriceCents,
          createdAt: now,
        }),
      );

      newItemsTotalCents += totalPriceCents;
    }

    // Check if there's an existing open order for this table
    const existingOrder = await prisma.order.findFirst({
      where: {
        organization_id: organizationId,
        table_id: table.id,
        status: { in: ['RECEIVED', 'PREPARING'] },
      },
      orderBy: { created_at: 'desc' },
    });

    let finalOrderId: string;
    let isNewOrder: boolean;

    if (existingOrder) {
      // Add items to existing order
      finalOrderId = existingOrder.id;
      isNewOrder = false;

      // Update items with correct orderId
      for (const item of newItemsDomain) {
        (item as any).orderId = finalOrderId;
      }

      await this.orderItemRepository.createMany(organizationId, newItemsDomain);
      if (newAddonsDomain.length > 0) {
        await this.orderItemAddonRepository.createMany(organizationId, newAddonsDomain);
      }

      // Update order total and notes
      const newTotal = existingOrder.total_cents + newItemsTotalCents;
      const updatedNotes = [existingOrder.notes, input.notes].filter(Boolean).join(' | ');
      const updatedCustomerName = [existingOrder.customer_name, input.customerName].filter(Boolean).join(', ');

      await prisma.order.update({
        where: { id: finalOrderId },
        data: {
          total_cents: newTotal,
          notes: updatedNotes || null,
          customer_name: updatedCustomerName || null,
          updated_at: BigInt(now),
        },
      });
    } else {
      // Create new order
      finalOrderId = uuidv4();
      isNewOrder = true;

      for (const item of newItemsDomain) {
        (item as any).orderId = finalOrderId;
      }

      const order = new Order({
        id: finalOrderId,
        organizationId,
        tableId: table.id,
        status: OrderStatus.RECEIVED,
        customerName: input.customerName,
        notes: input.notes,
        totalCents: newItemsTotalCents,
        createdAt: now,
      });

      await this.orderRepository.create(organizationId, order);
      await this.orderItemRepository.createMany(organizationId, newItemsDomain);
      if (newAddonsDomain.length > 0) {
        await this.orderItemAddonRepository.createMany(organizationId, newAddonsDomain);
      }
    }

    // Fetch complete order with all items for the response
    const fullOrder = await prisma.order.findUnique({
      where: { id: finalOrderId },
      include: {
        items: {
          include: {
            product: true,
            addons: { include: { addon_item: true } },
          },
        },
      },
    });

    const dto: OrderDTO = {
      id: fullOrder!.id,
      organizationId: fullOrder!.organization_id,
      tableId: fullOrder!.table_id,
      status: fullOrder!.status as string as OrderStatus,
      customerName: fullOrder!.customer_name ?? undefined,
      notes: fullOrder!.notes ?? undefined,
      totalCents: fullOrder!.total_cents,
      createdAt: Number(fullOrder!.created_at),
      updatedAt: fullOrder!.updated_at ? Number(fullOrder!.updated_at) : undefined,
      items: fullOrder!.items.map((i) => ({
        id: i.id,
        organizationId: i.organization_id,
        orderId: i.order_id,
        productId: i.product_id,
        quantity: i.quantity,
        unitPriceCents: i.unit_price_cents,
        totalPriceCents: i.total_price_cents,
        createdAt: Number(i.created_at),
      })),
    };

    if (isNewOrder) {
      orderEvents.emitNewOrder(dto);
    } else {
      orderEvents.emitStatusChange(dto);
    }

    return dto;
  }
}
