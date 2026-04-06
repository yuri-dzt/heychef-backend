import { Category } from "../../domain/category";

export interface ICategoryRepository {
  findById(organizationId: string, id: string): Promise<Category | null>;
  findAllByOrg(organizationId: string): Promise<Category[]>;
  create(organizationId: string, category: Category): Promise<Category>;
  update(organizationId: string, category: Category): Promise<Category>;
  delete(organizationId: string, id: string): Promise<void>;
}
