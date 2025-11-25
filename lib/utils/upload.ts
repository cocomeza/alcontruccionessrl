const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// Compresión básica del lado del cliente usando Canvas API
// Para compresión avanzada, usar el server action compressImageServer
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'))
          return
        }

        // Calcular dimensiones manteniendo aspect ratio
        let width = img.width
        let height = img.height
        const maxWidth = 1920
        const maxHeight = 1080

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        // Dibujar y comprimir
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Error al comprimir la imagen'))
            }
          },
          'image/jpeg',
          0.85 // Calidad 85%
        )
      }
      img.onerror = () => reject(new Error('Error al cargar la imagen'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo' }
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de imagen no permitido. Formatos permitidos: JPEG, PNG, WebP, GIF`,
    }
  }

  if (file.size === 0) {
    return { valid: false, error: 'El archivo está vacío' }
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
  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo' }
  }

  if (!file.type.startsWith('video/')) {
    return { valid: false, error: 'El archivo debe ser un video' }
  }

  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de video no permitido. Formatos permitidos: MP4, WebM, OGG`,
    }
  }

  if (file.size === 0) {
    return { valid: false, error: 'El archivo está vacío' }
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

