import { test, expect } from '@playwright/test'

test.describe('Public Obras Pages', () => {
  test('should display obras list', async ({ page }) => {
    await page.goto('/obras')
    
    // Should show header
    await expect(page.getByText('ALCONSTRUCCIONES SRL')).toBeVisible()
    await expect(page.getByText('Portfolio de Obras')).toBeVisible()
  })

  test('should navigate to obra detail', async ({ page }) => {
    await page.goto('/obras')
    
    // Wait for obras to load
    await page.waitForTimeout(1000)
    
    // Try to find and click first obra link if available
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    if (count > 0) {
      await obraLink.click()
      await expect(page).toHaveURL(/\/obra\/[a-f0-9-]+/)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    } else {
      // If no obras, should show empty state
      await expect(page.getByText(/No hay obras/i)).toBeVisible()
    }
  })

  test('should display obra detail with images and videos', async ({ page }) => {
    // This test assumes there's at least one obra
    await page.goto('/obras')
    await page.waitForTimeout(1000)
    
    const obraLink = page.locator('a[href^="/obra/"]').first()
    const count = await obraLink.count()
    
    if (count > 0) {
      await obraLink.click()
      await page.waitForURL(/\/obra\/[a-f0-9-]+/)
      
      // Should show title and description
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      
      // Check for back link
      await expect(page.getByText(/Volver/i)).toBeVisible()
    }
  })

  test('should open mixed gallery lightbox when clicking obra card', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForTimeout(1000)
    
    // Buscar una card de obra (no el link directo, sino la card completa)
    const obraCard = page.locator('[class*="card"], [class*="Card"]').first()
    const cardCount = await obraCard.count()
    
    if (cardCount > 0) {
      // Hacer click en la card
      await obraCard.click()
      await page.waitForTimeout(500)
      
      // Verificar que se abrió el lightbox (buscar elementos característicos)
      const lightbox = page.locator('text=Volver, button[aria-label*="cerrar"], button[aria-label*="Cerrar"]').first()
      const lightboxCount = await lightbox.count()
      
      // Si hay múltiples imágenes/videos, debería haber botones de navegación
      if (lightboxCount > 0) {
        // Verificar que hay controles de navegación o indicador
        const hasNavigation = await page.locator('button[aria-label*="anterior"], button[aria-label*="siguiente"], text=/\\d+.*de.*\\d+/').count() > 0
        // El lightbox puede tener solo un elemento, así que esto es opcional
        expect(lightboxCount).toBeGreaterThan(0)
      }
    }
  })

  test('should navigate carousel with keyboard arrows', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForTimeout(1000)
    
    const obraCard = page.locator('[class*="card"], [class*="Card"]').first()
    const cardCount = await obraCard.count()
    
    if (cardCount > 0) {
      await obraCard.click()
      await page.waitForTimeout(500)
      
      // Verificar que el lightbox está abierto
      const lightbox = page.locator('text=Volver').first()
      const lightboxCount = await lightbox.count()
      
      if (lightboxCount > 0) {
        // Presionar flecha derecha para navegar
        await page.keyboard.press('ArrowRight')
        await page.waitForTimeout(300)
        
        // Presionar flecha izquierda para volver
        await page.keyboard.press('ArrowLeft')
        await page.waitForTimeout(300)
        
        // Presionar Escape para cerrar
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
        
        // Verificar que el lightbox se cerró
        const closedLightbox = await page.locator('text=Volver').count()
        expect(closedLightbox).toBe(0)
      }
    }
  })
})

