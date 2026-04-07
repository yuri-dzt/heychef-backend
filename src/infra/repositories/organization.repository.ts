import { prisma } from '../../shared/prisma';
import { IOrganizationRepository } from '../../contracts/organization';
import { OrganizationMapper } from '../../contracts/organization';
import { Organization } from '../../domain/organization';

export class PrismaOrganizationRepository implements IOrganizationRepository {
  async findById(organizationId: string): Promise<Organization | null> {
    const record = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!record) return null;

    return OrganizationMapper.toDomain(record);
  }

  async findAll(): Promise<Organization[]> {
    const records = await prisma.organization.findMany({
      orderBy: { created_at: 'desc' },
      include: { plan: { select: { name: true } } },
    });

    return records.map(OrganizationMapper.toDomain);
  }

  async create(organization: Organization): Promise<Organization> {
    const data = OrganizationMapper.toPrisma(organization);

    const record = await prisma.organization.create({ data });

    return OrganizationMapper.toDomain(record);
  }

  async update(organization: Organization): Promise<Organization> {
    const data = OrganizationMapper.toPrisma(organization);

    const record = await prisma.organization.update({
      where: { id: organization.id },
      data,
    });

    return OrganizationMapper.toDomain(record);
  }
}
