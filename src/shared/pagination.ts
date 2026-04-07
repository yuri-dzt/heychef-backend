import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export function getPaginationParams(query: { page?: number; limit?: number }) {
  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 20, 100);
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
}
