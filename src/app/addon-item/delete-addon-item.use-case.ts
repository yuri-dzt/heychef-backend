import { IProductAddonItemRepository } from '../../contracts/product-addon-item';
import { NotFoundError } from '../../shared/errors';

interface DeleteAddonItemInput {
  organizationId: string;
  addonItemId: string;
}

export class DeleteAddonItemUseCase {
  constructor(private addonItemRepository: IProductAddonItemRepository) {}

  async execute(input: DeleteAddonItemInput): Promise<void> {
    const existing = await this.addonItemRepository.findById(input.organizationId, input.addonItemId);

    if (!existing) {
      throw new NotFoundError('Addon item');
    }

    await this.addonItemRepository.delete(input.organizationId, input.addonItemId);
  }
}
