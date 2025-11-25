# Estructura del Proyecto

## Organización de Carpetas

### `/app` - Next.js App Router
```
app/
├── admin/              # Rutas administrativas
│   ├── dashboard/      # Dashboard del admin
│   ├── login/          # Login del admin
│   └── obras/          # CRUD de obras
├── contacto/           # Página de contacto
├── nosotros/           # Página sobre nosotros
├── obra/               # Detalle de obra individual
├── obras/              # Listado de obras públicas
└── page.tsx            # Página principal
```

### `/components` - Componentes React
```
components/
├── admin/              # Componentes específicos del admin
│   ├── admin-link-client.tsx
│   ├── admin-loading.tsx
│   └── delete-button.tsx
├── common/             # Componentes reutilizables
│   ├── error-boundary.tsx
│   ├── pagination.tsx
│   ├── search-filter.tsx
│   ├── category-filter.tsx
│   └── uploader.tsx
├── contact/            # Componentes de contacto
│   ├── contact-form.tsx
│   ├── contact-hero.tsx
│   └── contact-info.tsx
├── home/               # Componentes del home
│   ├── home-hero.tsx
│   └── secciones-rapidas.tsx
├── layout/             # Componentes de layout
│   ├── footer.tsx
│   ├── header.tsx
│   ├── logo.tsx
│   ├── mobile-menu.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── nosotros/           # Componentes de "nosotros"
│   ├── nosotros-equipo.tsx
│   ├── nosotros-hero.tsx
│   ├── nosotros-historia.tsx
│   ├── nosotros-porque.tsx
│   └── nosotros-valores.tsx
├── obra/               # Componentes relacionados con obras
│   ├── image-gallery.tsx
│   ├── image-lightbox.tsx
│   ├── obra-card.tsx
│   ├── obra-card-skeleton.tsx
│   ├── obra-detail-content.tsx
│   ├── obra-form-improved.tsx
│   └── obras-destacadas.tsx
└── ui/                 # Componentes UI base (shadcn/ui)
    ├── alert.tsx
    ├── button.tsx
    ├── card.tsx
    └── ...
```

### `/lib` - Utilidades y lógica
```
lib/
├── actions/            # Server Actions
│   ├── auth.ts
│   ├── contact.ts
│   ├── obras.ts
│   └── upload.ts
├── schemas/            # Schemas de validación (Zod)
│   └── obra.ts
├── supabase/           # Clientes de Supabase
│   ├── client.ts
│   ├── middleware.ts
│   └── server.ts
├── types/              # Tipos TypeScript
│   └── database.ts
└── utils/              # Utilidades
    ├── cn.ts
    ├── compress.ts
    ├── error-handler.ts
    ├── storage.ts
    └── upload.ts
```

### `/tests` - Tests
```
tests/
├── e2e/                # Tests E2E (Playwright)
├── integration/        # Tests de integración
├── snapshot/           # Snapshot tests
└── unit/               # Unit tests
```

### `/supabase` - Scripts SQL
```
supabase/
├── setup.sql
├── storage-policies.sql
└── categorias.sql
```

## Compatibilidad con Vercel

✅ **Esta estructura es 100% compatible con Vercel**

### Razones:

1. **Next.js App Router**: La estructura sigue las convenciones de Next.js 15
2. **Rutas correctas**: Todas las rutas están en `/app` como requiere Next.js
3. **Server Components**: Los componentes del servidor están correctamente ubicados
4. **Client Components**: Los componentes cliente tienen `'use client'` cuando es necesario
5. **Imports absolutos**: Se usan imports con `@/` que funcionan en Vercel
6. **Middleware**: El middleware está en la raíz como requiere Next.js

### Configuración para Vercel

1. **Variables de entorno** (en Vercel Dashboard):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY` (opcional)
   - `CONTACT_EMAIL` (opcional)

2. **Build Command**: `npm run build` (por defecto)

3. **Output Directory**: `.next` (por defecto)

4. **Node Version**: 18.x o superior

### Verificación Pre-Deploy

Antes de hacer deploy, verifica:

```bash
# 1. Build local
npm run build

# 2. Verificar que no hay errores
npm run lint

# 3. Ejecutar tests
npm run test:unit
```

## Ventajas de esta Estructura

1. **Organización clara**: Cada tipo de componente tiene su lugar
2. **Fácil navegación**: Es fácil encontrar componentes relacionados
3. **Escalabilidad**: Fácil agregar nuevos componentes sin desorden
4. **Mantenibilidad**: Código más fácil de mantener y entender
5. **Colaboración**: Otros desarrolladores pueden entender rápidamente la estructura

