import { ICategoryRepository } from '../../contracts/category';
import { NotFoundError } from '../../shared/errors';

interface DeleteCategoryInput {
  organizationId: string;
  categoryId: string;
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const existing = await this.categoryRepository.findById(input.organizationId, input.categoryId);

    if (!existing) {
      throw new NotFoundError('Category');
    }

    await this.categoryRepository.delete(input.organizationId, input.categoryId);
  }
}
