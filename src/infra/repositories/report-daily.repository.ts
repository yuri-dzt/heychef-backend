import { prisma } from '../../shared/prisma';
import { IReportDailyRepository } from '../../contracts/report-daily';
import { ReportDailyMapper } from '../../contracts/report-daily';
import { ReportDaily } from '../../domain/report-daily';

export class PrismaReportDailyRepository implements IReportDailyRepository {
  async findByOrgAndDateRange(
    organizationId: string,
    startDate: string,
    endDate: string,
  ): Promise<ReportDaily[]> {
    const records = await prisma.reportDaily.findMany({
      where: {
        organization_id: organizationId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    return records.map(ReportDailyMapper.toDomain);
  }

  async create(organizationId: string, report: ReportDaily): Promise<ReportDaily> {
    const data = ReportDailyMapper.toPrisma(report);

    const record = await prisma.reportDaily.create({ data });

    return ReportDailyMapper.toDomain(record);
  }

  async upsert(organizationId: string, report: ReportDaily): Promise<ReportDaily> {
    const data = ReportDailyMapper.toPrisma(report);

    const record = await prisma.reportDaily.upsert({
      where: {
        organization_id_date: {
          organization_id: organizationId,
          date: report.date,
        },
      },
      create: data,
      update: {
        total_orders: data.total_orders,
        total_revenue_cents: data.total_revenue_cents,
      },
    });

    return ReportDailyMapper.toDomain(record);
  }
}
