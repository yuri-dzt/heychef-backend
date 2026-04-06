import { Order, OrderStatus } from "../../domain/order";

export interface IOrderRepository {
  findById(organizationId: string, id: string): Promise<Order | null>;
  findAllByOrg(organizationId: string, filters?: { status?: OrderStatus }): Promise<Order[]>;
  create(organizationId: string, order: Order): Promise<Order>;
  updateStatus(organizationId: string, id: string, status: OrderStatus): Promise<Order>;
  archiveOldOrders(organizationId: string, beforeTimestamp: number): Promise<number>;
}
