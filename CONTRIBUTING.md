# Guía de Contribución

## Estructura del Proyecto

Este proyecto sigue una arquitectura modular con Next.js 15 App Router:

- **`app/`**: Rutas y páginas de Next.js
- **`components/`**: Componentes React reutilizables
- **`lib/`**: Utilidades, helpers y lógica de negocio
- **`tests/`**: Tests unitarios, de integración y E2E
- **`public/`**: Archivos estáticos

## Convenciones de Código

### TypeScript
- Usar tipos explícitos cuando sea posible
- Evitar `any` excepto cuando sea absolutamente necesario
- Usar interfaces para objetos complejos

### Componentes
- Componentes funcionales con hooks
- Usar `'use client'` solo cuando sea necesario
- Preferir Server Components cuando sea posible

### Nombres de Archivos
- Componentes: PascalCase (`ObraForm.tsx`)
- Utilidades: camelCase (`upload.ts`)
- Rutas: seguir convención de Next.js (kebab-case para rutas)

## Testing

### Unit Tests (Vitest)
- Ubicación: `tests/unit/`
- Cubrir funciones utilitarias y componentes críticos
- Mockear dependencias externas

### Integration Tests (Vitest)
- Ubicación: `tests/integration/`
- Probar interacciones entre módulos
- Mockear Supabase y APIs externas

### E2E Tests (Playwright)
- Ubicación: `tests/e2e/`
- Probar flujos completos de usuario
- Usar datos de prueba realistas

## Commits

Usar mensajes descriptivos:
- `feat: agregar funcionalidad X`
- `fix: corregir bug Y`
- `refactor: mejorar código Z`
- `test: agregar tests para X`

## Pull Requests

1. Crear una rama descriptiva
2. Hacer cambios pequeños y enfocados
3. Asegurar que todos los tests pasen
4. Actualizar documentación si es necesario
5. Solicitar revisión

