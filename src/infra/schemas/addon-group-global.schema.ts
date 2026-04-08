import { z } from 'zod';

export const createGlobalAddonGroupSchema = z.object({
  name: z.string().min(1).max(200),
  minSelect: z.number().int().min(0),
  maxSelect: z.number().int().min(1),
});

export const updateGlobalAddonGroupSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  minSelect: z.number().int().min(0).optional(),
  maxSelect: z.number().int().min(1).optional(),
});

export const createGlobalAddonItemSchema = z.object({
  name: z.string().min(1).max(200),
  priceCents: z.number().int().min(0),
});

export const updateGlobalAddonItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  priceCents: z.number().int().min(0).optional(),
});

export const linkToProductSchema = z.object({
  productId: z.string().uuid(),
});
