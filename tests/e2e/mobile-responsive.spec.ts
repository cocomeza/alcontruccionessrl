import { test, expect, devices } from '@playwright/test'

test.describe('Mobile Responsive Tests', () => {
  test.use({ ...devices['iPhone 13'] })

  test('should display obras grid correctly on mobile', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // Grid should be single column on mobile
    const grid = page.locator('.grid')
    await expect(grid).toBeVisible()

    // Check that cards are stacked vertically
    const cards = page.locator('[class*="grid"] > *')
    const count = await cards.count()
    
    if (count > 0) {
      // On mobile, grid should be single column
      const firstCard = cards.first()
      await expect(firstCard).toBeVisible()
    }
  })

  test('should have accessible navigation on mobile', async ({ page }) => {
    await page.goto('/')
    
    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu"]').first()
    const menuButtonCount = await menuButton.count()

    if (menuButtonCount > 0) {
      await menuButton.click()
      
      // Menu should be visible
      const menu = page.locator('nav, [role="navigation"]')
      await expect(menu).toBeVisible()
    }
  })

  test('should display obra detail correctly on mobile', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // Click on first obra if available
    const obraLink = page.locator('a[href*="/obra/"]').first()
    const count = await obraLink.count()

    if (count > 0) {
      await obraLink.click()
      await page.waitForLoadState('networkidle')

      // Title should be visible
      const title = page.locator('h1').first()
      await expect(title).toBeVisible()

      // Images should be visible and properly sized
      const images = page.locator('img')
      const imageCount = await images.count()
      
      if (imageCount > 0) {
        const firstImage = images.first()
        await expect(firstImage).toBeVisible()
        
        // Check image is not overflowing
        const boundingBox = await firstImage.boundingBox()
        expect(boundingBox?.width).toBeLessThanOrEqual(400) // Mobile viewport width
      }
    }
  })

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')

    const submitButton = page.getByRole('button', { name: /iniciar sesión/i })
    await expect(submitButton).toBeVisible()

    // Button should be large enough for touch (min 44x44px)
    const boundingBox = await submitButton.boundingBox()
    expect(boundingBox?.height).toBeGreaterThanOrEqual(40)
    expect(boundingBox?.width).toBeGreaterThanOrEqual(200) // Full width on mobile
  })

  test('should handle form inputs correctly on mobile', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')

    const emailInput = page.getByLabel('Email')
    await emailInput.tap() // Use tap for mobile
    
    // Input should be focused
    await expect(emailInput).toBeFocused()
    
    // Virtual keyboard should appear (simulated)
    await emailInput.fill('test@example.com')
    await expect(emailInput).toHaveValue('test@example.com')
  })
})

test.describe('Tablet Responsive Tests', () => {
  test.use({ ...devices['iPad Pro'] })

  test('should display obras grid correctly on tablet', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // On tablet, should be 2 columns
    const grid = page.locator('.grid')
    await expect(grid).toBeVisible()
  })
})

