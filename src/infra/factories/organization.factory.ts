import { ListOrganizationsUseCase } from '../../app/organization/list-organizations.use-case';
import { GetOrganizationUseCase } from '../../app/organization/get-organization.use-case';
import { RenewPlanUseCase } from '../../app/organization/renew-plan.use-case';
import { OrganizationController } from '../controllers/organization.controller';
import { PrismaOrganizationRepository } from '../repositories/organization.repository';

export function makeOrganizationController(): OrganizationController {
  const orgRepo = new PrismaOrganizationRepository();

  const listOrganizationsUseCase = new ListOrganizationsUseCase(orgRepo);
  const getOrganizationUseCase = new GetOrganizationUseCase(orgRepo);
  const renewPlanUseCase = new RenewPlanUseCase(orgRepo);

  return new OrganizationController(listOrganizationsUseCase, getOrganizationUseCase, renewPlanUseCase);
}
