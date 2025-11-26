-- Script para agregar la columna 'featured' a la tabla obras
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna featured si no existe
ALTER TABLE obras 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false NOT NULL;

-- Crear índice para búsquedas rápidas de obras destacadas
CREATE INDEX IF NOT EXISTS idx_obras_featured ON obras(featured) WHERE featured = true;

-- Comentario sobre el uso de la columna
COMMENT ON COLUMN obras.featured IS 'Indica si la obra debe mostrarse en la página de inicio (home). Si es true, aparecerá en el home. Si es false, solo aparecerá en la sección de obras.';

