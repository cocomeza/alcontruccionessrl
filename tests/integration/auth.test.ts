import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signIn, signOut } from '@/lib/actions/auth'

// Mock Supabase server client
const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
  })),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: {
          session: { access_token: 'token' },
          user: { id: '123', email: 'test@example.com' },
        },
        error: null,
      })

      await expect(signIn('test@example.com', 'password123')).resolves.not.toThrow()
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should throw error on invalid credentials', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      })

      await expect(signIn('wrong@example.com', 'wrongpass')).rejects.toThrow('Invalid login credentials')
    })

    it('should throw error if no session received', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: null,
      })

      await expect(signIn('test@example.com', 'password123')).rejects.toThrow('No se recibió sesión')
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSignOut.mockResolvedValue({
        error: null,
      })

      await expect(signOut()).resolves.not.toThrow()
      expect(mockSignOut).toHaveBeenCalled()
    })
  })
})

