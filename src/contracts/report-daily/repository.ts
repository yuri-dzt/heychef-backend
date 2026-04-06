import { ReportDaily } from "../../domain/report-daily";

export interface IReportDailyRepository {
  findByOrgAndDateRange(organizationId: string, startDate: string, endDate: string): Promise<ReportDaily[]>;
  create(organizationId: string, report: ReportDaily): Promise<ReportDaily>;
  upsert(organizationId: string, report: ReportDaily): Promise<ReportDaily>;
}
