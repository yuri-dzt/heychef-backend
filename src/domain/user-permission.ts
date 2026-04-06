export enum PermissionAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface UserPermissionProps {
  id: string;
  organizationId: string;
  userId: string;
  pageId: string;
  action: PermissionAction;
  createdAt: number;
}

export class UserPermission {
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly pageId: string;
  readonly action: PermissionAction;
  readonly createdAt: number;

  constructor(props: UserPermissionProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.userId = props.userId;
    this.pageId = props.pageId;
    this.action = props.action;
    this.createdAt = props.createdAt;
  }
}
