'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface VideoPlayerSimpleProps {
  src: string
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
  className?: string
  autoPlay?: boolean
  onError?: (error: Error) => void
}

export function VideoPlayerSimple({
  src,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  className,
  autoPlay = false,
  onError,
}: VideoPlayerSimpleProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Formatear tiempo
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error al reproducir video:', error)
          onError?.(error)
        })
      }
      setIsPlaying(true)
      onPlay?.()
    }
  }, [isPlaying, onPlay, onPause, onError])

  // Actualizar tiempo actual
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return
    const time = videoRef.current.currentTime
    const dur = videoRef.current.duration
    setCurrentTime(time)
    onTimeUpdate?.(time, dur)
  }, [onTimeUpdate])

  // Cargar metadata
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
    setIsLoading(false)
  }, [])

  // Manejar error
  const handleError = useCallback(() => {
    setIsLoading(false)
    const error = new Error('Error al cargar el video')
    onError?.(error)
  }, [onError])

  // Manejar fin del video
  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    onEnded?.()
  }, [onEnded])

  // Cambiar tiempo del video
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }, [duration])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    
    if (isMuted) {
      videoRef.current.volume = volume || 0.5
      setIsMuted(false)
    } else {
      videoRef.current.volume = 0
      setIsMuted(true)
    }
  }, [isMuted, volume])

  // Toggle pantalla completa
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        ;(containerRef.current as any).webkitRequestFullscreen()
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        ;(containerRef.current as any).mozRequestFullScreen()
      } else if ((containerRef.current as any).msRequestFullscreen) {
        ;(containerRef.current as any).msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      }
    }
  }, [isFullscreen])

  // Detectar cambios en pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Sincronizar volumen con el video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Auto-play si está configurado
  useEffect(() => {
    if (autoPlay && videoRef.current && !isPlaying) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error en auto-play:', error)
        })
      }
    }
  }, [autoPlay, isPlaying])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full bg-black rounded-lg overflow-hidden', className)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onEnded={handleEnded}
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Overlay de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Botón de Play/Pause central GRANDE - Siempre visible cuando está pausado */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 hover:bg-white rounded-full p-6 shadow-2xl transition-all hover:scale-110"
          >
            <Play className="h-16 w-16 text-black" fill="currentColor" />
          </motion.div>
        </div>
      )}

      {/* Controles inferiores - SIEMPRE VISIBLES */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-4">
        {/* Barra de progreso - GRANDE y fácil de usar */}
        <div
          ref={progressRef}
          className="w-full h-3 bg-white/30 rounded-full cursor-pointer mb-4 hover:h-4 transition-all"
          onClick={(e) => {
            e.stopPropagation()
            handleSeek(e)
          }}
        >
          <div className="relative h-full">
            <div
              className="absolute h-full bg-white rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg -translate-x-1/2 cursor-grab active:cursor-grabbing"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controles principales - GRANDES y CLAROS */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause - BOTÓN GRANDE */}
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              className="text-white hover:bg-white/30 h-12 w-12 rounded-full bg-white/20"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" fill="currentColor" />
              ) : (
                <Play className="h-6 w-6" fill="currentColor" />
              )}
            </Button>

            {/* Volumen - BOTÓN GRANDE */}
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
              className="text-white hover:bg-white/30 h-12 w-12 rounded-full bg-white/20"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>

            {/* Tiempo - TEXTO GRANDE */}
            <div className="text-white text-base font-semibold flex items-center gap-2 min-w-[120px]">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/60">/</span>
              <span className="text-white/60">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Pantalla completa - BOTÓN GRANDE */}
          <Button
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen()
            }}
            className="text-white hover:bg-white/30 h-12 w-12 rounded-full bg-white/20"
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
