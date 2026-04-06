import { Request, Response, NextFunction } from 'express';
import { ListOrganizationsUseCase } from '../../app/organization/list-organizations.use-case';
import { GetOrganizationUseCase } from '../../app/organization/get-organization.use-case';
import { RenewPlanUseCase } from '../../app/organization/renew-plan.use-case';
import { getOrganizationSchema, renewPlanSchema } from '../schemas/organization.schema';

export class OrganizationController {
  constructor(
    private listOrganizationsUseCase: ListOrganizationsUseCase,
    private getOrganizationUseCase: GetOrganizationUseCase,
    private renewPlanUseCase: RenewPlanUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizations = await this.listOrganizationsUseCase.execute();

      res.status(200).json({ data: organizations });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = getOrganizationSchema.parse(req.params);

      const organization = await this.getOrganizationUseCase.execute({
        organizationId: params.id,
      });

      res.status(200).json({ data: organization });
    } catch (error) {
      next(error);
    }
  };

  renewPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = renewPlanSchema.parse(req.params);

      const organization = await this.renewPlanUseCase.execute({
        organizationId: params.id,
      });

      res.status(200).json({ data: organization });
    } catch (error) {
      next(error);
    }
  };
}
