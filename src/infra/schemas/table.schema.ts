import { z } from 'zod';

export const createTableSchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateTableSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  active: z.boolean().optional(),
});
