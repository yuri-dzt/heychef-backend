import { prisma } from '../../shared/prisma';
import { IProductAddonItemRepository } from '../../contracts/product-addon-item';
import { ProductAddonItemMapper } from '../../contracts/product-addon-item';
import { ProductAddonItem } from '../../domain/product-addon-item';

export class PrismaProductAddonItemRepository implements IProductAddonItemRepository {
  async findById(organizationId: string, id: string): Promise<ProductAddonItem | null> {
    const record = await prisma.productAddonItem.findFirst({
      where: { id, organization_id: organizationId },
    });

    return record ? ProductAddonItemMapper.toDomain(record) : null;
  }

  async findAllByGroupId(organizationId: string, groupId: string): Promise<ProductAddonItem[]> {
    const records = await prisma.productAddonItem.findMany({
      where: { organization_id: organizationId, addon_group_id: groupId },
      orderBy: { created_at: 'asc' },
    });

    return records.map(ProductAddonItemMapper.toDomain);
  }

  async create(organizationId: string, item: ProductAddonItem): Promise<ProductAddonItem> {
    const data = ProductAddonItemMapper.toPrisma(item);
    const record = await prisma.productAddonItem.create({ data });

    return ProductAddonItemMapper.toDomain(record);
  }

  async update(organizationId: string, item: ProductAddonItem): Promise<ProductAddonItem> {
    const data = ProductAddonItemMapper.toPrisma(item);
    const record = await prisma.productAddonItem.update({
      where: { id: item.id },
      data,
    });

    return ProductAddonItemMapper.toDomain(record);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await prisma.productAddonItem.delete({
      where: { id },
    });
  }
}
