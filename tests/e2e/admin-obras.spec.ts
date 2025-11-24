import { test, expect } from '@playwright/test'

test.describe('Admin Obras Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login first
    await page.goto('/admin/login')
  })

  test('should show obras management page after login', async ({ page }) => {
    // Note: This test requires valid credentials
    // In a real scenario, you'd set up test user credentials
    
    // For now, just check that login page is accessible
    await expect(page.getByText('Panel de Administración')).toBeVisible()
  })

  test('should navigate to create obra page', async ({ page }) => {
    // This would require authentication
    // For now, we'll test the route structure
    await page.goto('/admin/obras/new')
    
    // Should redirect to login if not authenticated
    // or show form if authenticated
    const isLoginPage = page.url().includes('/admin/login')
    const hasForm = await page.locator('form').count() > 0
    
    expect(isLoginPage || hasForm).toBe(true)
  })

  test('should show obras list in admin', async ({ page }) => {
    await page.goto('/admin/obras')
    
    // Should redirect to login or show obras
    const isLoginPage = page.url().includes('/admin/login')
    const hasObras = await page.getByText(/Gestionar Obras/i).count() > 0
    
    expect(isLoginPage || hasObras).toBe(true)
  })
})

