# ALCONSTRUCCIONES SRL - Plataforma Web

Plataforma web para gestión y visualización de portfolio de obras de construcción.

## 🚀 Tecnologías

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **Supabase** (Auth, Database, Storage)
- **Framer Motion** (Animaciones)
- **Sharp** (Compresión de imágenes)
- **Vitest** (Unit & Integration Tests)
- **Playwright** (E2E Tests)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (plan gratuito)

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd alcontruccionessrl
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

## 🗄️ Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL y la clave anónima a tu `.env.local`

### 2. Configurar Base de Datos

Ejecuta los scripts SQL en el siguiente orden en el SQL Editor de Supabase:

1. **`supabase/setup.sql`** - Script principal (crea tabla, políticas RLS, índices)
2. **`supabase/categorias.sql`** - Agrega soporte para categorías (opcional pero recomendado)

Ver `supabase/README.md` para instrucciones detalladas.

### 3. Crear Storage Bucket

1. Ve a **Storage** en el panel de Supabase
2. Crea un nuevo bucket llamado `obras-media`
3. Configura los permisos:
   - **Public**: `read`
   - **Authenticated**: `read, write`

### 4. Crear usuario administrador

1. Ve a **Authentication** > **Users**
2. Crea un nuevo usuario con email y contraseña
3. Este usuario podrá acceder al panel de administración

## 🏃 Ejecutar el proyecto

### Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción
```bash
npm run build
npm start
```

## 🧪 Testing

El proyecto incluye una suite completa de tests automatizados:

### Tests Unitarios e Integración (Vitest)
```bash
# Ejecutar tests en modo watch
npm run test

# Ejecutar tests una vez
npm run test:unit

# Con coverage
npm run test -- --coverage
```

**Cobertura actual**: 84 tests pasando ✅
- Unit tests: Componentes, schemas, utils
- Integration tests: Auth, obras, UI components
- Snapshot tests: Componentes visuales

### Tests E2E (Playwright)
```bash
# Ejecutar tests E2E (requiere servidor corriendo)
npm run test:e2e

# Ejecutar con UI interactiva
npm run test:e2e:ui
```

**Tests E2E incluidos**:
- Flujo completo de login y CRUD
- Accesibilidad (axe-core)
- Performance
- Responsive design
- Cross-browser
- Visual regression

> 📝 **Nota**: Los tests fueron actualizados para reflejar la nueva estructura organizada de componentes.

## 📁 Estructura del Proyecto

```
├── app/                    # Rutas de Next.js (App Router)
│   ├── admin/             # Rutas del panel admin
│   │   ├── dashboard/     # Dashboard del admin
│   │   ├── login/         # Login del admin
│   │   └── obras/         # CRUD de obras
│   ├── contacto/          # Página de contacto
│   ├── nosotros/          # Página sobre nosotros
│   ├── obra/              # Detalle de obra (público)
│   └── obras/             # Listado de obras (público)
├── components/            # Componentes React organizados por funcionalidad
│   ├── admin/             # Componentes específicos del admin
│   │   ├── admin-link-client.tsx
│   │   ├── admin-loading.tsx
│   │   └── delete-button.tsx
│   ├── common/            # Componentes reutilizables
│   │   ├── error-boundary.tsx
│   │   ├── pagination.tsx
│   │   ├── search-filter.tsx
│   │   ├── category-filter.tsx
│   │   └── uploader.tsx
│   ├── contact/           # Componentes de contacto
│   │   ├── contact-form.tsx
│   │   ├── contact-hero.tsx
│   │   └── contact-info.tsx
│   ├── home/              # Componentes del home
│   │   ├── home-hero.tsx
│   │   └── secciones-rapidas.tsx
│   ├── layout/            # Componentes de layout
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   ├── logo.tsx
│   │   ├── mobile-menu.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── nosotros/          # Componentes de "nosotros"
│   │   ├── nosotros-equipo.tsx
│   │   ├── nosotros-hero.tsx
│   │   ├── nosotros-historia.tsx
│   │   ├── nosotros-porque.tsx
│   │   └── nosotros-valores.tsx
│   ├── obra/              # Componentes relacionados con obras
│   │   ├── image-gallery.tsx
│   │   ├── image-lightbox.tsx
│   │   ├── obra-card.tsx
│   │   ├── obra-card-skeleton.tsx
│   │   ├── obra-detail-content.tsx
│   │   ├── obra-form-improved.tsx
│   │   └── obras-destacadas.tsx
│   └── ui/                # Componentes UI base (shadcn/ui)
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── lib/                   # Utilidades y lógica de negocio
│   ├── actions/           # Server Actions
│   │   ├── auth.ts
│   │   ├── contact.ts
│   │   ├── obras.ts
│   │   └── upload.ts
│   ├── schemas/           # Schemas de validación (Zod)
│   │   └── obra.ts
│   ├── supabase/          # Clientes de Supabase
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   ├── types/             # Tipos TypeScript
│   │   └── database.ts
│   └── utils/             # Funciones utilitarias
│       ├── cn.ts
│       ├── compress.ts
│       ├── error-handler.ts
│       ├── storage.ts
│       └── upload.ts
├── tests/                 # Suite de tests automatizados
│   ├── e2e/               # Tests E2E (Playwright)
│   │   ├── accessibility.spec.ts
│   │   ├── complete-workflow.spec.ts
│   │   ├── login-flow.spec.ts
│   │   └── ...
│   ├── integration/       # Tests de integración
│   │   ├── auth.test.ts
│   │   ├── obras.test.ts
│   │   └── ui-components.test.tsx
│   ├── snapshot/          # Snapshot tests
│   └── unit/              # Tests unitarios
│       ├── components/
│       ├── schemas/
│       ├── types/
│       └── utils/
├── supabase/              # Scripts SQL para Supabase
│   ├── setup.sql
│   ├── storage-policies.sql
│   └── categorias.sql
├── docs/                  # Documentación del proyecto
│   ├── CAMBIOS-TESTS.md
│   ├── ESTRUCTURA-PROYECTO.md
│   └── MEJORAS-IMPLEMENTADAS.md
└── public/                # Archivos estáticos
    ├── logo.png
    └── hero-background.jpg
```

### 🗂️ Organización de Componentes

Los componentes están organizados por funcionalidad para facilitar la navegación y el mantenimiento:

- **`admin/`**: Componentes específicos del panel de administración
- **`common/`**: Componentes reutilizables en toda la aplicación
- **`contact/`**: Componentes de la sección de contacto
- **`home/`**: Componentes de la página principal
- **`layout/`**: Componentes de estructura (header, footer, navegación)
- **`nosotros/`**: Componentes de la sección "Nosotros"
- **`obra/`**: Componentes relacionados con obras (cards, galerías, formularios)
- **`ui/`**: Componentes base de UI (shadcn/ui)

## 🎨 Paleta de Colores

- **Calypso**: `#2a5e80` - Color principal
- **Mystic**: `#edf2f4` - Fondo claro
- **Boston Blue**: `#3281b8` - Botones y acentos
- **Morning Glory**: `#90bedd` - Acentos secundarios

## 🔐 Rutas

### Públicas
- `/` - Página principal con obras destacadas
- `/obras` - Listado completo de obras (grid con filtros)
- `/obra/[id]` - Detalle de obra con galería y videos
- `/nosotros` - Información sobre la empresa
- `/contacto` - Formulario de contacto

### Admin (requiere autenticación)
- `/admin/login` - Login del administrador
- `/admin/dashboard` - Dashboard principal
- `/admin/obras` - Listado de obras (gestión CRUD)
- `/admin/obras/new` - Crear nueva obra
- `/admin/obras/[id]/edit` - Editar obra existente

## 📤 Uploads

### Límites
- **Imágenes**: Máximo 5MB por archivo
- **Videos**: Máximo 50MB por archivo (límite Supabase Free)

### Características
- Compresión automática de imágenes con Sharp
- Validación de tamaño antes de subir
- Barra de progreso durante la subida
- Previsualización de imágenes
- Eliminación automática de archivos al borrar obras

## 🚀 Despliegue en Vercel

✅ **Este proyecto está completamente compatible con Vercel**

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub/GitLab

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega las siguientes variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
     RESEND_API_KEY=opcional (para emails de contacto)
     CONTACT_EMAIL=opcional (email de destino para contacto)
     ```

3. **Desplegar**
   - Vercel detectará automáticamente Next.js
   - El despliegue se iniciará automáticamente
   - La estructura organizada es 100% compatible con Vercel

### Configuración adicional en Vercel

Asegúrate de que el proyecto tenga:
- **Framework Preset**: Next.js (detectado automáticamente)
- **Build Command**: `npm run build` (por defecto)
- **Output Directory**: `.next` (automático)
- **Node Version**: 18.x o superior

> 💡 **Nota**: La estructura organizada de componentes no afecta el deploy. Todos los imports usan rutas absolutas (`@/`) que funcionan perfectamente en Vercel.

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Autenticación requerida para rutas admin
- Validación de archivos antes de subir
- Middleware de autenticación en Next.js

## 📝 Notas

- Las imágenes se comprimen automáticamente antes de subir
- Los archivos se almacenan en Supabase Storage
- Las URLs de los archivos se guardan en la base de datos como arrays JSONB
- Al eliminar una obra, se eliminan automáticamente sus archivos del storage

## 🐛 Solución de Problemas

### Error: "No autorizado"
- Verifica que el usuario esté autenticado
- Revisa las políticas RLS en Supabase

### Error al subir archivos
- Verifica que el bucket `obras-media` exista
- Revisa los permisos del bucket
- Verifica el tamaño de los archivos (máx 5MB imágenes, 50MB videos)

### Tests fallan
- Asegúrate de tener las variables de entorno configuradas
- Para tests E2E, el servidor de desarrollo debe estar corriendo

## 📄 Licencia

Este proyecto es privado y propiedad de ALCONSTRUCCIONES SRL.

