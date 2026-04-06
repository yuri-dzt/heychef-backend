import { IOrganizationRepository } from '../../contracts/organization';
import { OrganizationMapper } from '../../contracts/organization';
import { NotFoundError } from '../../shared/errors';
import { OrganizationDTO } from '../../contracts/organization/dto';

interface GetOrganizationInput {
  organizationId: string;
}

export class GetOrganizationUseCase {
  constructor(private organizationRepository: IOrganizationRepository) {}

  async execute(input: GetOrganizationInput): Promise<OrganizationDTO> {
    const organization = await this.organizationRepository.findById(input.organizationId);

    if (!organization) {
      throw new NotFoundError('Organization');
    }

    return OrganizationMapper.toDTO(organization);
  }
}
