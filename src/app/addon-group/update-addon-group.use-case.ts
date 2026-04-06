import { IProductAddonGroupRepository } from '../../contracts/product-addon-group';
import { ProductAddonGroupMapper } from '../../contracts/product-addon-group';
import { ProductAddonGroup } from '../../domain/product-addon-group';
import { NotFoundError } from '../../shared/errors';
import { ProductAddonGroupDTO } from '../../contracts/product-addon-group/dto';

interface UpdateAddonGroupInput {
  organizationId: string;
  addonGroupId: string;
  name?: string;
  minSelect?: number;
  maxSelect?: number;
}

export class UpdateAddonGroupUseCase {
  constructor(private addonGroupRepository: IProductAddonGroupRepository) {}

  async execute(input: UpdateAddonGroupInput): Promise<ProductAddonGroupDTO> {
    const existing = await this.addonGroupRepository.findById(input.organizationId, input.addonGroupId);

    if (!existing) {
      throw new NotFoundError('Addon group');
    }

    const now = Date.now();

    const updated = new ProductAddonGroup({
      id: existing.id,
      organizationId: existing.organizationId,
      productId: existing.productId,
      name: input.name ?? existing.name,
      minSelect: input.minSelect ?? existing.minSelect,
      maxSelect: input.maxSelect ?? existing.maxSelect,
      createdAt: existing.createdAt,
      updatedAt: now,
    });

    const saved = await this.addonGroupRepository.update(input.organizationId, updated);

    return ProductAddonGroupMapper.toDTO(saved);
  }
}
