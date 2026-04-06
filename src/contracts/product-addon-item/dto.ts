export interface ProductAddonItemDTO {
  id: string;
  organizationId: string;
  addonGroupId: string;
  name: string;
  priceCents: number;
  createdAt: number;
  updatedAt?: number;
}
