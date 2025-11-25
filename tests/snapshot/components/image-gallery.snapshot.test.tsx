import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ImageGallery } from '@/components/obra/image-gallery'

const mockImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
]

describe('ImageGallery Snapshot', () => {
  it('should match snapshot with multiple images', () => {
    const { container } = render(<ImageGallery images={mockImages} title="Test Gallery" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with single image', () => {
    const { container } = render(<ImageGallery images={[mockImages[0]]} title="Single Image" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot without title', () => {
    const { container } = render(<ImageGallery images={mockImages} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

