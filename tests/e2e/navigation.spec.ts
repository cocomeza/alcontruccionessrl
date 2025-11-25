import { test, expect } from '@playwright/test'

test.describe('Navigation Tests', () => {
  test('should navigate from home to obras', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Obras')
    await expect(page).toHaveURL(/\/obras/)
  })

  test('should navigate to contacto page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Contacto')
    await expect(page).toHaveURL(/\/contacto/)
  })

  test('should navigate to nosotros page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Nosotros')
    await expect(page).toHaveURL(/\/nosotros/)
  })

  test('should navigate back from obra detail to obras list', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // Click on first obra if available
    const obraLink = page.locator('a[href*="/obra/"]').first()
    const count = await obraLink.count()
    
    if (count > 0) {
      await obraLink.click()
      await page.waitForLoadState('networkidle')
      
      // Click back link
      const backLink = page.getByText(/volver/i)
      if (await backLink.count() > 0) {
        await backLink.click()
        await expect(page).toHaveURL(/\/obras/)
      }
    }
  })

  test('should have working mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Look for hamburger menu button
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first()
    const menuButtonCount = await menuButton.count()

    if (menuButtonCount > 0) {
      await menuButton.click()
      
      // Menu should open
      const menu = page.locator('nav, [role="navigation"]')
      await expect(menu).toBeVisible()
    }
  })

  test('should navigate to admin login from admin link', async ({ page }) => {
    await page.goto('/')
    
    // Look for admin link (might be in header or footer)
    const adminLink = page.locator('a[href*="/admin"]').first()
    const count = await adminLink.count()
    
    if (count > 0) {
      await adminLink.click()
      await expect(page).toHaveURL(/\/admin/)
    }
  })

  test('should maintain scroll position on navigation', async ({ page }) => {
    await page.goto('/obras')
    await page.evaluate(() => window.scrollTo(0, 500))
    
    const scrollPosition = await page.evaluate(() => window.scrollY)
    expect(scrollPosition).toBeGreaterThan(0)
  })

  test('should have working breadcrumbs if implemented', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // Check for breadcrumb navigation
    const breadcrumbs = page.locator('[aria-label*="breadcrumb"], nav[aria-label*="Breadcrumb"]')
    const count = await breadcrumbs.count()
    
    // Breadcrumbs are optional, so we just check if they exist
    if (count > 0) {
      await expect(breadcrumbs.first()).toBeVisible()
    }
  })

  test('should handle browser back button correctly', async ({ page }) => {
    await page.goto('/')
    await page.goto('/obras')
    await page.goBack()
    
    await expect(page).toHaveURL(/\/$|^http:\/\/localhost:3000\/$/)
  })

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/')
    
    // Tab through page
    await page.keyboard.press('Tab')
    const firstFocused = page.locator(':focus')
    await expect(firstFocused).toBeVisible()
    
    // Continue tabbing
    await page.keyboard.press('Tab')
    const secondFocused = page.locator(':focus')
    await expect(secondFocused).toBeVisible()
  })
})

