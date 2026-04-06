import { z } from 'zod';

export const callWaiterParamsSchema = z.object({
  id: z.string().uuid(),
});

export const callWaiterQuerySchema = z.object({
  status: z.enum(['OPEN', 'RESOLVED']).optional(),
});

export const callWaiterTokenParamsSchema = z.object({
  tableToken: z.string().min(1),
});
