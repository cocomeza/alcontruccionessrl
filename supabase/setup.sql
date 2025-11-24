-- Script de configuración de Supabase para ALCONSTRUCCIONES SRL
-- Ejecutar este script en el SQL Editor de Supabase

-- Crear tabla obras
CREATE TABLE IF NOT EXISTS obras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Public read access" ON obras;
DROP POLICY IF EXISTS "Admin write access" ON obras;

-- Política para lectura pública
CREATE POLICY "Public read access"
  ON obras
  FOR SELECT
  USING (true);

-- Política para administradores (solo usuarios autenticados pueden escribir)
CREATE POLICY "Admin write access"
  ON obras
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Crear índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_obras_created_at ON obras(created_at DESC);

-- Nota: El bucket 'obras-media' debe crearse manualmente desde el panel de Supabase Storage
-- con los siguientes permisos:
-- - Public: read
-- - Authenticated: read, write

