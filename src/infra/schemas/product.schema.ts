import { z } from 'zod';

export const createProductSchema = z.object({
  categoryId: z.string().min(1).max(255),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priceCents: z.number().int().min(0),
  imageUrl: z.string().max(2000).optional(),
  ingredients: z.array(z.string().max(100)).max(30).optional(),
});

export const updateProductSchema = z.object({
  categoryId: z.string().min(1).max(255).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  priceCents: z.number().int().min(0).optional(),
  imageUrl: z.string().max(2000).optional(),
  ingredients: z.array(z.string().max(100)).max(30).optional(),
  active: z.boolean().optional(),
});
