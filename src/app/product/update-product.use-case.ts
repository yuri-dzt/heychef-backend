import { IProductRepository } from '../../contracts/product';
import { ProductMapper } from '../../contracts/product';
import { Product } from '../../domain/product';
import { NotFoundError } from '../../shared/errors';
import { ProductDTO } from '../../contracts/product/dto';

interface UpdateProductInput {
  organizationId: string;
  productId: string;
  categoryId?: string;
  name?: string;
  description?: string;
  priceCents?: number;
  imageUrl?: string;
  active?: boolean;
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<ProductDTO> {
    const existing = await this.productRepository.findById(input.organizationId, input.productId);

    if (!existing) {
      throw new NotFoundError('Product');
    }

    const now = Date.now();

    const updated = new Product({
      id: existing.id,
      organizationId: existing.organizationId,
      categoryId: input.categoryId ?? existing.categoryId,
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      priceCents: input.priceCents ?? existing.priceCents,
      imageUrl: input.imageUrl ?? existing.imageUrl,
      active: input.active ?? existing.active,
      createdAt: existing.createdAt,
      updatedAt: now,
    });

    const saved = await this.productRepository.update(input.organizationId, updated);

    return ProductMapper.toDTO(saved);
  }
}
