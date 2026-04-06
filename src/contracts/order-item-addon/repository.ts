import { OrderItemAddon } from "../../domain/order-item-addon";

export interface IOrderItemAddonRepository {
  findById(organizationId: string, id: string): Promise<OrderItemAddon | null>;
  findAllByOrderItemId(organizationId: string, orderItemId: string): Promise<OrderItemAddon[]>;
  createMany(organizationId: string, addons: OrderItemAddon[]): Promise<OrderItemAddon[]>;
}
