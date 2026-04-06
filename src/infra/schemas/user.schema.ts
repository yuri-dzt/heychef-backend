import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(4).max(255),
  role: z.string().min(1).max(50),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(6).max(255).optional(),
  role: z.string().min(1).max(50).optional(),
});

export const userParamsSchema = z.object({
  id: z.string().uuid(),
});
