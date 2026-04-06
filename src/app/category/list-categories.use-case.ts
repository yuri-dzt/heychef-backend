import { ICategoryRepository } from '../../contracts/category';
import { CategoryMapper } from '../../contracts/category';
import { CategoryDTO } from '../../contracts/category/dto';

interface ListCategoriesInput {
  organizationId: string;
}

export class ListCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.findAllByOrg(input.organizationId);
    return categories.map(CategoryMapper.toDTO);
  }
}
