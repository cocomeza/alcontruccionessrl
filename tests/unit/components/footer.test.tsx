import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Facebook: () => <svg data-testid="facebook-icon" />,
  Instagram: () => <svg data-testid="instagram-icon" />,
}))

describe('Footer', () => {
  it('should render company name', () => {
    render(<Footer />)
    
    expect(screen.getByText('ALCONSTRUCCIONES SRL')).toBeInTheDocument()
  })

  it('should render company tagline', () => {
    render(<Footer />)
    
    expect(screen.getByText('Construyendo sueños con calidad y compromiso')).toBeInTheDocument()
  })

  it('should render Facebook link', () => {
    render(<Footer />)
    
    const facebookLink = screen.getByRole('link', { name: /facebook/i })
    expect(facebookLink).toBeInTheDocument()
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/alconstrucciones')
    expect(facebookLink).toHaveAttribute('target', '_blank')
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render Instagram link', () => {
    render(<Footer />)
    
    const instagramLink = screen.getByRole('link', { name: /instagram/i })
    expect(instagramLink).toBeInTheDocument()
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/alconstrucciones')
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should NOT render WhatsApp link', () => {
    render(<Footer />)
    
    // Verificar que no hay ningún link de WhatsApp
    const links = screen.getAllByRole('link')
    const whatsappLinks = links.filter(link => 
      link.getAttribute('href')?.includes('wa.me') || 
      link.getAttribute('aria-label')?.toLowerCase().includes('whatsapp')
    )
    
    expect(whatsappLinks.length).toBe(0)
  })

  it('should render copyright notice', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument()
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument()
  })

  it('should render developer credit', () => {
    render(<Footer />)
    
    expect(screen.getByText(/Desarrollado por/i)).toBeInTheDocument()
    
    const developerLink = screen.getByRole('link', { name: /Botón Creativo/i })
    expect(developerLink).toBeInTheDocument()
    expect(developerLink).toHaveAttribute('href', 'https://botoncreativo.onrender.com/')
  })

  it('should have correct CSS classes', () => {
    const { container } = render(<Footer />)
    
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('bg-calypso', 'dark:bg-calypso/90', 'text-white')
  })

  it('should render social media icons', () => {
    render(<Footer />)
    
    expect(screen.getByTestId('facebook-icon')).toBeInTheDocument()
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument()
  })
})

