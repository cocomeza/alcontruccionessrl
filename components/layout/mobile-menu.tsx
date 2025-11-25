'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

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
      }
    }

    // Verificar autenticación inicial
    checkAuth()

    // Escuchar cambios en la sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {open && (
        <nav className="md:hidden fixed top-[73px] left-0 right-0 bg-white dark:bg-card border-b shadow-lg z-50 max-h-[calc(100vh-73px)] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block py-2 text-center text-muted-foreground hover:text-calypso transition-colors"
              onClick={() => setOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/obras"
              className="block py-2 text-center text-muted-foreground hover:text-calypso transition-colors"
              onClick={() => setOpen(false)}
            >
              Obras
            </Link>
            <Link
              href="/nosotros"
              className="block py-2 text-center text-muted-foreground hover:text-calypso transition-colors"
              onClick={() => setOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className="block py-2 text-center text-muted-foreground hover:text-calypso transition-colors"
              onClick={() => setOpen(false)}
            >
              Contacto
            </Link>
            <Link
              href={isAdmin ? "/admin/dashboard" : "/admin/login"}
              className="block py-2 text-center text-muted-foreground hover:text-calypso transition-colors border-t mt-2 pt-2"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                <span>{isAdmin ? "Admin" : "Acceder Admin"}</span>
              </div>
            </Link>
          </div>
        </nav>
      )}
    </>
  )
}
