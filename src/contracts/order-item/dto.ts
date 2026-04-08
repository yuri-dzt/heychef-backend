export interface OrderItemDTO {
  id: string;
  organizationId: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  notes?: string;
  createdAt: number;
}
