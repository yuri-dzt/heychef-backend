import { IReportDailyRepository } from '../../contracts/report-daily';
import { ReportDailyMapper } from '../../contracts/report-daily';
import { ReportDailyDTO } from '../../contracts/report-daily/dto';

interface GetDailyReportsInput {
  organizationId: string;
  from: string;
  to: string;
}

export class GetDailyReportsUseCase {
  constructor(private reportDailyRepository: IReportDailyRepository) {}

  async execute(input: GetDailyReportsInput): Promise<ReportDailyDTO[]> {
    const reports = await this.reportDailyRepository.findByOrgAndDateRange(
      input.organizationId,
      input.from,
      input.to,
    );

    return reports.map(ReportDailyMapper.toDTO);
  }
}
