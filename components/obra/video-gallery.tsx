'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { VideoLightbox } from './video-lightbox'
import { motion } from 'framer-motion'
import { Play, Video as VideoIcon } from 'lucide-react'
import { isSupabaseUrl } from '@/lib/utils/storage'

interface VideoGalleryProps {
  videos: string[]
  title?: string
}

export function VideoGallery({ videos, title }: VideoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [failedVideos, setFailedVideos] = useState<Set<number>>(new Set())

  if (!videos || videos.length === 0) {
    return null
  }

  const handleVideoClick = (index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  const handleVideoError = (index: number, videoUrl: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error cargando video en galería:', {
        index,
        url: videoUrl,
        isSupabase: isSupabaseUrl(videoUrl),
      })
    }
    setFailedVideos((prev) => new Set(prev).add(index))
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, index) => {
          if (failedVideos.has(index)) {
            return (
              <Card key={index} className="overflow-hidden">
                <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Error al cargar video</p>
                </div>
              </Card>
            )
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => handleVideoClick(index)}
              >
                <div className="relative aspect-video w-full bg-black">
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    playsInline
                    crossOrigin="anonymous"
                    muted
                    onError={() => handleVideoError(index, video)}
                  >
                    Tu navegador no soporta videos HTML5.
                  </video>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white">
                      <Play className="h-12 w-12" fill="currentColor" />
                      <span className="font-semibold text-lg">Reproducir video</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <VideoIcon className="h-3 w-3" />
                    Video {index + 1}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {lightboxOpen && (
        <VideoLightbox
          videos={videos}
          initialIndex={selectedIndex}
          onClose={() => setLightboxOpen(false)}
          title={title}
        />
      )}
    </>
  )
}

