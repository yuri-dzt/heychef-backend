import { IProductAddonGroupRepository } from '../../contracts/product-addon-group';
import { NotFoundError } from '../../shared/errors';

interface DeleteAddonGroupInput {
  organizationId: string;
  addonGroupId: string;
}

export class DeleteAddonGroupUseCase {
  constructor(private addonGroupRepository: IProductAddonGroupRepository) {}

  async execute(input: DeleteAddonGroupInput): Promise<void> {
    const existing = await this.addonGroupRepository.findById(input.organizationId, input.addonGroupId);

    if (!existing) {
      throw new NotFoundError('Addon group');
    }

    await this.addonGroupRepository.delete(input.organizationId, input.addonGroupId);
  }
}
