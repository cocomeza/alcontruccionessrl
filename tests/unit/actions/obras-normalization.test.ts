import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getObras, getObraById } from '@/lib/actions/obras'

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  order: vi.fn(() => mockSupabaseClient),
  maybeSingle: vi.fn(),
  single: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}))

describe('Obras Data Normalization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getObras', () => {
    it('should normalize images array when it is already an array', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Obra',
            description: 'Test',
            images: ['https://example.com/image1.jpg'],
            videos: ['https://example.com/video1.mp4'],
          },
        ],
        error: null,
      })

      const obras = await getObras()

      expect(obras).toHaveLength(1)
      expect(Array.isArray(obras[0].images)).toBe(true)
      expect(Array.isArray(obras[0].videos)).toBe(true)
      expect(obras[0].images).toEqual(['https://example.com/image1.jpg'])
      expect(obras[0].videos).toEqual(['https://example.com/video1.mp4'])
    })

    it('should normalize images when it is a single string', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Obra',
            description: 'Test',
            images: 'https://example.com/image1.jpg', // String instead of array
            videos: [],
          },
        ],
        error: null,
      })

      const obras = await getObras()

      expect(Array.isArray(obras[0].images)).toBe(true)
      expect(obras[0].images).toEqual(['https://example.com/image1.jpg'])
    })

    it('should normalize videos when it is a single string', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Obra',
            description: 'Test',
            images: [],
            videos: 'https://example.com/video1.mp4', // String instead of array
          },
        ],
        error: null,
      })

      const obras = await getObras()

      expect(Array.isArray(obras[0].videos)).toBe(true)
      expect(obras[0].videos).toEqual(['https://example.com/video1.mp4'])
    })

    it('should normalize empty/null images to empty array', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Obra',
            description: 'Test',
            images: null,
            videos: [],
          },
        ],
        error: null,
      })

      const obras = await getObras()

      expect(Array.isArray(obras[0].images)).toBe(true)
      expect(obras[0].images).toEqual([])
    })

    it('should normalize empty/null videos to empty array', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Obra',
            description: 'Test',
            images: [],
            videos: null,
          },
        ],
        error: null,
      })

      const obras = await getObras()

      expect(Array.isArray(obras[0].videos)).toBe(true)
      expect(obras[0].videos).toEqual([])
    })

    it('should handle multiple obras with mixed data formats', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Obra 1',
            description: 'Test',
            images: ['https://example.com/image1.jpg'],
            videos: ['https://example.com/video1.mp4'],
          },
          {
            id: '2',
            title: 'Obra 2',
            description: 'Test',
            images: 'https://example.com/image2.jpg', // String
            videos: null, // Null
          },
          {
            id: '3',
            title: 'Obra 3',
            description: 'Test',
            images: [],
            videos: 'https://example.com/video3.mp4', // String
          },
        ],
        error: null,
      })

      const obras = await getObras()

      expect(obras).toHaveLength(3)
      
      // Obra 1 - already arrays
      expect(Array.isArray(obras[0].images)).toBe(true)
      expect(Array.isArray(obras[0].videos)).toBe(true)
      
      // Obra 2 - string image, null video
      expect(Array.isArray(obras[1].images)).toBe(true)
      expect(obras[1].images).toEqual(['https://example.com/image2.jpg'])
      expect(Array.isArray(obras[1].videos)).toBe(true)
      expect(obras[1].videos).toEqual([])
      
      // Obra 3 - empty images, string video
      expect(Array.isArray(obras[2].images)).toBe(true)
      expect(obras[2].images).toEqual([])
      expect(Array.isArray(obras[2].videos)).toBe(true)
      expect(obras[2].videos).toEqual(['https://example.com/video3.mp4'])
    })
  })

  describe('getObraById', () => {
    it('should normalize data for single obra', async () => {
      mockSupabaseClient.maybeSingle.mockResolvedValue({
        data: {
          id: '1',
          title: 'Test Obra',
          description: 'Test',
          images: ['https://example.com/image1.jpg'],
          videos: ['https://example.com/video1.mp4'],
        },
        error: null,
      })

      const obra = await getObraById('1')

      expect(Array.isArray(obra.images)).toBe(true)
      expect(Array.isArray(obra.videos)).toBe(true)
      expect(obra.images).toEqual(['https://example.com/image1.jpg'])
      expect(obra.videos).toEqual(['https://example.com/video1.mp4'])
    })

    it('should normalize string images/videos to arrays', async () => {
      mockSupabaseClient.maybeSingle.mockResolvedValue({
        data: {
          id: '1',
          title: 'Test Obra',
          description: 'Test',
          images: 'https://example.com/image1.jpg',
          videos: 'https://example.com/video1.mp4',
        },
        error: null,
      })

      const obra = await getObraById('1')

      expect(Array.isArray(obra.images)).toBe(true)
      expect(Array.isArray(obra.videos)).toBe(true)
      expect(obra.images).toEqual(['https://example.com/image1.jpg'])
      expect(obra.videos).toEqual(['https://example.com/video1.mp4'])
    })
  })
})

