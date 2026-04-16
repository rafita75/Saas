import { z } from 'zod';

export const slugSchema = z.object({
  params: z.object({
    slug: z.string().min(2, 'Slug inválido').regex(/^[a-z0-9-]+$/, 'Formato de slug inválido')
  })
});

export const idSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB inválido')
  })
});

export const userIdSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de usuario inválido')
  })
});