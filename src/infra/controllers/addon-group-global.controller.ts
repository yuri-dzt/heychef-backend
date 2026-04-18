import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/prisma';
import { NotFoundError, ValidationError } from '../../shared/errors';
import {
  createGlobalAddonGroupSchema,
  updateGlobalAddonGroupSchema,
  createGlobalAddonItemSchema,
  updateGlobalAddonItemSchema,
  linkToProductSchema,
} from '../schemas/addon-group-global.schema';

export class AddonGroupGlobalController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.user!.organizationId!;

      const groups = await prisma.productAddonGroup.findMany({
        where: { organization_id: orgId, product_id: null },
        include: {
          items: true,
          product_links: {
            include: {
              product: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      const data = groups.map((g) => ({
        id: g.id,
        name: g.name,
        minSelect: g.min_select,
        maxSelect: g.max_select,
        items: g.items.map((i) => ({
          id: i.id,
          name: i.name,
          priceCents: i.price_cents,
        })),
        products: g.product_links.map((l) => ({
          id: l.product.id,
          name: l.product.name,
        })),
      }));

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createGlobalAddonGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(details);
      }

      const orgId = req.user!.organizationId!;
      const now = Date.now();

      const group = await prisma.productAddonGroup.create({
        data: {
          organization_id: orgId,
          product_id: null,
          name: parsed.data.name,
          min_select: parsed.data.minSelect,
          max_select: parsed.data.maxSelect,
          created_at: BigInt(now),
        },
      });

      res.status(201).json({
        data: {
          id: group.id,
          name: group.name,
          minSelect: group.min_select,
          maxSelect: group.max_select,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateGlobalAddonGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(details);
      }

      const orgId = req.user!.organizationId!;
      const groupId = req.params.id as string;

      const existing = await prisma.productAddonGroup.findFirst({
        where: { id: groupId, organization_id: orgId, product_id: null },
      });

      if (!existing) {
        throw new NotFoundError('Addon group');
      }

      const now = Date.now();
      const group = await prisma.productAddonGroup.update({
        where: { id: groupId },
        data: {
          name: parsed.data.name,
          min_select: parsed.data.minSelect,
          max_select: parsed.data.maxSelect,
          updated_at: BigInt(now),
        },
      });

      res.status(200).json({
        data: {
          id: group.id,
          name: group.name,
          minSelect: group.min_select,
          maxSelect: group.max_select,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.user!.organizationId!;
      const groupId = req.params.id as string;

      const existing = await prisma.productAddonGroup.findFirst({
        where: { id: groupId, organization_id: orgId, product_id: null },
      });

      if (!existing) {
        throw new NotFoundError('Addon group');
      }

      await prisma.productAddonGroup.delete({
        where: { id: groupId },
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };

  createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createGlobalAddonItemSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(details);
      }

      const orgId = req.user!.organizationId!;
      const groupId = req.params.groupId as string;

      const group = await prisma.productAddonGroup.findFirst({
        where: { id: groupId, organization_id: orgId, product_id: null },
      });

      if (!group) {
        throw new NotFoundError('Addon group');
      }

      const now = Date.now();
      const item = await prisma.productAddonItem.create({
        data: {
          organization_id: orgId,
          addon_group_id: groupId,
          name: parsed.data.name,
          price_cents: parsed.data.priceCents,
          created_at: BigInt(now),
        },
      });

      res.status(201).json({
        data: {
          id: item.id,
          name: item.name,
          priceCents: item.price_cents,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateGlobalAddonItemSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(details);
      }

      const orgId = req.user!.organizationId!;
      const itemId = req.params.itemId as string;

      const existing = await prisma.productAddonItem.findFirst({
        where: {
          id: itemId,
          organization_id: orgId,
          addon_group: { product_id: null },
        },
      });

      if (!existing) {
        throw new NotFoundError('Addon item');
      }

      const now = Date.now();
      const item = await prisma.productAddonItem.update({
        where: { id: itemId },
        data: {
          name: parsed.data.name,
          price_cents: parsed.data.priceCents,
          updated_at: BigInt(now),
        },
      });

      res.status(200).json({
        data: {
          id: item.id,
          name: item.name,
          priceCents: item.price_cents,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.user!.organizationId!;
      const itemId = req.params.itemId as string;

      const existing = await prisma.productAddonItem.findFirst({
        where: {
          id: itemId,
          organization_id: orgId,
          addon_group: { product_id: null },
        },
      });

      if (!existing) {
        throw new NotFoundError('Addon item');
      }

      await prisma.productAddonItem.delete({
        where: { id: itemId },
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };

  linkToProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = linkToProductSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(details);
      }

      const orgId = req.user!.organizationId!;
      const groupId = req.params.groupId as string;

      const group = await prisma.productAddonGroup.findFirst({
        where: { id: groupId, organization_id: orgId, product_id: null },
      });

      if (!group) {
        throw new NotFoundError('Addon group');
      }

      const product = await prisma.product.findFirst({
        where: { id: parsed.data.productId, organization_id: orgId },
      });

      if (!product) {
        throw new NotFoundError('Product');
      }

      const now = Date.now();
      const link = await prisma.productAddonGroupLink.create({
        data: {
          organization_id: orgId,
          product_id: parsed.data.productId,
          addon_group_id: groupId,
          created_at: BigInt(now),
        },
      });

      res.status(201).json({
        data: {
          id: link.id,
          productId: link.product_id,
          addonGroupId: link.addon_group_id,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  unlinkFromProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.user!.organizationId!;
      const groupId = req.params.groupId as string;
      const productId = req.params.productId as string;

      const link = await prisma.productAddonGroupLink.findFirst({
        where: {
          addon_group_id: groupId,
          product_id: productId,
          organization_id: orgId,
        },
      });

      if (!link) {
        throw new NotFoundError('Link');
      }

      await prisma.productAddonGroupLink.delete({
        where: { id: link.id },
      });

      res.status(204).json({ data: null });
    } catch (error) {
      next(error);
    }
  };
}
