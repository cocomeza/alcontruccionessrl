import { createClient } from '@/lib/supabase/client'

const BUCKET_NAME = 'obras-media'

export async function uploadFile(
  file: File | Blob,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const supabase = createClient()
  const fileName = `${Date.now()}-${path}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Error al subir archivo: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

  return publicUrl
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = createClient()
  const fileName = path.split('/').pop() || ''

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName])

  if (error) {
    throw new Error(`Error al eliminar archivo: ${error.message}`)
  }
}

export async function deleteFiles(paths: string[]): Promise<void> {
  const supabase = createClient()
  const fileNames = paths.map((path) => path.split('/').pop() || '').filter(Boolean)

  if (fileNames.length === 0) return

  const { error } = await supabase.storage.from(BUCKET_NAME).remove(fileNames)

  if (error) {
    throw new Error(`Error al eliminar archivos: ${error.message}`)
  }
}

