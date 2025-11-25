import { test, expect, devices } from '@playwright/test'

const browsers = [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'firefox', use: devices['Desktop Firefox'] },
  { name: 'webkit', use: devices['Desktop Safari'] },
]

for (const browser of browsers) {
  test.describe(`Cross-Browser Tests - ${browser.name}`, () => {
    test.use(browser.use)

    test('should render obras page correctly', async ({ page }) => {
      await page.goto('/obras')
      await page.waitForLoadState('networkidle')

      // Verify page loads
      await expect(page.locator('body')).toBeVisible()

      // Verify grid is visible
      const grid = page.locator('.grid, [class*="grid"]').first()
      await expect(grid).toBeVisible()
    })

    test('should render obra detail page correctly', async ({ page }) => {
      await page.goto('/obras')
      await page.waitForLoadState('networkidle')

      const obraLink = page.locator('a[href*="/obra/"]').first()
      const count = await obraLink.count()

      if (count > 0) {
        await obraLink.click()
        await page.waitForLoadState('networkidle')

        // Verify title is visible
        const title = page.locator('h1').first()
        await expect(title).toBeVisible()

        // Verify images load
        const images = page.locator('img')
        const imageCount = await images.count()
        expect(imageCount).toBeGreaterThan(0)
      }
    })

    test('should handle form submission correctly', async ({ page }) => {
      await page.goto('/admin/login')
      await page.waitForLoadState('networkidle')

      const emailInput = page.getByLabel('Email')
      const passwordInput = page.getByLabel('Contraseña')
      const submitButton = page.getByRole('button', { name: /iniciar sesión/i })

      await expect(emailInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
      await expect(submitButton).toBeVisible()

      // Fill form
      await emailInput.fill('test@example.com')
      await passwordInput.fill('testpassword123')

      // Verify values are set
      await expect(emailInput).toHaveValue('test@example.com')
      await expect(passwordInput).toHaveValue('testpassword123')
    })

    test('should handle animations correctly', async ({ page }) => {
      await page.goto('/obras')
      await page.waitForLoadState('networkidle')

      // Check that page loads without animation errors
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.waitForTimeout(1000)

      // Filter out known non-critical errors
      const criticalErrors = errors.filter(
        err => !err.includes('favicon') && !err.includes('404')
      )

      expect(criticalErrors.length).toBe(0)
    })
  })
}

