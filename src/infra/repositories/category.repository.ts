import { prisma } from '../../shared/prisma';
import { ICategoryRepository } from '../../contracts/category';
import { CategoryMapper } from '../../contracts/category';
import { Category } from '../../domain/category';

export class PrismaCategoryRepository implements ICategoryRepository {
  async findById(organizationId: string, id: string): Promise<Category | null> {
    const record = await prisma.category.findFirst({
      where: { id, organization_id: organizationId },
    });

    return record ? CategoryMapper.toDomain(record) : null;
  }

  async findAllByOrg(organizationId: string): Promise<Category[]> {
    const records = await prisma.category.findMany({
      where: { organization_id: organizationId },
      orderBy: { order_index: 'asc' },
    });

    return records.map(CategoryMapper.toDomain);
  }

  async create(organizationId: string, category: Category): Promise<Category> {
    const data = CategoryMapper.toPrisma(category);
    const record = await prisma.category.create({ data });

    return CategoryMapper.toDomain(record);
  }

  async update(organizationId: string, category: Category): Promise<Category> {
    const data = CategoryMapper.toPrisma(category);
    const record = await prisma.category.update({
      where: { id: category.id },
      data,
    });

    return CategoryMapper.toDomain(record);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}
