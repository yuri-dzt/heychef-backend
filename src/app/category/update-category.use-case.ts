import { ICategoryRepository } from '../../contracts/category';
import { CategoryMapper } from '../../contracts/category';
import { Category } from '../../domain/category';
import { NotFoundError } from '../../shared/errors';
import { CategoryDTO } from '../../contracts/category/dto';

interface UpdateCategoryInput {
  organizationId: string;
  categoryId: string;
  name?: string;
  orderIndex?: number;
  active?: boolean;
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<CategoryDTO> {
    const existing = await this.categoryRepository.findById(input.organizationId, input.categoryId);

    if (!existing) {
      throw new NotFoundError('Category');
    }

    const now = Date.now();

    const updated = new Category({
      id: existing.id,
      organizationId: existing.organizationId,
      name: input.name ?? existing.name,
      orderIndex: input.orderIndex ?? existing.orderIndex,
      active: input.active ?? existing.active,
      createdAt: existing.createdAt,
      updatedAt: now,
    });

    const saved = await this.categoryRepository.update(input.organizationId, updated);

    return CategoryMapper.toDTO(saved);
  }
}
