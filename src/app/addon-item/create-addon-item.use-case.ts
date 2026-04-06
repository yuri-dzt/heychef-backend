import { v4 as uuidv4 } from 'uuid';
import { IProductAddonItemRepository } from '../../contracts/product-addon-item';
import { ProductAddonItemMapper } from '../../contracts/product-addon-item';
import { ProductAddonItem } from '../../domain/product-addon-item';
import { ProductAddonItemDTO } from '../../contracts/product-addon-item/dto';

interface CreateAddonItemInput {
  organizationId: string;
  addonGroupId: string;
  name: string;
  priceCents: number;
}

export class CreateAddonItemUseCase {
  constructor(private addonItemRepository: IProductAddonItemRepository) {}

  async execute(input: CreateAddonItemInput): Promise<ProductAddonItemDTO> {
    const now = Date.now();

    const item = new ProductAddonItem({
      id: uuidv4(),
      organizationId: input.organizationId,
      addonGroupId: input.addonGroupId,
      name: input.name,
      priceCents: input.priceCents,
      createdAt: now,
    });

    const created = await this.addonItemRepository.create(input.organizationId, item);

    return ProductAddonItemMapper.toDTO(created);
  }
}
