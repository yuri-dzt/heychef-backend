import { PrismaOrderRepository } from '../repositories/order.repository';
import { PrismaOrderItemRepository } from '../repositories/order-item.repository';
import { PrismaOrderItemAddonRepository } from '../repositories/order-item-addon.repository';
import { ListOrdersUseCase } from '../../app/order/list-orders.use-case';
import { GetOrderUseCase } from '../../app/order/get-order.use-case';
import { UpdateOrderStatusUseCase } from '../../app/order/update-order-status.use-case';
import { CancelOrderUseCase } from '../../app/order/cancel-order.use-case';
import { OrderController } from '../controllers/order.controller';

export function makeOrderController(): OrderController {
  const orderRepository = new PrismaOrderRepository();
  const orderItemRepository = new PrismaOrderItemRepository();
  const orderItemAddonRepository = new PrismaOrderItemAddonRepository();

  const listOrdersUseCase = new ListOrdersUseCase(orderRepository);
  const getOrderUseCase = new GetOrderUseCase(orderRepository, orderItemRepository, orderItemAddonRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  const cancelOrderUseCase = new CancelOrderUseCase(orderRepository);

  return new OrderController(
    listOrdersUseCase,
    getOrderUseCase,
    updateOrderStatusUseCase,
    cancelOrderUseCase,
  );
}
