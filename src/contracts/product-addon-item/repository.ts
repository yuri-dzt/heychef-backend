import { ProductAddonItem } from "../../domain/product-addon-item";

export interface IProductAddonItemRepository {
  findById(organizationId: string, id: string): Promise<ProductAddonItem | null>;
  findAllByGroupId(organizationId: string, groupId: string): Promise<ProductAddonItem[]>;
  create(organizationId: string, item: ProductAddonItem): Promise<ProductAddonItem>;
  update(organizationId: string, item: ProductAddonItem): Promise<ProductAddonItem>;
  delete(organizationId: string, id: string): Promise<void>;
}
