import { getObraById } from '@/lib/actions/obras'
import { ObraFormImproved } from '@/components/obra/obra-form-improved'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

export default async function EditObraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let obra
  try {
    obra = await getObraById(id)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-mystic">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-calypso">Editar Obra</h1>
          <Link href="/admin/obras">
            <Button variant="outline">← Volver</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <ObraFormImproved obra={obra} />
        </div>
      </main>
    </div>
  )
}

