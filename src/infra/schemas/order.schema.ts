import { z } from 'zod';

export const orderParamsSchema = z.object({
  id: z.string().uuid(),
});

export const orderQuerySchema = z.object({
  status: z.enum(['RECEIVED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED']).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['RECEIVED', 'PREPARING', 'READY', 'DELIVERED']),
});

export const cancelOrderSchema = z.object({
  reason: z.string().max(500).optional(),
});
