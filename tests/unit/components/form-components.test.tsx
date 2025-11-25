import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ObraFormImproved } from '@/components/obra/obra-form-improved'
import LoginPageImproved from '@/app/admin/login/page-improved'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  default: {
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  },
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  EyeOff: () => <span data-testid="eye-off-icon">👁️‍🗨️</span>,
  Upload: () => <span data-testid="upload-icon">📤</span>,
  X: () => <span data-testid="x-icon">✕</span>,
  Image: () => <span data-testid="image-icon">🖼️</span>,
  Video: () => <span data-testid="video-icon">🎥</span>,
}))

// Mock Uploader component
vi.mock('@/components/common/uploader', () => ({
  Uploader: ({ type, onUploadComplete, existingUrls }: any) => (
    <div data-testid={`uploader-${type}`}>
      <input type="file" accept={type === 'image' ? 'image/*' : 'video/*'} />
      {existingUrls && existingUrls.length > 0 && (
        <div data-testid="existing-urls">
          {existingUrls.map((url: string, i: number) => (
            <span key={i}>{url}</span>
          ))}
        </div>
      )}
    </div>
  ),
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    replace: vi.fn(),
  },
  writable: true,
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock Supabase client
const mockSignInWithPassword = vi.fn().mockResolvedValue({
  data: {
    session: { access_token: 'token' },
    user: { id: '1', email: 'test@example.com' },
  },
  error: null,
})

const mockGetSession = vi.fn().mockResolvedValue({
  data: { 
    session: { access_token: 'token' },
    user: { id: '1', email: 'test@example.com' }
  },
  error: null,
})

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getSession: mockGetSession,
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' } },
        error: null,
      }),
    },
  })),
}))

// Mock server actions
vi.mock('@/lib/actions/obras', () => ({
  createObra: vi.fn().mockResolvedValue({ id: '1' }),
  updateObra: vi.fn().mockResolvedValue({ id: '1' }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  window.location.href = ''
})

describe('Form Components', () => {
  describe('ObraFormImproved', () => {
    it('should render form with all fields', () => {
      render(<ObraFormImproved />)
      
      expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument()
    })

    it('should show validation errors for empty form', async () => {
      const user = userEvent.setup()
      render(<ObraFormImproved />)
      
      const submitButton = screen.getByRole('button', { name: /crear|guardar/i })
      await user.click(submitButton)
      
      // Should show validation errors
      await waitFor(() => {
        const errors = screen.queryAllByText(/debe tener|requerido/i)
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    it('should prefill form when editing', () => {
      const obra = {
        id: '1',
        title: 'Existing Obra',
        description: 'Existing description',
        images: [],
        videos: [],
        created_at: '2024-01-01',
      }
      
      render(<ObraFormImproved obra={obra} />)
      
      expect(screen.getByDisplayValue('Existing Obra')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument()
    })
  })

  describe('LoginPageImproved', () => {
    it('should render login form', () => {
      render(<LoginPageImproved />)
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    })

    it('should toggle password visibility', async () => {
      const user = userEvent.setup()
      render(<LoginPageImproved />)
      
      const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement
      const toggleButton = screen.getByRole('button', { name: /mostrar|ocultar contraseña/i })
      
      expect(passwordInput.type).toBe('password')
      
      await user.click(toggleButton)
      await waitFor(() => {
        expect(passwordInput.type).toBe('text')
      })
      
      await user.click(toggleButton)
      await waitFor(() => {
        expect(passwordInput.type).toBe('password')
      })
    })

    it('should handle form submission', async () => {
      const user = userEvent.setup()
      render(<LoginPageImproved />)
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Contraseña')
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // Verificar que se llamó signInWithPassword
      await waitFor(() => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })
  })
})

