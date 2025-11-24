import { getObraById, getObras } from '@/lib/actions/obras'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ImageGallery } from '@/components/image-gallery'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export async function generateStaticParams() {
  const obras = await getObras()
  return obras.map((obra) => ({
    id: obra.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const obra = await getObraById(params.id)
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
  params: { id: string }
}) {
  let obra
  try {
    obra = await getObraById(params.id)
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-calypso mb-4">{obra.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{obra.description}</p>

          {obra.images && obra.images.length > 0 && (
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-semibold text-calypso">Galería de Imágenes</h2>
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: obra.images.length }).map((_, i) => (
                    <Skeleton key={i} className="aspect-video w-full" />
                  ))}
                </div>
              }>
                <ImageGallery images={obra.images} title={obra.title} />
              </Suspense>
            </div>
          )}

          {obra.videos && obra.videos.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-calypso">Videos</h2>
              <div className="grid grid-cols-1 gap-4">
                {obra.videos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="aspect-video w-full">
                        <video
                          src={video}
                          controls
                          className="w-full h-full"
                        >
                          Tu navegador no soporta videos HTML5.
                        </video>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

