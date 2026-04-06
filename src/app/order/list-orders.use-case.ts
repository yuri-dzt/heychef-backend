import { IOrderRepository } from '../../contracts/order';
import { OrderMapper } from '../../contracts/order';
import { OrderDTO } from '../../contracts/order/dto';
import { OrderStatus } from '../../domain/order';

interface ListOrdersInput {
  organizationId: string;
  status?: OrderStatus;
}

export class ListOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(input: ListOrdersInput): Promise<OrderDTO[]> {
    const filters = input.status ? { status: input.status } : undefined;
    const orders = await this.orderRepository.findAllByOrg(input.organizationId, filters);
    return orders.map((order) => OrderMapper.toDTO(order));
  }
}
