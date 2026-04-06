import { IOrderRepository } from '../../contracts/order';
import { OrderMapper } from '../../contracts/order';
import { OrderDTO } from '../../contracts/order/dto';
import { OrderStatus } from '../../domain/order';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { orderEvents } from '../../infra/events/order-events';

interface UpdateOrderStatusInput {
  organizationId: string;
  orderId: string;
  status: OrderStatus;
}

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(input: UpdateOrderStatusInput): Promise<OrderDTO> {
    const order = await this.orderRepository.findById(input.organizationId, input.orderId);

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (order.status === OrderStatus.CANCELED) {
      throw new ValidationError('Cannot update status of a canceled order');
    }

    const updated = await this.orderRepository.updateStatus(
      input.organizationId,
      input.orderId,
      input.status,
    );

    const dto = OrderMapper.toDTO(updated);
    orderEvents.emitStatusChange(dto);

    return dto;
  }
}
