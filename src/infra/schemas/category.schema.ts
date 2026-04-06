import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  orderIndex: z.number().int().min(0).optional().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  orderIndex: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});
