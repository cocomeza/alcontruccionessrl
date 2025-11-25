import { test, expect } from '@playwright/test'

test.describe('Authentication - Basic Tests', () => {
  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 })
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible()
    
    // Verificar que el título esté presente
    await expect(page.getByText('ALCONSTRUCCIONES SRL')).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    
    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Contraseña').fill('wrongpassword')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    
    // Esperar a que aparezca el mensaje de error
    await page.waitForTimeout(1000)
    
    // Verificar que sigue en la página de login o muestra error
    const currentUrl = page.url()
    const isLoginPage = currentUrl.includes('/admin/login')
    const hasError = await page.locator('text=/error|Error|incorrecta|inválida/i').count() > 0
    
    expect(isLoginPage || hasError).toBeTruthy()
  })

  test('should redirect authenticated users from login to dashboard', async ({ page }) => {
    // Este test requiere credenciales válidas
    // Se ejecutará solo si están configuradas las variables de entorno
    const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL
    const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD
    
    test.skip(
      !ADMIN_EMAIL || !ADMIN_PASSWORD,
      'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
    )

    // Hacer login primero
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill(ADMIN_EMAIL!)
    await page.getByLabel('Contraseña').fill(ADMIN_PASSWORD!)
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    
    // Esperar a que se complete el login
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })
    
    // Ahora intentar ir a /admin/login
    await page.goto('/admin/login')
    
    // Debería redirigir automáticamente al dashboard
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })
})

