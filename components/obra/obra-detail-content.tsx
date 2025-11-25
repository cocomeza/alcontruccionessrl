'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ImageGallery } from '@/components/obra/image-gallery'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Obra } from '@/lib/types/database'

interface ObraDetailContentProps {
  obra: Obra
}

export function ObraDetailContent({ obra }: ObraDetailContentProps) {
  return (
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
            {obra.videos.map((video: string, index: number) => (
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
  )
}

