import { PermissionAction } from "../../domain/user-permission";

export interface UserPermissionDTO {
  id: string;
  organizationId: string;
  userId: string;
  pageId: string;
  action: PermissionAction;
  createdAt: number;
}
