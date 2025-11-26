import { test, expect } from '@playwright/test'

test.describe('WhatsApp Button', () => {
  test('should show WhatsApp button on home page', async ({ page }) => {
    await page.goto('/')
    
    // Buscar el botón de WhatsApp por aria-label
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    await expect(whatsappButton).toBeVisible()
  })

  test('should NOT show WhatsApp button on admin pages', async ({ page }) => {
    await page.goto('/admin/login')
    
    // El botón no debe estar visible en páginas de admin
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    await expect(whatsappButton).not.toBeVisible()
  })

  test('should have correct WhatsApp URL format', async ({ page }) => {
    await page.goto('/')
    
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    const href = await whatsappButton.getAttribute('href')
    
    // Debe ser un enlace de WhatsApp
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+/)
    expect(href).toContain('text=')
  })

  test('should open WhatsApp in new tab', async ({ page }) => {
    await page.goto('/')
    
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    
    // Verificar que tiene target="_blank"
    const target = await whatsappButton.getAttribute('target')
    expect(target).toBe('_blank')
    
    // Verificar que tiene rel="noopener noreferrer"
    const rel = await whatsappButton.getAttribute('rel')
    expect(rel).toBe('noopener noreferrer')
  })

  test('should show WhatsApp button on obras page', async ({ page }) => {
    await page.goto('/obras')
    
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    await expect(whatsappButton).toBeVisible()
  })

  test('should show WhatsApp button on contacto page', async ({ page }) => {
    await page.goto('/contacto')
    
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    await expect(whatsappButton).toBeVisible()
  })

  test('should show WhatsApp button on nosotros page', async ({ page }) => {
    await page.goto('/nosotros')
    
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    await expect(whatsappButton).toBeVisible()
  })

  test('should have correct positioning (fixed bottom-right)', async ({ page }) => {
    await page.goto('/')
    
    const whatsappButton = page.getByRole('link', { name: /contactar por whatsapp/i })
    
    // Verificar que tiene las clases CSS correctas
    const classes = await whatsappButton.getAttribute('class')
    expect(classes).toContain('fixed')
    expect(classes).toContain('bottom-6')
    expect(classes).toContain('right-6')
  })
})

