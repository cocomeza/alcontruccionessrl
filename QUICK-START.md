# 🚀 Inicio Rápido

## ✅ Instalación Completada

Las dependencias están instaladas. Ahora sigue estos pasos:

## 1️⃣ Configurar Supabase

### Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL y la clave anónima

### Configurar Base de Datos
1. Ve a SQL Editor en Supabase
2. Copia y ejecuta el contenido de `supabase/setup.sql`
3. Esto creará la tabla `obras` con las políticas RLS

### Configurar Storage
1. Ve a Storage en Supabase
2. Crea un nuevo bucket llamado `obras-media`
3. Configura permisos:
   - **Public**: `read`
   - **Authenticated**: `read, write`

## 2️⃣ Variables de Entorno

Crea `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

## 3️⃣ Crear Usuario Admin

1. Ve a Authentication > Users en Supabase
2. Crea un nuevo usuario manualmente
3. Usa ese email/contraseña para login en `/admin/login`

## 4️⃣ Ejecutar el Proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 5️⃣ Probar la Aplicación

1. **Público**: Ve a `/obras` para ver el portfolio (vacío inicialmente)
2. **Admin**: Ve a `/admin/login` y usa tus credenciales
3. **Crear obra**: En el admin, crea tu primera obra con imágenes/videos

## 📝 Notas Importantes

- Las imágenes se comprimen automáticamente antes de subir
- Límites: 5MB por imagen, 50MB por video
- Los archivos se almacenan en Supabase Storage
- Al eliminar una obra, se eliminan automáticamente sus archivos

## 🐛 Problemas Comunes

### Error: "No autorizado"
- Verifica que el usuario esté autenticado
- Revisa las políticas RLS en Supabase

### Error al subir archivos
- Verifica que el bucket `obras-media` exista
- Revisa los permisos del bucket
- Verifica el tamaño de los archivos

### Error de conexión a Supabase
- Verifica las variables de entorno en `.env.local`
- Asegúrate de que las URLs sean correctas

## ✨ Listo!

Tu proyecto está configurado y listo para usar. ¡Empieza a crear obras!

