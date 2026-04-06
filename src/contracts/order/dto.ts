import { OrderStatus } from "../../domain/order";
import { OrderItemDTO } from "../order-item/dto";

export interface OrderDTO {
  id: string;
  organizationId: string;
  tableId: string;
  status: OrderStatus;
  customerName?: string;
  notes?: string;
  totalCents: number;
  cancelReason?: string;
  items?: OrderItemDTO[];
  createdAt: number;
  updatedAt?: number;
}
