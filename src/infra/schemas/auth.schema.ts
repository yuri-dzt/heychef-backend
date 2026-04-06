import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(4).max(255),
  organizationName: z.string().min(1).max(255),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(255),
  organizationId: z.string().uuid().optional(),
});
