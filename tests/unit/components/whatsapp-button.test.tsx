import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WhatsAppButton } from '@/components/common/whatsapp-button'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  MessageCircle: () => <svg data-testid="message-circle-icon" />,
}))

describe('WhatsAppButton', () => {
  it('should render WhatsApp button with default config', () => {
    render(<WhatsAppButton />)
    
    const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should format phone number correctly', () => {
    render(<WhatsAppButton phoneNumber="+54 9 11 2345-6789" />)
    
    const link = screen.getByRole('link')
    const href = link.getAttribute('href')
    
    // Debe remover espacios, guiones y el +
    expect(href).toContain('wa.me/5491123456789')
  })

  it('should include custom message in URL', () => {
    const customMessage = 'Hola, necesito información'
    render(<WhatsAppButton message={customMessage} />)
    
    const link = screen.getByRole('link')
    const href = link.getAttribute('href')
    
    expect(href).toContain(encodeURIComponent(customMessage))
  })

  it('should have correct CSS classes', () => {
    render(<WhatsAppButton />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-50')
    expect(link).toHaveClass('bg-boston-blue', 'hover:bg-calypso')
  })

  it('should apply custom className', () => {
    render(<WhatsAppButton className="custom-class" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('should have aria-label for accessibility', () => {
    render(<WhatsAppButton />)
    
    const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
    expect(link).toHaveAttribute('aria-label', 'Contactar por WhatsApp')
  })

  it('should render MessageCircle icon', () => {
    render(<WhatsAppButton />)
    
    const icon = screen.getByTestId('message-circle-icon')
    expect(icon).toBeInTheDocument()
  })

  it('should have screen reader text', () => {
    render(<WhatsAppButton />)
    
    const srText = screen.getByText('Contactar por WhatsApp')
    expect(srText).toHaveClass('sr-only')
  })
})

