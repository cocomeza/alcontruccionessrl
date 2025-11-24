-- Script de migración para actualizar categorías antiguas a las nuevas categorías argentinas
-- Ejecutar solo si tienes obras con las categorías antiguas

-- Migrar categorías antiguas a nuevas
UPDATE obras SET category = 'vivienda' WHERE category = 'residencial';
UPDATE obras SET category = 'refaccion' WHERE category = 'renovacion';

-- Verificar migración
SELECT category, COUNT(*) as cantidad 
FROM obras 
GROUP BY category 
ORDER BY cantidad DESC;

