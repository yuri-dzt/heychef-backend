import { OrderItem } from "../../domain/order-item";
import { OrderItemDTO } from "./dto";

export class OrderItemMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price_cents: number;
    total_price_cents: number;
    notes?: string | null;
    created_at: bigint;
  }): OrderItem {
    return new OrderItem({
      id: prisma.id,
      organizationId: prisma.organization_id,
      orderId: prisma.order_id,
      productId: prisma.product_id,
      quantity: prisma.quantity,
      unitPriceCents: prisma.unit_price_cents,
      totalPriceCents: prisma.total_price_cents,
      notes: prisma.notes ?? undefined,
      createdAt: Number(prisma.created_at),
    });
  }

  static toDTO(domain: OrderItem): OrderItemDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      orderId: domain.orderId,
      productId: domain.productId,
      quantity: domain.quantity,
      unitPriceCents: domain.unitPriceCents,
      totalPriceCents: domain.totalPriceCents,
      notes: domain.notes,
      createdAt: domain.createdAt,
    };
  }

  static toPrisma(domain: OrderItem): {
    id: string;
    organization_id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price_cents: number;
    total_price_cents: number;
    notes: string | null;
    created_at: bigint;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      order_id: domain.orderId,
      product_id: domain.productId,
      quantity: domain.quantity,
      unit_price_cents: domain.unitPriceCents,
      total_price_cents: domain.totalPriceCents,
      notes: domain.notes ?? null,
      created_at: BigInt(domain.createdAt),
    };
  }
}
