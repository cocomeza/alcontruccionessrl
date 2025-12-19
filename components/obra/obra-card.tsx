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

  // Asegurar que siempre sean arrays
  const images = Array.isArray(obra.images) ? obra.images : (obra.images ? [obra.images] : [])
  const videos = Array.isArray(obra.videos) ? obra.videos : (obra.videos ? [obra.videos] : [])
  
  const hasImages = images.length > 0 && !imageError
  const hasVideos = videos.length > 0 && !videoError
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
      hasMedia,
      imagesCount: images.length,
      videosCount: videos.length,
      imageError,
      videoError,
      images,
      videos,
      imagesType: typeof obra.images,
      videosType: typeof obra.videos,
      isImagesArray: Array.isArray(obra.images),
      isVideosArray: Array.isArray(obra.videos),
    })
  }

  const handleImageError = () => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error cargando imagen en obra card:', {
        obraId: obra.id,
        imageUrl: images[0],
        isSupabase: isSupabaseUrl(images[0]),
        allImages: images,
      })
    }
    setImageError(true)
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error cargando video en obra card:', {
        obraId: obra.id,
        videoUrl: videos[0],
        isSupabase: isSupabaseUrl(videos[0]),
        allVideos: videos,
        videoError: videoElement.error,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState,
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
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Link href={hasMedia ? '#' : `/obra/${obra.id}`}>
          <Card 
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full group border-border/50 hover:border-calypso/50 bg-card"
            onClick={handleCardClick}
          >
            {hasImages ? (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={images[0]}
                  alt={obra.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading={index < 6 ? 'eager' : 'lazy'}
                  unoptimized={isSupabaseUrl(images[0])}
                  onError={handleImageError}
                />
                {/* Gradiente overlay mejorado */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Indicador de que hay videos disponibles */}
                {hasVideos && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 z-10 shadow-lg"
                  >
                    <VideoIcon className="h-3.5 w-3.5" />
                    <span className="font-medium">{videos.length} video{videos.length > 1 ? 's' : ''}</span>
                  </motion.div>
                )}
                
                {/* Overlay mejorado para indicar que se puede hacer clic */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="opacity-0 group-hover:opacity-100 text-white font-semibold transition-all duration-300 text-sm sm:text-base px-4 py-2 bg-calypso/90 backdrop-blur-sm rounded-lg shadow-xl"
                  >
                    Ver galería
                  </motion.span>
                </div>
              </div>
            ) : showVideo ? (
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={videos[0]}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  playsInline
                  crossOrigin="anonymous"
                  onError={handleVideoError}
                  onLoadStart={() => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('📹 Video iniciando carga:', videos[0])
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('✅ Video metadata cargado:', videos[0])
                    }
                  }}
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
            <CardContent className="p-6 group-hover:bg-accent/5 transition-colors duration-300">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="text-xl font-bold text-calypso flex-1 group-hover:text-boston-blue transition-colors duration-300 line-clamp-2">
                  {obra.title}
                </h2>
                {obra.category && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="text-xs px-3 py-1.5 bg-calypso/10 text-calypso rounded-full whitespace-nowrap font-medium border border-calypso/20 group-hover:bg-calypso group-hover:text-white transition-colors duration-300"
                  >
                    {OBRA_CATEGORIES.find(c => c.value === obra.category)?.label || obra.category}
                  </motion.span>
                )}
              </div>
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                {obra.description}
              </p>
              
              {/* Indicador de acción */}
              <div className="mt-4 flex items-center gap-2 text-calypso text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Ver detalles</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      {galleryOpen && (
        <MixedGalleryLightbox
          images={images}
          videos={videos}
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

