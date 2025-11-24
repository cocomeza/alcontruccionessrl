import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, Plus, Edit } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
            Bienvenido, {user?.email}
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

