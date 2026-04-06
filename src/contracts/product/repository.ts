import { Product } from "../../domain/product";

export interface IProductRepository {
  findById(organizationId: string, id: string): Promise<Product | null>;
  findAllByOrg(organizationId: string): Promise<Product[]>;
  findAllByCategoryId(organizationId: string, categoryId: string): Promise<Product[]>;
  create(organizationId: string, product: Product): Promise<Product>;
  update(organizationId: string, product: Product): Promise<Product>;
  delete(organizationId: string, id: string): Promise<void>;
}
