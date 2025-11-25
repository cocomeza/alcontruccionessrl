import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadFile, deleteFile, deleteFiles } from '@/lib/utils/storage'

// Mock Supabase client
const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()
const mockRemove = vi.fn()
const mockFrom = vi.fn(() => ({
  upload: mockUpload,
  getPublicUrl: mockGetPublicUrl,
  remove: mockRemove,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: mockFrom,
    },
  })),
}))

describe('storage utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('uploadFile', () => {
    it('should upload file and return public URL', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const mockPublicUrl = 'https://example.com/test.jpg'

      mockUpload.mockResolvedValue({
        data: { path: 'test-path' },
        error: null,
      })
      
      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: mockPublicUrl },
      })

      const url = await uploadFile(mockFile, 'images/test.jpg')
      expect(url).toBe(mockPublicUrl)
      expect(mockUpload).toHaveBeenCalled()
    })

    it('should throw error on upload failure', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      mockUpload.mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' },
      })

      await expect(uploadFile(mockFile, 'images/test.jpg')).rejects.toThrow('Upload failed')
    })
  })

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      mockRemove.mockResolvedValue({
        error: null,
      })

      await deleteFile('https://example.com/path/to/file.jpg')
      expect(mockRemove).toHaveBeenCalled()
    })

    it('should throw error on delete failure', async () => {
      mockRemove.mockResolvedValue({
        error: { message: 'Delete failed' },
      })

      await expect(deleteFile('https://example.com/file.jpg')).rejects.toThrow('Delete failed')
    })
  })

  describe('deleteFiles', () => {
    it('should delete multiple files', async () => {
      mockRemove.mockResolvedValue({
        error: null,
      })

      const urls = [
        'https://example.com/file1.jpg',
        'https://example.com/file2.jpg',
      ]

      await deleteFiles(urls)
      expect(mockRemove).toHaveBeenCalled()
    })

    it('should return early if no file names', async () => {
      await deleteFiles([])
      expect(mockRemove).not.toHaveBeenCalled()
    })
  })
})

