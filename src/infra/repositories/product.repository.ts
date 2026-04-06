import { prisma } from '../../shared/prisma';
import { IProductRepository } from '../../contracts/product';
import { ProductMapper } from '../../contracts/product';
import { Product } from '../../domain/product';

export class PrismaProductRepository implements IProductRepository {
  async findById(organizationId: string, id: string): Promise<Product | null> {
    const record = await prisma.product.findFirst({
      where: { id, organization_id: organizationId },
      include: {
        addon_groups: {
          include: {
            items: true,
          },
        },
      },
    });

    return record ? ProductMapper.toDomain(record) : null;
  }

  async findAllByOrg(organizationId: string): Promise<Product[]> {
    const records = await prisma.product.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'asc' },
      include: {
        addon_groups: {
          include: {
            items: true,
          },
        },
      },
    });

    return records.map(ProductMapper.toDomain);
  }

  async findAllByCategoryId(organizationId: string, categoryId: string): Promise<Product[]> {
    const records = await prisma.product.findMany({
      where: { organization_id: organizationId, category_id: categoryId },
      orderBy: { created_at: 'asc' },
    });

    return records.map(ProductMapper.toDomain);
  }

  async create(organizationId: string, product: Product): Promise<Product> {
    const data = ProductMapper.toPrisma(product);
    const record = await prisma.product.create({ data });

    return ProductMapper.toDomain(record);
  }

  async update(organizationId: string, product: Product): Promise<Product> {
    const data = ProductMapper.toPrisma(product);
    const record = await prisma.product.update({
      where: { id: product.id },
      data,
    });

    return ProductMapper.toDomain(record);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
