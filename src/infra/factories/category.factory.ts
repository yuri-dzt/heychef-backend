import { PrismaCategoryRepository } from '../repositories/category.repository';
import { ListCategoriesUseCase } from '../../app/category/list-categories.use-case';
import { CreateCategoryUseCase } from '../../app/category/create-category.use-case';
import { UpdateCategoryUseCase } from '../../app/category/update-category.use-case';
import { DeleteCategoryUseCase } from '../../app/category/delete-category.use-case';
import { CategoryController } from '../controllers/category.controller';

export function makeCategoryController(): CategoryController {
  const repository = new PrismaCategoryRepository();

  const listCategoriesUseCase = new ListCategoriesUseCase(repository);
  const createCategoryUseCase = new CreateCategoryUseCase(repository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(repository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(repository);

  return new CategoryController(
    listCategoriesUseCase,
    createCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
  );
}
