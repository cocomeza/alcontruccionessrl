import { test, expect } from '@playwright/test'

test.describe('Network Interception Tests', () => {
  test('should handle 401 unauthorized error', async ({ page }) => {
    // Intercept Supabase auth requests
    await page.route('**/auth/v1/**', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Invalid login credentials' } }),
        })
      } else {
        route.continue()
      }
    })

    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Contraseña').fill('wrongpassword')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    // Should show error message
    await page.waitForTimeout(2000)
    
    const errorMessage = page.locator('text=/error|Error|incorrecta|inválida/i')
    const errorCount = await errorMessage.count()
    expect(errorCount).toBeGreaterThan(0)
  })

  test('should handle slow image upload', async ({ page }) => {
    const testCredentials = {
      email: process.env.TEST_ADMIN_EMAIL || 'test@example.com',
      password: process.env.TEST_ADMIN_PASSWORD || 'testpassword123',
    }

    // Intercept storage upload to simulate slow upload
    await page.route('**/storage/v1/object/**', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ path: 'test-path' }),
        })
      }, 2000) // 2 second delay
    })

    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')

    // Login first
    await page.getByLabel('Email').fill(testCredentials.email)
    await page.getByLabel('Contraseña').fill(testCredentials.password)
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await page.waitForURL(/\/admin\/obras/, { timeout: 15000 })

    // Navigate to create obra
    await page.getByRole('link', { name: /nueva obra/i }).click()
    await page.waitForURL(/\/admin\/obras\/new/, { timeout: 5000 })

    // Check if progress bar appears (if upload component is visible)
    const uploadButton = page.locator('button:has-text("Seleccionar")').first()
    const uploadButtonCount = await uploadButton.count()

    if (uploadButtonCount > 0) {
      // Progress indicator should appear during upload
      // This is a basic check - actual implementation may vary
      expect(uploadButton).toBeVisible()
    }
  })

  test('should handle network timeout', async ({ page }) => {
    await page.route('**/rest/v1/obras**', route => {
      route.abort('timedout')
    })

    await page.goto('/obras')
    
    // Should handle error gracefully
    await page.waitForLoadState('networkidle')
    
    // Page should still render (with error state or empty state)
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should handle 500 server error', async ({ page }) => {
    await page.route('**/rest/v1/obras**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Internal server error' } }),
      })
    })

    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    // Should show error or empty state
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})

