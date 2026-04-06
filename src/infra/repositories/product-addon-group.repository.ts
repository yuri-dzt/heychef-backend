import { prisma } from '../../shared/prisma';
import { IProductAddonGroupRepository } from '../../contracts/product-addon-group';
import { ProductAddonGroupMapper } from '../../contracts/product-addon-group';
import { ProductAddonGroup } from '../../domain/product-addon-group';

export class PrismaProductAddonGroupRepository implements IProductAddonGroupRepository {
  async findById(organizationId: string, id: string): Promise<ProductAddonGroup | null> {
    const record = await prisma.productAddonGroup.findFirst({
      where: { id, organization_id: organizationId },
    });

    return record ? ProductAddonGroupMapper.toDomain(record) : null;
  }

  async findAllByProductId(organizationId: string, productId: string): Promise<ProductAddonGroup[]> {
    const records = await prisma.productAddonGroup.findMany({
      where: { organization_id: organizationId, product_id: productId },
      orderBy: { created_at: 'asc' },
    });

    return records.map(ProductAddonGroupMapper.toDomain);
  }

  async create(organizationId: string, group: ProductAddonGroup): Promise<ProductAddonGroup> {
    const data = ProductAddonGroupMapper.toPrisma(group);
    const record = await prisma.productAddonGroup.create({ data });

    return ProductAddonGroupMapper.toDomain(record);
  }

  async update(organizationId: string, group: ProductAddonGroup): Promise<ProductAddonGroup> {
    const data = ProductAddonGroupMapper.toPrisma(group);
    const record = await prisma.productAddonGroup.update({
      where: { id: group.id },
      data,
    });

    return ProductAddonGroupMapper.toDomain(record);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await prisma.productAddonGroup.delete({
      where: { id },
    });
  }
}
