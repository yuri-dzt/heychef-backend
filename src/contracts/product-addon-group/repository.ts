import { ProductAddonGroup } from "../../domain/product-addon-group";

export interface IProductAddonGroupRepository {
  findById(organizationId: string, id: string): Promise<ProductAddonGroup | null>;
  findAllByProductId(organizationId: string, productId: string): Promise<ProductAddonGroup[]>;
  create(organizationId: string, group: ProductAddonGroup): Promise<ProductAddonGroup>;
  update(organizationId: string, group: ProductAddonGroup): Promise<ProductAddonGroup>;
  delete(organizationId: string, id: string): Promise<void>;
}
