import { ReportDaily } from "../../domain/report-daily";
import { ReportDailyDTO } from "./dto";

export class ReportDailyMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    date: string;
    total_orders: number;
    total_revenue_cents: number;
    created_at: bigint;
  }): ReportDaily {
    return new ReportDaily({
      id: prisma.id,
      organizationId: prisma.organization_id,
      date: prisma.date,
      totalOrders: prisma.total_orders,
      totalRevenueCents: prisma.total_revenue_cents,
      createdAt: Number(prisma.created_at),
    });
  }

  static toDTO(domain: ReportDaily): ReportDailyDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      date: domain.date,
      totalOrders: domain.totalOrders,
      totalRevenueCents: domain.totalRevenueCents,
      createdAt: domain.createdAt,
    };
  }

  static toPrisma(domain: ReportDaily): {
    id: string;
    organization_id: string;
    date: string;
    total_orders: number;
    total_revenue_cents: number;
    created_at: bigint;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      date: domain.date,
      total_orders: domain.totalOrders,
      total_revenue_cents: domain.totalRevenueCents,
      created_at: BigInt(domain.createdAt),
    };
  }
}
