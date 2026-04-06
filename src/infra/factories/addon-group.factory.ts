import { PrismaProductAddonGroupRepository } from '../repositories/product-addon-group.repository';
import { CreateAddonGroupUseCase } from '../../app/addon-group/create-addon-group.use-case';
import { UpdateAddonGroupUseCase } from '../../app/addon-group/update-addon-group.use-case';
import { DeleteAddonGroupUseCase } from '../../app/addon-group/delete-addon-group.use-case';
import { AddonGroupController } from '../controllers/addon-group.controller';

export function makeAddonGroupController(): AddonGroupController {
  const repository = new PrismaProductAddonGroupRepository();

  const createAddonGroupUseCase = new CreateAddonGroupUseCase(repository);
  const updateAddonGroupUseCase = new UpdateAddonGroupUseCase(repository);
  const deleteAddonGroupUseCase = new DeleteAddonGroupUseCase(repository);

  return new AddonGroupController(
    createAddonGroupUseCase,
    updateAddonGroupUseCase,
    deleteAddonGroupUseCase,
  );
}
