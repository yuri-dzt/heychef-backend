import { z } from 'zod';

export const tableTokenParamsSchema = z.object({
  tableToken: z.string().min(1),
});

export const createPublicOrderSchema = z.object({
  customerName: z.string().max(255).optional(),
  notes: z.string().max(1000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
        addonItemIds: z.array(z.string().uuid()).optional(),
        notes: z.string().max(500).optional(),
      }),
    )
    .min(1)
    .max(30),
});
