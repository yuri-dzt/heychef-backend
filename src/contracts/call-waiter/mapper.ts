import { CallWaiterEvent, CallWaiterStatus } from "../../domain/call-waiter-event";
import { CallWaiterStatus as PrismaCallWaiterStatus } from "@prisma/client";
import { CallWaiterEventDTO } from "./dto";

export class CallWaiterEventMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    table_id: string;
    status: string;
    created_at: bigint;
    resolved_at: bigint | null;
  }): CallWaiterEvent {
    return new CallWaiterEvent({
      id: prisma.id,
      organizationId: prisma.organization_id,
      tableId: prisma.table_id,
      status: prisma.status as CallWaiterStatus,
      createdAt: Number(prisma.created_at),
      resolvedAt: prisma.resolved_at !== null ? Number(prisma.resolved_at) : undefined,
    });
  }

  static toDTO(domain: CallWaiterEvent): CallWaiterEventDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      tableId: domain.tableId,
      status: domain.status,
      createdAt: domain.createdAt,
      resolvedAt: domain.resolvedAt,
    };
  }

  static toPrisma(domain: CallWaiterEvent): {
    id: string;
    organization_id: string;
    table_id: string;
    status: PrismaCallWaiterStatus;
    created_at: bigint;
    resolved_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      table_id: domain.tableId,
      status: domain.status as PrismaCallWaiterStatus,
      created_at: BigInt(domain.createdAt),
      resolved_at: domain.resolvedAt !== undefined ? BigInt(domain.resolvedAt) : null,
    };
  }
}
