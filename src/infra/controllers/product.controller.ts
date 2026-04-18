import { Request, Response, NextFunction } from 'express';
import { ListProductsUseCase } from '../../app/product/list-products.use-case';
import { GetProductUseCase } from '../../app/product/get-product.use-case';
import { CreateProductUseCase } from '../../app/product/create-product.use-case';
import { UpdateProductUseCase } from '../../app/product/update-product.use-case';
import { DeleteProductUseCase } from '../../app/product/delete-product.use-case';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { ValidationError } from '../../shared/errors';
import { prisma } from '../../shared/prisma';
import { paginationSchema, getPaginationParams } from '../../shared/pagination';

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
      const organizationId = req.user!.organizationId!;
      const pagination = paginationSchema.parse(req.query);
      const { skip, take, page, limit } = getPaginationParams(pagination);

      const where = { organization_id: organizationId };

      const [records, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: { created_at: 'asc' },
          skip,
          take,
          include: {
            addon_groups: {
              include: { items: true },
            },
            addon_group_links: {
              include: {
                addon_group: { include: { items: true } },
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      const data = records.map((r) => {
        const mapGroup = (g: typeof r.addon_groups[number]) => ({
          id: g.id,
          name: g.name,
          minSelect: g.min_select,
          maxSelect: g.max_select,
          items: g.items.map((i) => ({
            id: i.id,
            name: i.name,
            priceCents: i.price_cents,
          })),
        });

        const allAddonGroups = [
          ...r.addon_groups.map(mapGroup),
          ...r.addon_group_links.map((l) => mapGroup(l.addon_group)),
        ];
        const addonGroups = [...new Map(allAddonGroups.map((g) => [g.id, g])).values()];

        return {
          id: r.id,
          organizationId: r.organization_id,
          categoryId: r.category_id,
          name: r.name,
          description: r.description ?? undefined,
          priceCents: r.price_cents,
          imageUrl: r.image_url ?? undefined,
          ingredients: r.ingredients ? JSON.parse(r.ingredients) : undefined,
          active: r.active,
          createdAt: Number(r.created_at),
          updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
          addonGroups,
        };
      });

      res.status(200).json({ data, total, page, limit });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId!;
      const r = await prisma.product.findFirst({
        where: { id: req.params.id as string, organization_id: organizationId },
        include: {
          addon_groups: {
            include: { items: true },
          },
          addon_group_links: {
            include: {
              addon_group: { include: { items: true } },
            },
          },
        },
      });

      if (!r) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      const mapGroup = (g: typeof r.addon_groups[number]) => ({
        id: g.id,
        name: g.name,
        minSelect: g.min_select,
        maxSelect: g.max_select,
        items: g.items.map((i) => ({
          id: i.id,
          name: i.name,
          priceCents: i.price_cents,
        })),
      });

      const allAddonGroups = [
        ...r.addon_groups.map(mapGroup),
        ...r.addon_group_links.map((l) => mapGroup(l.addon_group)),
      ];
      const addonGroups = [...new Map(allAddonGroups.map((g) => [g.id, g])).values()];

      const data = {
        id: r.id,
        organizationId: r.organization_id,
        categoryId: r.category_id,
        name: r.name,
        description: r.description ?? undefined,
        priceCents: r.price_cents,
        imageUrl: r.image_url ?? undefined,
        ingredients: r.ingredients ? JSON.parse(r.ingredients) : undefined,
        active: r.active,
        createdAt: Number(r.created_at),
        updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
        addonGroups,
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
        const details = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(details);
      }

      const organizationId = req.user!.organizationId!;
      const data = await this.createProductUseCase.execute({
        organizationId,
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
        description: parsed.data.description,
        priceCents: parsed.data.priceCents,
        imageUrl: parsed.data.imageUrl,
        ingredients: parsed.data.ingredients,
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
        const details = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(details);
      }

      const organizationId = req.user!.organizationId!;
      const data = await this.updateProductUseCase.execute({
        organizationId,
        productId: req.params.id as string,
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
        description: parsed.data.description,
        priceCents: parsed.data.priceCents,
        imageUrl: parsed.data.imageUrl,
        ingredients: parsed.data.ingredients,
        active: parsed.data.active,
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user!.organizationId!;
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
