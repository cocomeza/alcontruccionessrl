'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function AdminLinkDebug() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState('')

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      try {
        setDebug('Checking auth...')
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        
        if (error) {
          setDebug(`Error: ${error.message}`)
          setIsAdmin(false)
        } else {
          setDebug(`User: ${user ? 'Found' : 'Not found'}`)
          setIsAdmin(!!user)
        }
      } catch (error) {
        setDebug(`Exception: ${error instanceof Error ? error.message : 'Unknown'}`)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setDebug(`Auth change: ${event}, User: ${session?.user ? 'Yes' : 'No'}`)
      setIsAdmin(!!session?.user)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Mostrar siempre para debug (puedes quitar esto después)
  return (
    <div className="flex items-center gap-2">
      {process.env.NODE_ENV === 'development' && (
        <span className="text-xs text-muted-foreground">{debug}</span>
      )}
      {!loading && isAdmin && (
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-calypso" title="Panel de Administración">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Panel de Administración</span>
          </Button>
        </Link>
      )}
    </div>
  )
}

