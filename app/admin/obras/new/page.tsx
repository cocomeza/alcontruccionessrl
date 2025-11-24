import { ObraFormImproved } from '@/components/obra-form-improved'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewObraPage() {
  return (
    <div className="min-h-screen bg-mystic">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-calypso">Nueva Obra</h1>
          <Link href="/admin/obras">
            <Button variant="outline">← Volver</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <ObraFormImproved />
        </div>
      </main>
    </div>
  )
}

