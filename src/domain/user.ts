export enum Role {
  SUPPORT = "SUPPORT",
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserProps {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: number;
  updatedAt?: number;
}

export class User {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: Role;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: UserProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
