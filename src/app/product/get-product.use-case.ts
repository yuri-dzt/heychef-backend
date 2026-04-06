import { IProductRepository } from '../../contracts/product';
import { ProductMapper } from '../../contracts/product';
import { ProductDTO } from '../../contracts/product/dto';
import { NotFoundError } from '../../shared/errors';

interface GetProductInput {
  organizationId: string;
  productId: string;
}

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: GetProductInput): Promise<ProductDTO> {
    const product = await this.productRepository.findById(input.organizationId, input.productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return ProductMapper.toDTO(product);
  }
}
