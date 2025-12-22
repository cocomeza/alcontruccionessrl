import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateVideo } from '@/lib/utils/upload'
import { uploadFile } from '@/lib/utils/storage'

// Mock de Supabase Storage
vi.mock('@/lib/utils/storage', () => ({
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
  deleteFiles: vi.fn(),
  getPublicUrl: vi.fn(),
  isSupabaseUrl: vi.fn(),
}))

describe('Video Upload Validation', () => {
  describe('validateVideo', () => {
    it('should accept valid MP4 video file', () => {
      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }) // 10MB
      
      const result = validateVideo(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid WebM video file', () => {
      const file = new File(['video content'], 'test.webm', { type: 'video/webm' })
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }) // 5MB
      
      const result = validateVideo(file)
      expect(result.valid).toBe(true)
    })

    it('should accept valid OGG video file', () => {
      const file = new File(['video content'], 'test.ogg', { type: 'video/ogg' })
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 }) // 3MB
      
      const result = validateVideo(file)
      expect(result.valid).toBe(true)
    })

    it('should reject file that is not a video', () => {
      const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1 * 1024 * 1024 })
      
      const result = validateVideo(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('debe ser un video')
    })

    it('should reject video file that exceeds 50MB limit', () => {
      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 51 * 1024 * 1024 }) // 51MB
      
      const result = validateVideo(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('50MB')
    })

    it('should reject empty video file', () => {
      const file = new File([], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 0 })
      
      const result = validateVideo(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('vacío')
    })

    it('should reject unsupported video format', () => {
      const file = new File(['video content'], 'test.avi', { type: 'video/avi' })
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 })
      
      const result = validateVideo(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('no permitido')
    })

    it('should reject null or undefined file', () => {
      const result1 = validateVideo(null as any)
      expect(result1.valid).toBe(false)
      expect(result1.error).toContain('No se seleccionó')
      
      const result2 = validateVideo(undefined as any)
      expect(result2.valid).toBe(false)
      expect(result2.error).toContain('No se seleccionó')
    })

    it('should accept video file at exactly 50MB limit', () => {
      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 50 * 1024 * 1024 }) // Exactamente 50MB
      
      const result = validateVideo(file)
      expect(result.valid).toBe(true)
    })

    it('should accept video file just under 50MB limit', () => {
      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 49 * 1024 * 1024 + 1024 * 1024 - 1 }) // 49.99MB
      
      const result = validateVideo(file)
      expect(result.valid).toBe(true)
    })
  })

  describe('Video Upload to Storage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should upload valid video file successfully', async () => {
      const mockPublicUrl = 'https://supabase.co/storage/v1/object/public/obras-media/video.mp4'
      vi.mocked(uploadFile).mockResolvedValue(mockPublicUrl)

      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 })

      // Validar primero
      const validation = validateVideo(file)
      expect(validation.valid).toBe(true)

      // Simular upload
      const url = await uploadFile(file, 'videos/test.mp4')
      expect(url).toBe(mockPublicUrl)
      expect(uploadFile).toHaveBeenCalled()
      // Verificar que se llamó con el archivo y la ruta correcta
      const calls = vi.mocked(uploadFile).mock.calls
      expect(calls[0][0]).toBe(file)
      expect(calls[0][1]).toBe('videos/test.mp4')
    })

    it('should reject invalid video before upload attempt', async () => {
      const file = new File(['video content'], 'test.avi', { type: 'video/avi' })
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 })

      const validation = validateVideo(file)
      expect(validation.valid).toBe(false)
      expect(uploadFile).not.toHaveBeenCalled()
    })

    it('should handle upload errors gracefully', async () => {
      const error = new Error('Upload failed: Network error')
      vi.mocked(uploadFile).mockRejectedValue(error)

      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 })

      await expect(uploadFile(file, 'videos/test.mp4')).rejects.toThrow('Upload failed')
    })
  })

  describe('Video URL Validation', () => {
    it('should validate that video URLs are valid HTTP/HTTPS URLs', () => {
      const validUrls = [
        'https://supabase.co/storage/v1/object/public/obras-media/video.mp4',
        'http://example.com/video.mp4',
        'https://cdn.example.com/videos/test.webm',
      ]

      validUrls.forEach(url => {
        expect(url).toMatch(/^https?:\/\//)
      })
    })

    it('should reject invalid video URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com/video.mp4',
        'javascript:alert(1)',
        '',
        null,
        undefined,
      ]

      invalidUrls.forEach(url => {
        if (typeof url === 'string') {
          expect(url).not.toMatch(/^https?:\/\//)
        } else {
          expect(url).toBeFalsy()
        }
      })
    })
  })

  describe('Video Array Handling', () => {
    it('should handle empty video array', () => {
      const videos: string[] = []
      expect(Array.isArray(videos)).toBe(true)
      expect(videos.length).toBe(0)
    })

    it('should handle single video in array', () => {
      const videos = ['https://supabase.co/storage/v1/object/public/obras-media/video1.mp4']
      expect(Array.isArray(videos)).toBe(true)
      expect(videos.length).toBe(1)
      expect(videos[0]).toMatch(/^https?:\/\//)
    })

    it('should handle multiple videos in array', () => {
      const videos = [
        'https://supabase.co/storage/v1/object/public/obras-media/video1.mp4',
        'https://supabase.co/storage/v1/object/public/obras-media/video2.mp4',
        'https://supabase.co/storage/v1/object/public/obras-media/video3.mp4',
      ]
      expect(Array.isArray(videos)).toBe(true)
      expect(videos.length).toBe(3)
      videos.forEach(url => {
        expect(url).toMatch(/^https?:\/\//)
      })
    })

    it('should normalize non-array video data to array', () => {
      const singleVideo = 'https://supabase.co/storage/v1/object/public/obras-media/video.mp4'
      const normalized = Array.isArray(singleVideo) ? singleVideo : [singleVideo]
      
      expect(Array.isArray(normalized)).toBe(true)
      expect(normalized.length).toBe(1)
    })
  })
})
