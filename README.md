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

### Tests Unitarios e Integración (Vitest)
```bash
# Ejecutar tests en modo watch
npm run test

# Ejecutar tests una vez
npm run test:unit

# Con coverage
npm run test -- --coverage
```

### Tests E2E (Playwright)
```bash
# Ejecutar tests E2E
npm run test:e2e

# Ejecutar con UI
npm run test:e2e:ui
```

## 📁 Estructura del Proyecto

```
├── app/                    # Rutas de Next.js (App Router)
│   ├── admin/             # Rutas del panel admin
│   ├── obra/              # Detalle de obra (público)
│   └── obras/             # Listado de obras (público)
├── components/            # Componentes React
│   └── ui/                # Componentes shadcn/ui
├── lib/                   # Utilidades y helpers
│   ├── actions/           # Server Actions
│   ├── supabase/          # Clientes Supabase
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Funciones utilitarias
├── tests/                 # Tests
│   ├── e2e/               # Tests E2E (Playwright)
│   ├── integration/       # Tests de integración
│   └── unit/              # Tests unitarios
└── public/                # Archivos estáticos
```

## 🎨 Paleta de Colores

- **Calypso**: `#2a5e80` - Color principal
- **Mystic**: `#edf2f4` - Fondo claro
- **Boston Blue**: `#3281b8` - Botones y acentos
- **Morning Glory**: `#90bedd` - Acentos secundarios

## 🔐 Rutas

### Públicas
- `/` - Redirige a `/obras`
- `/obras` - Listado de obras (grid)
- `/obra/[id]` - Detalle de obra con galería y videos

### Admin (requiere autenticación)
- `/admin/login` - Login
- `/admin/dashboard` - Dashboard principal
- `/admin/obras` - Listado de obras (gestión)
- `/admin/obras/new` - Crear nueva obra
- `/admin/obras/[id]/edit` - Editar obra

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

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub/GitLab

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Desplegar**
   - Vercel detectará automáticamente Next.js
   - El despliegue se iniciará automáticamente

### Configuración adicional en Vercel

Asegúrate de que el proyecto tenga:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (automático)

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

