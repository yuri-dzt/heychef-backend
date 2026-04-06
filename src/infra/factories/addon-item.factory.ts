import { PrismaProductAddonItemRepository } from '../repositories/product-addon-item.repository';
import { CreateAddonItemUseCase } from '../../app/addon-item/create-addon-item.use-case';
import { UpdateAddonItemUseCase } from '../../app/addon-item/update-addon-item.use-case';
import { DeleteAddonItemUseCase } from '../../app/addon-item/delete-addon-item.use-case';
import { AddonItemController } from '../controllers/addon-item.controller';

export function makeAddonItemController(): AddonItemController {
  const repository = new PrismaProductAddonItemRepository();

  const createAddonItemUseCase = new CreateAddonItemUseCase(repository);
  const updateAddonItemUseCase = new UpdateAddonItemUseCase(repository);
  const deleteAddonItemUseCase = new DeleteAddonItemUseCase(repository);

  return new AddonItemController(
    createAddonItemUseCase,
    updateAddonItemUseCase,
    deleteAddonItemUseCase,
  );
}
