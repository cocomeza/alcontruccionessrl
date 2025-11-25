# 🧪 Suite de Tests Completa

Este proyecto incluye una suite completa de tests automatizados para garantizar la calidad del código.

## 📊 Resumen de Tests

### ✅ Unit Tests (Vitest)
- **Schemas**: Validación de formularios (obra, login)
- **Utils**: Funciones utilitarias (upload, storage, formatFileSize)
- **Components**: Componentes UI (Button, Card, Input, ObraCard)

### ✅ Integration Tests (Vitest)
- **Auth Actions**: Flujos de autenticación (signIn, signOut)
- **Obras Actions**: CRUD completo de obras (get, create, update, delete)

### ✅ E2E Tests (Playwright)
- **Login Flow**: Flujo completo de login y autenticación
- **Navigation**: Navegación entre páginas
- **Accessibility**: Tests de accesibilidad con axe-core
- **Performance**: Tests de rendimiento y métricas
- **Complete Workflow**: Flujo completo CRUD de obras
- **Public Pages**: Tests de páginas públicas

## 🚀 Ejecutar Tests

### Unit Tests e Integration Tests
```bash
# Modo watch (desarrollo)
npm run test

# Una sola ejecución
npm run test:unit

# Con coverage
npm run test -- --coverage
```

### E2E Tests
```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Con UI interactiva
npm run test:e2e:ui

# Ejecutar un archivo específico
npx playwright test tests/e2e/login-flow.spec.ts
```

## 📝 Configuración

### Variables de Entorno para Tests E2E

Crea un archivo `.env.test` o configura estas variables:

```env
TEST_ADMIN_EMAIL=tu-email@example.com
TEST_ADMIN_PASSWORD=tu-password
```

## 📈 Cobertura de Tests

Los tests cubren:
- ✅ Validación de formularios
- ✅ Funciones utilitarias
- ✅ Componentes UI críticos
- ✅ Server Actions
- ✅ Flujos de autenticación
- ✅ Navegación
- ✅ Accesibilidad (WCAG 2.1 AA)
- ✅ Performance básica

## 🔧 Estructura

```
tests/
├── unit/              # Tests unitarios
│   ├── components/   # Tests de componentes
│   ├── schemas/      # Tests de validación
│   └── utils/        # Tests de utilidades
├── integration/       # Tests de integración
│   ├── auth.test.ts  # Tests de autenticación
│   └── obras.test.ts # Tests de CRUD
└── e2e/              # Tests end-to-end
    ├── accessibility.spec.ts
    ├── performance.spec.ts
    ├── navigation.spec.ts
    ├── login-flow.spec.ts
    └── complete-workflow.spec.ts
```

## 🎯 Próximos Tests a Agregar

- [ ] Tests de componentes de formularios completos
- [ ] Tests de componentes de galería
- [ ] Tests de upload de archivos E2E
- [ ] Tests de búsqueda y filtrado
- [ ] Tests de paginación
- [ ] Tests de modo oscuro
- [ ] Tests de responsive design

