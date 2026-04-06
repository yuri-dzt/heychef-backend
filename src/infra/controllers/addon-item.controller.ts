import { Request, Response, NextFunction } from 'express';
import { CreateAddonItemUseCase } from '../../app/addon-item/create-addon-item.use-case';
import { UpdateAddonItemUseCase } from '../../app/addon-item/update-addon-item.use-case';
import { DeleteAddonItemUseCase } from '../../app/addon-item/delete-addon-item.use-case';
import { createAddonItemSchema, updateAddonItemSchema } from '../schemas/addon-item.schema';
import { ValidationError } from '../../shared/errors';

export class AddonItemController {
  constructor(
    private createAddonItemUseCase: CreateAddonItemUseCase,
    private updateAddonItemUseCase: UpdateAddonItemUseCase,
    private deleteAddonItemUseCase: DeleteAddonItemUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createAddonItemSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId;
      const data = await this.createAddonItemUseCase.execute({
        organizationId,
        addonGroupId: req.params.id as string,
        name: parsed.data.name,
        priceCents: parsed.data.priceCents,
      });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateAddonItemSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId;
      const data = await this.updateAddonItemUseCase.execute({
        organizationId,
        addonItemId: req.params.id as string,
        name: parsed.data.name,
        priceCents: parsed.data.priceCents,
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId;
      await this.deleteAddonItemUseCase.execute({
        organizationId,
        addonItemId: req.params.id as string,
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };
}
