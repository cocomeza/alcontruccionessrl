import { getObras } from '@/lib/actions/obras'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SearchFilter } from '@/components/common/search-filter'
import { CategoryFilter } from '@/components/common/category-filter'
import { ObrasGridSkeleton } from '@/components/obra/obra-card-skeleton'
import { Pagination } from '@/components/common/pagination'
import { ObraCard } from '@/components/obra/obra-card'
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
          <ObraCard key={obra.id} obra={obra} index={index} />
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
  searchParams: Promise<{ q?: string; page?: string; category?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.q || ''
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10)
  const categoryFilter = resolvedSearchParams.category || 'all'

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

