import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getObras, createObra, updateObra, deleteObra } from '@/lib/actions/obras'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'test-user-id' } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            {
              id: '1',
              title: 'Test Obra',
              description: 'Test Description',
              images: [],
              videos: [],
              created_at: '2024-01-01',
            },
          ],
          error: null,
        })),
      })),
      eq: vi.fn(() => ({
        single: vi.fn(() => ({
          data: {
            id: '1',
            title: 'Test Obra',
            description: 'Test Description',
            images: [],
            videos: [],
            created_at: '2024-01-01',
          },
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: '1',
              title: 'New Obra',
              description: 'New Description',
              images: [],
              videos: [],
              created_at: '2024-01-01',
            },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: {
                id: '1',
                title: 'Updated Obra',
                description: 'Updated Description',
                images: [],
                videos: [],
                created_at: '2024-01-01',
              },
              error: null,
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null,
        })),
      })),
    })),
  })),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('obras actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get obras', async () => {
    const obras = await getObras()
    expect(obras).toHaveLength(1)
    expect(obras[0].title).toBe('Test Obra')
  })

  it('should create obra', async () => {
    const obra = await createObra({
      title: 'New Obra',
      description: 'New Description',
      images: [],
      videos: [],
    })
    expect(obra.title).toBe('New Obra')
  })

  it('should update obra', async () => {
    const obra = await updateObra('1', {
      title: 'Updated Obra',
    })
    expect(obra.title).toBe('Updated Obra')
  })

  it('should delete obra', async () => {
    vi.mock('@/lib/utils/storage', () => ({
      deleteFiles: vi.fn(),
    }))

    await expect(deleteObra('1')).resolves.not.toThrow()
  })
})

