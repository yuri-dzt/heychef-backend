import { z } from 'zod';

export const createAddonItemSchema = z.object({
  name: z.string().min(1).max(200),
  priceCents: z.number().int().min(0),
});

export const updateAddonItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  priceCents: z.number().int().min(0).optional(),
});
