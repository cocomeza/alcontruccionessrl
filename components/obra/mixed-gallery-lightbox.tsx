'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Video as VideoIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { isSupabaseUrl } from '@/lib/utils/storage'

interface MediaItem {
  type: 'image' | 'video'
  url: string
}

interface MixedGalleryLightboxProps {
  images: string[]
  videos: string[]
  initialIndex?: number
  initialType?: 'image' | 'video'
  onClose: () => void
  title?: string
  description?: string
}

export function MixedGalleryLightbox({
  images,
  videos,
  initialIndex = 0,
  initialType = 'image',
  onClose,
  title,
  description,
}: MixedGalleryLightboxProps) {
  // Combinar imágenes y videos en un solo array (usando useMemo para evitar recrear en cada render)
  const mediaItems: MediaItem[] = useMemo(() => [
    ...images.map((url) => ({ type: 'image' as const, url })),
    ...videos.map((url) => ({ type: 'video' as const, url })),
  ], [images, videos])

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialType === 'image') {
      return initialIndex
    } else {
      return images.length + initialIndex
    }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
    setIsPlaying(false)
  }, [mediaItems.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
    setIsPlaying(false)
  }, [mediaItems.length])

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  useEffect(() => {
    setCurrentIndex(() => {
      if (initialType === 'image') {
        return initialIndex
      } else {
        return images.length + initialIndex
      }
    })
    setIsPlaying(false)
  }, [initialIndex, initialType, images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === ' ' && mediaItems[currentIndex]?.type === 'video') {
        e.preventDefault()
        togglePlay()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [currentIndex, handleNext, handlePrevious, mediaItems, onClose, togglePlay])

  useEffect(() => {
    // Pausar video anterior cuando cambia el índice
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
      setVideoDuration(0)
    }
  }, [currentIndex])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (mediaItems.length === 0) return null

  const currentItem = mediaItems[currentIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Controles superiores */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="text-white hover:bg-white/20 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
              </div>
              {title && (
                <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
              )}
              {description && (
                <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="text-white hover:bg-white/20 flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            {currentItem.type === 'image' && (
              <span className="px-2 py-1 bg-white/10 rounded">Imagen</span>
            )}
            {currentItem.type === 'video' && (
              <span className="px-2 py-1 bg-white/10 rounded flex items-center gap-1">
                <VideoIcon className="h-3 w-3" />
                Video
              </span>
            )}
          </div>
        </div>

        {/* Contenido - Carrusel */}
        <div
          className="relative w-full h-full flex items-center justify-center p-4 pt-24 pb-32"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Contenedor del carrusel */}
          <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                }}
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                {currentItem.type === 'image' ? (
                  <div className="relative max-w-full max-h-[85vh]">
                    <Image
                      src={currentItem.url}
                      alt={`${title || 'Imagen'} - ${currentIndex + 1}`}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                      priority
                      unoptimized={isSupabaseUrl(currentItem.url)}
                      onError={() => {
                        if (process.env.NODE_ENV === 'development') {
                          console.error('Error cargando imagen en lightbox:', {
                            index: currentIndex,
                            url: currentItem.url,
                          })
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full max-w-6xl bg-black rounded-lg overflow-hidden shadow-2xl relative group">
                    <video
                      ref={videoRef}
                      src={currentItem.url}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full"
                      preload="metadata"
                      playsInline
                      crossOrigin="anonymous"
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onError={() => {
                        if (process.env.NODE_ENV === 'development') {
                          console.error('Error cargando video en lightbox:', {
                            index: currentIndex,
                            url: currentItem.url,
                          })
                        }
                      }}
                    >
                      <source src={currentItem.url} type="video/mp4" />
                      <source src={currentItem.url} type="video/webm" />
                      <source src={currentItem.url} type="video/ogg" />
                      Tu navegador no soporta videos HTML5.
                    </video>
                    {/* Información de duración del video */}
                    {videoDuration > 0 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-mono backdrop-blur-sm">
                        {formatTime(currentTime)} / {formatTime(videoDuration)}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controles de navegación - Mejorados */}
        {mediaItems.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/30 bg-black/50 backdrop-blur-sm h-14 w-14 rounded-full transition-all hover:scale-110 z-20"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/30 bg-black/50 backdrop-blur-sm h-14 w-14 rounded-full transition-all hover:scale-110 z-20"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </>
        )}

        {/* Indicador mejorado */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-sm bg-black/80 backdrop-blur-sm px-6 py-2 rounded-full flex items-center gap-2 z-10">
            <span className="font-semibold">{currentIndex + 1}</span>
            <span className="text-white/60">de</span>
            <span className="font-semibold">{mediaItems.length}</span>
          </div>
        )}

        {/* Miniaturas inferiores - Carrusel mejorado */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex gap-3 max-w-[90vw] overflow-x-auto px-4 py-2 scrollbar-hide">
              {mediaItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                    setIsPlaying(false)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all shadow-lg ${
                    index === currentIndex
                      ? 'border-white ring-2 ring-white/50 scale-110'
                      : 'border-white/30 opacity-70 hover:opacity-100 hover:border-white/60'
                  } ${item.type === 'image' ? 'w-20 h-20' : 'w-28 h-20'}`}
                  aria-label={`Ver ${item.type === 'image' ? 'imagen' : 'video'} ${index + 1}`}
                >
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={isSupabaseUrl(item.url)}
                    />
                  ) : (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <VideoIcon className="h-5 w-5 text-white" />
                      </div>
                    </>
                  )}
                  {/* Indicador de posición activa */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 border-2 border-white rounded-lg" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

