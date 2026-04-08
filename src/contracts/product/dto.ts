export interface ProductDTO {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  ingredients?: string[];
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}
