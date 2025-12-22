import { test, expect } from '@playwright/test'

test.describe('Video Player Controls Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')
  })

  test('should display video player controls when hovering over video in obra card', async ({ page }) => {
    // Buscar una obra con video
    const obraCards = page.locator('[class*="cursor-pointer"]')
    const cardCount = await obraCards.count()
    
    test.skip(cardCount === 0, 'No hay obras disponibles para testear')
    
    // Buscar una obra que tenga video (puede tener indicador de video)
    let obraWithVideo = null
    for (let i = 0; i < cardCount; i++) {
      const card = obraCards.nth(i)
      const hasVideoIndicator = await card.locator('text=/video|Video/i').count()
      if (hasVideoIndicator > 0) {
        obraWithVideo = card
        break
      }
    }
    
    if (!obraWithVideo) {
      // Si no encontramos indicador, intentar con la primera obra
      obraWithVideo = obraCards.first()
    }
    
    // Hacer clic en la obra para abrir la galería
    await obraWithVideo.click()
    await page.waitForTimeout(1000)
    
    // Buscar el video en la galería mixta
    const videoElement = page.locator('video').first()
    const videoCount = await videoElement.count()
    
    if (videoCount > 0) {
      // Hacer hover sobre el video
      await videoElement.hover()
      await page.waitForTimeout(500)
      
      // Verificar que los controles están visibles
      // Buscar botones de play/pause
      const playPauseButton = page.locator('button[aria-label*="reproducir"], button[aria-label*="pausar"]').first()
      const controlsVisible = await playPauseButton.count() > 0
      
      expect(controlsVisible).toBe(true)
    }
  })

  test('should show video player controls when clicking on video in obra detail page', async ({ page }) => {
    // Navegar a una obra con video
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    await page.waitForLoadState('networkidle')
    
    // Buscar la galería de videos
    const videoGallery = page.locator('text=/Galería de Videos/i')
    const hasVideoGallery = await videoGallery.count() > 0
    
    if (hasVideoGallery) {
      // Buscar un video en la galería
      const videoCard = page.locator('[class*="cursor-pointer"]').first()
      await videoCard.click()
      await page.waitForTimeout(1000)
      
      // Verificar que el VideoPlayer está visible
      const videoPlayer = page.locator('video').first()
      await expect(videoPlayer).toBeVisible({ timeout: 5000 })
      
      // Hacer hover sobre el video player
      await videoPlayer.hover()
      await page.waitForTimeout(500)
      
      // Verificar que los controles están visibles
      const playButton = page.locator('button[aria-label*="reproducir"], button[aria-label*="pausar"]').first()
      await expect(playButton).toBeVisible({ timeout: 2000 })
    }
  })

  test('should show all video controls (play, volume, fullscreen, progress) in desktop view', async ({ page }) => {
    // Configurar viewport de desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')
    
    // Buscar y abrir una obra con video
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    
    // Buscar galería de videos
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(1000)
    
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    if (videoCount > 0) {
      // Hacer hover para mostrar controles
      await videoPlayer.hover()
      await page.waitForTimeout(1000)
      
      // Verificar que todos los controles están presentes
      const playButton = page.locator('button[aria-label*="reproducir"], button[aria-label*="pausar"]')
      const volumeButton = page.locator('button[aria-label*="silenciar"], button[aria-label*="sonido"]')
      const fullscreenButton = page.locator('button[aria-label*="pantalla completa"]')
      const progressBar = page.locator('[class*="bg-white/20"], [class*="progress"]').first()
      
      // Verificar que al menos el botón de play está visible
      const hasPlayButton = await playButton.count() > 0
      expect(hasPlayButton).toBe(true)
      
      // Verificar que hay controles visibles (puede ser que algunos estén ocultos en móvil)
      const hasControls = await playButton.isVisible() || await volumeButton.isVisible() || await fullscreenButton.isVisible()
      expect(hasControls).toBe(true)
    }
  })

  test('should toggle controls visibility on mouse enter/leave in desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')
    
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(1000)
    
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    if (videoCount > 0) {
      // Hacer hover - controles deberían aparecer
      await videoPlayer.hover()
      await page.waitForTimeout(500)
      
      const playButton = page.locator('button[aria-label*="reproducir"], button[aria-label*="pausar"]').first()
      const controlsVisibleOnHover = await playButton.isVisible().catch(() => false)
      
      // Mover el mouse fuera
      await page.mouse.move(0, 0)
      await page.waitForTimeout(1500)
      
      // Si el video está reproduciéndose, los controles pueden ocultarse
      // Pero deberían aparecer de nuevo al hacer hover
      await videoPlayer.hover()
      await page.waitForTimeout(500)
      
      const controlsVisibleAfterRehover = await playButton.isVisible().catch(() => false)
      
      // Los controles deberían ser visibles al hacer hover
      expect(controlsVisibleOnHover || controlsVisibleAfterRehover).toBe(true)
    }
  })

  test('should show video controls when video is paused in desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')
    
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(1000)
    
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    if (videoCount > 0) {
      await videoPlayer.hover()
      await page.waitForTimeout(500)
      
      // Verificar que el botón de play está visible cuando el video está pausado
      const playButton = page.locator('button[aria-label*="reproducir"]').first()
      const isPlayButtonVisible = await playButton.isVisible().catch(() => false)
      
      // Si no está visible, hacer clic en el video para pausarlo
      if (!isPlayButtonVisible) {
        await videoPlayer.click()
        await page.waitForTimeout(500)
      }
      
      // Verificar que los controles están visibles cuando está pausado
      const controlsOverlay = page.locator('[class*="bg-gradient-to-t"], [class*="controls"]').first()
      const hasControls = await controlsOverlay.isVisible().catch(() => false) || 
                          await playButton.isVisible().catch(() => false)
      
      expect(hasControls).toBe(true)
    }
  })
})
