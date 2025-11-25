import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ObraCard } from '@/components/obra/obra-card'
import type { Obra } from '@/lib/types/database'

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

  it('should show placeholder when no image', () => {
    const obraWithoutImage = { ...mockObra, images: [] }
    render(<ObraCard obra={obraWithoutImage} index={0} />)
    
    expect(screen.getByText('Sin imagen')).toBeInTheDocument()
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
})

