-- Actualizar límite de credenciales del plan Free de 25 a 15
-- Fecha: 13 de enero de 2026
-- Razón: Crear fricción más efectiva para conversión a planes pagos

UPDATE plans 
SET maxKeys = 15 
WHERE name = 'Free';

-- Verificar el cambio
SELECT id, name, maxKeys, maxFolders, price 
FROM plans 
WHERE name = 'Free';
