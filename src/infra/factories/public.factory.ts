import { PrismaOrderRepository } from '../repositories/order.repository';
import { PrismaOrderItemRepository } from '../repositories/order-item.repository';
import { PrismaOrderItemAddonRepository } from '../repositories/order-item-addon.repository';
import { GetPublicMenuUseCase } from '../../app/public/get-menu.use-case';
import { CreatePublicOrderUseCase } from '../../app/public/create-public-order.use-case';
import { PublicController } from '../controllers/public.controller';

export function makePublicController(): PublicController {
  const orderRepository = new PrismaOrderRepository();
  const orderItemRepository = new PrismaOrderItemRepository();
  const orderItemAddonRepository = new PrismaOrderItemAddonRepository();

  const getPublicMenuUseCase = new GetPublicMenuUseCase();
  const createPublicOrderUseCase = new CreatePublicOrderUseCase(
    orderRepository,
    orderItemRepository,
    orderItemAddonRepository,
  );

  return new PublicController(getPublicMenuUseCase, createPublicOrderUseCase);
}
