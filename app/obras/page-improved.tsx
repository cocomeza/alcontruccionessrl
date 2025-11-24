import { getObras } from '@/lib/actions/obras'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { SearchFilter } from '@/components/search-filter'
import { ObrasGridSkeleton } from '@/components/obra-card-skeleton'
import { Suspense } from 'react'

export const metadata = {
  title: 'Portfolio de Obras - ALCONSTRUCCIONES SRL',
  description: 'Explora nuestro portfolio de obras de construcción',
}

async function ObrasList({ searchQuery }: { searchQuery: string }) {
  const obras = await getObras()
  
  const filteredObras = searchQuery
    ? obras.filter(
        (obra) =>
          obra.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          obra.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : obras

  if (filteredObras.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          {searchQuery
            ? 'No se encontraron obras con ese criterio de búsqueda.'
            : 'No hay obras disponibles aún.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredObras.map((obra, index) => (
        <motion.div
          key={obra.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/obra/${obra.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
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
                <p className="text-muted-foreground line-clamp-3">
                  {obra.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const searchQuery = searchParams.q || ''

  return (
    <div className="min-h-screen bg-mystic">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchFilter placeholder="Buscar obras por título o descripción..." />
        </div>
        <Suspense fallback={<ObrasGridSkeleton />}>
          <ObrasList searchQuery={searchQuery} />
        </Suspense>
      </main>
    </div>
  )
}

