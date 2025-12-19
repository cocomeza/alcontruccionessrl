'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, VideoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { isSupabaseUrl } from '@/lib/utils/storage'
import { VideoPlayer } from './video-player'

interface VideoLightboxProps {
  videos: string[]
  initialIndex?: number
  onClose: () => void
  title?: string
}

export function VideoLightbox({ videos, initialIndex = 0, onClose, title }: VideoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))
    setIsPlaying(false)
  }, [videos.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
    setIsPlaying(false)
  }, [videos.length])

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    setCurrentIndex(initialIndex)
    setIsPlaying(false)
  }, [initialIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        // El VideoPlayer maneja el espacio internamente
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [currentIndex, handleNext, handlePrevious, onClose])

  useEffect(() => {
    // Pausar video anterior cuando cambia el índice
    setIsPlaying(false)
  }, [currentIndex])

  if (videos.length === 0) return null

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
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          {title && (
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="text-white hover:bg-white/20 ml-auto"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video */}
        <div
          className="relative w-full h-full flex items-center justify-center p-4"
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
            <div className="aspect-video w-full max-w-6xl bg-black relative">
              <VideoPlayer
                src={videos[currentIndex]}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onError={(error) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.error('Error cargando video en lightbox:', {
                      index: currentIndex,
                      url: videos[currentIndex],
                      isSupabase: isSupabaseUrl(videos[currentIndex]),
                      error,
                    })
                  }
                }}
                className="w-full h-full"
                showControls={true}
              />
            </div>
          </motion.div>
        </div>

        {/* Controles de navegación */}
        {videos.length > 1 && (
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

        {/* Indicador de video */}
        {videos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/70 px-4 py-2 rounded">
            {currentIndex + 1} / {videos.length}
          </div>
        )}

        {/* Miniaturas inferiores */}
        {videos.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
            {videos.map((video, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                  setIsPlaying(false)
                }}
                className={`relative w-24 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all bg-black ${
                  index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <video
                  src={video}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <VideoIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

