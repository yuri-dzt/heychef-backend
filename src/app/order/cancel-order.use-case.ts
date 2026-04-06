import { prisma } from '../../shared/prisma';
import { IOrderRepository } from '../../contracts/order';
import { OrderMapper } from '../../contracts/order';
import { OrderDTO } from '../../contracts/order/dto';
import { OrderStatus } from '../../domain/order';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { orderEvents } from '../../infra/events/order-events';

interface CancelOrderInput {
  organizationId: string;
  orderId: string;
  reason?: string;
}

export class CancelOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(input: CancelOrderInput): Promise<OrderDTO> {
    const order = await this.orderRepository.findById(input.organizationId, input.orderId);

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (order.status === OrderStatus.CANCELED) {
      throw new ValidationError('Order is already canceled');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new ValidationError('Cannot cancel a delivered order');
    }

    const record = await prisma.order.update({
      where: { id: input.orderId },
      data: {
        status: OrderStatus.CANCELED,
        cancel_reason: input.reason ?? null,
        updated_at: BigInt(Date.now()),
      },
    });

    const updated = OrderMapper.toDomain(record);
    const dto = OrderMapper.toDTO(updated);
    orderEvents.emitStatusChange(dto);

    return dto;
  }
}
