import { Request, Response, NextFunction } from 'express';
import { GetDailyReportsUseCase } from '../../app/report/get-daily-reports.use-case';
import { getDailyReportsSchema } from '../schemas/report.schema';
import { generateDailyReports } from '../cron';

export class ReportController {
  constructor(private getDailyReportsUseCase: GetDailyReportsUseCase) {}

  generate = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await generateDailyReports();
      res.status(200).json({ data: { message: 'Reports generated successfully' } });
    } catch (error) {
      next(error);
    }
  };

  getDailyReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = getDailyReportsSchema.parse(req.query);

      const reports = await this.getDailyReportsUseCase.execute({
        organizationId: req.user!.organizationId!,
        from: query.from,
        to: query.to,
      });

      res.status(200).json({ data: reports });
    } catch (error) {
      next(error);
    }
  };
}
