'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, Plus, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Esperar un momento para que las cookies se sincronicen después del login
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser) {
        setUser(currentUser)
      } else {
        // Si no hay usuario, redirigir al login
        router.push('/admin/login')
      }
      setLoading(false)
    }

    checkAuth()

    // Escuchar cambios en la sesión
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/admin/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-mystic flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-calypso"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // El useEffect redirigirá
  }

  return (
    <div className="min-h-screen bg-mystic">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-calypso">Panel de Administración</h1>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-muted-foreground mb-6">
            Bienvenido, {user.email}
          </p>
          <div className="flex gap-4">
            <Link href="/admin/obras">
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Gestionar Obras
              </Button>
            </Link>
            <Link href="/admin/obras/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Obra
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

