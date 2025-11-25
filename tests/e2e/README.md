# Tests E2E - Playwright

Tests end-to-end para verificar el funcionamiento completo de la aplicación.

## Configuración

### Variables de Entorno para Tests

Para ejecutar los tests que requieren autenticación, configura las siguientes variables de entorno:

```bash
# Windows PowerShell
$env:TEST_ADMIN_EMAIL="tu-email@ejemplo.com"
$env:TEST_ADMIN_PASSWORD="tu-contraseña"

# Windows CMD
set TEST_ADMIN_EMAIL=tu-email@ejemplo.com
set TEST_ADMIN_PASSWORD=tu-contraseña

# Linux/Mac
export TEST_ADMIN_EMAIL="tu-email@ejemplo.com"
export TEST_ADMIN_PASSWORD="tu-contraseña"
```

O crea un archivo `.env.test.local` en la raíz del proyecto:

```env
TEST_ADMIN_EMAIL=tu-email@ejemplo.com
TEST_ADMIN_PASSWORD=tu-contraseña
```

## Ejecutar Tests

### Todos los tests E2E

```bash
npm run test:e2e
```

### Tests con UI interactiva

```bash
npm run test:e2e:ui
```

### Test específico de login

```bash
npx playwright test tests/e2e/login-flow.spec.ts
```

### Test específico con UI

```bash
npx playwright test tests/e2e/login-flow.spec.ts --ui
```

## Tests Disponibles

### `auth.spec.ts`
Tests básicos de autenticación:
- Redirección al login cuando no hay autenticación
- Formulario de login visible
- Manejo de credenciales inválidas
- Redirección de usuarios autenticados

### `login-flow.spec.ts` ⭐ **NUEVO**
Test completo del flujo de login:
- ✅ Formulario de login completo
- ✅ Login exitoso y redirección al dashboard
- ✅ Protección de rutas admin
- ✅ Redirección automática si ya está autenticado
- ✅ Persistencia de sesión después de recargar
- ✅ Cerrar sesión correctamente
- ✅ Mostrar/ocultar contraseña

### `admin-obras.spec.ts`
Tests de gestión de obras en el panel admin

### `obras-public.spec.ts`
Tests de la vista pública de obras

### `upload.spec.ts`
Tests de subida de archivos

## Solución de Problemas

### El servidor no inicia

Asegúrate de que:
1. Las variables de entorno estén configuradas en `.env.local`
2. El proyecto de Supabase esté configurado correctamente
3. No haya otro proceso usando el puerto 3000

### Tests fallan por timeout

- Aumenta el timeout en `playwright.config.ts`
- Verifica que el servidor esté respondiendo en `http://localhost:3000`

### Error de autenticación en tests

- Verifica que las credenciales en `TEST_ADMIN_EMAIL` y `TEST_ADMIN_PASSWORD` sean correctas
- Asegúrate de que el usuario exista en Supabase Authentication
- Verifica que el usuario tenga permisos de administrador

## Debugging

### Ver el navegador durante la ejecución

```bash
npx playwright test --headed
```

### Ejecutar en modo debug

```bash
npx playwright test --debug
```

### Ver el trace después de un fallo

```bash
npx playwright show-trace trace.zip
```

## Notas

- Los tests que requieren autenticación se saltarán automáticamente si no están configuradas las credenciales
- El servidor de desarrollo se inicia automáticamente antes de ejecutar los tests
- Los tests se ejecutan en modo headless por defecto (sin mostrar el navegador)

