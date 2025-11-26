'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ImageGallery } from '@/components/obra/image-gallery'
import { VideoGallery } from '@/components/obra/video-gallery'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { Obra } from '@/lib/types/database'
import { isSupabaseUrl } from '@/lib/utils/storage'

interface ObraDetailContentProps {
  obra: Obra
}

export function ObraDetailContent({ obra }: ObraDetailContentProps) {
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set())

  const handleVideoError = (index: number, videoUrl: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error cargando video:', {
        index,
        url: videoUrl,
        isSupabase: isSupabaseUrl(videoUrl),
        videoElement: document.querySelector(`video[data-video-index="${index}"]`),
      })
    }
    setVideoErrors((prev) => new Set(prev).add(index))
  }

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
          <h2 className="text-2xl font-semibold text-calypso">Galería de Videos</h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: obra.videos.length }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full" />
              ))}
            </div>
          }>
            <VideoGallery videos={obra.videos} title={obra.title} />
          </Suspense>
        </div>
      )}
    </motion.div>
  )
}

