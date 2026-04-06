import { v4 as uuidv4 } from 'uuid';
import { ICategoryRepository } from '../../contracts/category';
import { CategoryMapper } from '../../contracts/category';
import { Category } from '../../domain/category';
import { CategoryDTO } from '../../contracts/category/dto';

interface CreateCategoryInput {
  organizationId: string;
  name: string;
  orderIndex: number;
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CategoryDTO> {
    const now = Date.now();

    const category = new Category({
      id: uuidv4(),
      organizationId: input.organizationId,
      name: input.name,
      orderIndex: input.orderIndex,
      active: true,
      createdAt: now,
    });

    const created = await this.categoryRepository.create(input.organizationId, category);

    return CategoryMapper.toDTO(created);
  }
}
