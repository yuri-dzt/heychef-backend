export interface ProductAddonGroupDTO {
  id: string;
  organizationId: string;
  productId?: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  createdAt: number;
  updatedAt?: number;
}
