import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { compressImage } from '@/lib/utils/upload'

// Mock canvas and FileReader
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  drawImage: vi.fn(),
} as any))

global.HTMLCanvasElement.prototype.toBlob = vi.fn((callback: (blob: Blob | null) => void) => {
  const blob = new Blob(['compressed'], { type: 'image/jpeg' })
  callback(blob)
})

global.FileReader = class FileReader {
  result: string | null = null
  onload: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null

  readAsDataURL(file: Blob) {
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      if (this.onload) {
        this.onload({ target: { result: this.result } })
      }
    }, 10)
  }
} as any

describe('compressImage', () => {
  beforeEach(() => {
    // Mock Image constructor
    global.Image = class Image {
      width = 2000
      height = 1500
      src = ''
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.onload()
          }
        }, 10)
      }
    } as any
  })

  it('should compress image successfully', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = await compressImage(file)
    
    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('image/jpeg')
  })

  it('should resize large images', async () => {
    const file = new File(['test'], 'large.jpg', { type: 'image/jpeg' })
    
    // Mock Image with large dimensions
    global.Image = class Image {
      width = 4000
      height = 3000
      src = ''
      onload: (() => void) | null = null

      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.onload()
          }
        }, 10)
      }
    } as any

    const result = await compressImage(file)
    expect(result).toBeInstanceOf(Blob)
  })

  it('should handle canvas context error', async () => {
    global.HTMLCanvasElement.prototype.getContext = vi.fn(() => null)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    await expect(compressImage(file)).rejects.toThrow('No se pudo obtener contexto')
  })

  it('should handle image load error', async () => {
    global.Image = class Image {
      onerror: (() => void) | null = null
      src = ''

      constructor() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror()
          }
        }, 10)
      }
    } as any

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    await expect(compressImage(file)).rejects.toThrow('Error al cargar la imagen')
  })
})

