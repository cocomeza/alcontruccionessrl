import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getObras, createObra, updateObra, deleteObra } from '@/lib/actions/obras'

// Mock Supabase
const mockGetUser = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/utils/storage', () => ({
  deleteFiles: vi.fn().mockResolvedValue(undefined),
}))

describe('obras actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    })

    // Mock for getObras
    const mockSelectOrder = vi.fn().mockResolvedValue({
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
    })

    // Mock for getObraById (select().eq().single())
    const mockSelectEqSingle = vi.fn().mockResolvedValue({
      data: {
        id: '1',
        title: 'Test Obra',
        description: 'Test Description',
        images: [],
        videos: [],
        created_at: '2024-01-01',
      },
      error: null,
    })

    const mockEqSingle = vi.fn().mockReturnValue({
      single: mockSelectEqSingle,
    })

    const mockSelect = vi.fn().mockReturnValue({
      order: mockSelectOrder,
      eq: mockEqSingle,
    })

    // Mock for createObra
    const mockInsertSelectSingle = vi.fn().mockResolvedValue({
      data: {
        id: '1',
        title: 'New Obra',
        description: 'New Description',
        images: [],
        videos: [],
        created_at: '2024-01-01',
      },
      error: null,
    })

    const mockInsertSelect = vi.fn().mockReturnValue({
      single: mockInsertSelectSingle,
    })

    const mockInsert = vi.fn().mockReturnValue({
      select: mockInsertSelect,
    })

    // Mock for updateObra
    const mockUpdateSelectSingle = vi.fn().mockResolvedValue({
      data: {
        id: '1',
        title: 'Updated Obra',
        description: 'Updated Description',
        images: [],
        videos: [],
        created_at: '2024-01-01',
      },
      error: null,
    })

    const mockUpdateSelect = vi.fn().mockReturnValue({
      single: mockUpdateSelectSingle,
    })

    const mockUpdateEq = vi.fn().mockReturnValue({
      select: mockUpdateSelect,
    })

    const mockUpdate = vi.fn().mockReturnValue({
      eq: mockUpdateEq,
    })

    // Mock for deleteObra
    const mockDeleteEq = vi.fn().mockResolvedValue({
      error: null,
    })

    const mockDelete = vi.fn().mockReturnValue({
      eq: mockDeleteEq,
    })

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })
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
    await expect(deleteObra('1')).resolves.not.toThrow()
  })
})
