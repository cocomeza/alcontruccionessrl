'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data?.session || !data?.user) {
      throw new Error('No se recibió sesión del servidor')
    }

    // Las cookies ya están establecidas por createClient durante signInWithPassword
    // Redirigir al dashboard
    redirect('/admin/dashboard')
  } catch (error: any) {
    // Si es un error de redirect, re-lanzarlo (Next.js lo maneja)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    // Para otros errores, lanzarlos normalmente
    throw error
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

