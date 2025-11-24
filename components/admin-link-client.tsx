'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function AdminLinkClient() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAdmin(!!user)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    // Verificar autenticación inicial
    checkAuth()

    // Escuchar cambios en la sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session?.user)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Siempre mostrar el icono, pero redirigir al login o dashboard según autenticación
  const href = isAdmin ? '/admin/dashboard' : '/admin/login'
  const title = isAdmin ? 'Panel de Administración' : 'Acceder al Panel de Administración'

  return (
    <Link href={href}>
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-calypso" title={title}>
        <Settings className="h-5 w-5" />
        <span className="sr-only">{title}</span>
      </Button>
    </Link>
  )
}
