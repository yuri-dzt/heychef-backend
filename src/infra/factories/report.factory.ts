import { GetDailyReportsUseCase } from '../../app/report/get-daily-reports.use-case';
import { ReportController } from '../controllers/report.controller';
import { PrismaReportDailyRepository } from '../repositories/report-daily.repository';

export function makeReportController(): ReportController {
  const reportDailyRepo = new PrismaReportDailyRepository();

  const getDailyReportsUseCase = new GetDailyReportsUseCase(reportDailyRepo);

  return new ReportController(getDailyReportsUseCase);
}
