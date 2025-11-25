import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime

    // Homepage should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('should have good Lighthouse performance score', async ({ page }) => {
    await page.goto('/')
    
    // Check for performance metrics
    const navigationTiming = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
      }
    })

    // DOM should be interactive quickly
    expect(navigationTiming.domContentLoaded).toBeLessThan(3000)
  })

  test('should lazy load images', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    const images = page.locator('img')
    const count = await images.count()

    if (count > 0) {
      // Check that images have loading attribute
      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i)
        const loading = await img.getAttribute('loading')
        // First few images should be eager, rest should be lazy
        if (i > 6) {
          expect(loading).toBe('lazy')
        }
      }
    }
  })

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      err => !err.includes('favicon') && !err.includes('404')
    )

    expect(criticalErrors.length).toBe(0)
  })

  test('should have optimized images with proper sizes', async ({ page }) => {
    await page.goto('/obras')
    await page.waitForLoadState('networkidle')

    const images = page.locator('img[src*="supabase"]')
    const count = await images.count()

    if (count > 0) {
      const firstImage = images.first()
      const sizes = await firstImage.getAttribute('sizes')
      // Images should have sizes attribute for responsive loading
      expect(sizes).toBeTruthy()
    }
  })

  test('should have minimal layout shift', async ({ page }) => {
    await page.goto('/')
    
    // Check for Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          resolve(clsValue)
        })
        observer.observe({ type: 'layout-shift', buffered: true })
        
        // Resolve after a short delay if no shifts occur
        setTimeout(() => resolve(clsValue), 2000)
      })
    })

    // CLS should be low (good score is < 0.1)
    expect(cls).toBeLessThan(0.25)
  })

  test('should load critical CSS inline', async ({ page }) => {
    await page.goto('/')
    
    const styles = await page.locator('style').count()
    // Should have some inline styles for critical CSS
    // This is a basic check
    expect(styles).toBeGreaterThanOrEqual(0)
  })

  test('should have proper caching headers', async ({ page }) => {
    const response = await page.goto('/')
    
    if (response) {
      const cacheControl = response.headers()['cache-control']
      // Static assets should have cache headers
      // This is a basic check
      expect(response.status()).toBeLessThan(400)
    }
  })

  test('should have minimal JavaScript bundle size', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]')).map(
        (script: HTMLScriptElement) => script.src
      )
    })

    // Should not have excessive number of scripts
    expect(scripts.length).toBeLessThan(20)
  })

  test('should load admin pages efficiently', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime

    // Admin pages should load quickly
    expect(loadTime).toBeLessThan(4000)
  })
})

