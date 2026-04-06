import { UserPermission, PermissionAction } from "../../domain/user-permission";
import { Action as PrismaAction } from "@prisma/client";
import { UserPermissionDTO } from "./dto";

export class UserPermissionMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    user_id: string;
    page_id: string;
    action: string;
    created_at: bigint;
  }): UserPermission {
    return new UserPermission({
      id: prisma.id,
      organizationId: prisma.organization_id,
      userId: prisma.user_id,
      pageId: prisma.page_id,
      action: prisma.action as PermissionAction,
      createdAt: Number(prisma.created_at),
    });
  }

  static toDTO(domain: UserPermission): UserPermissionDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      userId: domain.userId,
      pageId: domain.pageId,
      action: domain.action,
      createdAt: domain.createdAt,
    };
  }

  static toPrisma(domain: UserPermission): {
    id: string;
    organization_id: string;
    user_id: string;
    page_id: string;
    action: PrismaAction;
    created_at: bigint;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      user_id: domain.userId,
      page_id: domain.pageId,
      action: domain.action as PrismaAction,
      created_at: BigInt(domain.createdAt),
    };
  }
}
