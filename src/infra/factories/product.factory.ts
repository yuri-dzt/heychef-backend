import { PrismaProductRepository } from '../repositories/product.repository';
import { ListProductsUseCase } from '../../app/product/list-products.use-case';
import { GetProductUseCase } from '../../app/product/get-product.use-case';
import { CreateProductUseCase } from '../../app/product/create-product.use-case';
import { UpdateProductUseCase } from '../../app/product/update-product.use-case';
import { DeleteProductUseCase } from '../../app/product/delete-product.use-case';
import { ProductController } from '../controllers/product.controller';

export function makeProductController(): ProductController {
  const repository = new PrismaProductRepository();

  const listProductsUseCase = new ListProductsUseCase(repository);
  const getProductUseCase = new GetProductUseCase(repository);
  const createProductUseCase = new CreateProductUseCase(repository);
  const updateProductUseCase = new UpdateProductUseCase(repository);
  const deleteProductUseCase = new DeleteProductUseCase(repository);

  return new ProductController(
    listProductsUseCase,
    getProductUseCase,
    createProductUseCase,
    updateProductUseCase,
    deleteProductUseCase,
  );
}
