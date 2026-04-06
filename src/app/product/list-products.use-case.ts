import { IProductRepository } from '../../contracts/product';
import { ProductMapper } from '../../contracts/product';
import { ProductDTO } from '../../contracts/product/dto';

interface ListProductsInput {
  organizationId: string;
}

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: ListProductsInput): Promise<ProductDTO[]> {
    const products = await this.productRepository.findAllByOrg(input.organizationId);
    return products.map(ProductMapper.toDTO);
  }
}
