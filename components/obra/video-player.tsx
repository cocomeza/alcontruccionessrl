'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface VideoPlayerProps {
  src: string
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
  className?: string
  autoPlay?: boolean
  showControls?: boolean
  onError?: (error: Error) => void
}

export function VideoPlayer({
  src,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  className,
  autoPlay = false,
  showControls = true,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControlsOverlay, setShowControlsOverlay] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showPlaybackMenu, setShowPlaybackMenu] = useState(false)

  // Formatear tiempo
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
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

  // Manejar carga de datos
  const handleLoadedData = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Manejar inicio de carga
  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
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

  // Cambiar volumen
  const handleVolumeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !volumeRef.current) return
    
    const rect = volumeRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    
    videoRef.current.volume = percent
    setVolume(percent)
    setIsMuted(percent === 0)
  }, [])

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

  // Saltar hacia atrás/adelante
  const skip = useCallback((seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
  }, [currentTime, duration])

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

  // Cambiar velocidad de reproducción
  const changePlaybackRate = useCallback((rate: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
    setShowPlaybackMenu(false)
  }, [])

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

  // Ocultar controles automáticamente
  useEffect(() => {
    if (!showControls) return

    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      setShowControlsOverlay(true)
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControlsOverlay(false)
        }, 3000)
      }
    }

    resetControlsTimeout()

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying, showControls, setShowControlsOverlay])

  // Manejar clic en el video
  const handleVideoClick = useCallback(() => {
    if (showControls) {
      setShowControlsOverlay(true)
      togglePlay()
    }
  }, [showControls, togglePlay])

  // Manejar movimiento del mouse - mostrar controles siempre que el mouse se mueva
  const handleMouseMove = useCallback(() => {
    if (showControls) {
      setShowControlsOverlay(true)
      // Resetear el timeout para que los controles se mantengan visibles mientras el mouse está sobre el video
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControlsOverlay(false)
        }, 3000)
      }
    }
  }, [showControls, isPlaying])

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
  const volumePercent = volume * 100

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full bg-black rounded-lg overflow-hidden group', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        // Mostrar controles cuando el mouse entra al área del video
        if (showControls) {
          setShowControlsOverlay(true)
          // Cancelar cualquier timeout de ocultar controles
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
            controlsTimeoutRef.current = undefined
          }
        }
      }}
      onMouseLeave={() => {
        // Ocultar controles solo cuando el mouse sale Y el video está reproduciéndose
        // Si está pausado, mantener los controles visibles
        if (isPlaying && showControls) {
          controlsTimeoutRef.current = setTimeout(() => {
            setShowControlsOverlay(false)
          }, 2000)
        }
        // Si está pausado, mantener controles visibles (no hacer nada)
      }}
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
        onLoadedData={handleLoadedData}
        onLoadStart={handleLoadStart}
        onError={handleError}
        onEnded={handleEnded}
        onClick={handleVideoClick}
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

      {/* Controles overlay */}
      <AnimatePresence>
        {showControls && showControlsOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
          >
            {/* Controles superiores */}
            <div className="flex items-center justify-end gap-2">
              {/* Menú de velocidad */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowPlaybackMenu(!showPlaybackMenu)
                  }}
                  className="text-white hover:bg-white/20 h-9 w-9"
                  aria-label="Velocidad de reproducción"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <AnimatePresence>
                  {showPlaybackMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-[120px] z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={cn(
                            'w-full text-left px-3 py-2 text-sm text-white hover:bg-white/20 rounded transition-colors',
                            playbackRate === rate && 'bg-white/30 font-semibold'
                          )}
                        >
                          {rate}x
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
                className="text-white hover:bg-white/20 h-9 w-9"
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>

            {/* Controles inferiores */}
            <div className="space-y-3">
              {/* Barra de progreso */}
              <div
                ref={progressRef}
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress hover:h-2 transition-all"
                onClick={handleSeek}
              >
                <div className="relative h-full">
                  <div
                    className="absolute h-full bg-white rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity -translate-x-1/2"
                    style={{ left: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Controles principales */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay()
                    }}
                    className="text-white hover:bg-white/20 h-10 w-10"
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" fill="currentColor" />
                    ) : (
                      <Play className="h-5 w-5" fill="currentColor" />
                    )}
                  </Button>

                  {/* Saltar atrás */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      skip(-10)
                    }}
                    className="text-white hover:bg-white/20 h-9 w-9"
                    aria-label="Retroceder 10 segundos"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  {/* Saltar adelante */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      skip(10)
                    }}
                    className="text-white hover:bg-white/20 h-9 w-9"
                    aria-label="Adelantar 10 segundos"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  {/* Volumen */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMute()
                      }}
                      className="text-white hover:bg-white/20 h-9 w-9"
                      aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div
                      ref={volumeRef}
                      className="w-20 h-1.5 bg-white/20 rounded-full cursor-pointer group/volume hover:h-2 transition-all hidden sm:block"
                      onClick={handleVolumeChange}
                    >
                      <div className="relative h-full">
                        <div
                          className="absolute h-full bg-white rounded-full transition-all"
                          style={{ width: `${volumePercent}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/volume:opacity-100 transition-opacity -translate-x-1/2"
                          style={{ left: `${volumePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tiempo */}
                  <div className="text-white text-sm font-mono hidden sm:flex items-center gap-1">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-white/60">/</span>
                    <span className="text-white/60">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Velocidad actual (móvil) */}
                <div className="text-white text-xs font-semibold sm:hidden">
                  {playbackRate}x
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de play central (cuando está pausado y controles ocultos) */}
      {!isPlaying && !showControlsOverlay && showControls && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          onClick={handleVideoClick}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/50 backdrop-blur-sm rounded-full p-4 group-hover:bg-black/70 transition-colors"
          >
            <Play className="h-12 w-12 text-white" fill="currentColor" />
          </motion.div>
        </div>
      )}
    </div>
  )
}

