'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Video as VideoIcon } from 'lucide-react'
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
  // Combinar imágenes y videos en un solo array
  const mediaItems: MediaItem[] = [
    ...images.map((url) => ({ type: 'image' as const, url })),
    ...videos.map((url) => ({ type: 'video' as const, url })),
  ]

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialType === 'image') {
      return initialIndex
    } else {
      return images.length + initialIndex
    }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
  }, [currentIndex])

  useEffect(() => {
    // Pausar video anterior cuando cambia el índice
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [currentIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
    setIsPlaying(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
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

        {/* Contenido */}
        <div
          className="relative w-full h-full flex items-center justify-center p-4 pt-24"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-full max-h-full"
          >
            {currentItem.type === 'image' ? (
              <div className="relative max-w-full max-h-[90vh]">
                <Image
                  src={currentItem.url}
                  alt={`${title || 'Imagen'} - ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[90vh] object-contain"
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
              <div className="aspect-video w-full max-w-6xl bg-black">
                <video
                  ref={videoRef}
                  src={currentItem.url}
                  controls
                  className="w-full h-full"
                  preload="metadata"
                  playsInline
                  crossOrigin="anonymous"
                  onPlay={handlePlay}
                  onPause={handlePause}
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
              </div>
            )}
          </motion.div>
        </div>

        {/* Controles de navegación */}
        {mediaItems.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Indicador */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/70 px-4 py-2 rounded">
            {currentIndex + 1} / {mediaItems.length}
          </div>
        )}

        {/* Miniaturas inferiores */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                  setIsPlaying(false)
                }}
                className={`relative flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                } ${item.type === 'image' ? 'w-16 h-16' : 'w-24 h-16'}`}
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <VideoIcon className="h-4 w-4 text-white" />
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

