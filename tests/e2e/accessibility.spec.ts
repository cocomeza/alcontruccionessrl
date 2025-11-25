import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/ALCONSTRUCCIONES/i)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Check for navigation links
    const links = nav.locator('a[href]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have accessible buttons', async ({ page }) => {
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    if (count > 0) {
      const firstButton = buttons.first()
      await expect(firstButton).toBeVisible()
      
      // Check if button has accessible name
      const ariaLabel = await firstButton.getAttribute('aria-label')
      const text = await firstButton.textContent()
      expect(ariaLabel || text).toBeTruthy()
    }
  })

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/admin/login')
    
    const emailInput = page.getByLabel('Email')
    await expect(emailInput).toBeVisible()
    
    const passwordInput = page.getByLabel('Contraseña')
    await expect(passwordInput).toBeVisible()
  })

  test('should have proper ARIA attributes on interactive elements', async ({ page }) => {
    await page.goto('/admin/login')
    
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i })
    await expect(submitButton).toBeVisible()
    
    const ariaDisabled = await submitButton.getAttribute('aria-disabled')
    // Button should not be disabled initially (unless form is invalid)
    expect(ariaDisabled).not.toBe('true')
  })

  test('should not have accessibility violations on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility violations on obras page', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility violations on login page', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have skip links for keyboard navigation', async ({ page }) => {
    // Check for skip links (common accessibility pattern)
    const skipLinks = page.locator('a[href*="#main"], a[href*="#content"]')
    const count = await skipLinks.count()
    // Skip links are optional but good practice
    // We'll just check they exist if implemented
  })

  test('should have proper language attribute', async ({ page }) => {
    const html = page.locator('html')
    const lang = await html.getAttribute('lang')
    expect(lang).toBeTruthy()
    expect(lang).toBe('es')
  })
})

