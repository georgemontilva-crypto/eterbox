-- ============================================================
-- Migration: Add QR Codes and QR Folders tables (Simplified)
-- Created: 2026-01-15
-- Description: Adds QR code functionality without foreign keys
-- ============================================================

-- Step 1: Create QR Folders table
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

-- Step 2: Create QR Codes table
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

-- Step 3: Update users table (if columns don't exist)
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS qrCodesUsed INT DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS qrFoldersUsed INT DEFAULT 0 NOT NULL;

-- Step 4: Update plans table (if columns don't exist)
ALTER TABLE plans 
  ADD COLUMN IF NOT EXISTS maxQrCodes INT DEFAULT 50 NOT NULL,
  ADD COLUMN IF NOT EXISTS maxQrFolders INT DEFAULT 10 NOT NULL;

SELECT 'Migration completed successfully!' AS Status;
