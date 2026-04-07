import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priceCents: z.number().int().min(0),
  maxUsers: z.number().int().min(1),
  maxTables: z.number().int().min(1),
  maxProducts: z.number().int().min(1),
  maxCategories: z.number().int().min(1),
  maxOrdersPerDay: z.number().int().min(1),
});

export const updatePlanSchema = createPlanSchema.partial().extend({
  active: z.boolean().optional(),
});
