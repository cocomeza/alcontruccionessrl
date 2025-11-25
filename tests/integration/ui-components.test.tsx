import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ObraCard } from '@/components/obra/obra-card'
import { ImageGallery } from '@/components/obra/image-gallery'
import type { Obra } from '@/lib/types/database'

const mockObra: Obra = {
  id: '1',
  title: 'Test Obra',
  description: 'Test description for integration test',
  images: ['https://example.com/image.jpg'],
  videos: [],
  category: 'vivienda',
  created_at: '2024-01-01T00:00:00Z',
}

describe('UI Components Integration', () => {
  describe('ObraCard', () => {
    it('should render with all props correctly', () => {
      render(<ObraCard obra={mockObra} index={0} />)
      
      expect(screen.getByText('Test Obra')).toBeInTheDocument()
      expect(screen.getByText('Test description for integration test')).toBeInTheDocument()
      expect(screen.getByText('Vivienda')).toBeInTheDocument()
      expect(screen.getByAltText('Test Obra')).toBeInTheDocument()
    })

    it('should handle missing images gracefully', () => {
      const obraWithoutImages = { ...mockObra, images: [] }
      render(<ObraCard obra={obraWithoutImages} index={0} />)
      
      expect(screen.getByText('Sin imagen')).toBeInTheDocument()
    })

    it('should handle missing category gracefully', () => {
      const obraWithoutCategory = { ...mockObra, category: undefined }
      render(<ObraCard obra={obraWithoutCategory} index={0} />)
      
      expect(screen.getByText('Test Obra')).toBeInTheDocument()
      // Category badge should not appear
      expect(screen.queryByText('Vivienda')).not.toBeInTheDocument()
    })
  })

  describe('ImageGallery', () => {
    it('should render gallery with images', () => {
      const images = [
        'https://example.com/img1.jpg',
        'https://example.com/img2.jpg',
      ]
      
      render(<ImageGallery images={images} title="Test Gallery" />)
      
      images.forEach((_, index) => {
        const img = screen.getByAltText(`Test Gallery - ${index + 1}`)
        expect(img).toBeInTheDocument()
      })
    })

    it('should not render when images array is empty', () => {
      const { container } = render(<ImageGallery images={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle null images gracefully', () => {
      const { container } = render(<ImageGallery images={null as any} />)
      expect(container.firstChild).toBeNull()
    })
  })
})

