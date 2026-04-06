import { User } from "../../domain/user";

export interface IUserRepository {
  findById(organizationId: string, id: string): Promise<User | null>;
  findByEmail(organizationId: string, email: string): Promise<User | null>;
  findByEmailGlobal(email: string): Promise<User | null>;
  findAllByOrg(organizationId: string): Promise<User[]>;
  create(organizationId: string, user: User): Promise<User>;
  update(organizationId: string, user: User): Promise<User>;
  delete(organizationId: string, id: string): Promise<void>;
}
