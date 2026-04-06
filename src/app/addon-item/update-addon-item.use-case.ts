import { IProductAddonItemRepository } from '../../contracts/product-addon-item';
import { ProductAddonItemMapper } from '../../contracts/product-addon-item';
import { ProductAddonItem } from '../../domain/product-addon-item';
import { NotFoundError } from '../../shared/errors';
import { ProductAddonItemDTO } from '../../contracts/product-addon-item/dto';

interface UpdateAddonItemInput {
  organizationId: string;
  addonItemId: string;
  name?: string;
  priceCents?: number;
}

export class UpdateAddonItemUseCase {
  constructor(private addonItemRepository: IProductAddonItemRepository) {}

  async execute(input: UpdateAddonItemInput): Promise<ProductAddonItemDTO> {
    const existing = await this.addonItemRepository.findById(input.organizationId, input.addonItemId);

    if (!existing) {
      throw new NotFoundError('Addon item');
    }

    const now = Date.now();

    const updated = new ProductAddonItem({
      id: existing.id,
      organizationId: existing.organizationId,
      addonGroupId: existing.addonGroupId,
      name: input.name ?? existing.name,
      priceCents: input.priceCents ?? existing.priceCents,
      createdAt: existing.createdAt,
      updatedAt: now,
    });

    const saved = await this.addonItemRepository.update(input.organizationId, updated);

    return ProductAddonItemMapper.toDTO(saved);
  }
}
