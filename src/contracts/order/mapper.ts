import { Order, OrderStatus } from "../../domain/order";
import { OrderStatus as PrismaOrderStatus } from "@prisma/client";
import { OrderDTO } from "./dto";

export class OrderMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    table_id: string;
    status: string;
    customer_name: string | null;
    notes: string | null;
    total_cents: number;
    cancel_reason: string | null;
    created_at: bigint;
    updated_at: bigint | null;
  }): Order {
    return new Order({
      id: prisma.id,
      organizationId: prisma.organization_id,
      tableId: prisma.table_id,
      status: prisma.status as OrderStatus,
      customerName: prisma.customer_name ?? undefined,
      notes: prisma.notes ?? undefined,
      totalCents: prisma.total_cents,
      cancelReason: prisma.cancel_reason ?? undefined,
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
    });
  }

  static toDTO(domain: Order, items?: OrderDTO["items"]): OrderDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      tableId: domain.tableId,
      status: domain.status,
      customerName: domain.customerName,
      notes: domain.notes,
      totalCents: domain.totalCents,
      cancelReason: domain.cancelReason,
      items,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toPrisma(domain: Order): {
    id: string;
    organization_id: string;
    table_id: string;
    status: PrismaOrderStatus;
    customer_name: string | null;
    notes: string | null;
    total_cents: number;
    cancel_reason: string | null;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      table_id: domain.tableId,
      status: domain.status as PrismaOrderStatus,
      customer_name: domain.customerName ?? null,
      notes: domain.notes ?? null,
      total_cents: domain.totalCents,
      cancel_reason: domain.cancelReason ?? null,
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
