import { z } from 'zod';

export const getOrganizationSchema = z.object({
  id: z.string().uuid(),
});

export const renewPlanSchema = z.object({
  id: z.string().uuid(),
});
