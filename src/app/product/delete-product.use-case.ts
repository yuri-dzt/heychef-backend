import { IProductRepository } from '../../contracts/product';
import { NotFoundError } from '../../shared/errors';

interface DeleteProductInput {
  organizationId: string;
  productId: string;
}

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: DeleteProductInput): Promise<void> {
    const existing = await this.productRepository.findById(input.organizationId, input.productId);

    if (!existing) {
      throw new NotFoundError('Product');
    }

    await this.productRepository.delete(input.organizationId, input.productId);
  }
}
