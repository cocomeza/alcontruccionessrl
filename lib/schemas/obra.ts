import { z } from 'zod'

export const obraSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  images: z.array(z.string().url('URL de imagen inválida')).default([]),
  videos: z.array(z.string().url('URL de video inválida')).default([]),
  category: z.enum(['vivienda', 'edificios-altura', 'comercial', 'industrial', 'obra-publica', 'infraestructura', 'refaccion', 'ampliacion', 'otros']).optional(),
  featured: z.boolean().default(false).optional(),
})

export type ObraFormData = z.infer<typeof obraSchema>

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

