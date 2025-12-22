'use server'

import { createClient } from '@/lib/supabase/server'
import { ObraInsert, ObraUpdate } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

/**
 * Normaliza arrays de imágenes y videos para asegurar que siempre sean arrays
 * También verifica que las URLs de videos no estén en el campo de imágenes
 */
function normalizeObraData(obra: any) {
  let images = Array.isArray(obra.images) ? obra.images : (obra.images ? [obra.images] : [])
  let videos = Array.isArray(obra.videos) ? obra.videos : (obra.videos ? [obra.videos] : [])
  
  // Verificar si hay videos en el campo de imágenes (corrección de datos corruptos)
  const videoUrls = ['video', '.mp4', '.webm', '.ogg']
  const videosInImages = images.filter((url: string) => 
    videoUrls.some(ext => url.toLowerCase().includes(ext))
  )
  
  if (videosInImages.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Detectados videos en el campo de imágenes, corrigiendo...', {
        obraId: obra.id,
        videosEncontrados: videosInImages,
      })
    }
    // Mover videos del campo de imágenes al campo de videos
    videos = [...videos, ...videosInImages]
    images = images.filter((url: string) => 
      !videoUrls.some(ext => url.toLowerCase().includes(ext))
    )
  }
  
  return {
    ...obra,
    images,
    videos,
  }
}

export async function getObras() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error al obtener obras: ${error.message}`)
  }

  // Normalizar datos y debug logging en desarrollo
  const normalizedData = data?.map(normalizeObraData) || []
  
  if (process.env.NODE_ENV === 'development' && normalizedData.length > 0) {
    normalizedData.forEach((obra) => {
      const videosCount = obra.videos.length
      const imagesCount = obra.images.length
      if (videosCount > 0) {
        console.log(`📹 Obra "${obra.title}" tiene ${videosCount} video(s):`, {
          videos: obra.videos,
          images: imagesCount,
          videosType: typeof obra.videos,
          isArray: Array.isArray(obra.videos),
        })
      }
    })
  }

  return normalizedData
}

export async function getObraById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(`Error al obtener obra: ${error.message}`)
  }

  if (!data) {
    throw new Error('Obra no encontrada')
  }

  // Normalizar datos
  return normalizeObraData(data)
}

export async function createObra(obra: ObraInsert) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  // Debug logging en desarrollo
  console.log('🔍 createObra Debug:', {
    title: obra.title,
    imagesCount: obra.images?.length || 0,
    videosCount: obra.videos?.length || 0,
    images: obra.images,
    videos: obra.videos,
    videosType: typeof obra.videos,
    isVideosArray: Array.isArray(obra.videos),
    fullData: obra,
  })

  const { data, error } = await supabase
    .from('obras')
    .insert(obra)
    .select()
    .single()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error al crear obra:', error)
    }
    throw new Error(`Error al crear obra: ${error.message}`)
  }

  console.log('✅ Obra creada exitosamente:', {
    id: data.id,
    imagesCount: data.images?.length || 0,
    videosCount: data.videos?.length || 0,
    images: data.images,
    videos: data.videos,
    videosType: typeof data.videos,
    isVideosArray: Array.isArray(data.videos),
  })

  revalidatePath('/obras')
  revalidatePath('/admin/obras')
  revalidatePath('/')
  
  return data
}

export async function updateObra(id: string, obra: ObraUpdate) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const { data, error } = await supabase
    .from('obras')
    .update(obra)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error al actualizar obra: ${error.message}`)
  }

  revalidatePath('/obras')
  revalidatePath(`/obra/${id}`)
  revalidatePath('/admin/obras')
  revalidatePath('/')
  
  return data
}

export async function deleteObra(id: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  // Obtener solo las imágenes y videos de la obra antes de eliminarla
  // Usamos maybeSingle() para manejar el caso donde la obra no existe
  const { data: obra, error: fetchError } = await supabase
    .from('obras')
    .select('images, videos')
    .eq('id', id)
    .maybeSingle()

  // Si hay un error al obtener la obra, continuamos con la eliminación
  // (puede que la obra ya no exista o haya un problema, pero intentamos eliminarla de todos modos)
  if (fetchError && process.env.NODE_ENV === 'development') {
    console.warn('Error al obtener obra antes de eliminar:', fetchError.message)
  }

  // Eliminar archivos del storage si existen y se pudieron obtener
  if (obra && ((obra.images && obra.images.length > 0) || (obra.videos && obra.videos.length > 0))) {
    try {
      const { deleteFiles } = await import('@/lib/utils/storage')
      await deleteFiles([...(obra.images || []), ...(obra.videos || [])])
    } catch (storageError) {
      // Si falla la eliminación de archivos, registramos el error pero continuamos
      // con la eliminación de la obra en la base de datos
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error al eliminar archivos del storage:', storageError)
      }
    }
  }

  // Eliminar la obra de la base de datos
  const { error } = await supabase.from('obras').delete().eq('id', id)

  if (error) {
    throw new Error(`Error al eliminar obra: ${error.message}`)
  }

  revalidatePath('/obras')
  revalidatePath('/admin/obras')
  revalidatePath(`/obra/${id}`)
}

