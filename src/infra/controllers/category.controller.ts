import { Request, Response, NextFunction } from 'express';
import { ListCategoriesUseCase } from '../../app/category/list-categories.use-case';
import { CreateCategoryUseCase } from '../../app/category/create-category.use-case';
import { UpdateCategoryUseCase } from '../../app/category/update-category.use-case';
import { DeleteCategoryUseCase } from '../../app/category/delete-category.use-case';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { ValidationError } from '../../shared/errors';

export class CategoryController {
  constructor(
    private listCategoriesUseCase: ListCategoriesUseCase,
    private createCategoryUseCase: CreateCategoryUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId;
      const data = await this.listCategoriesUseCase.execute({ organizationId });
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId;
      const data = await this.createCategoryUseCase.execute({
        organizationId,
        name: parsed.data.name,
        orderIndex: parsed.data.orderIndex,
      });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId;
      const data = await this.updateCategoryUseCase.execute({
        organizationId,
        categoryId: req.params.id as string,
        name: parsed.data.name,
        orderIndex: parsed.data.orderIndex,
        active: parsed.data.active,
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId;
      await this.deleteCategoryUseCase.execute({
        organizationId,
        categoryId: req.params.id as string,
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };
}
