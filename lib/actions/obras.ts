'use server'

import { createClient } from '@/lib/supabase/server'
import { ObraInsert, ObraUpdate } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

export async function getObras() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error al obtener obras: ${error.message}`)
  }

  return data
}

export async function getObraById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Error al obtener obra: ${error.message}`)
  }

  return data
}

export async function createObra(obra: ObraInsert) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const { data, error } = await supabase
    .from('obras')
    .insert(obra)
    .select()
    .single()

  if (error) {
    throw new Error(`Error al crear obra: ${error.message}`)
  }

  revalidatePath('/obras')
  revalidatePath('/admin/obras')
  
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

  // Obtener la obra para eliminar archivos
  const obra = await getObraById(id)
  
  // Eliminar archivos del storage si existen
  if ((obra.images && obra.images.length > 0) || (obra.videos && obra.videos.length > 0)) {
    const { deleteFiles } = await import('@/lib/utils/storage')
    await deleteFiles([...(obra.images || []), ...(obra.videos || [])])
  }

  const { error } = await supabase.from('obras').delete().eq('id', id)

  if (error) {
    throw new Error(`Error al eliminar obra: ${error.message}`)
  }

  revalidatePath('/obras')
  revalidatePath('/admin/obras')
}

