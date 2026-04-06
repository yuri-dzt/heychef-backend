import { Request, Response, NextFunction } from 'express';
import { ListProductsUseCase } from '../../app/product/list-products.use-case';
import { GetProductUseCase } from '../../app/product/get-product.use-case';
import { CreateProductUseCase } from '../../app/product/create-product.use-case';
import { UpdateProductUseCase } from '../../app/product/update-product.use-case';
import { DeleteProductUseCase } from '../../app/product/delete-product.use-case';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { ValidationError } from '../../shared/errors';
import { prisma } from '../../shared/prisma';

export class ProductController {
  constructor(
    private listProductsUseCase: ListProductsUseCase,
    private getProductUseCase: GetProductUseCase,
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId;
      const records = await prisma.product.findMany({
        where: { organization_id: organizationId },
        orderBy: { created_at: 'asc' },
        include: {
          addon_groups: {
            include: { items: true },
          },
        },
      });

      const data = records.map((r) => ({
        id: r.id,
        organizationId: r.organization_id,
        categoryId: r.category_id,
        name: r.name,
        description: r.description ?? undefined,
        priceCents: r.price_cents,
        imageUrl: r.image_url ?? undefined,
        active: r.active,
        createdAt: Number(r.created_at),
        updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
        addonGroups: r.addon_groups.map((g) => ({
          id: g.id,
          name: g.name,
          minSelect: g.min_select,
          maxSelect: g.max_select,
          items: g.items.map((i) => ({
            id: i.id,
            name: i.name,
            priceCents: i.price_cents,
          })),
        })),
      }));

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId;
      const r = await prisma.product.findFirst({
        where: { id: req.params.id as string, organization_id: organizationId },
        include: {
          addon_groups: {
            include: { items: true },
          },
        },
      });

      if (!r) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      const data = {
        id: r.id,
        organizationId: r.organization_id,
        categoryId: r.category_id,
        name: r.name,
        description: r.description ?? undefined,
        priceCents: r.price_cents,
        imageUrl: r.image_url ?? undefined,
        active: r.active,
        createdAt: Number(r.created_at),
        updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
        addonGroups: r.addon_groups.map((g) => ({
          id: g.id,
          name: g.name,
          minSelect: g.min_select,
          maxSelect: g.max_select,
          items: g.items.map((i) => ({
            id: i.id,
            name: i.name,
            priceCents: i.price_cents,
          })),
        })),
      };

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createProductSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId;
      const data = await this.createProductUseCase.execute({
        organizationId,
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
        description: parsed.data.description,
        priceCents: parsed.data.priceCents,
        imageUrl: parsed.data.imageUrl,
      });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateProductSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const organizationId = req.user!.organizationId;
      const data = await this.updateProductUseCase.execute({
        organizationId,
        productId: req.params.id as string,
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
        description: parsed.data.description,
        priceCents: parsed.data.priceCents,
        imageUrl: parsed.data.imageUrl,
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
      await this.deleteProductUseCase.execute({
        organizationId,
        productId: req.params.id as string,
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };
}
