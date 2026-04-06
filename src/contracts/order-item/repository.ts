import { OrderItem } from "../../domain/order-item";

export interface IOrderItemRepository {
  findById(organizationId: string, id: string): Promise<OrderItem | null>;
  findAllByOrderId(organizationId: string, orderId: string): Promise<OrderItem[]>;
  createMany(organizationId: string, items: OrderItem[]): Promise<OrderItem[]>;
}
