import { IOrganizationRepository } from '../../contracts/organization';
import { OrganizationMapper } from '../../contracts/organization';
import { OrganizationDTO } from '../../contracts/organization/dto';

export class ListOrganizationsUseCase {
  constructor(private organizationRepository: IOrganizationRepository) {}

  async execute(): Promise<OrganizationDTO[]> {
    const organizations = await this.organizationRepository.findAll();
    return organizations.map(OrganizationMapper.toDTO);
  }
}
