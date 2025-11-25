import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

describe('Card Components', () => {
  it('should render Card with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should render CardHeader with title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should render CardDescription', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should render CardContent', () => {
    render(
      <Card>
        <CardContent>
          <p>Content text</p>
        </CardContent>
      </Card>
    )
    expect(screen.getByText('Content text')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

