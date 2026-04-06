import { IOrganizationRepository } from '../../contracts/organization';
import { OrganizationMapper } from '../../contracts/organization';
import { Organization } from '../../domain/organization';
import { NotFoundError } from '../../shared/errors';
import { OrganizationDTO } from '../../contracts/organization/dto';

interface RenewPlanInput {
  organizationId: string;
}

export class RenewPlanUseCase {
  constructor(private organizationRepository: IOrganizationRepository) {}

  async execute(input: RenewPlanInput): Promise<OrganizationDTO> {
    const organization = await this.organizationRepository.findById(input.organizationId);

    if (!organization) {
      throw new NotFoundError('Organization');
    }

    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    const updated = new Organization({
      id: organization.id,
      name: organization.name,
      planExpiresAt: now + thirtyDaysMs,
      createdAt: organization.createdAt,
      updatedAt: now,
    });

    const saved = await this.organizationRepository.update(updated);

    return OrganizationMapper.toDTO(saved);
  }
}
