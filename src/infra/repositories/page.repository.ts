import { prisma } from '../../shared/prisma';
import { IPageRepository } from '../../contracts/page';
import { PageMapper } from '../../contracts/page';
import { PageEntity } from '../../domain/page';

export class PrismaPageRepository implements IPageRepository {
  async findById(organizationId: string, id: string): Promise<PageEntity | null> {
    const record = await prisma.page.findFirst({
      where: { id, organization_id: organizationId },
    });

    if (!record) return null;

    return PageMapper.toDomain(record);
  }

  async findByName(organizationId: string, name: string): Promise<PageEntity | null> {
    const record = await prisma.page.findFirst({
      where: { name, organization_id: organizationId },
    });

    if (!record) return null;

    return PageMapper.toDomain(record);
  }

  async findAllByOrg(organizationId: string): Promise<PageEntity[]> {
    const records = await prisma.page.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'asc' },
    });

    return records.map(PageMapper.toDomain);
  }

  async create(organizationId: string, page: PageEntity): Promise<PageEntity> {
    const data = PageMapper.toPrisma(page);

    const record = await prisma.page.create({ data });

    return PageMapper.toDomain(record);
  }
}
