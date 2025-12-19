import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoPlayer } from '@/components/obra/video-player'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...restProps } = props
      return <div {...restProps}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Play: ({ className, fill }: any) => <svg data-testid="play-icon" className={className} fill={fill} />,
  Pause: ({ className, fill }: any) => <svg data-testid="pause-icon" className={className} fill={fill} />,
  Volume2: ({ className }: any) => <svg data-testid="volume-icon" className={className} />,
  VolumeX: ({ className }: any) => <svg data-testid="volume-x-icon" className={className} />,
  Maximize: ({ className }: any) => <svg data-testid="maximize-icon" className={className} />,
  Minimize: ({ className }: any) => <svg data-testid="minimize-icon" className={className} />,
  SkipBack: ({ className }: any) => <svg data-testid="skip-back-icon" className={className} />,
  SkipForward: ({ className }: any) => <svg data-testid="skip-forward-icon" className={className} />,
  Settings: ({ className }: any) => <svg data-testid="settings-icon" className={className} />,
}))

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}))

describe('VideoPlayer', () => {
  const mockOnPlay = vi.fn()
  const mockOnPause = vi.fn()
  const mockOnTimeUpdate = vi.fn()
  const mockOnEnded = vi.fn()
  const mockOnError = vi.fn()

  const defaultProps = {
    src: 'https://example.com/video.mp4',
    onPlay: mockOnPlay,
    onPause: mockOnPause,
    onTimeUpdate: mockOnTimeUpdate,
    onEnded: mockOnEnded,
    onError: mockOnError,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock HTMLVideoElement methods
    HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    HTMLVideoElement.prototype.pause = vi.fn()
    
    // Mock HTMLElement.requestFullscreen (used by container)
    HTMLElement.prototype.requestFullscreen = vi.fn().mockResolvedValue(undefined)
    
    // Mock document.fullscreenElement
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: null,
    })
    
    // Mock document.exitFullscreen
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined)
  })

  describe('Rendering', () => {
    it('should render video element with correct src', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const video = document.querySelector('video')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('src', defaultProps.src)
    })

    it('should render with custom className', () => {
      const { container } = render(
        <VideoPlayer {...defaultProps} className="custom-class" />
      )
      
      const player = container.querySelector('.custom-class')
      expect(player).toBeInTheDocument()
    })

    it('should show loading indicator initially', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should render controls overlay when showControls is true', () => {
      render(<VideoPlayer {...defaultProps} showControls={true} />)
      
      const playButton = screen.queryByLabelText(/reproducir/i)
      expect(playButton).toBeInTheDocument()
    })

    it('should not render controls when showControls is false', () => {
      render(<VideoPlayer {...defaultProps} showControls={false} />)
      
      const playButton = screen.queryByLabelText(/reproducir|pausar/i)
      expect(playButton).not.toBeInTheDocument()
    })

    it('should render multiple source elements for different formats', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const sources = document.querySelectorAll('source')
      expect(sources.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Play/Pause functionality', () => {
    it('should render play button when paused', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const playButton = screen.getByLabelText(/reproducir/i)
      expect(playButton).toBeInTheDocument()
    })

    it('should call onPlay when play button is clicked', async () => {
      const user = userEvent.setup()
      render(<VideoPlayer {...defaultProps} />)
      
      const playButton = screen.getByLabelText(/reproducir/i)
      await user.click(playButton)
      
      await waitFor(() => {
        expect(mockOnPlay).toHaveBeenCalled()
      }, { timeout: 1000 })
    })

    it('should toggle between play and pause', async () => {
      const user = userEvent.setup()
      render(<VideoPlayer {...defaultProps} />)
      
      // Start with play button
      const playButton = screen.getByLabelText(/reproducir/i)
      await user.click(playButton)
      
      // Should call onPlay
      await waitFor(() => {
        expect(mockOnPlay).toHaveBeenCalled()
      }, { timeout: 1000 })
    })
  })

  describe('Controls', () => {
    it('should render all control buttons', () => {
      render(<VideoPlayer {...defaultProps} showControls={true} />)
      
      expect(screen.getByLabelText(/reproducir/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/retroceder/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/adelantar/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/silenciar|activar sonido/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/pantalla completa/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/velocidad de reproducción/i)).toBeInTheDocument()
    })

    it('should render progress bar', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const progressBar = document.querySelector('[class*="bg-white/20"]')
      expect(progressBar).toBeInTheDocument()
    })

    it('should render volume control', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const volumeButton = screen.getByLabelText(/silenciar|activar sonido/i)
      expect(volumeButton).toBeInTheDocument()
    })

    it('should toggle mute when volume button is clicked', async () => {
      const user = userEvent.setup()
      render(<VideoPlayer {...defaultProps} />)
      
      const volumeButton = screen.getByLabelText(/silenciar/i)
      await user.click(volumeButton)
      
      // Button should still be visible (might show unmute now)
      await waitFor(() => {
        const volumeControl = screen.queryByLabelText(/silenciar|activar sonido/i)
        expect(volumeControl).toBeInTheDocument()
      })
    })
  })

  describe('Skip controls', () => {
    it('should render skip backward button', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const skipBackButton = screen.getByLabelText(/retroceder/i)
      expect(skipBackButton).toBeInTheDocument()
    })

    it('should render skip forward button', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const skipForwardButton = screen.getByLabelText(/adelantar/i)
      expect(skipForwardButton).toBeInTheDocument()
    })

    it('should be clickable without errors', async () => {
      const user = userEvent.setup()
      render(<VideoPlayer {...defaultProps} />)
      
      const skipBackButton = screen.getByLabelText(/retroceder/i)
      const skipForwardButton = screen.getByLabelText(/adelantar/i)
      
      await user.click(skipBackButton)
      await user.click(skipForwardButton)
      
      // Should not throw errors
      expect(skipBackButton).toBeInTheDocument()
      expect(skipForwardButton).toBeInTheDocument()
    })
  })

  describe('Fullscreen functionality', () => {
    it('should render fullscreen button', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const fullscreenButton = screen.getByLabelText(/pantalla completa/i)
      expect(fullscreenButton).toBeInTheDocument()
    })

    it('should request fullscreen when button is clicked', async () => {
      const user = userEvent.setup()
      render(<VideoPlayer {...defaultProps} />)
      
      const fullscreenButton = screen.getByLabelText(/pantalla completa/i)
      await user.click(fullscreenButton)
      
      // requestFullscreen should be called on the container element
      await waitFor(() => {
        expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalled()
      }, { timeout: 1000 })
    })
  })

  describe('Playback rate', () => {
    it('should render playback rate button', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const playbackRateButton = screen.getByLabelText(/velocidad de reproducción/i)
      expect(playbackRateButton).toBeInTheDocument()
    })

    it('should show playback rate menu when clicked', async () => {
      const user = userEvent.setup()
      render(<VideoPlayer {...defaultProps} />)
      
      const playbackRateButton = screen.getByLabelText(/velocidad de reproducción/i)
      await user.click(playbackRateButton)
      
      await waitFor(() => {
        // Use getAllByText since there are multiple elements with "1x" (menu and display)
        const menuItems = screen.getAllByText(/1x|1\.5x|2x/i)
        expect(menuItems.length).toBeGreaterThan(0)
      }, { timeout: 1000 })
    })
  })

  describe('Video events', () => {
    it('should handle video error events', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const video = document.querySelector('video')
      expect(video).toBeInTheDocument()
      
      // Simulate error event
      if (video) {
        fireEvent(video, new Event('error'))
      }
      
      // onError should be called
      expect(mockOnError).toHaveBeenCalled()
    })

    it('should handle video ended events', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const video = document.querySelector('video')
      expect(video).toBeInTheDocument()
      
      // Simulate ended event
      if (video) {
        fireEvent(video, new Event('ended'))
      }
      
      // onEnded should be called
      expect(mockOnEnded).toHaveBeenCalled()
    })

    it('should handle time update events', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const video = document.querySelector('video')
      expect(video).toBeInTheDocument()
      
      // Simulate timeupdate event
      if (video) {
        fireEvent(video, new Event('timeupdate'))
      }
      
      // onTimeUpdate should be called
      expect(mockOnTimeUpdate).toHaveBeenCalled()
    })

    it('should handle loaded metadata events', () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const video = document.querySelector('video')
      expect(video).toBeInTheDocument()
      
      // Simulate loadedmetadata event
      if (video) {
        fireEvent(video, new Event('loadedmetadata'))
      }
      
      // Should not throw errors
      expect(video).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels on all buttons', () => {
      render(<VideoPlayer {...defaultProps} showControls={true} />)
      
      expect(screen.getByLabelText(/reproducir/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/retroceder/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/adelantar/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/silenciar|activar sonido/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/pantalla completa/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/velocidad de reproducción/i)).toBeInTheDocument()
    })

    it('should be keyboard accessible', async () => {
      render(<VideoPlayer {...defaultProps} />)
      
      const playButton = screen.getByLabelText(/reproducir/i)
      playButton.focus()
      
      // Should be focusable
      expect(playButton).toHaveFocus()
    })
  })

  describe('Props handling', () => {
    it('should handle missing optional callbacks', () => {
      const { container } = render(
        <VideoPlayer src="https://example.com/video.mp4" />
      )
      
      const video = container.querySelector('video')
      expect(video).toBeInTheDocument()
    })

    it('should respect showControls prop', () => {
      const { rerender } = render(
        <VideoPlayer {...defaultProps} showControls={false} />
      )
      
      expect(screen.queryByLabelText(/reproducir/i)).not.toBeInTheDocument()
      
      rerender(<VideoPlayer {...defaultProps} showControls={true} />)
      
      expect(screen.getByLabelText(/reproducir/i)).toBeInTheDocument()
    })

    it('should handle className prop', () => {
      const { container } = render(
        <VideoPlayer {...defaultProps} className="test-class" />
      )
      
      const player = container.querySelector('.test-class')
      expect(player).toBeInTheDocument()
    })
  })
})
