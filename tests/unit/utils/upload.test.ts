import { describe, it, expect } from 'vitest'
import {
  validateImage,
  validateVideo,
  formatFileSize,
} from '@/lib/utils/upload'

describe('upload utils', () => {
  describe('validateImage', () => {
    it('should validate correct image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = validateImage(file)
      expect(result.valid).toBe(true)
    })

    it('should reject non-image file', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' })
      Object.defineProperty(file, 'size', { value: 1024 })

      const result = validateImage(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('imagen')
    })

    it('should reject image larger than 5MB', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }) // 6MB

      const result = validateImage(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('5MB')
    })
  })

  describe('validateVideo', () => {
    it('should validate correct video file', () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }) // 10MB

      const result = validateVideo(file)
      expect(result.valid).toBe(true)
    })

    it('should reject non-video file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })

      const result = validateVideo(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('video')
    })

    it('should reject video larger than 50MB', () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 51 * 1024 * 1024 }) // 51MB

      const result = validateVideo(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('50MB')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })
})

