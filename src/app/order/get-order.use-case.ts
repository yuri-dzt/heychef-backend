import { IOrderRepository } from '../../contracts/order';
import { OrderMapper } from '../../contracts/order';
import { OrderDTO } from '../../contracts/order/dto';
import { IOrderItemRepository } from '../../contracts/order-item';
import { OrderItemMapper } from '../../contracts/order-item';
import { IOrderItemAddonRepository } from '../../contracts/order-item-addon';
import { OrderItemAddonMapper } from '../../contracts/order-item-addon';
import { NotFoundError } from '../../shared/errors';

interface GetOrderInput {
  organizationId: string;
  orderId: string;
}

export class GetOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private orderItemRepository: IOrderItemRepository,
    private orderItemAddonRepository: IOrderItemAddonRepository,
  ) {}

  async execute(input: GetOrderInput): Promise<OrderDTO> {
    const order = await this.orderRepository.findById(input.organizationId, input.orderId);

    if (!order) {
      throw new NotFoundError('Order');
    }

    const items = await this.orderItemRepository.findAllByOrderId(input.organizationId, order.id);

    const itemDTOs = await Promise.all(
      items.map(async (item) => {
        const addons = await this.orderItemAddonRepository.findAllByOrderItemId(
          input.organizationId,
          item.id,
        );
        return {
          ...OrderItemMapper.toDTO(item),
          addons: addons.map(OrderItemAddonMapper.toDTO),
        };
      }),
    );

    return OrderMapper.toDTO(order, itemDTOs);
  }
}
