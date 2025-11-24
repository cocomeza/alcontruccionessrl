import { getObras } from '@/lib/actions/obras'
import { deleteObra } from '@/lib/actions/obras'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { DeleteButton } from '@/components/delete-button'

export default async function ObrasAdminPage() {
  const obras = await getObras()

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

