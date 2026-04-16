import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres'),
    businessName: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  })
});