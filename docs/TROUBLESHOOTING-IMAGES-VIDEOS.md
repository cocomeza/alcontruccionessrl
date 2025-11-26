# Solución de Problemas: Imágenes y Videos No Se Visualizan

## Problema
Las imágenes y videos se suben correctamente a Supabase Storage y se guardan en la base de datos, pero no se visualizan en la aplicación.

## Posibles Causas y Soluciones

### 1. Bucket No Está Configurado como Público

**Verificar:**
1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Storage** > **Buckets**
3. Busca el bucket `obras-media`
4. Verifica que el bucket tenga la opción **Public bucket** activada

**Solución:**
1. Si el bucket no es público, haz clic en el bucket `obras-media`
2. Ve a la pestaña **Settings**
3. Activa la opción **Public bucket**
4. Guarda los cambios

### 2. Políticas de Storage Incorrectas

**Verificar:**
Ejecuta el script SQL en el SQL Editor de Supabase:

```sql
-- Verificar políticas existentes
SELECT * FROM storage.policies 
WHERE bucket_id = 'obras-media';
```

**Solución:**
Ejecuta el script `supabase/storage-policies.sql` en el SQL Editor de Supabase para crear las políticas correctas.

### 3. URLs No Se Están Generando Correctamente

**Verificar:**
Ejecuta el script de diagnóstico:

```bash
npx tsx scripts/check-storage-urls.ts
```

Este script verificará:
- Que todas las URLs en la base de datos sean válidas
- Que las URLs sean de Supabase Storage
- Que las URLs tengan el formato correcto

**Solución:**
Si el script encuentra URLs inválidas, necesitarás:
1. Verificar que `lib/utils/storage.ts` está usando `getPublicUrl()` correctamente
2. Re-subir las imágenes/videos afectados desde el panel de administración

### 4. Problemas de CORS

**Verificar:**
Abre la consola del navegador (F12) y busca errores de CORS al cargar imágenes.

**Solución:**
1. Ve a **Storage** > **Buckets** > `obras-media` > **Settings**
2. Verifica que **CORS** esté configurado correctamente
3. Si es necesario, agrega tu dominio a la lista de orígenes permitidos

### 5. Variables de Entorno Incorrectas

**Verificar:**
Asegúrate de que tu archivo `.env.local` tenga las variables correctas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

**Solución:**
1. Verifica que las variables estén correctas en `.env.local`
2. Reinicia el servidor de desarrollo (`npm run dev`)
3. Si estás en producción (Vercel), verifica las variables de entorno en el dashboard de Vercel

### 6. Formato de URLs Incorrecto

Las URLs de Supabase Storage deben tener el formato:
```
https://[project-ref].supabase.co/storage/v1/object/public/[bucket-name]/[file-path]
```

**Verificar:**
Ejecuta el script de diagnóstico para verificar el formato de las URLs.

**Solución:**
Si las URLs no tienen el formato correcto, verifica que `lib/utils/storage.ts` esté usando `getPublicUrl()` correctamente.

## Pasos de Diagnóstico Recomendados

1. **Ejecutar script de verificación:**
   ```bash
   npx tsx scripts/check-storage-urls.ts
   ```

2. **Verificar configuración del bucket:**
   - Ve a Supabase Dashboard > Storage > Buckets
   - Verifica que `obras-media` sea público

3. **Verificar políticas de storage:**
   - Ejecuta `supabase/storage-policies.sql` en el SQL Editor

4. **Verificar en la consola del navegador:**
   - Abre F12 > Console
   - Busca errores al cargar imágenes/videos
   - Revisa la pestaña Network para ver si las peticiones fallan

5. **Verificar variables de entorno:**
   - Asegúrate de que `.env.local` tenga las variables correctas
   - Reinicia el servidor de desarrollo

## Solución Rápida

Si necesitas una solución rápida y las imágenes/videos ya están en la base de datos pero con URLs incorrectas:

1. Ve al panel de administración (`/admin/obras`)
2. Edita la obra que tiene problemas
3. Elimina las imágenes/videos que no se visualizan
4. Re-sube los archivos
5. Guarda la obra

Esto regenerará las URLs correctamente.

## Contacto

Si después de seguir estos pasos el problema persiste, verifica:
- Los logs del servidor de desarrollo
- La consola del navegador para errores específicos
- El estado del bucket en Supabase Dashboard

