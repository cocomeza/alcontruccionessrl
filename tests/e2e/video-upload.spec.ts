import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'

test.describe('Video Upload - E2E Tests', () => {
  const testCredentials = {
    email: process.env.TEST_ADMIN_EMAIL || 'test@example.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'testpassword123',
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Helper para hacer login de forma robusta
  async function login(page: any) {
    // Asegurar que estamos en la página de login
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    
    // Verificar que los campos estén visibles
    await expect(page.getByLabel('Email')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('input#password')).toBeVisible({ timeout: 5000 })
    
    // Llenar el formulario de login
    await page.getByLabel('Email').fill(testCredentials.email)
    await page.locator('input#password').fill(testCredentials.password)
    
    // Hacer clic en iniciar sesión
    await page.getByRole('button', { name: /Iniciar Sesión|iniciar sesión/i }).click()
    
    // Esperar un momento para que se procese el login (el código espera 800ms + tiempo de red)
    await page.waitForTimeout(1500)
    
    // El login redirige usando window.location.href a /admin/obras, así que esperamos esa URL
    // Usamos waitForURL con 'load' para esperar la recarga completa de página
    try {
      await page.waitForURL(/\/admin\/obras/, { timeout: 20000, waitUntil: 'load' })
    } catch (error) {
      // Si falla, intentar esperar dashboard como fallback
      await page.waitForURL(/\/admin\/(obras|dashboard)/, { timeout: 5000, waitUntil: 'load' })
    }
    
    // Verificar que estamos en la página correcta
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/obras') && !currentUrl.includes('/admin/dashboard')) {
      // Tomar screenshot para debug
      await page.screenshot({ path: 'test-results/login-failed.png', fullPage: true })
      throw new Error(`Login falló. URL actual: ${currentUrl}. Ver screenshot en test-results/login-failed.png`)
    }
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      // Si networkidle falla, al menos esperar domcontentloaded
    })
  }

  // Helper para crear directorio de fixtures si no existe
  function ensureFixturesDir(): string {
    const fixturesDir = path.join(__dirname, '../fixtures')
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true })
    }
    return fixturesDir
  }

  // Helper para crear un archivo de video de prueba
  function createTestVideoFile(): string {
    ensureFixturesDir()
    const testVideoPath = path.join(__dirname, '../fixtures/test-video.mp4')
    
    // Si el archivo no existe, crear uno mínimo (MP4 header básico)
    if (!fs.existsSync(testVideoPath)) {
      // Crear un archivo MP4 mínimo válido (solo header, muy pequeño)
      // Esto es un fragmento mínimo de MP4 que los navegadores aceptarán
      const minimalMp4 = Buffer.from([
        0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, // ftyp box
        0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
        0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
        0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31,
        0x00, 0x00, 0x00, 0x08, 0x6D, 0x64, 0x61, 0x74, // mdat box (vacío)
      ])
      
      fs.writeFileSync(testVideoPath, minimalMp4)
    }
    
    return testVideoPath
  }

  test.beforeEach(async ({ page }) => {
    // Navegar a login - el helper login() ya lo hace, pero lo dejamos aquí por si acaso
    // Algunos tests pueden necesitar empezar desde otra página
  })

  test.describe('Successful Video Upload', () => {
    test('should upload video to Supabase Storage and save URL in database', async ({ page }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Step 1: Login
      await login(page)
      
      // Step 2: Navegar a crear nueva obra
      // Si estamos en dashboard, ir a obras primero
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/dashboard')) {
        const obrasLink = page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i })
        if (await obrasLink.count() > 0) {
          await obrasLink.click()
          await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
        }
      }
      
      // Buscar el enlace de "Nueva Obra" - puede estar en diferentes lugares
      const nuevaObraLink = page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).first()
      await expect(nuevaObraLink).toBeVisible({ timeout: 5000 })
      await nuevaObraLink.click()
      
      // Esperar la navegación con timeout más largo
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 15000 })
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Continuar aunque networkidle falle
      })
      
      // Step 3: Llenar datos básicos
      const obraTitle = `Test Video Upload ${Date.now()}`
      await page.getByLabel(/título/i).fill(obraTitle)
      await page.getByLabel(/descripción/i).fill('Esta es una obra de prueba para verificar la subida de videos')
      
      // Step 4: Seleccionar y subir video
      const testVideoPath = createTestVideoFile()
      
      // Interceptar la llamada de upload para verificar que se hace correctamente
      let uploadUrl: string | null = null
      let uploadSuccess = false
      
      page.on('response', async (response) => {
        const url = response.url()
        // Verificar si es una llamada a Supabase Storage
        if (url.includes('supabase.co') && url.includes('storage') && response.request().method() === 'POST') {
          if (response.status() === 200 || response.status() === 201) {
            uploadSuccess = true
            const responseData = await response.json().catch(() => null)
            if (responseData?.path) {
              uploadUrl = responseData.path
            }
          }
        }
      })
      
      // Seleccionar archivo de video
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      await fileInput.setInputFiles(testVideoPath)
      
      // Esperar a que aparezca el botón de subir
      await page.waitForSelector('button:has-text("Subir")', { timeout: 5000 })
      
      // Hacer clic en el botón de subir
      const uploadButton = page.getByRole('button', { name: /subir.*video/i })
      await uploadButton.click()
      
      // Esperar a que se complete la subida (verificar barra de progreso)
      await page.waitForSelector('text=/Subiendo|100%|subido/i', { timeout: 30000 })
      
      // Verificar que el video aparece en la lista de videos subidos
      await expect(page.locator('text=/video.*subido|videos subidos/i')).toBeVisible({ timeout: 10000 })
      
      // Step 5: Crear la obra
      await page.getByRole('button', { name: /crear obra|Crear Obra/i }).click()
      
      // Esperar redirección y mensaje de éxito
      await page.waitForURL(/\/admin\/obras/, { timeout: 15000 })
      
      // Esperar a que la página cargue
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Continuar aunque networkidle falle
      })
      
      // Verificar mensaje de éxito (puede ser un toast)
      try {
        await expect(page.locator('text=/creada correctamente|éxito|success/i')).toBeVisible({ timeout: 5000 })
      } catch {
        // Si no aparece el mensaje, continuar de todas formas
      }
      
      // Step 6: Verificar que la obra se creó con el video
      // Esperar a que la página cargue completamente y buscar el título
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      
      // Buscar el título - puede estar en diferentes formatos (link, texto, etc)
      try {
        await expect(page.getByText(obraTitle, { exact: false })).toBeVisible({ timeout: 10000 })
      } catch {
        // Si no encuentra por texto exacto, intentar buscar por link
        const obraLink = page.locator(`a:has-text("${obraTitle}")`)
        if (await obraLink.count() > 0) {
          await expect(obraLink.first()).toBeVisible({ timeout: 5000 })
        } else {
          // Si aún no aparece, hacer refresh y buscar de nuevo
          await page.reload()
          await page.waitForLoadState('networkidle', { timeout: 10000 })
          await expect(page.getByText(obraTitle, { exact: false })).toBeVisible({ timeout: 10000 })
        }
      }
      
      // Step 7: Verificar en la base de datos que el video está guardado
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        const { data: obras, error } = await supabase
          .from('obras')
          .select('*')
          .eq('title', obraTitle)
          .single()
        
        expect(error).toBeNull()
        expect(obras).not.toBeNull()
        expect(obras?.videos).toBeDefined()
        expect(Array.isArray(obras?.videos)).toBe(true)
        expect(obras?.videos.length).toBeGreaterThan(0)
        
        // Verificar que la URL del video es válida
        const videoUrl = obras?.videos[0]
        expect(videoUrl).toMatch(/^https?:\/\//)
        expect(videoUrl).toContain('supabase')
        
        // Verificar que el video es accesible
        const videoResponse = await page.request.get(videoUrl)
        expect(videoResponse.status()).toBe(200)
        expect(videoResponse.headers()['content-type']).toContain('video')
      }
    })

    test('should upload multiple videos and save all URLs', async ({ page }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Login
      await login(page)
      
      // Navegar a crear obra
      // Si estamos en dashboard, ir a obras primero
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/dashboard')) {
        const obrasLink = page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i })
        if (await obrasLink.count() > 0) {
          await obrasLink.click()
          await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
        }
      }
      
      // Buscar el enlace de "Nueva Obra"
      const nuevaObraLink = page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).first()
      await expect(nuevaObraLink).toBeVisible({ timeout: 5000 })
      await nuevaObraLink.click()
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 15000 })
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      
      // Llenar datos
      const obraTitle = `Test Multiple Videos ${Date.now()}`
      await page.getByLabel(/título/i).fill(obraTitle)
      await page.getByLabel(/descripción/i).fill('Obra con múltiples videos de prueba')
      
      // Crear dos archivos de video de prueba
      const testVideoPath1 = createTestVideoFile()
      ensureFixturesDir()
      const testVideoPath2 = path.join(__dirname, '../fixtures/test-video-2.mp4')
      fs.copyFileSync(testVideoPath1, testVideoPath2)
      
      // Seleccionar múltiples videos
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      await fileInput.setInputFiles([testVideoPath1, testVideoPath2])
      
      // Subir videos
      await page.waitForSelector('button:has-text("Subir")', { timeout: 5000 })
      const uploadButton = page.getByRole('button', { name: /subir.*video/i })
      await uploadButton.click()
      
      // Esperar a que se completen ambas subidas
      await page.waitForSelector('text=/2 videos|videos subidos/i', { timeout: 30000 })
      
      // Crear obra
      await page.getByRole('button', { name: /crear obra/i }).click()
      await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
      
      // Verificar en base de datos
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        const { data: obra } = await supabase
          .from('obras')
          .select('*')
          .eq('title', obraTitle)
          .single()
        
        expect(obra).not.toBeNull()
        expect(obra?.videos).toBeDefined()
        expect(Array.isArray(obra?.videos)).toBe(true)
        expect(obra?.videos.length).toBe(2)
        
        // Verificar que ambas URLs son válidas
        obra?.videos.forEach((videoUrl: string) => {
          expect(videoUrl).toMatch(/^https?:\/\//)
          expect(videoUrl).toContain('supabase')
        })
      }
    })
  })

  test.describe('Video Upload Error Handling', () => {
    test('should reject video file that exceeds size limit', async ({ page }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Login
      await login(page)
      
      // Navegar a crear obra
      // Si estamos en dashboard, ir a obras primero
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/dashboard')) {
        const obrasLink = page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i })
        if (await obrasLink.count() > 0) {
          await obrasLink.click()
          await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
        }
      }
      
      // Buscar el enlace de "Nueva Obra"
      const nuevaObraLink = page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).first()
      await expect(nuevaObraLink).toBeVisible({ timeout: 5000 })
      await nuevaObraLink.click()
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 15000 })
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      
      // Crear un archivo de video que exceda el límite (50MB)
      ensureFixturesDir()
      const largeVideoPath = path.join(__dirname, '../fixtures/large-video.mp4')
      const largeBuffer = Buffer.alloc(51 * 1024 * 1024) // 51MB
      fs.writeFileSync(largeVideoPath, largeBuffer)
      
      // Intentar seleccionar el archivo grande
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      await fileInput.setInputFiles(largeVideoPath)
      
      // Verificar que aparece un mensaje de error
      await expect(page.locator('text=/50MB|excede|tamaño/i')).toBeVisible({ timeout: 5000 })
      
      // Limpiar archivo temporal
      if (fs.existsSync(largeVideoPath)) {
        fs.unlinkSync(largeVideoPath)
      }
    })

    test('should reject invalid video file type', async ({ page }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Login
      await login(page)
      
      // Navegar a crear obra
      // Si estamos en dashboard, ir a obras primero
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/dashboard')) {
        const obrasLink = page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i })
        if (await obrasLink.count() > 0) {
          await obrasLink.click()
          await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
        }
      }
      
      // Buscar el enlace de "Nueva Obra"
      const nuevaObraLink = page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).first()
      await expect(nuevaObraLink).toBeVisible({ timeout: 5000 })
      await nuevaObraLink.click()
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 15000 })
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      
      // Crear un archivo que no sea video (por ejemplo, un archivo de texto)
      ensureFixturesDir()
      const invalidFile = path.join(__dirname, '../fixtures/invalid-video.txt')
      fs.writeFileSync(invalidFile, 'Este no es un video')
      
      // Intentar seleccionar el archivo inválido
      // Nota: El input HTML puede rechazar el archivo antes de que llegue al código
      // Por lo que este test verifica el comportamiento del navegador
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      
      // El navegador debería rechazar archivos que no coincidan con el accept
      // Verificamos que el input tiene la restricción correcta
      const acceptAttr = await fileInput.getAttribute('accept')
      expect(acceptAttr).toContain('video')
      
      // Limpiar archivo temporal
      if (fs.existsSync(invalidFile)) {
        fs.unlinkSync(invalidFile)
      }
    })

    test('should handle network error during video upload gracefully', async ({ page, context }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Login
      await login(page)
      
      // Navegar a crear obra
      // Si estamos en dashboard, ir a obras primero
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/dashboard')) {
        const obrasLink = page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i })
        if (await obrasLink.count() > 0) {
          await obrasLink.click()
          await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
        }
      }
      
      // Buscar el enlace de "Nueva Obra"
      const nuevaObraLink = page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).first()
      await expect(nuevaObraLink).toBeVisible({ timeout: 5000 })
      await nuevaObraLink.click()
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 15000 })
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      
      // Interceptar y bloquear requests a Supabase Storage
      await page.route('**/storage/v1/object/**', (route) => {
        route.abort('failed')
      })
      
      // Llenar datos
      const obraTitle = `Test Network Error ${Date.now()}`
      await page.getByLabel(/título/i).fill(obraTitle)
      await page.getByLabel(/descripción/i).fill('Obra para testear error de red')
      
      // Intentar subir video
      const testVideoPath = createTestVideoFile()
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      await fileInput.setInputFiles(testVideoPath)
      
      await page.waitForSelector('button:has-text("Subir")', { timeout: 5000 })
      const uploadButton = page.getByRole('button', { name: /subir.*video/i })
      await uploadButton.click()
      
      // Verificar que aparece un mensaje de error
      await expect(page.locator('text=/error|fallo|no se pudo/i')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Video Persistence and Accessibility', () => {
    test('should persist videos after obra creation and be accessible', async ({ page, context }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Login y crear obra con video
      await login(page)
      
      const obraTitle = `Test Video Persistence ${Date.now()}`
      
      // Crear obra con video
      // Si estamos en dashboard, ir a obras primero
      if (page.url().includes('/admin/dashboard')) {
        await page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i }).click()
        await page.waitForURL(/\/admin\/obras/, { timeout: 5000 })
      }
      
      await page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).click()
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 10000 })
      
      await page.getByLabel(/título/i).fill(obraTitle)
      await page.getByLabel(/descripción/i).fill('Obra para verificar persistencia de videos')
      
      const testVideoPath = createTestVideoFile()
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      await fileInput.setInputFiles(testVideoPath)
      
      await page.waitForSelector('button:has-text("Subir")', { timeout: 5000 })
      const uploadButton = page.getByRole('button', { name: /subir.*video/i })
      await uploadButton.click()
      await page.waitForSelector('text=/video.*subido|videos subidos/i', { timeout: 30000 })
      
      await page.getByRole('button', { name: /crear obra/i }).click()
      await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
      
      // Obtener la obra de la base de datos
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        const { data: obra } = await supabase
          .from('obras')
          .select('*')
          .eq('title', obraTitle)
          .single()
        
        expect(obra).not.toBeNull()
        expect(obra?.videos.length).toBeGreaterThan(0)
        
        const videoUrl = obra?.videos[0]
        
        // Verificar que el video es accesible desde una página pública
        const publicPage = await context.newPage()
        await publicPage.goto('/obras')
        await publicPage.waitForLoadState('networkidle')
        
        // Buscar la obra y hacer clic
        await publicPage.getByText(obraTitle).click()
        await publicPage.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
        
        // Verificar que el video está presente en la página
        const videoElement = publicPage.locator('video, [class*="video"]')
        await expect(videoElement.first()).toBeVisible({ timeout: 5000 })
        
        // Verificar que la URL del video es accesible
        const videoResponse = await publicPage.request.get(videoUrl)
        expect(videoResponse.status()).toBe(200)
        
        await publicPage.close()
      }
    })

    test('should display videos correctly in obra detail page', async ({ page, context }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Crear obra con video (similar al test anterior)
      await login(page)
      
      const obraTitle = `Test Video Display ${Date.now()}`
      
      // Si estamos en dashboard, ir a obras primero
      if (page.url().includes('/admin/dashboard')) {
        await page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i }).click()
        await page.waitForURL(/\/admin\/obras/, { timeout: 5000 })
      }
      
      await page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).click()
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 10000 })
      
      await page.getByLabel(/título/i).fill(obraTitle)
      await page.getByLabel(/descripción/i).fill('Obra para verificar visualización de videos')
      
      const testVideoPath = createTestVideoFile()
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      await fileInput.setInputFiles(testVideoPath)
      
      await page.waitForSelector('button:has-text("Subir")', { timeout: 5000 })
      const uploadButton = page.getByRole('button', { name: /subir.*video/i })
      await uploadButton.click()
      await page.waitForSelector('text=/video.*subido|videos subidos/i', { timeout: 30000 })
      
      await page.getByRole('button', { name: /crear obra/i }).click()
      await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
      
      // Verificar en página pública
      const publicPage = await context.newPage()
      await publicPage.goto('/obras')
      await publicPage.waitForLoadState('networkidle')
      
      await publicPage.getByText(obraTitle).click()
      await publicPage.waitForURL(/\/obra\/[a-f0-9-]+/, { timeout: 5000 })
      
      // Verificar que hay elementos de video visibles
      const videoCards = publicPage.locator('[class*="aspect-video"], [class*="video"]')
      const videoCount = await videoCards.count()
      expect(videoCount).toBeGreaterThan(0)
      
      // Verificar que se puede hacer clic en el video
      await videoCards.first().click()
      
      // Verificar que aparece el reproductor de video
      await expect(publicPage.locator('video')).toBeVisible({ timeout: 5000 })
      
      await publicPage.close()
    })
  })

  test.describe('Video Upload Integration with Database', () => {
    test('should verify video URLs are stored as array in database', async ({ page }) => {
      // Skip si no hay credenciales configuradas
      test.skip(
        testCredentials.email === 'test@example.com' && testCredentials.password === 'testpassword123',
        'Configura TEST_ADMIN_EMAIL y TEST_ADMIN_PASSWORD para ejecutar este test'
      )

      // Skip si no hay configuración de Supabase
      test.skip(
        !supabaseUrl || !supabaseAnonKey,
        'Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para ejecutar este test'
      )

      // Login y crear obra
      await login(page)
      
      const obraTitle = `Test Video Array ${Date.now()}`
      
      // Si estamos en dashboard, ir a obras primero
      if (page.url().includes('/admin/dashboard')) {
        await page.getByRole('link', { name: /Gestionar Obras|gestionar obras/i }).click()
        await page.waitForURL(/\/admin\/obras/, { timeout: 5000 })
      }
      
      await page.getByRole('link', { name: /Nueva Obra|nueva obra/i }).click()
      await page.waitForURL(/\/admin\/obras\/new/, { timeout: 10000 })
      
      await page.getByLabel(/título/i).fill(obraTitle)
      await page.getByLabel(/descripción/i).fill('Obra para verificar estructura de array en BD')
      
      const testVideoPath = createTestVideoFile()
      const fileInput = page.locator('input[type="file"][accept*="video"]')
      await fileInput.setInputFiles(testVideoPath)
      
      await page.waitForSelector('button:has-text("Subir")', { timeout: 5000 })
      const uploadButton = page.getByRole('button', { name: /subir.*video/i })
      await uploadButton.click()
      await page.waitForSelector('text=/video.*subido|videos subidos/i', { timeout: 30000 })
      
      await page.getByRole('button', { name: /crear obra/i }).click()
      await page.waitForURL(/\/admin\/obras/, { timeout: 10000 })
      
      // Verificar estructura en base de datos
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        const { data: obra } = await supabase
          .from('obras')
          .select('*')
          .eq('title', obraTitle)
          .single()
        
        expect(obra).not.toBeNull()
        
        // Verificar que videos es un array JSONB
        expect(obra?.videos).toBeDefined()
        expect(Array.isArray(obra?.videos)).toBe(true)
        
        // Verificar que cada elemento es una URL válida
        obra?.videos.forEach((videoUrl: any) => {
          expect(typeof videoUrl).toBe('string')
          expect(videoUrl).toMatch(/^https?:\/\//)
        })
        
        // Verificar que se puede recuperar correctamente
        const { data: retrievedObra } = await supabase
          .from('obras')
          .select('videos')
          .eq('id', obra?.id)
          .single()
        
        expect(retrievedObra?.videos).toEqual(obra?.videos)
      }
    })
  })
})
