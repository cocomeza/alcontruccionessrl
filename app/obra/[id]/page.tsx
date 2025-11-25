import { getObraById, getObras } from '@/lib/actions/obras'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ObraDetailContent } from '@/components/obra/obra-detail-content'

export async function generateStaticParams() {
  try {
    const obras = await getObras()
    return obras.map((obra) => ({
      id: obra.id,
    }))
        } catch (error) {
          // Si falla en build time, retornar array vacío (las páginas se generarán dinámicamente)
          if (process.env.NODE_ENV === 'development') {
            console.warn('Error generando static params:', error)
          }
          return []
        }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const obra = await getObraById(id)
    return {
      title: `${obra.title} - ALCONSTRUCCIONES SRL`,
      description: obra.description,
      openGraph: {
        images: obra.images && obra.images.length > 0 ? [obra.images[0]] : [],
      },
    }
  } catch {
    return {
      title: 'Obra no encontrada - ALCONSTRUCCIONES SRL',
    }
  }
}

export default async function ObraDetailPage({
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
    <div className="min-h-screen bg-mystic dark:bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link href="/obras" className="text-boston-blue hover:underline inline-block">
          ← Volver al portfolio
        </Link>
      </div>

      <main className="container mx-auto px-4 py-8">
        <ObraDetailContent obra={obra} />
      </main>
      <Footer />
    </div>
  )
}

