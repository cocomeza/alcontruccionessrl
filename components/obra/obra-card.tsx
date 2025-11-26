'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { OBRA_CATEGORIES } from '@/lib/types/database'
import type { Obra } from '@/lib/types/database'
import { isSupabaseUrl } from '@/lib/utils/storage'
import { Play, Video as VideoIcon } from 'lucide-react'
import { MixedGalleryLightbox } from './mixed-gallery-lightbox'

interface ObraCardProps {
  obra: Obra
  index: number
}

export function ObraCard({ obra, index }: ObraCardProps) {
  const [imageError, setImageError] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const hasImages = obra.images && obra.images.length > 0 && !imageError
  const hasVideos = obra.videos && obra.videos.length > 0 && !videoError
  const showVideo = !hasImages && hasVideos
  const hasMedia = hasImages || hasVideos

  // Debug logging en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 ObraCard Debug:', {
      obraId: obra.id,
      title: obra.title,
      hasImages,
      hasVideos,
      showVideo,
      imagesCount: obra.images?.length || 0,
      videosCount: obra.videos?.length || 0,
      imageError,
      videoError,
    })
  }

  const handleImageError = () => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error cargando imagen en obra card:', {
        obraId: obra.id,
        imageUrl: obra.images[0],
        isSupabase: isSupabaseUrl(obra.images[0]),
      })
    }
    setImageError(true)
  }

  const handleVideoError = () => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error cargando video en obra card:', {
        obraId: obra.id,
        videoUrl: obra.videos[0],
        isSupabase: isSupabaseUrl(obra.videos[0]),
      })
    }
    setVideoError(true)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMedia) {
      e.preventDefault()
      e.stopPropagation()
      setGalleryOpen(true)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link href={hasMedia ? '#' : `/obra/${obra.id}`}>
          <Card 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full group"
            onClick={handleCardClick}
          >
            {hasImages ? (
              <div className="relative aspect-video w-full">
                <Image
                  src={obra.images[0]}
                  alt={obra.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading={index < 6 ? 'eager' : 'lazy'}
                  unoptimized={isSupabaseUrl(obra.images[0])}
                  onError={handleImageError}
                />
                {/* Indicador de que hay videos disponibles */}
                {hasVideos && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1 z-10">
                    <VideoIcon className="h-3 w-3" />
                    {obra.videos.length} video{obra.videos.length > 1 ? 's' : ''}
                  </div>
                )}
                {/* Overlay para indicar que se puede hacer clic */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-semibold transition-opacity text-sm">
                    Click para ver galería
                  </span>
                </div>
              </div>
            ) : showVideo ? (
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={obra.videos[0]}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  playsInline
                  crossOrigin="anonymous"
                  onError={handleVideoError}
                  onMouseEnter={(e) => {
                    if (!isVideoPlaying) {
                      e.currentTarget.play().catch(() => {
                        // Ignorar errores de autoplay
                      })
                      setIsVideoPlaying(true)
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause()
                    e.currentTarget.currentTime = 0
                    setIsVideoPlaying(false)
                  }}
                  muted
                  loop
                >
                  Tu navegador no soporta videos HTML5.
                </video>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8" fill="currentColor" />
                    <span className="font-semibold">Click para ver galería</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <VideoIcon className="h-3 w-3" />
                  Video
                </div>
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
      {galleryOpen && (
        <MixedGalleryLightbox
          images={obra.images || []}
          videos={obra.videos || []}
          initialIndex={0}
          initialType={hasImages ? 'image' : 'video'}
          onClose={() => setGalleryOpen(false)}
          title={obra.title}
          description={obra.description}
        />
      )}
    </>
  )
}

