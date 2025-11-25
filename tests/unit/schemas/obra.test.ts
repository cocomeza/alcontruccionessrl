import { describe, it, expect } from 'vitest'
import { obraSchema, loginSchema } from '@/lib/schemas/obra'

describe('obraSchema', () => {
  it('should validate correct obra data', () => {
    const validData = {
      title: 'Casa Moderna',
      description: 'Una hermosa casa moderna con diseño contemporáneo',
      images: ['https://example.com/image.jpg'],
      videos: [],
      category: 'vivienda' as const,
    }

    const result = obraSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject title shorter than 3 characters', () => {
    const invalidData = {
      title: 'Ab',
      description: 'Una descripción válida',
      images: [],
      videos: [],
    }

    const result = obraSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('3 caracteres')
    }
  })

  it('should reject title longer than 200 characters', () => {
    const invalidData = {
      title: 'A'.repeat(201),
      description: 'Una descripción válida',
      images: [],
      videos: [],
    }

    const result = obraSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject description shorter than 10 characters', () => {
    const invalidData = {
      title: 'Casa Moderna',
      description: 'Corta',
      images: [],
      videos: [],
    }

    const result = obraSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid image URL', () => {
    const invalidData = {
      title: 'Casa Moderna',
      description: 'Una descripción válida',
      images: ['not-a-url'],
      videos: [],
    }

    const result = obraSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept valid category', () => {
    const validData = {
      title: 'Casa Moderna',
      description: 'Una descripción válida',
      images: [],
      videos: [],
      category: 'comercial' as const,
    }

    const result = obraSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid category', () => {
    const invalidData = {
      title: 'Casa Moderna',
      description: 'Una descripción válida',
      images: [],
      videos: [],
      category: 'invalid-category',
    }

    const result = obraSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should default to empty arrays for images and videos', () => {
    const data = {
      title: 'Casa Moderna',
      description: 'Una descripción válida',
    }

    const result = obraSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.images).toEqual([])
      expect(result.data.videos).toEqual([])
    }
  })
})

describe('loginSchema', () => {
  it('should validate correct login data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'password123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Email')
    }
  })

  it('should reject password shorter than 6 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '12345',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('6 caracteres')
    }
  })

  it('should accept password with 6 or more characters', () => {
    const validData = {
      email: 'test@example.com',
      password: '123456',
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})

