'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit } from 'lucide-react'
import { DeleteButton } from '@/components/admin/delete-button'
import type { Obra } from '@/lib/types/database'

export function ClientObrasPage() {
  const router = useRouter()
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuthAndLoadObras = async () => {
      const supabase = createClient()
      
      // Intentar obtener el usuario con retry (las cookies pueden estar sincronizándose)
      let currentUser = null
      let retries = 3
      
      while (!currentUser && retries > 0) {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (user && !error) {
          currentUser = user
          break
        }
        
        // Esperar un momento antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 500))
        retries--
      }
      
      if (!currentUser) {
        if (process.env.NODE_ENV === 'development') {
          console.log('No se encontró usuario después de reintentos, redirigiendo al login')
        }
        router.push('/admin/login')
        return
      }

      setUser(currentUser)

      // Cargar obras directamente desde Supabase (cliente-side)
      try {
        const { data: obrasData, error } = await supabase
          .from('obras')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setObras(obrasData || [])
            } catch (err) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Error cargando obras:', err)
              }
            } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadObras()

    // Escuchar cambios en la sesión
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
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
    return null
  }

  return (
    <div className="min-h-screen bg-mystic">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-calypso">Gestionar Obras</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">← Volver al Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/obras/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Obra
            </Button>
          </Link>
        </div>

        {obras.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-muted-foreground text-lg mb-4">
              No hay obras disponibles.
            </p>
            <Link href="/admin/obras/new">
              <Button>Crear primera obra</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {obras.map((obra) => (
              <Card key={obra.id} className="overflow-hidden">
                {obra.images && obra.images.length > 0 ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={obra.images[0]}
                      alt={obra.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Sin imagen</p>
                  </div>
                )}
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-calypso">
                    {obra.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {obra.description}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/admin/obras/${obra.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                    <DeleteButton obraId={obra.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

