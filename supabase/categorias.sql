-- Script para agregar categorías a las obras
-- Ejecutar este script en el SQL Editor de Supabase después del script principal (setup.sql)

-- Agregar columna category a la tabla obras
ALTER TABLE obras ADD COLUMN IF NOT EXISTS category TEXT;

-- Crear índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_obras_category ON obras(category);

-- Categorías usadas en Argentina:
-- 'vivienda', 'edificios-altura', 'comercial', 'industrial', 'obra-publica', 'infraestructura', 'refaccion', 'ampliacion', 'otros'

