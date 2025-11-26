import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WhatsAppFloating } from '@/components/common/whatsapp-floating'

// Mock next/navigation
const mockPathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

// Mock WhatsAppButton
vi.mock('@/components/common/whatsapp-button', () => ({
  WhatsAppButton: ({ phoneNumber, message }: any) => (
    <div data-testid="whatsapp-button">
      {phoneNumber && <span data-testid="phone">{phoneNumber}</span>}
      {message && <span data-testid="message">{message}</span>}
    </div>
  ),
}))

describe('WhatsAppFloating', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render WhatsApp button on public pages', () => {
    mockPathname.mockReturnValue('/')
    
    render(<WhatsAppFloating />)
    
    expect(screen.getByTestId('whatsapp-button')).toBeInTheDocument()
  })

  it('should render WhatsApp button on obras page', () => {
    mockPathname.mockReturnValue('/obras')
    
    render(<WhatsAppFloating />)
    
    expect(screen.getByTestId('whatsapp-button')).toBeInTheDocument()
  })

  it('should NOT render WhatsApp button on admin pages', () => {
    mockPathname.mockReturnValue('/admin/login')
    
    const { container } = render(<WhatsAppFloating />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should NOT render WhatsApp button on admin dashboard', () => {
    mockPathname.mockReturnValue('/admin/dashboard')
    
    const { container } = render(<WhatsAppFloating />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should NOT render WhatsApp button on admin obras page', () => {
    mockPathname.mockReturnValue('/admin/obras')
    
    const { container } = render(<WhatsAppFloating />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should pass phoneNumber and message to WhatsAppButton', () => {
    mockPathname.mockReturnValue('/')
    
    render(
      <WhatsAppFloating 
        phoneNumber="+5491123456789" 
        message="Test message" 
      />
    )
    
    expect(screen.getByTestId('phone')).toHaveTextContent('+5491123456789')
    expect(screen.getByTestId('message')).toHaveTextContent('Test message')
  })

  it('should render on contacto page', () => {
    mockPathname.mockReturnValue('/contacto')
    
    render(<WhatsAppFloating />)
    
    expect(screen.getByTestId('whatsapp-button')).toBeInTheDocument()
  })

  it('should render on nosotros page', () => {
    mockPathname.mockReturnValue('/nosotros')
    
    render(<WhatsAppFloating />)
    
    expect(screen.getByTestId('whatsapp-button')).toBeInTheDocument()
  })
})

