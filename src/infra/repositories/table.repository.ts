import { prisma } from '../../shared/prisma';
import { ITableRepository } from '../../contracts/table';
import { TableMapper } from '../../contracts/table';
import { TableEntity } from '../../domain/table';

export class PrismaTableRepository implements ITableRepository {
  async findById(organizationId: string, id: string): Promise<TableEntity | null> {
    const record = await prisma.table.findFirst({
      where: { id, organization_id: organizationId },
    });

    return record ? TableMapper.toDomain(record) : null;
  }

  async findByToken(qrCodeToken: string): Promise<TableEntity | null> {
    const record = await prisma.table.findFirst({
      where: { qr_code_token: qrCodeToken },
    });

    return record ? TableMapper.toDomain(record) : null;
  }

  async findAllByOrg(organizationId: string): Promise<TableEntity[]> {
    const records = await prisma.table.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'asc' },
    });

    return records.map(TableMapper.toDomain);
  }

  async create(organizationId: string, table: TableEntity): Promise<TableEntity> {
    const data = TableMapper.toPrisma(table);
    const record = await prisma.table.create({ data });

    return TableMapper.toDomain(record);
  }

  async update(organizationId: string, table: TableEntity): Promise<TableEntity> {
    const data = TableMapper.toPrisma(table);
    const record = await prisma.table.update({
      where: { id: table.id },
      data,
    });

    return TableMapper.toDomain(record);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await prisma.table.delete({
      where: { id },
    });
  }
}
