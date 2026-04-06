export interface CategoryDTO {
  id: string;
  organizationId: string;
  name: string;
  orderIndex: number;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}
