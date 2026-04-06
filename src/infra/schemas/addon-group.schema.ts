import { z } from 'zod';

export const createAddonGroupSchema = z.object({
  name: z.string().min(1).max(200),
  minSelect: z.number().int().min(0),
  maxSelect: z.number().int().min(1),
});

export const updateAddonGroupSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  minSelect: z.number().int().min(0).optional(),
  maxSelect: z.number().int().min(1).optional(),
});
