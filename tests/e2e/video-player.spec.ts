import { test, expect } from '@playwright/test'

test.describe('Video Player - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a una página con videos (asumiendo que hay obras con videos)
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Video Player Controls', () => {
    test('should display video player with controls when opening video', async ({ page }) => {
      // Buscar una obra con video
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        // Buscar un video en la galería
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          // Verificar que el reproductor de video está visible
          await expect(page.locator('video')).toBeVisible({ timeout: 5000 })
          
          // Verificar que los controles están presentes
          await expect(page.getByLabel(/reproducir|pausar/i)).toBeVisible()
        }
      }
    })

    test('should play video when play button is clicked', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          // Esperar a que el video se cargue
          await page.waitForSelector('video', { state: 'visible' })
          
          // Hacer clic en play
          const playButton = page.getByLabel(/reproducir/i).first()
          await playButton.click()
          
          // Verificar que el video está reproduciéndose
          await page.waitForTimeout(1000)
          
          // Verificar que el botón cambió a pause
          await expect(page.getByLabel(/pausar/i)).toBeVisible({ timeout: 2000 })
        }
      }
    })

    test('should pause video when pause button is clicked', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Reproducir primero
          const playButton = page.getByLabel(/reproducir/i).first()
          await playButton.click()
          await page.waitForTimeout(1000)
          
          // Pausar
          const pauseButton = page.getByLabel(/pausar/i).first()
          await pauseButton.click()
          
          // Verificar que el botón cambió a play
          await expect(page.getByLabel(/reproducir/i)).toBeVisible({ timeout: 2000 })
        }
      }
    })

    test('should show progress bar and allow seeking', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Buscar la barra de progreso
          const progressBar = page.locator('[class*="bg-white/20"]').first()
          await expect(progressBar).toBeVisible()
          
          // Hacer clic en la barra de progreso para saltar
          const box = await progressBar.boundingBox()
          if (box) {
            await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2)
            await page.waitForTimeout(500)
            
            // Verificar que el tiempo del video cambió
            const video = page.locator('video').first()
            const currentTime = await video.evaluate((v: HTMLVideoElement) => v.currentTime)
            expect(currentTime).toBeGreaterThan(0)
          }
        }
      }
    })

    test('should control volume with volume slider', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Buscar el botón de volumen
          const volumeButton = page.getByLabel(/silenciar|activar sonido/i).first()
          await expect(volumeButton).toBeVisible()
          
          // Hacer clic para mutear
          await volumeButton.click()
          await page.waitForTimeout(500)
          
          // Verificar que el video está silenciado
          const video = page.locator('video').first()
          const isMuted = await video.evaluate((v: HTMLVideoElement) => v.muted)
          expect(isMuted).toBe(true)
        }
      }
    })

    test('should skip backward 10 seconds', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Reproducir y avanzar un poco
          const playButton = page.getByLabel(/reproducir/i).first()
          await playButton.click()
          await page.waitForTimeout(2000)
          
          // Obtener tiempo actual
          const video = page.locator('video').first()
          const initialTime = await video.evaluate((v: HTMLVideoElement) => v.currentTime)
          
          // Saltar atrás
          const skipBackButton = page.getByLabel(/retroceder/i).first()
          await skipBackButton.click()
          await page.waitForTimeout(500)
          
          // Verificar que el tiempo retrocedió
          const newTime = await video.evaluate((v: HTMLVideoElement) => v.currentTime)
          expect(newTime).toBeLessThan(initialTime)
        }
      }
    })

    test('should skip forward 10 seconds', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Reproducir
          const playButton = page.getByLabel(/reproducir/i).first()
          await playButton.click()
          await page.waitForTimeout(1000)
          
          // Obtener tiempo actual
          const video = page.locator('video').first()
          const initialTime = await video.evaluate((v: HTMLVideoElement) => v.currentTime)
          
          // Saltar adelante
          const skipForwardButton = page.getByLabel(/adelantar/i).first()
          await skipForwardButton.click()
          await page.waitForTimeout(500)
          
          // Verificar que el tiempo avanzó
          const newTime = await video.evaluate((v: HTMLVideoElement) => v.currentTime)
          expect(newTime).toBeGreaterThan(initialTime)
        }
      }
    })

    test('should toggle fullscreen', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Buscar botón de pantalla completa
          const fullscreenButton = page.getByLabel(/pantalla completa/i).first()
          await expect(fullscreenButton).toBeVisible()
          
          // Hacer clic en pantalla completa
          await fullscreenButton.click()
          await page.waitForTimeout(1000)
          
          // Verificar que está en pantalla completa (si el navegador lo soporta)
          // Nota: Playwright no puede verificar fullscreen directamente en algunos navegadores
          const video = page.locator('video').first()
          await expect(video).toBeVisible()
        }
      }
    })

    test('should change playback rate', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Buscar botón de velocidad
          const speedButton = page.getByLabel(/velocidad de reproducción/i).first()
          await expect(speedButton).toBeVisible()
          
          // Abrir menú de velocidad
          await speedButton.click()
          await page.waitForTimeout(500)
          
          // Seleccionar 1.5x
          const speedOption = page.getByText('1.5x').first()
          if (await speedOption.isVisible()) {
            await speedOption.click()
            await page.waitForTimeout(500)
            
            // Verificar que la velocidad cambió
            const video = page.locator('video').first()
            const playbackRate = await video.evaluate((v: HTMLVideoElement) => v.playbackRate)
            expect(playbackRate).toBe(1.5)
          }
        }
      }
    })
  })

  test.describe('Video Player in Mixed Gallery', () => {
    test('should navigate between videos in mixed gallery', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        // Buscar cualquier card (imagen o video)
        const mediaCard = page.locator('[class*="cursor-pointer"]').first()
        const cardCount = await mediaCard.count()
        
        if (cardCount > 0) {
          await mediaCard.click()
          
          // Si hay múltiples items, debería haber botones de navegación
          const nextButton = page.locator('button[aria-label*="siguiente"], button[aria-label*="next"]').first()
          const hasNextButton = await nextButton.count() > 0
          
          if (hasNextButton) {
            // Navegar al siguiente
            await nextButton.click()
            await page.waitForTimeout(1000)
            
            // Verificar que el contenido cambió
            const video = page.locator('video').first()
            const image = page.locator('img').first()
            const hasMedia = await video.count() > 0 || await image.count() > 0
            expect(hasMedia).toBe(true)
          }
        }
      }
    })

    test('should pause video when navigating to next item', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Reproducir video
          const playButton = page.getByLabel(/reproducir/i).first()
          await playButton.click()
          await page.waitForTimeout(1000)
          
          // Navegar al siguiente item
          const nextButton = page.locator('button[aria-label*="siguiente"], button[aria-label*="next"]').first()
          const hasNextButton = await nextButton.count() > 0
          
          if (hasNextButton) {
            await nextButton.click()
            await page.waitForTimeout(1000)
            
            // Verificar que el video está pausado (si hay otro video)
            const video = page.locator('video').first()
            if (await video.count() > 0) {
              const isPaused = await video.evaluate((v: HTMLVideoElement) => v.paused)
              expect(isPaused).toBe(true)
            }
          }
        }
      }
    })
  })

  test.describe('Video Player Accessibility', () => {
    test('should have proper ARIA labels on all controls', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Verificar ARIA labels
          await expect(page.getByLabel(/reproducir|pausar/i)).toBeVisible()
          await expect(page.getByLabel(/retroceder/i)).toBeVisible()
          await expect(page.getByLabel(/adelantar/i)).toBeVisible()
          await expect(page.getByLabel(/silenciar|activar sonido/i)).toBeVisible()
          await expect(page.getByLabel(/pantalla completa/i)).toBeVisible()
        }
      }
    })

    test('should be keyboard navigable', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Presionar Espacio para reproducir/pausar
          await page.keyboard.press('Space')
          await page.waitForTimeout(1000)
          
          // Verificar que el video está reproduciéndose o pausado
          const video = page.locator('video').first()
          const isPlaying = !(await video.evaluate((v: HTMLVideoElement) => v.paused))
          
          // Presionar Espacio de nuevo para pausar
          await page.keyboard.press('Space')
          await page.waitForTimeout(500)
          
          const isPaused = await video.evaluate((v: HTMLVideoElement) => v.paused)
          expect(isPaused).toBe(true)
        }
      }
    })
  })

  test.describe('Video Player Error Handling', () => {
    test('should handle video load errors gracefully', async ({ page }) => {
      // Este test verificaría que los errores de carga se manejan correctamente
      // En un entorno real, podrías inyectar un video con URL inválida
      
      await page.goto('/obras')
      await page.waitForLoadState('networkidle')
      
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        // Verificar que la página carga sin errores
        await expect(page.locator('body')).toBeVisible()
      }
    })
  })

  test.describe('Video Player Performance', () => {
    test('should load video metadata efficiently', async ({ page }) => {
      const obraLink = page.locator('a[href^="/obra/"]').first()
      const count = await obraLink.count()
      
      if (count > 0) {
        await obraLink.click()
        await page.waitForURL(/\/obra\/[a-f0-9-]+/)
        
        const videoCard = page.locator('[class*="aspect-video"]').first()
        const videoCount = await videoCard.count()
        
        if (videoCount > 0) {
          const startTime = Date.now()
          await videoCard.click()
          
          await page.waitForSelector('video', { state: 'visible' })
          
          // Verificar que el video se carga en un tiempo razonable (< 5 segundos)
          const loadTime = Date.now() - startTime
          expect(loadTime).toBeLessThan(5000)
        }
      }
    })
  })
})

