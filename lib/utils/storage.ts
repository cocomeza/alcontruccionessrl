import { createClient } from '@/lib/supabase/client'
import { AppError, handleError, logError } from './error-handler'

const BUCKET_NAME = 'obras-media'

/**
 * Verifica si una URL es de Supabase Storage
 */
export function isSupabaseUrl(url: string | undefined | null): boolean {
  if (!url) return false
  return url.includes('supabase.co') || url.includes('supabase.com')
}

/**
 * Obtiene la URL pública de un archivo en Supabase Storage
 */
export function getPublicUrl(path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFile(
  file: File | Blob,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const supabase = createClient()
    
    if (!file || file.size === 0) {
      throw new AppError('El archivo está vacío', 'EMPTY_FILE', 400)
    }

    const fileName = `${Date.now()}-${path.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al subir archivo:', error)
      }
      throw new AppError(
        `Error al subir archivo: ${error.message}`,
        'UPLOAD_ERROR',
        500
      )
    }

    if (!data?.path) {
      throw new AppError('No se recibió la ruta del archivo subido', 'NO_PATH', 500)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

    if (!publicUrl) {
      throw new AppError('No se pudo obtener la URL pública del archivo', 'NO_PUBLIC_URL', 500)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Archivo subido exitosamente:', {
        path: data.path,
        publicUrl,
        fileName,
      })
    }

    return publicUrl
  } catch (error) {
    logError(error, 'uploadFile')
    const handled = handleError(error)
    throw new AppError(handled.message, handled.code, 500)
  }
}

export async function deleteFile(path: string): Promise<void> {
  try {
    if (!path || path.trim() === '') {
      throw new AppError('La ruta del archivo es inválida', 'INVALID_PATH', 400)
    }

    const supabase = createClient()
    // Extraer el nombre del archivo de la URL completa si es necesario
    let fileName: string
    if (path.includes('/')) {
      // Si es una URL completa, extraer el nombre del archivo
      const urlParts = path.split('/')
      fileName = urlParts[urlParts.length - 1]
    } else {
      fileName = path
    }

    if (!fileName) {
      throw new AppError('No se pudo extraer el nombre del archivo', 'NO_FILENAME', 400)
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName])

    if (error) {
      throw new AppError(
        `Error al eliminar archivo: ${error.message}`,
        'DELETE_ERROR',
        500
      )
    }
  } catch (error) {
    logError(error, 'deleteFile')
    const handled = handleError(error)
    throw new AppError(handled.message, handled.code)
  }
}

export async function deleteFiles(paths: string[]): Promise<void> {
  try {
    if (!paths || paths.length === 0) return

    const supabase = createClient()
    const fileNames = paths
      .map((path) => {
        if (path.includes('/')) {
          const urlParts = path.split('/')
          return urlParts[urlParts.length - 1]
        }
        return path
      })
      .filter(Boolean)

    if (fileNames.length === 0) {
      return
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove(fileNames)

    if (error) {
      throw new AppError(
        `Error al eliminar archivos: ${error.message}`,
        'DELETE_FILES_ERROR',
        500
      )
    }
  } catch (error) {
    logError(error, 'deleteFiles')
    const handled = handleError(error)
    throw new AppError(handled.message, handled.code)
  }
}
