import { v4 as uuidv4 } from 'uuid';
import { IProductRepository } from '../../contracts/product';
import { ProductMapper } from '../../contracts/product';
import { Product } from '../../domain/product';
import { ProductDTO } from '../../contracts/product/dto';

interface CreateProductInput {
  organizationId: string;
  categoryId: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  ingredients?: string[];
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<ProductDTO> {
    const now = Date.now();

    const product = new Product({
      id: uuidv4(),
      organizationId: input.organizationId,
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      priceCents: input.priceCents,
      imageUrl: input.imageUrl,
      ingredients: input.ingredients,
      active: true,
      createdAt: now,
    });

    const created = await this.productRepository.create(input.organizationId, product);

    return ProductMapper.toDTO(created);
  }
}
