# 📁 Scripts de Base de Datos - Supabase

Esta carpeta contiene todos los scripts SQL necesarios para configurar y mantener la base de datos de Supabase para ALCONSTRUCCIONES SRL.

## 📋 Archivos

### 1. `setup.sql`
**Script principal de configuración inicial**

Ejecutar primero este script en el SQL Editor de Supabase. Incluye:
- Creación de la tabla `obras`
- Configuración de Row Level Security (RLS)
- Políticas de acceso público y admin
- Índices para optimización

**Instrucciones:**
1. Abre el SQL Editor en tu proyecto de Supabase
2. Copia y pega el contenido de `setup.sql`
3. Ejecuta el script

### 2. `categorias.sql`
**Script para agregar categorías**

Ejecutar después de `setup.sql`. Agrega:
- Columna `category` a la tabla `obras`
- Índice para búsquedas por categoría

**Categorías disponibles:**
- `vivienda` - Vivienda
- `edificios-altura` - Edificios en Altura
- `comercial` - Comercial
- `industrial` - Industrial
- `obra-publica` - Obra Pública
- `infraestructura` - Infraestructura
- `refaccion` - Refacción
- `ampliacion` - Ampliación
- `otros` - Otros

### 3. `migracion-categorias.sql`
**Script de migración (opcional)**

Solo ejecutar si tienes obras existentes con las categorías antiguas (`residencial`, `renovacion`).

Este script migra automáticamente:
- `residencial` → `vivienda`
- `renovacion` → `refaccion`

## 🚀 Orden de Ejecución

1. **Primera vez (proyecto nuevo):**
   ```
   1. setup.sql
   2. categorias.sql
   ```

2. **Si ya tienes datos y quieres migrar categorías:**
   ```
   1. migracion-categorias.sql
   ```

## 📝 Notas Importantes

- ⚠️ **Backup**: Siempre haz un backup antes de ejecutar scripts en producción
- 🔒 **Seguridad**: Las políticas RLS están configuradas para permitir lectura pública y escritura solo para usuarios autenticados
- 📦 **Storage**: El bucket `obras-media` debe crearse manualmente desde el panel de Supabase Storage con permisos:
  - Public: read
  - Authenticated: read, write

## 🔧 Troubleshooting

Si encuentras errores al ejecutar los scripts:

1. Verifica que estés ejecutando en el orden correcto
2. Asegúrate de tener permisos de administrador en Supabase
3. Revisa que no existan conflictos con tablas/políticas existentes
4. Los scripts usan `IF NOT EXISTS` y `DROP POLICY IF EXISTS` para evitar errores si ya existen

## 📚 Documentación Adicional

- Ver `CATEGORIAS-ARGENTINA.md` en la raíz del proyecto para más detalles sobre las categorías
- Ver `README.md` en la raíz del proyecto para configuración general

