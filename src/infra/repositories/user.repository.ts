import { prisma } from '../../shared/prisma';
import { IUserRepository } from '../../contracts/user';
import { UserMapper } from '../../contracts/user';
import { User } from '../../domain/user';

export class PrismaUserRepository implements IUserRepository {
  async findById(organizationId: string, id: string): Promise<User | null> {
    const record = await prisma.user.findFirst({
      where: { id, organization_id: organizationId },
    });

    if (!record) return null;

    return UserMapper.toDomain(record);
  }

  async findByEmail(organizationId: string, email: string): Promise<User | null> {
    const record = await prisma.user.findFirst({
      where: { email, organization_id: organizationId },
    });

    if (!record) return null;

    return UserMapper.toDomain(record);
  }

  async findByEmailGlobal(email: string): Promise<User | null> {
    const record = await prisma.user.findFirst({
      where: { email },
    });

    if (!record) return null;

    return UserMapper.toDomain(record);
  }

  async findAllByOrg(organizationId: string): Promise<User[]> {
    const records = await prisma.user.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
    });

    return records.map(UserMapper.toDomain);
  }

  async create(organizationId: string, user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);

    const record = await prisma.user.create({ data });

    return UserMapper.toDomain(record);
  }

  async update(organizationId: string, user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);

    const record = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return UserMapper.toDomain(record);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
