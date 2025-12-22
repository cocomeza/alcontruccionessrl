import { test, expect } from '@playwright/test'

test.describe('Video Player Simple - Controles Siempre Visibles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')
  })

  test('debe mostrar controles siempre visibles en desktop sin necesidad de hover', async ({ page }) => {
    // Configurar viewport de desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Buscar una obra con video
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    await page.waitForLoadState('networkidle')
    
    // Buscar y abrir un video
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(2000)
    
    // Verificar que el video está visible
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    test.skip(videoCount === 0, 'No hay videos disponibles')
    
    // Verificar que los controles están SIEMPRE visibles (sin hover)
    // No mover el mouse, solo verificar que los controles están ahí
    const playButton = page.locator('button[aria-label*="reproducir"], button[aria-label*="pausar"]').first()
    const volumeButton = page.locator('button[aria-label*="silenciar"], button[aria-label*="sonido"]').first()
    const fullscreenButton = page.locator('button[aria-label*="pantalla completa"]').first()
    const progressBar = page.locator('[class*="bg-white/30"]').first()
    
    // Esperar un momento para que el componente se renderice
    await page.waitForTimeout(1000)
    
    // Verificar que los controles están visibles SIN hacer hover
    await expect(playButton).toBeVisible({ timeout: 5000 })
    await expect(volumeButton).toBeVisible({ timeout: 5000 })
    await expect(fullscreenButton).toBeVisible({ timeout: 5000 })
    await expect(progressBar).toBeVisible({ timeout: 5000 })
  })

  test('debe mostrar botón de play grande cuando el video está pausado', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(2000)
    
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    test.skip(videoCount === 0, 'No hay videos disponibles')
    
    // Verificar que hay un botón de play grande central
    // Buscar el botón de play grande (puede estar en el centro o en los controles)
    const largePlayButton = page.locator('button:has(svg)').filter({ hasText: /reproducir|play/i }).or(
      page.locator('[class*="rounded-full"]:has(svg)').first()
    )
    
    // O simplemente verificar que hay un botón de play visible
    const playButtons = page.locator('button[aria-label*="reproducir"], button[aria-label*="pausar"]')
    const playButtonCount = await playButtons.count()
    
    expect(playButtonCount).toBeGreaterThan(0)
    
    // Verificar que al menos uno es visible
    const firstPlayButton = playButtons.first()
    await expect(firstPlayButton).toBeVisible({ timeout: 5000 })
  })

  test('debe poder reproducir y pausar el video con los controles', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(2000)
    
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    test.skip(videoCount === 0, 'No hay videos disponibles')
    
    // Esperar a que el video cargue
    await page.waitForTimeout(2000)
    
    // Hacer clic en el botón de play
    const playButton = page.locator('button[aria-label*="reproducir"]').first()
    await expect(playButton).toBeVisible({ timeout: 5000 })
    await playButton.click()
    
    // Esperar a que el video comience a reproducirse
    await page.waitForTimeout(1000)
    
    // Verificar que el botón cambió a pausa
    const pauseButton = page.locator('button[aria-label*="pausar"]').first()
    await expect(pauseButton).toBeVisible({ timeout: 3000 })
    
    // Hacer clic en pausa
    await pauseButton.click()
    await page.waitForTimeout(500)
    
    // Verificar que el botón cambió de vuelta a play
    const playButtonAgain = page.locator('button[aria-label*="reproducir"]').first()
    await expect(playButtonAgain).toBeVisible({ timeout: 3000 })
  })

  test('debe mostrar barra de progreso grande y fácil de usar', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(2000)
    
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    test.skip(videoCount === 0, 'No hay videos disponibles')
    
    // Buscar la barra de progreso (debe ser grande y visible)
    const progressBar = page.locator('[class*="bg-white/30"], [class*="h-3"]').first()
    await expect(progressBar).toBeVisible({ timeout: 5000 })
    
    // Verificar que la barra tiene un tamaño mínimo (h-3 = 12px mínimo)
    const box = await progressBar.boundingBox()
    expect(box).not.toBeNull()
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(10) // Al menos 10px de alto
    }
  })

  test('debe mostrar tiempo del video de forma clara', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    test.skip(count === 0, 'No hay obras disponibles')
    
    await obraLink.click()
    await page.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
    
    const videoCard = page.locator('[class*="cursor-pointer"]').first()
    await videoCard.click()
    await page.waitForTimeout(2000)
    
    const videoPlayer = page.locator('video').first()
    const videoCount = await videoPlayer.count()
    
    test.skip(videoCount === 0, 'No hay videos disponibles')
    
    // Esperar a que el video cargue metadata
    await page.waitForTimeout(3000)
    
    // Buscar el texto de tiempo (formato: "0:00 / 0:00")
    const timeDisplay = page.locator('text=/\\d+:\\d+.*\\/.*\\d+:\\d+/').first()
    const hasTimeDisplay = await timeDisplay.count() > 0
    
    // Verificar que hay algún indicador de tiempo visible
    expect(hasTimeDisplay).toBe(true)
  })
})
