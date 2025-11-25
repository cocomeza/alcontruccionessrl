import { describe, it, expect } from 'vitest'
import { OBRA_CATEGORIES, type Obra, type ObraInsert, type ObraUpdate } from '@/lib/types/database'

describe('Database Types', () => {
  describe('Obra interface', () => {
    it('should match expected structure', () => {
      const obra: Obra = {
        id: '123',
        title: 'Test Obra',
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
        videos: ['https://example.com/video.mp4'],
        category: 'vivienda',
        created_at: '2024-01-01T00:00:00Z',
      }

      expect(obra.id).toBe('123')
      expect(obra.title).toBe('Test Obra')
      expect(obra.images).toBeInstanceOf(Array)
      expect(obra.videos).toBeInstanceOf(Array)
      expect(obra.category).toBe('vivienda')
    })

    it('should allow optional category', () => {
      const obra: Obra = {
        id: '123',
        title: 'Test',
        description: 'Test',
        images: [],
        videos: [],
        created_at: '2024-01-01',
      }

      expect(obra.category).toBeUndefined()
    })
  })

  describe('ObraInsert interface', () => {
    it('should match expected structure', () => {
      const obraInsert: ObraInsert = {
        title: 'New Obra',
        description: 'New description',
        images: [],
        videos: [],
        category: 'comercial',
      }

      expect(obraInsert.title).toBeDefined()
      expect(obraInsert.description).toBeDefined()
      expect(obraInsert.images).toBeInstanceOf(Array)
      expect(obraInsert.videos).toBeInstanceOf(Array)
    })

    it('should allow optional category', () => {
      const obraInsert: ObraInsert = {
        title: 'Test',
        description: 'Test',
        images: [],
        videos: [],
      }

      expect(obraInsert.category).toBeUndefined()
    })
  })

  describe('ObraUpdate interface', () => {
    it('should allow partial updates', () => {
      const obraUpdate: ObraUpdate = {
        title: 'Updated Title',
      }

      expect(obraUpdate.title).toBe('Updated Title')
      expect(obraUpdate.description).toBeUndefined()
    })

    it('should allow updating only images', () => {
      const obraUpdate: ObraUpdate = {
        images: ['https://example.com/new.jpg'],
      }

      expect(obraUpdate.images).toEqual(['https://example.com/new.jpg'])
    })
  })

  describe('OBRA_CATEGORIES', () => {
    it('should have all required categories', () => {
      const categories = OBRA_CATEGORIES.map(c => c.value)
      
      expect(categories).toContain('vivienda')
      expect(categories).toContain('edificios-altura')
      expect(categories).toContain('comercial')
      expect(categories).toContain('industrial')
      expect(categories).toContain('obra-publica')
      expect(categories).toContain('infraestructura')
      expect(categories).toContain('refaccion')
      expect(categories).toContain('ampliacion')
      expect(categories).toContain('otros')
    })

    it('should have labels for all categories', () => {
      OBRA_CATEGORIES.forEach(category => {
        expect(category.label).toBeTruthy()
        expect(category.value).toBeTruthy()
      })
    })

    it('should have unique values', () => {
      const values = OBRA_CATEGORIES.map(c => c.value)
      const uniqueValues = new Set(values)
      
      expect(values.length).toBe(uniqueValues.size)
    })
  })
})

