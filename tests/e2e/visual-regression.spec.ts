import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('should match snapshot of obras page', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await expect(page).toHaveScreenshot('obras-page.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences
    })
  })

  test('should match snapshot of login page', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('should match snapshot of obra detail page', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // Click on first obra if available
    const obraLink = page.locator('a[href*="/obra/"]').first()
    const count = await obraLink.count()

    if (count > 0) {
      await obraLink.click()
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot('obra-detail-page.png', {
        fullPage: true,
        maxDiffPixels: 100,
      })
    } else {
      test.skip()
    }
  })

  test('should match snapshot of obra card component', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    const obraCard = page.locator('[class*="grid"] > *').first()
    const count = await obraCard.count()

    if (count > 0) {
      await expect(obraCard).toHaveScreenshot('obra-card.png', {
        maxDiffPixels: 50,
      })
    } else {
      test.skip()
    }
  })

  test('should match snapshot of header', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const header = page.locator('header').first()
    await expect(header).toHaveScreenshot('header.png', {
      maxDiffPixels: 50,
    })
  })
})

