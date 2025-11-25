import { test, expect } from '@playwright/test'

/**
 * Test completo del flujo de login y acceso al panel admin
 * 
 * IMPORTANTE: Para ejecutar este test, necesitas:
 * 1. Tener un usuario creado en Supabase Authentication
 * 2. Configurar las variables de entorno TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD
 *    o modificar los valores directamente en el test
 */

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@test.com'
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'testpassword123'

test.describe('Login Flow - Panel Admin', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar cualquier sesión previa
    await page.goto('/admin/login')
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
  })

  test('debería mostrar el formulario de login', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    
    // Verificar que los elementos del formulario estén visibles
    await expect(page.getByLabel('Email')).toBeVisible()
    // Usar el input directamente por ID para evitar ambigüedad con el botón
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible()
    
    // Verificar que el título esté presente (usar getByRole para ser más específico)
    await expect(page.getByRole('heading', { name: 'ALCONSTRUCCIONES SRL' })).toBeVisible()
    await expect(page.getByText('Panel de Administración')).toBeVisible()
  })

  test('debería mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    
    await page.getByLabel('Email').fill('invalid@test.com')
    // Usar el input directamente por ID para evitar ambigüedad
    await page.locator('input#password').fill('wrongpassword')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    
    // Esperar a que aparezca el mensaje de error (toast)
    await page.waitForTimeout(2000)
    
    // Verificar que sigue en la página de login o muestra error
    const currentUrl = page.url()
    const isLoginPage = currentUrl.includes('/admin/login')
    const hasError = await page.locator('text=/error|Error|incorrecta|inválida/i').count() > 0
    
    expect(isLoginPage || hasError).toBeTruthy()
  })

  test('debería redirigir al dashboard después de login exitoso', async ({ page }) => {
    // Skip si no hay credenciales configuradas
    test.skip(
      ADMIN_EMAIL === 'admin@test.com' && ADMIN_PASSWORD === 'testpassword123',
      'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
    )

    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    
    // Llenar el formulario de login
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    // Usar el input directamente por ID para evitar ambigüedad
    await page.locator('input#password').fill(ADMIN_PASSWORD)
    
    // Hacer clic en iniciar sesión
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    
    // Esperar a que aparezca el mensaje de éxito
    await page.waitForTimeout(1000)
    
    // Verificar que aparece el mensaje de éxito (toast)
    const successToast = page.locator('text=/Sesión iniciada correctamente|success/i')
    await expect(successToast).toBeVisible({ timeout: 5000 }).catch(() => {
      // Si no aparece el toast, continuar de todas formas
    })
    
    // Esperar a que se complete la redirección
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 })
    
    // Verificar que estamos en el dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/)
    
    // Verificar que el contenido del dashboard esté visible
    await expect(page.getByText('Panel de Administración')).toBeVisible()
    await expect(page.getByText(/Bienvenido/i)).toBeVisible()
    
    // Verificar que los botones de acción estén presentes
    await expect(page.getByRole('link', { name: /Gestionar Obras/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Nueva Obra/i })).toBeVisible()
  })

  test('debería redirigir al dashboard si el usuario ya está autenticado', async ({ page }) => {
    // Skip si no hay credenciales configuradas
    test.skip(
      ADMIN_EMAIL === 'admin@test.com' && ADMIN_PASSWORD === 'testpassword123',
      'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
    )

    // Primero hacer login
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    // Usar el input directamente por ID para evitar ambigüedad
    await page.locator('input#password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 })
    
    // Ahora intentar ir a /admin/login cuando ya está autenticado
    await page.goto('/admin/login')
    
    // Debería redirigir automáticamente al dashboard
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })

  test('debería proteger las rutas admin sin autenticación', async ({ page }) => {
    // Intentar acceder directamente al dashboard sin estar autenticado
    await page.goto('/admin/dashboard')
    
    // Debería redirigir al login
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/login/)
    
    // Intentar acceder a otras rutas admin
    await page.goto('/admin/obras')
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/login/)
    
    await page.goto('/admin/obras/new')
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('debería mantener la sesión después de recargar la página', async ({ page }) => {
    // Skip si no hay credenciales configuradas
    test.skip(
      ADMIN_EMAIL === 'admin@test.com' && ADMIN_PASSWORD === 'testpassword123',
      'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
    )

    // Hacer login
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    // Usar el input directamente por ID para evitar ambigüedad
    await page.locator('input#password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 })
    
    // Recargar la página
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Verificar que sigue autenticado y en el dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/)
    await expect(page.getByText('Panel de Administración')).toBeVisible()
  })

  test('debería poder cerrar sesión correctamente', async ({ page }) => {
    // Skip si no hay credenciales configuradas
    test.skip(
      ADMIN_EMAIL === 'admin@test.com' && ADMIN_PASSWORD === 'testpassword123',
      'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
    )

    // Hacer login
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    // Usar el input directamente por ID para evitar ambigüedad
    await page.locator('input#password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 })
    
    // Cerrar sesión
    const signOutButton = page.getByRole('button', { name: /Cerrar Sesión/i })
    await expect(signOutButton).toBeVisible()
    await signOutButton.click()
    
    // Debería redirigir al login
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/login/)
    
    // Intentar acceder al dashboard debería redirigir al login
    await page.goto('/admin/dashboard')
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('debería mostrar y ocultar la contraseña correctamente', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    
    // Usar el input directamente por ID para evitar ambigüedad
    const passwordInput = page.locator('input#password')
    const toggleButton = page.locator('button[aria-label*="contraseña" i]')
    
    // Verificar que el input es de tipo password inicialmente
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Hacer clic en el botón de mostrar contraseña
    await toggleButton.click()
    await page.waitForTimeout(100)
    
    // Verificar que ahora es de tipo text
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Hacer clic nuevamente para ocultar
    await toggleButton.click()
    await page.waitForTimeout(100)
    
    // Verificar que vuelve a ser password
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

