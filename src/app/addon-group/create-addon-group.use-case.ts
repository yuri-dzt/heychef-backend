import { v4 as uuidv4 } from 'uuid';
import { IProductAddonGroupRepository } from '../../contracts/product-addon-group';
import { ProductAddonGroupMapper } from '../../contracts/product-addon-group';
import { ProductAddonGroup } from '../../domain/product-addon-group';
import { ProductAddonGroupDTO } from '../../contracts/product-addon-group/dto';

interface CreateAddonGroupInput {
  organizationId: string;
  productId: string;
  name: string;
  minSelect: number;
  maxSelect: number;
}

export class CreateAddonGroupUseCase {
  constructor(private addonGroupRepository: IProductAddonGroupRepository) {}

  async execute(input: CreateAddonGroupInput): Promise<ProductAddonGroupDTO> {
    const now = Date.now();

    const group = new ProductAddonGroup({
      id: uuidv4(),
      organizationId: input.organizationId,
      productId: input.productId,
      name: input.name,
      minSelect: input.minSelect,
      maxSelect: input.maxSelect,
      createdAt: now,
    });

    const created = await this.addonGroupRepository.create(input.organizationId, group);

    return ProductAddonGroupMapper.toDTO(created);
  }
}
