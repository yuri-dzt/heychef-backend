import { Role } from "../../domain/user";

export interface UserDTO {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: Role;
  createdAt: number;
  updatedAt?: number;
}
