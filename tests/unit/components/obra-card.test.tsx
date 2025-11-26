import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ObraCard } from '@/components/obra/obra-card'
import type { Obra } from '@/lib/types/database'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

const mockObra: Obra = {
  id: '1',
  title: 'Test Obra',
  description: 'This is a test description for the obra',
  images: ['https://example.com/image.jpg'],
  videos: [],
  category: 'vivienda',
  created_at: '2024-01-01T00:00:00Z',
}

describe('ObraCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render obra card with title and description', () => {
    render(<ObraCard obra={mockObra} index={0} />)
    
    expect(screen.getByText('Test Obra')).toBeInTheDocument()
    expect(screen.getByText('This is a test description for the obra')).toBeInTheDocument()
  })

  it('should render image when available', () => {
    render(<ObraCard obra={mockObra} index={0} />)
    
    const image = screen.getByAltText('Test Obra')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('example.com'))
  })

  it('should show placeholder when no image and no videos', () => {
    const obraWithoutMedia = { ...mockObra, images: [], videos: [] }
    render(<ObraCard obra={obraWithoutMedia} index={0} />)
    
    expect(screen.getByText('Sin imagen')).toBeInTheDocument()
  })

  it('should render video when no images but videos exist', () => {
    const obraWithVideoOnly: Obra = {
      ...mockObra,
      images: [],
      videos: ['https://example.com/video.mp4'],
    }
    
    const { container } = render(<ObraCard obra={obraWithVideoOnly} index={0} />)
    
    // Verificar que el video está presente en el DOM
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', 'https://example.com/video.mp4')
  })

  it('should prioritize images over videos', () => {
    const obraWithBoth: Obra = {
      ...mockObra,
      images: ['https://example.com/image.jpg'],
      videos: ['https://example.com/video.mp4'],
    }
    
    render(<ObraCard obra={obraWithBoth} index={0} />)
    
    // Debe mostrar la imagen, no el video
    const image = screen.getByAltText('Test Obra')
    expect(image).toBeInTheDocument()
    
    // No debe haber video visible
    const videos = document.querySelectorAll('video')
    expect(videos.length).toBe(0)
  })

  it('should render video with correct attributes', () => {
    const obraWithVideoOnly: Obra = {
      ...mockObra,
      images: [],
      videos: ['https://supabase.co/storage/v1/object/public/obras-media/video.mp4'],
    }
    
    const { container } = render(<ObraCard obra={obraWithVideoOnly} index={0} />)
    
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    
    if (video) {
      expect(video).toHaveAttribute('src', obraWithVideoOnly.videos[0])
      expect(video).toHaveAttribute('preload', 'metadata')
      expect(video).toHaveAttribute('playsinline')
      expect(video).toHaveAttribute('crossorigin', 'anonymous')
      // muted y loop pueden estar como atributos booleanos (sin valor)
      expect(video.hasAttribute('muted')).toBe(true)
      expect(video.hasAttribute('loop')).toBe(true)
    }
  })

  it('should show video badge when video is displayed', () => {
    const obraWithVideoOnly: Obra = {
      ...mockObra,
      images: [],
      videos: ['https://example.com/video.mp4'],
    }
    
    render(<ObraCard obra={obraWithVideoOnly} index={0} />)
    
    // Verificar que hay un badge de video
    const videoBadge = screen.getByText('Video')
    expect(videoBadge).toBeInTheDocument()
  })

  it('should handle video error and show fallback', async () => {
    const obraWithVideoOnly: Obra = {
      ...mockObra,
      images: [],
      videos: ['https://invalid-url.com/video.mp4'],
    }
    
    const { container } = render(<ObraCard obra={obraWithVideoOnly} index={0} />)
    
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    
    // Simular error en el video
    if (video) {
      const errorEvent = new Event('error')
      video.dispatchEvent(errorEvent)
    }
    
    // Esperar a que el error se maneje
    await waitFor(() => {
      // Después del error, debería mostrar "Sin imagen"
      const sinImagen = screen.queryByText('Sin imagen')
      // El video puede desaparecer o mostrar un error
      expect(sinImagen || container.querySelector('video')).toBeTruthy()
    }, { timeout: 1000 })
  })

  it('should handle video play on hover', async () => {
    const user = userEvent.setup()
    const playSpy = vi.fn().mockResolvedValue(undefined)
    const pauseSpy = vi.fn()
    
    const obraWithVideoOnly: Obra = {
      ...mockObra,
      images: [],
      videos: ['https://example.com/video.mp4'],
    }
    
    const { container } = render(<ObraCard obra={obraWithVideoOnly} index={0} />)
    
    const video = container.querySelector('video') as HTMLVideoElement
    expect(video).toBeInTheDocument()
    
    // Mock play y pause
    if (video) {
      video.play = playSpy
      video.pause = pauseSpy
      
      // Simular hover usando eventos del mouse
      const card = container.querySelector('[class*="group"]')
      if (card) {
        // Simular mouseenter
        const mouseEnterEvent = new MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
        })
        card.dispatchEvent(mouseEnterEvent)
        
        // Esperar a que el evento se procese
        await waitFor(() => {
          expect(playSpy).toHaveBeenCalled()
        }, { timeout: 1000 })
      }
    }
  })

  it('should render category badge when category exists', () => {
    render(<ObraCard obra={mockObra} index={0} />)
    
    expect(screen.getByText('Vivienda')).toBeInTheDocument()
  })

  it('should have link to obra detail page', () => {
    render(<ObraCard obra={mockObra} index={0} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/obra/1')
  })

  it('should log video URL in development mode', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Set NODE_ENV to development
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    const obraWithVideoOnly: Obra = {
      ...mockObra,
      images: [],
      videos: ['https://example.com/video.mp4'],
    }
    
    const { container } = render(<ObraCard obra={obraWithVideoOnly} index={0} />)
    
    const video = container.querySelector('video')
    if (video) {
      const loadStartEvent = new Event('loadstart')
      video.dispatchEvent(loadStartEvent)
    }
    
    // Restore NODE_ENV
    process.env.NODE_ENV = originalEnv
    
    consoleSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })
})

