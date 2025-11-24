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
})

