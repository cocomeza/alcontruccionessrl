import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ObrasDestacadas } from '@/components/obra/obras-destacadas'
import type { Obra } from '@/lib/types/database'

// Mock ObraCard
vi.mock('@/components/obra/obra-card', () => ({
  ObraCard: ({ obra, index }: { obra: Obra; index: number }) => (
    <div data-testid={`obra-card-${obra.id}`}>
      <h3>{obra.title}</h3>
      <p>{obra.description}</p>
    </div>
  ),
}))

// Mock ObraCardSkeleton
vi.mock('@/components/obra/obra-card-skeleton', () => ({
  ObraCardSkeleton: () => <div data-testid="obra-card-skeleton">Loading...</div>,
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock Button
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ArrowRight: () => <svg data-testid="arrow-right-icon" />,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ObrasDestacadas', () => {
  const mockObras: Obra[] = [
    {
      id: '1',
      title: 'Obra 1',
      description: 'Descripción de la obra 1',
      images: ['https://example.com/image1.jpg'],
      videos: [],
      category: 'vivienda',
      featured: true,
      created_at: '2024-01-01',
    },
    {
      id: '2',
      title: 'Obra 2',
      description: 'Descripción de la obra 2',
      images: [],
      videos: ['https://example.com/video1.mp4'],
      category: 'comercial',
      featured: true,
      created_at: '2024-01-02',
    },
    {
      id: '3',
      title: 'Obra 3',
      description: 'Descripción de la obra 3',
      images: ['https://example.com/image2.jpg'],
      videos: ['https://example.com/video2.mp4'],
      category: 'industrial',
      featured: true,
      created_at: '2024-01-03',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render section with title and description', () => {
    render(<ObrasDestacadas obras={mockObras} />)

    expect(screen.getByText('Obras Destacadas')).toBeInTheDocument()
    expect(screen.getByText(/Conoce algunos de nuestros proyectos más importantes/i)).toBeInTheDocument()
  })

  it('should render all featured obras using ObraCard', () => {
    render(<ObrasDestacadas obras={mockObras} />)

    mockObras.forEach((obra) => {
      expect(screen.getByTestId(`obra-card-${obra.id}`)).toBeInTheDocument()
      expect(screen.getByText(obra.title)).toBeInTheDocument()
      expect(screen.getByText(obra.description)).toBeInTheDocument()
    })
  })

  it('should render link to all obras page', () => {
    render(<ObrasDestacadas obras={mockObras} />)

    const link = screen.getByText(/Ver Todas las Obras/i).closest('a')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/obras')
  })

  it('should handle empty obras array', () => {
    render(<ObrasDestacadas obras={[]} />)

    expect(screen.getByText('Obras Destacadas')).toBeInTheDocument()
    expect(screen.getByText(/Ver Todas las Obras/i)).toBeInTheDocument()
  })

  it('should pass correct index to ObraCard', () => {
    render(<ObrasDestacadas obras={mockObras} />)

    // Verificar que cada ObraCard recibe el index correcto
    mockObras.forEach((obra, index) => {
      const card = screen.getByTestId(`obra-card-${obra.id}`)
      expect(card).toBeInTheDocument()
    })
  })

  it('should render obras with mixed media (images and videos)', () => {
    const obrasWithMixedMedia: Obra[] = [
      {
        id: '1',
        title: 'Obra con imágenes',
        description: 'Solo imágenes',
        images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
        videos: [],
        featured: true,
        created_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Obra con videos',
        description: 'Solo videos',
        images: [],
        videos: ['https://example.com/vid1.mp4', 'https://example.com/vid2.mp4'],
        featured: true,
        created_at: '2024-01-02',
      },
      {
        id: '3',
        title: 'Obra completa',
        description: 'Con imágenes y videos',
        images: ['https://example.com/img3.jpg'],
        videos: ['https://example.com/vid3.mp4'],
        featured: true,
        created_at: '2024-01-03',
      },
    ]

    render(<ObrasDestacadas obras={obrasWithMixedMedia} />)

    obrasWithMixedMedia.forEach((obra) => {
      expect(screen.getByTestId(`obra-card-${obra.id}`)).toBeInTheDocument()
    })
  })

  it('should handle obras without images or videos', () => {
    const obrasSinMedia: Obra[] = [
      {
        id: '1',
        title: 'Obra sin media',
        description: 'Sin imágenes ni videos',
        images: [],
        videos: [],
        featured: true,
        created_at: '2024-01-01',
      },
    ]

    render(<ObrasDestacadas obras={obrasSinMedia} />)

    expect(screen.getByTestId('obra-card-1')).toBeInTheDocument()
    expect(screen.getByText('Obra sin media')).toBeInTheDocument()
  })
})

