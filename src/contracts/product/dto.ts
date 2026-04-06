export interface ProductDTO {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}
