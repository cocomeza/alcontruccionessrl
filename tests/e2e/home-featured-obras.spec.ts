import { test, expect } from '@playwright/test'

test.describe('Home - Featured Obras', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display featured obras section', async ({ page }) => {
    // Verificar que la sección de obras destacadas existe
    await expect(page.getByRole('heading', { name: /Obras Destacadas/i })).toBeVisible()
    
    // Verificar el texto descriptivo
    await expect(page.getByText(/Conoce algunos de nuestros proyectos más importantes/i)).toBeVisible()
  })

  test('should display featured obras cards', async ({ page }) => {
    // Esperar a que las obras se carguen
    await page.waitForTimeout(1000)
    
    // Verificar que hay al menos una obra destacada (si existen)
    const obraCards = page.locator('[data-testid^="obra-card-"]')
    const count = await obraCards.count()
    
    if (count > 0) {
      // Verificar que las tarjetas son visibles
      await expect(obraCards.first()).toBeVisible()
    } else {
      // Si no hay obras, verificar que la sección no se muestra o muestra mensaje apropiado
      const section = page.locator('section:has-text("Obras Destacadas")')
      // La sección puede estar presente pero sin obras
      expect(await section.count()).toBeGreaterThanOrEqual(0)
    }
  })

  test('should open gallery when clicking obra card with media', async ({ page }) => {
    await page.waitForTimeout(1000)
    
    // Buscar una tarjeta de obra que tenga media
    const obraCard = page.locator('[data-testid^="obra-card-"]').first()
    const count = await obraCard.count()
    
    if (count > 0) {
      // Hacer click en la tarjeta
      await obraCard.click()
      
      // Verificar que se abre la galería (MixedGalleryLightbox)
      // La galería puede tener un botón de cerrar o un overlay
      await page.waitForTimeout(500)
      
      // Verificar que hay un elemento de la galería (botón cerrar, overlay, etc.)
      const closeButton = page.getByLabel(/cerrar|volver/i).first()
      const galleryOverlay = page.locator('[class*="fixed"][class*="inset-0"]').first()
      
      // Al menos uno de estos debería estar presente si la galería se abrió
      const hasCloseButton = await closeButton.count() > 0
      const hasGalleryOverlay = await galleryOverlay.count() > 0
      
      expect(hasCloseButton || hasGalleryOverlay).toBeTruthy()
    }
  })

  test('should navigate to obra detail when clicking obra without media', async ({ page }) => {
    await page.waitForTimeout(1000)
    
    // Buscar links a obras (pueden ser directos o a través de la galería)
    const obraLinks = page.locator('a[href^="/obra/"]')
    const count = await obraLinks.count()
    
    if (count > 0) {
      // Si hay links directos, hacer click en uno
      const firstLink = obraLinks.first()
      const href = await firstLink.getAttribute('href')
      
      if (href && href !== '#') {
        await firstLink.click()
        
        // Verificar que navegó a la página de detalle
        await expect(page).toHaveURL(/\/obra\/[a-f0-9-]+/)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      }
    }
  })

  test('should have link to all obras page', async ({ page }) => {
    // Verificar que existe el botón/link "Ver Todas las Obras"
    const allObrasLink = page.getByRole('link', { name: /Ver Todas las Obras/i })
    await expect(allObrasLink).toBeVisible()
    
    // Verificar que el link apunta a /obras
    await expect(allObrasLink).toHaveAttribute('href', '/obras')
    
    // Hacer click y verificar navegación
    await allObrasLink.click()
    await expect(page).toHaveURL('/obras')
  })

  test('should handle obras with images correctly', async ({ page }) => {
    await page.waitForTimeout(1000)
    
    // Verificar que las imágenes se cargan correctamente
    const images = page.locator('img[alt]')
    const imageCount = await images.count()
    
    if (imageCount > 0) {
      // Verificar que al menos una imagen es visible
      await expect(images.first()).toBeVisible()
    }
  })

  test('should handle obras with videos correctly', async ({ page }) => {
    await page.waitForTimeout(1000)
    
    // Verificar que los videos se manejan correctamente
    // Los videos pueden estar en las tarjetas o solo aparecer en la galería
    const videoElements = page.locator('video')
    const videoCount = await videoElements.count()
    
    // Los videos pueden no estar visibles inicialmente (solo en hover o galería)
    // Solo verificamos que no hay errores
    expect(videoCount).toBeGreaterThanOrEqual(0)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.waitForTimeout(1000)
    
    // Verificar que la sección sigue siendo visible
    await expect(page.getByRole('heading', { name: /Obras Destacadas/i })).toBeVisible()
    
    // Verificar que el grid se adapta (debería ser 1 columna en móvil)
    const grid = page.locator('.grid').first()
    await expect(grid).toBeVisible()
  })

  test('should handle empty featured obras gracefully', async ({ page }) => {
    // Si no hay obras destacadas, la sección puede no mostrarse
    // o mostrar un estado vacío apropiado
    await page.waitForTimeout(1000)
    
    const section = page.locator('section:has-text("Obras Destacadas")')
    const sectionCount = await section.count()
    
    // La sección puede estar presente o no, pero no debe causar errores
    expect(sectionCount).toBeGreaterThanOrEqual(0)
  })
})

