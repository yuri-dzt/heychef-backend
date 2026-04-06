import { prisma } from '../../shared/prisma';
import { IUserPermissionRepository } from '../../contracts/user-permission';
import { UserPermissionMapper } from '../../contracts/user-permission';
import { UserPermission, PermissionAction } from '../../domain/user-permission';

export class PrismaUserPermissionRepository implements IUserPermissionRepository {
  async findByUserAndPageAndAction(
    organizationId: string,
    userId: string,
    pageId: string,
    action: PermissionAction,
  ): Promise<UserPermission | null> {
    const record = await prisma.userPermission.findFirst({
      where: {
        organization_id: organizationId,
        user_id: userId,
        page_id: pageId,
        action,
      },
    });

    if (!record) return null;

    return UserPermissionMapper.toDomain(record);
  }

  async findAllByUser(organizationId: string, userId: string): Promise<UserPermission[]> {
    const records = await prisma.userPermission.findMany({
      where: {
        organization_id: organizationId,
        user_id: userId,
      },
      orderBy: { created_at: 'asc' },
    });

    return records.map(UserPermissionMapper.toDomain);
  }

  async create(organizationId: string, permission: UserPermission): Promise<UserPermission> {
    const data = UserPermissionMapper.toPrisma(permission);

    const record = await prisma.userPermission.create({ data });

    return UserPermissionMapper.toDomain(record);
  }

  async deleteByUser(organizationId: string, userId: string): Promise<void> {
    await prisma.userPermission.deleteMany({
      where: {
        organization_id: organizationId,
        user_id: userId,
      },
    });
  }
}
