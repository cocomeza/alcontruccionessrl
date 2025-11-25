-- Script para configurar las políticas de Storage en Supabase
-- Ejecutar este script DESPUÉS de crear el bucket 'obras-media' manualmente
-- Ve a SQL Editor en Supabase y ejecuta este script

-- IMPORTANTE: Primero crea el bucket 'obras-media' desde Storage > Buckets > New bucket
-- Nombre: obras-media
-- Public: ✅ Marcado
-- File size limit: 52428800 (50 MB)

-- Habilitar el bucket como público
UPDATE storage.buckets
SET public = true
WHERE id = 'obras-media';

-- Eliminar políticas existentes si las hay (para evitar conflictos)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;

-- Política para lectura pública (cualquiera puede ver las imágenes)
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'obras-media');

-- Política para subida de archivos (solo usuarios autenticados)
CREATE POLICY "Authenticated upload access"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'obras-media' 
  AND auth.role() = 'authenticated'
);

-- Política para actualización de archivos (solo usuarios autenticados)
CREATE POLICY "Authenticated update access"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'obras-media' 
  AND auth.role() = 'authenticated'
);

-- Política para eliminación de archivos (solo usuarios autenticados)
CREATE POLICY "Authenticated delete access"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'obras-media' 
  AND auth.role() = 'authenticated'
);

-- Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%obras-media%' OR policyname LIKE '%Public%' OR policyname LIKE '%Authenticated%';

