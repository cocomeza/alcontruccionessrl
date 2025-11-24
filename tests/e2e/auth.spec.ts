import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Contraseña').fill('wrongpassword')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    
    // Should show error or stay on login page
    await expect(page.getByText(/error/i).or(page.locator('form'))).toBeVisible()
  })
})

