import { UserPermission, PermissionAction } from "../../domain/user-permission";

export interface IUserPermissionRepository {
  findByUserAndPageAndAction(
    organizationId: string,
    userId: string,
    pageId: string,
    action: PermissionAction,
  ): Promise<UserPermission | null>;
  findAllByUser(organizationId: string, userId: string): Promise<UserPermission[]>;
  create(organizationId: string, permission: UserPermission): Promise<UserPermission>;
  deleteByUser(organizationId: string, userId: string): Promise<void>;
}
