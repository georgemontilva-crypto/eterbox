-- ============================================================
-- Migration: Add QR Codes and QR Folders tables
-- Created: 2026-01-15
-- Description: Adds QR code functionality with folders support
-- ============================================================

-- Step 1: Create QR Folders table
-- This table stores folders for organizing QR codes
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

-- Add foreign key for parent folder (only if table was just created)
-- This allows nested folders
ALTER TABLE qr_folders
  ADD CONSTRAINT fk_qr_folders_parent 
  FOREIGN KEY (parentFolderId) REFERENCES qr_folders(id) ON DELETE CASCADE;

-- Step 2: Create QR Codes table
-- This table stores the actual QR codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  folderId INT DEFAULT NULL,
  
  -- QR Code details
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'url',
  
  -- QR Code data (stored as base64 image)
  qrImage TEXT NOT NULL,
  
  -- Metadata
  description TEXT,
  scans INT DEFAULT 0 NOT NULL,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  lastScanned TIMESTAMP NULL,
  
  INDEX idx_userId (userId),
  INDEX idx_folderId (folderId),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key for folder (only if table was just created)
ALTER TABLE qr_codes
  ADD CONSTRAINT fk_qr_codes_folder 
  FOREIGN KEY (folderId) REFERENCES qr_folders(id) ON DELETE SET NULL;

-- Step 3: Update users table to track QR usage
-- Check if column exists before adding
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'qrCodesUsed'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE users ADD COLUMN qrCodesUsed INT DEFAULT 0 NOT NULL AFTER generatedKeysUsed',
  'SELECT "Column qrCodesUsed already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add qrFoldersUsed column
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'qrFoldersUsed'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE users ADD COLUMN qrFoldersUsed INT DEFAULT 0 NOT NULL AFTER qrCodesUsed',
  'SELECT "Column qrFoldersUsed already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 4: Update plans table to add QR limits
-- Check if column exists before adding
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'plans' 
  AND COLUMN_NAME = 'maxQrCodes'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE plans ADD COLUMN maxQrCodes INT DEFAULT 50 NOT NULL AFTER maxGeneratedKeys',
  'SELECT "Column maxQrCodes already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add maxQrFolders column
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'plans' 
  AND COLUMN_NAME = 'maxQrFolders'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE plans ADD COLUMN maxQrFolders INT DEFAULT 10 NOT NULL AFTER maxQrCodes',
  'SELECT "Column maxQrFolders already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 5: Verification
-- Show the new tables
SELECT 'QR Folders table created/verified' AS Status;
SELECT COUNT(*) AS qr_folders_count FROM qr_folders;

SELECT 'QR Codes table created/verified' AS Status;
SELECT COUNT(*) AS qr_codes_count FROM qr_codes;

SELECT 'Migration completed successfully!' AS Status;
