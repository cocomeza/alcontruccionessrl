import { getObras } from '@/lib/actions/obras'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchFilter } from '@/components/search-filter'
import { CategoryFilter } from '@/components/category-filter'
import { ObrasGridSkeleton } from '@/components/obra-card-skeleton'
import { Pagination } from '@/components/pagination'
import { OBRA_CATEGORIES } from '@/lib/types/database'
import { Suspense } from 'react'

export const metadata = {
  title: 'Portfolio de Obras - ALCONSTRUCCIONES SRL',
  description: 'Explora nuestro portfolio de obras de construcción',
}

const ITEMS_PER_PAGE = 9

async function ObrasList({ 
  searchQuery, 
  currentPage,
  categoryFilter
}: { 
  searchQuery: string
  currentPage: number
  categoryFilter: string
}) {
  const obras = await getObras()
  
  let filteredObras = obras

  // Filtrar por búsqueda
  if (searchQuery) {
    filteredObras = filteredObras.filter(
      (obra) =>
        obra.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obra.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Filtrar por categoría
  if (categoryFilter && categoryFilter !== 'all') {
    filteredObras = filteredObras.filter(
      (obra) => obra.category === categoryFilter
    )
  }

  const totalPages = Math.ceil(filteredObras.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedObras = filteredObras.slice(startIndex, endIndex)

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedObras.map((obra, index) => (
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
                      loading={index < 6 ? 'eager' : 'lazy'}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Sin imagen</p>
                  </div>
                )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-calypso flex-1">
                    {obra.title}
                  </h2>
                  {obra.category && (
                    <span className="text-xs px-2 py-1 bg-calypso/10 text-calypso rounded-full whitespace-nowrap">
                      {OBRA_CATEGORIES.find(c => c.value === obra.category)?.label || obra.category}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground line-clamp-3">
                  {obra.description}
                </p>
              </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredObras.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </>
  )
}

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; category?: string }
}) {
  const searchQuery = searchParams.q || ''
  const currentPage = parseInt(searchParams.page || '1', 10)
  const categoryFilter = searchParams.category || 'all'

  return (
    <div className="min-h-screen bg-mystic dark:bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <SearchFilter placeholder="Buscar obras por título o descripción..." />
          <CategoryFilter />
        </div>
        <Suspense fallback={<ObrasGridSkeleton />}>
          <ObrasList searchQuery={searchQuery} currentPage={currentPage} categoryFilter={categoryFilter} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

