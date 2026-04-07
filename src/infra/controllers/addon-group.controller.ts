import { Request, Response, NextFunction } from 'express';
import { CreateAddonGroupUseCase } from '../../app/addon-group/create-addon-group.use-case';
import { UpdateAddonGroupUseCase } from '../../app/addon-group/update-addon-group.use-case';
import { DeleteAddonGroupUseCase } from '../../app/addon-group/delete-addon-group.use-case';
import { createAddonGroupSchema, updateAddonGroupSchema } from '../schemas/addon-group.schema';
import { ValidationError } from '../../shared/errors';

export class AddonGroupController {
  constructor(
    private createAddonGroupUseCase: CreateAddonGroupUseCase,
    private updateAddonGroupUseCase: UpdateAddonGroupUseCase,
    private deleteAddonGroupUseCase: DeleteAddonGroupUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createAddonGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId!;
      const data = await this.createAddonGroupUseCase.execute({
        organizationId,
        productId: req.params.id as string,
        name: parsed.data.name,
        minSelect: parsed.data.minSelect,
        maxSelect: parsed.data.maxSelect,
      });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateAddonGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId!;
      const data = await this.updateAddonGroupUseCase.execute({
        organizationId,
        addonGroupId: req.params.id as string,
        name: parsed.data.name,
        minSelect: parsed.data.minSelect,
        maxSelect: parsed.data.maxSelect,
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId!;
      await this.deleteAddonGroupUseCase.execute({
        organizationId,
        addonGroupId: req.params.id as string,
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };
}
