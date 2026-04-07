import { z } from 'zod';

export const getOrganizationSchema = z.object({
  id: z.string().uuid(),
});

export const renewPlanSchema = z.object({
  id: z.string().uuid(),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(255),
  adminName: z.string().min(1).max(255),
  adminEmail: z.string().email().max(255),
  adminPassword: z.string().min(4).max(255),
  planId: z.string().uuid().optional(),
});
