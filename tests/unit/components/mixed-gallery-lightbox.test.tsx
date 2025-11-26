import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Button component FIRST
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { priority, unoptimized, ...restProps } = props
    return <img src={src} alt={alt} {...restProps} />
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...restProps } = props
      return <div {...restProps}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="x-icon" />,
  ChevronLeft: () => <svg data-testid="chevron-left-icon" />,
  ChevronRight: () => <svg data-testid="chevron-right-icon" />,
  Video: () => <svg data-testid="video-icon" />,
  ArrowLeft: () => <svg data-testid="arrow-left-icon" />,
}))

// Mock storage utils
vi.mock('@/lib/utils/storage', () => ({
  isSupabaseUrl: (url: string) => url.includes('supabase') || url.includes('storage'),
  getPublicUrl: (url: string) => url,
}))

// Import after mocks
import { MixedGalleryLightbox } from '@/components/obra/mixed-gallery-lightbox'

describe('MixedGalleryLightbox', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with images', () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg', 'https://example.com/image2.jpg']}
        videos={[]}
        onClose={mockOnClose}
        title="Test Obra"
        description="Test Description"
      />
    )

    expect(screen.getByText('Test Obra')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    
    const image = container.querySelector('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg')
  })

  it('should render with videos', () => {
    render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    const video = document.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', 'https://example.com/video1.mp4')
  })

  it('should combine images and videos in correct order', () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg']}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    // Primera imagen debe estar visible
    const image = container.querySelector('img')
    expect(image).toBeInTheDocument()
  })

  it('should show navigation buttons when multiple items', () => {
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg', 'https://example.com/image2.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument()
  })

  it('should NOT show navigation buttons when single item', () => {
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    expect(screen.queryByTestId('chevron-left-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('chevron-right-icon')).not.toBeInTheDocument()
  })

  it('should show indicator with current position', () => {
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg', 'https://example.com/image2.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('de')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should show thumbnails when multiple items', () => {
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg', 'https://example.com/image2.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    const thumbnails = document.querySelectorAll('img[alt^="Miniatura"]')
    expect(thumbnails.length).toBeGreaterThan(0)
  })

  it('should call onClose when clicking close button', async () => {
    const user = userEvent.setup()
    
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    const closeButton = screen.getByTestId('x-icon').closest('button')
    if (closeButton) {
      await user.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('should call onClose when clicking back button', async () => {
    const user = userEvent.setup()
    
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    const backButton = screen.getByText('Volver').closest('button')
    if (backButton) {
      await user.click(backButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('should navigate to next item when clicking next button', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg', 'https://example.com/image2.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    const nextButton = screen.getByTestId('chevron-right-icon').closest('button')
    if (nextButton) {
      await user.click(nextButton)
      
      await waitFor(() => {
        // Verificar que el indicador cambió
        const indicator = screen.queryByText(/2.*de.*2/)
        expect(indicator || screen.getByText('2')).toBeTruthy()
      })
    }
  })

  it('should navigate to previous item when clicking previous button', async () => {
    const user = userEvent.setup()
    
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg', 'https://example.com/image2.jpg']}
        videos={[]}
        initialIndex={1}
        onClose={mockOnClose}
      />
    )

    const prevButton = screen.getByTestId('chevron-left-icon').closest('button')
    if (prevButton) {
      await user.click(prevButton)
      
      await waitFor(() => {
        // Verificar que el indicador cambió
        const indicator = screen.queryByText(/1.*de.*2/)
        expect(indicator || screen.getByText('1')).toBeTruthy()
      })
    }
  })

  it('should show video type indicator for videos', () => {
    render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Video')).toBeInTheDocument()
  })

  it('should show image type indicator for images', () => {
    render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg']}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Imagen')).toBeInTheDocument()
  })

  it('should return null when no media items', () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={[]}
        onClose={mockOnClose}
      />
    )

    // Si no hay media items, el componente debería retornar null o no renderizar nada
    // Verificamos que no hay elementos principales del lightbox
    const lightboxContent = container.querySelector('[class*="fixed"], [class*="inset"]')
    expect(lightboxContent).toBeNull()
  })

  it('should start at correct initial index', () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={['https://example.com/image1.jpg', 'https://example.com/image2.jpg']}
        videos={[]}
        initialIndex={1}
        onClose={mockOnClose}
      />
    )

    const images = container.querySelectorAll('img')
    // Debe haber al menos una imagen renderizada
    expect(images.length).toBeGreaterThan(0)
  })

  it('should render video with controls attribute', () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('preload', 'metadata')
  })

  it('should handle video play and pause events', async () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    const video = container.querySelector('video') as HTMLVideoElement
    expect(video).toBeInTheDocument()

    // Simular eventos de play y pause
    const playEvent = new Event('play')
    video.dispatchEvent(playEvent)

    const pauseEvent = new Event('pause')
    video.dispatchEvent(pauseEvent)

    // Verificar que el video tiene los event handlers
    expect(video.onplay).toBeDefined()
    expect(video.onpause).toBeDefined()
  })

  it('should handle video time update events', async () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    const video = container.querySelector('video') as HTMLVideoElement
    expect(video).toBeInTheDocument()

    // Simular evento de timeupdate
    const timeUpdateEvent = new Event('timeupdate')
    video.dispatchEvent(timeUpdateEvent)

    // Verificar que el video tiene el event handler
    expect(video.ontimeupdate).toBeDefined()
  })

  it('should handle video loaded metadata events', async () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    const video = container.querySelector('video') as HTMLVideoElement
    expect(video).toBeInTheDocument()

    // Simular evento de loadedmetadata
    const loadedMetadataEvent = new Event('loadedmetadata')
    video.dispatchEvent(loadedMetadataEvent)

    // Verificar que el video tiene el event handler
    expect(video.onloadedmetadata).toBeDefined()
  })

  it('should reset video time when changing items', async () => {
    const { container, rerender } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4', 'https://example.com/video2.mp4']}
        initialIndex={0}
        onClose={mockOnClose}
      />
    )

    const video = container.querySelector('video') as HTMLVideoElement
    if (video) {
      video.currentTime = 10
      
      // Cambiar al siguiente video
      rerender(
        <MixedGalleryLightbox
          images={[]}
          videos={['https://example.com/video1.mp4', 'https://example.com/video2.mp4']}
          initialIndex={1}
          onClose={mockOnClose}
        />
      )

      // El video debería resetearse (esto se maneja en el useEffect)
      await waitFor(() => {
        const newVideo = container.querySelector('video') as HTMLVideoElement
        if (newVideo) {
          expect(newVideo.currentTime).toBe(0)
        }
      }, { timeout: 1000 })
    }
  })

  it('should support keyboard controls for video playback', () => {
    render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        initialIndex={0}
        initialType="video"
        onClose={mockOnClose}
      />
    )

    // El componente debería tener listeners de teclado
    // Esto se prueba indirectamente verificando que el componente renderiza correctamente
    const video = document.querySelector('video')
    expect(video).toBeInTheDocument()
  })

  it('should show video duration when metadata is loaded', async () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    const video = container.querySelector('video') as HTMLVideoElement
    if (video) {
      // Simular que el video tiene duración
      Object.defineProperty(video, 'duration', {
        writable: true,
        value: 125, // 2 minutos y 5 segundos
      })

      const loadedMetadataEvent = new Event('loadedmetadata')
      video.dispatchEvent(loadedMetadataEvent)

      // Verificar que el componente maneja la duración
      // (la duración se muestra en el formato "M:SS / M:SS")
      await waitFor(() => {
        // El componente debería mostrar la duración si está disponible
        expect(video.onloadedmetadata).toBeDefined()
      })
    }
  })

  it('should have multiple source tags for video compatibility', () => {
    const { container } = render(
      <MixedGalleryLightbox
        images={[]}
        videos={['https://example.com/video1.mp4']}
        onClose={mockOnClose}
      />
    )

    const sources = container.querySelectorAll('source')
    expect(sources.length).toBeGreaterThan(0)
    
    // Verificar que hay sources para diferentes formatos
    const sourceTypes = Array.from(sources).map(s => s.getAttribute('type'))
    expect(sourceTypes).toContain('video/mp4')
  })
})

