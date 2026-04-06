import { OrderItemAddon } from "../../domain/order-item-addon";
import { OrderItemAddonDTO } from "./dto";

export class OrderItemAddonMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    order_item_id: string;
    addon_item_id: string;
    price_cents: number;
    created_at: bigint;
  }): OrderItemAddon {
    return new OrderItemAddon({
      id: prisma.id,
      organizationId: prisma.organization_id,
      orderItemId: prisma.order_item_id,
      addonItemId: prisma.addon_item_id,
      priceCents: prisma.price_cents,
      createdAt: Number(prisma.created_at),
    });
  }

  static toDTO(domain: OrderItemAddon): OrderItemAddonDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      orderItemId: domain.orderItemId,
      addonItemId: domain.addonItemId,
      priceCents: domain.priceCents,
      createdAt: domain.createdAt,
    };
  }

  static toPrisma(domain: OrderItemAddon): {
    id: string;
    organization_id: string;
    order_item_id: string;
    addon_item_id: string;
    price_cents: number;
    created_at: bigint;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      order_item_id: domain.orderItemId,
      addon_item_id: domain.addonItemId,
      price_cents: domain.priceCents,
      created_at: BigInt(domain.createdAt),
    };
  }
}
