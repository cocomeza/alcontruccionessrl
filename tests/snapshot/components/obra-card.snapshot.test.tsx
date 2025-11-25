import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ObraCard } from '@/components/obra/obra-card'
import type { Obra } from '@/lib/types/database'

const mockObra: Obra = {
  id: '1',
  title: 'Casa Moderna',
  description: 'Una hermosa casa moderna con diseño contemporáneo y grandes ventanales',
  images: ['https://example.com/image.jpg'],
  videos: [],
  category: 'vivienda',
  created_at: '2024-01-01T00:00:00Z',
}

describe('ObraCard Snapshot', () => {
  it('should match snapshot with image', () => {
    const { container } = render(<ObraCard obra={mockObra} index={0} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot without image', () => {
    const obraWithoutImage = { ...mockObra, images: [] }
    const { container } = render(<ObraCard obra={obraWithoutImage} index={0} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with category', () => {
    const { container } = render(<ObraCard obra={mockObra} index={0} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot without category', () => {
    const obraWithoutCategory = { ...mockObra, category: undefined }
    const { container } = render(<ObraCard obra={obraWithoutCategory} index={0} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

