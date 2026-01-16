# Instrucciones para Migración de Tablas QR

## Problema Actual
Las tablas `qr_codes` y `qr_folders` no existen en la base de datos de Railway, lo que causa errores al intentar crear carpetas o códigos QR.

## Solución

Debes ejecutar el siguiente SQL en tu base de datos MySQL de Railway:

### Opción 1: Usar Railway Dashboard

1. Ve a tu proyecto en Railway
2. Abre la base de datos MySQL
3. Ve a la pestaña "Query" o "Data"
4. Copia y pega el siguiente SQL:

```sql
-- Crear tabla de carpetas QR
CREATE TABLE IF NOT EXISTS qr_folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parentFolderId INT DEFAULT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_userId (userId),
  INDEX idx_parentFolderId (parentFolderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de códigos QR
CREATE TABLE IF NOT EXISTS qr_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  folderId INT DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'url',
  qrImage LONGTEXT NOT NULL,
  description TEXT,
  scans INT DEFAULT 0 NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  lastScanned TIMESTAMP NULL,
  INDEX idx_userId (userId),
  INDEX idx_folderId (folderId),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actualizar tabla users (agregar columnas si no existen)
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS qrCodesUsed INT DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS qrFoldersUsed INT DEFAULT 0 NOT NULL;

-- Actualizar tabla plans (agregar columnas si no existen)
ALTER TABLE plans 
  ADD COLUMN IF NOT EXISTS maxQrCodes INT DEFAULT 50 NOT NULL,
  ADD COLUMN IF NOT EXISTS maxQrFolders INT DEFAULT 10 NOT NULL;
```

5. Ejecuta el SQL
6. Verifica que las tablas se crearon correctamente:

```sql
SHOW TABLES LIKE 'qr_%';
SELECT COUNT(*) FROM qr_codes;
SELECT COUNT(*) FROM qr_folders;
```

### Opción 2: Usar MySQL CLI (si tienes acceso)

```bash
mysql -h [HOST] -u [USER] -p[PASSWORD] [DATABASE] < drizzle/migrations/qr_tables_simple.sql
```

## Verificación

Después de ejecutar la migración:

1. Limpia la caché del navegador (Ctrl+Shift+R)
2. Intenta crear una carpeta QR
3. Intenta crear un código QR
4. Ambas operaciones deberían funcionar sin errores

## Cambios Implementados en el Frontend

✅ **QR Dashboard**: Estilos actualizados similares a Password Dashboard
✅ **Sidebar Colapsado**: Iconos centrados, blancos, activo azul oscuro
✅ **Tema/Idioma**: Cambios instantáneos sin recarga de página
✅ **Modales**: Espaciado mejorado entre labels y campos
✅ **Botones**: Hover azul fino, activo azul oscuro con texto blanco

## Notas

- El archivo SQL está en: `drizzle/migrations/qr_tables_simple.sql`
- Esta versión NO usa foreign keys para evitar problemas de dependencias
- Las tablas usan `IF NOT EXISTS` para evitar errores si ya existen
- El tipo de dato para `qrImage` es `LONGTEXT` para soportar imágenes grandes en base64
