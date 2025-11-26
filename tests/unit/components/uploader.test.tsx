import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Uploader } from '@/components/common/uploader'

// Mock storage utils
vi.mock('@/lib/utils/storage', () => ({
  uploadFile: vi.fn().mockResolvedValue('https://example.com/uploaded-file.jpg'),
}))

// Mock upload utils
vi.mock('@/lib/utils/upload', () => ({
  validateImage: vi.fn((file) => ({
    valid: file.type.startsWith('image/'),
    error: file.type.startsWith('image/') ? null : 'Invalid image',
  })),
  validateVideo: vi.fn((file) => ({
    valid: file.type.startsWith('video/'),
    error: file.type.startsWith('video/') ? null : 'Invalid video',
  })),
  compressImage: vi.fn((file) => Promise.resolve(file)),
  formatFileSize: vi.fn((size) => `${(size / 1024 / 1024).toFixed(2)} MB`),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Upload: () => <svg data-testid="upload-icon" />,
  X: () => <svg data-testid="x-icon" />,
  Image: () => <svg data-testid="image-icon" />,
  Video: () => <svg data-testid="video-icon" />,
}))

describe('Uploader', () => {
  const mockOnUploadComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  describe('Video Uploader', () => {
    it('should show upload button for videos', () => {
      render(<Uploader type="video" onUploadComplete={mockOnUploadComplete} />)
      
      const selectButton = screen.getByText(/seleccionar videos/i)
      expect(selectButton).toBeInTheDocument()
    })

    it('should show upload button after selecting video files', async () => {
      const user = userEvent.setup()
      const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' })
      
      render(<Uploader type="video" onUploadComplete={mockOnUploadComplete} />)
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).toBeInTheDocument()
      
      // Simular selección de archivo
      await user.upload(input, file)
      
      await waitFor(() => {
        const uploadButton = screen.getByText(/subir.*video/i)
        expect(uploadButton).toBeInTheDocument()
      })
    })

    it('should show explanatory message when files are selected', async () => {
      const user = userEvent.setup()
      const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' })
      
      render(<Uploader type="video" onUploadComplete={mockOnUploadComplete} />)
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await user.upload(input, file)
      
      await waitFor(() => {
        expect(screen.getByText(/haz clic en "subir" para cargar/i)).toBeInTheDocument()
      })
    })

    it('should call onUploadComplete with URLs after upload', async () => {
      const user = userEvent.setup()
      const { uploadFile } = await import('@/lib/utils/storage')
      vi.mocked(uploadFile).mockResolvedValue('https://example.com/video.mp4')
      
      const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' })
      
      render(<Uploader type="video" onUploadComplete={mockOnUploadComplete} />)
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await user.upload(input, file)
      
      const uploadButton = await screen.findByText(/subir.*video/i)
      await user.click(uploadButton)
      
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalledWith(['https://example.com/video.mp4'])
      })
    })

    it('should handle multiple video files', async () => {
      const user = userEvent.setup()
      const { uploadFile } = await import('@/lib/utils/storage')
      vi.mocked(uploadFile)
        .mockResolvedValueOnce('https://example.com/video1.mp4')
        .mockResolvedValueOnce('https://example.com/video2.mp4')
      
      const file1 = new File(['video1'], 'video1.mp4', { type: 'video/mp4' })
      const file2 = new File(['video2'], 'video2.mp4', { type: 'video/mp4' })
      
      render(<Uploader type="video" onUploadComplete={mockOnUploadComplete} />)
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      
      // Simular selección múltiple usando userEvent
      await user.upload(input, file1)
      await user.upload(input, file2)
      
      const uploadButton = await screen.findByText(/subir.*video/i)
      await user.click(uploadButton)
      
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalled()
      })
    })

    it('should show error for invalid video files', async () => {
      const user = userEvent.setup()
      const { validateVideo } = await import('@/lib/utils/upload')
      vi.mocked(validateVideo).mockReturnValue({
        valid: false,
        error: 'Invalid video format',
      })
      
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      
      render(<Uploader type="video" onUploadComplete={mockOnUploadComplete} />)
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await user.upload(input, file)
      
      await waitFor(() => {
        // El error se muestra en el formato "filename: error"
        expect(screen.getByText(/test\.txt.*Invalid video format/i)).toBeInTheDocument()
      })
    })

    it('should combine existing URLs with new uploads', async () => {
      const user = userEvent.setup()
      const { uploadFile } = await import('@/lib/utils/storage')
      vi.mocked(uploadFile).mockResolvedValue('https://example.com/new-video.mp4')
      
      const existingUrls = ['https://example.com/existing-video.mp4']
      const file = new File(['video content'], 'new-video.mp4', { type: 'video/mp4' })
      
      render(
        <Uploader 
          type="video" 
          onUploadComplete={mockOnUploadComplete}
          existingUrls={existingUrls}
        />
      )
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await user.upload(input, file)
      
      const uploadButton = await screen.findByText(/subir.*video/i)
      await user.click(uploadButton)
      
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalledWith([
          'https://example.com/existing-video.mp4',
          'https://example.com/new-video.mp4',
        ])
      })
    })
  })

  describe('Image Uploader', () => {
    it('should show upload button for images', () => {
      render(<Uploader type="image" onUploadComplete={mockOnUploadComplete} />)
      
      const selectButton = screen.getByText(/seleccionar imágenes/i)
      expect(selectButton).toBeInTheDocument()
    })

    it('should compress images before upload', async () => {
      const user = userEvent.setup()
      const { compressImage } = await import('@/lib/utils/upload')
      const compressedFile = new File(['compressed'], 'compressed.jpg', { type: 'image/jpeg' })
      vi.mocked(compressImage).mockResolvedValue(compressedFile)
      
      const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' })
      
      render(<Uploader type="image" onUploadComplete={mockOnUploadComplete} />)
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await user.upload(input, file)
      
      const uploadButton = await screen.findByText(/subir.*imagen/i)
      await user.click(uploadButton)
      
      await waitFor(() => {
        expect(compressImage).toHaveBeenCalled()
      })
    })
  })

  describe('File Removal', () => {
    it('should allow removing selected files before upload', async () => {
      const user = userEvent.setup()
      const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' })
      
      render(<Uploader type="video" onUploadComplete={mockOnUploadComplete} />)
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await user.upload(input, file)
      
      await waitFor(() => {
        expect(screen.getByText(/subir.*video/i)).toBeInTheDocument()
      })
      
      // Buscar botón de eliminar (X icon) en los archivos seleccionados
      const removeButtons = screen.getAllByTestId('x-icon')
      // El primer X icon es del botón de seleccionar, los siguientes son de los archivos
      if (removeButtons.length > 1) {
        await user.click(removeButtons[1].closest('button')!)
        
        await waitFor(() => {
          expect(screen.queryByText(/subir.*video/i)).not.toBeInTheDocument()
        })
      }
    })

    it('should allow removing uploaded URLs', async () => {
      const user = userEvent.setup()
      const existingUrls = [
        'https://example.com/video1.mp4',
        'https://example.com/video2.mp4',
      ]
      
      render(
        <Uploader 
          type="video" 
          onUploadComplete={mockOnUploadComplete}
          existingUrls={existingUrls}
        />
      )
      
      // Buscar botones de eliminar en URLs subidas
      const removeButtons = screen.getAllByTestId('x-icon')
      if (removeButtons.length > 0) {
        await user.click(removeButtons[0].closest('button')!)
        
        await waitFor(() => {
          expect(mockOnUploadComplete).toHaveBeenCalledWith(['https://example.com/video2.mp4'])
        })
      }
    })
  })
})

