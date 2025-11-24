import sharp from 'sharp'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export async function compressImage(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const compressed = await sharp(buffer)
    .resize(1920, 1080, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer()

  return new Blob([compressed], { type: 'image/jpeg' })
}

export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `La imagen no puede superar ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}

export function validateVideo(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('video/')) {
    return { valid: false, error: 'El archivo debe ser un video' }
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `El video no puede superar ${MAX_VIDEO_SIZE / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

