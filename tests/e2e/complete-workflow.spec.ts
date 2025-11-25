import { test, expect } from '@playwright/test'

test.describe('Complete Workflow - Admin CRUD', () => {
  const testCredentials = {
    email: process.env.TEST_ADMIN_EMAIL || 'test@example.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'testpassword123',
  }

  test.beforeEach(async ({ page }) => {
    // Start from login page
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
  })

  test('should complete full CRUD workflow', async ({ page }) => {
    // Step 1: Login
    await page.getByLabel('Email').fill(testCredentials.email)
    await page.getByLabel('Contraseña').fill(testCredentials.password)
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    
    // Wait for redirect to obras page
    await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
    
    // Step 2: Navigate to create new obra
    await page.getByRole('link', { name: /nueva obra/i }).click()
    await page.waitForURL(/\/admin\/obras\/new/, { timeout: 5000 })
    
    // Step 3: Fill form
    const obraTitle = `Test Obra ${Date.now()}`
    await page.getByLabel(/título/i).fill(obraTitle)
    await page.getByLabel(/descripción/i).fill('Esta es una descripción de prueba para la obra de test')
    
    // Step 4: Submit form
    await page.getByRole('button', { name: /crear|guardar/i }).click()
    
    // Step 5: Verify obra was created (should redirect to obras list)
    await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
    
    // Step 6: Verify obra appears in list
    await expect(page.getByText(obraTitle)).toBeVisible({ timeout: 5000 })
    
    // Step 7: Click on obra to edit
    const obraCard = page.locator(`text=${obraTitle}`).locator('..').locator('..')
    const editButton = obraCard.getByRole('link', { name: /editar/i })
    
    if (await editButton.count() > 0) {
      await editButton.click()
      await page.waitForURL(/\/admin\/obras\/.*\/edit/, { timeout: 5000 })
      
      // Step 8: Update obra
      const updatedTitle = `${obraTitle} - Updated`
      await page.getByLabel(/título/i).clear()
      await page.getByLabel(/título/i).fill(updatedTitle)
      await page.getByRole('button', { name: /actualizar|guardar/i }).click()
      
      // Step 9: Verify update
      await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
      await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 5000 })
    }
  })

  test('should handle form validation errors', async ({ page }) => {
    // Login first
    await page.getByLabel('Email').fill(testCredentials.email)
    await page.getByLabel('Contraseña').fill(testCredentials.password)
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
    
    // Navigate to create
    await page.getByRole('link', { name: /nueva obra/i }).click()
    await page.waitForURL(/\/admin\/obras\/new/, { timeout: 5000 })
    
    // Try to submit empty form
    await page.getByRole('button', { name: /crear|guardar/i }).click()
    
    // Should show validation errors
    const errorMessages = page.locator('text=/debe tener|requerido|inválido/i')
    const errorCount = await errorMessages.count()
    expect(errorCount).toBeGreaterThan(0)
  })

  test('should display obras in public page after creation', async ({ page, context }) => {
    // Login and create obra in admin
    await page.getByLabel('Email').fill(testCredentials.email)
    await page.getByLabel('Contraseña').fill(testCredentials.password)
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
    
    const obraTitle = `Public Test ${Date.now()}`
    
    // Create obra (simplified - assuming form works)
    await page.getByRole('link', { name: /nueva obra/i }).click()
    await page.waitForURL(/\/admin\/obras\/new/, { timeout: 5000 })
    await page.getByLabel(/título/i).fill(obraTitle)
    await page.getByLabel(/descripción/i).fill('Descripción pública de prueba')
    await page.getByRole('button', { name: /crear|guardar/i }).click()
    await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
    
    // Open public page in new tab
    const publicPage = await context.newPage()
    await publicPage.goto('/obras')
    await publicPage.waitForLoadState('networkidle')
    
    // Verify obra appears
    await expect(publicPage.getByText(obraTitle)).toBeVisible({ timeout: 10000 })
    
    await publicPage.close()
  })

  test('should handle logout correctly', async ({ page }) => {
    // Login
    await page.getByLabel('Email').fill(testCredentials.email)
    await page.getByLabel('Contraseña').fill(testCredentials.password)
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
    
    // Logout
    const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout/i })
    if (await logoutButton.count() > 0) {
      await logoutButton.click()
      await page.waitForURL(/\/admin\/login/, { timeout: 10000 })
      
      // Verify redirected to login
      await expect(page.getByLabel('Email')).toBeVisible()
    }
  })
})

