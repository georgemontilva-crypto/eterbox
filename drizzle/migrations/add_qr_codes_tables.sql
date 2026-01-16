-- Migration: Add QR Codes and QR Folders tables
-- Created: 2026-01-15

-- QR Folders table (similar to folders but for QR codes)
CREATE TABLE IF NOT EXISTS qr_folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parentFolderId INT DEFAULT NULL, -- For nested folders
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_userId (userId),
  INDEX idx_parentFolderId (parentFolderId),
  FOREIGN KEY (parentFolderId) REFERENCES qr_folders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- QR Codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  folderId INT DEFAULT NULL, -- Reference to qr_folders
  
  -- QR Code details
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL, -- The actual content/URL encoded in the QR
  type VARCHAR(50) NOT NULL DEFAULT 'url', -- 'url', 'text', 'email', 'phone', 'wifi', 'vcard'
  
  -- QR Code data (stored as base64 image)
  qrImage TEXT NOT NULL, -- Base64 encoded PNG image
  
  -- Metadata
  description TEXT,
  scans INT DEFAULT 0 NOT NULL, -- Track how many times it was scanned
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  lastScanned TIMESTAMP NULL,
  
  INDEX idx_userId (userId),
  INDEX idx_folderId (folderId),
  INDEX idx_type (type),
  FOREIGN KEY (folderId) REFERENCES qr_folders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update users table to track QR usage
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS qrCodesUsed INT DEFAULT 0 NOT NULL AFTER generatedKeysUsed,
  ADD COLUMN IF NOT EXISTS qrFoldersUsed INT DEFAULT 0 NOT NULL AFTER qrCodesUsed;

-- Update plans table to add QR limits
ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS maxQrCodes INT DEFAULT 50 NOT NULL AFTER maxGeneratedKeys,
  ADD COLUMN IF NOT EXISTS maxQrFolders INT DEFAULT 10 NOT NULL AFTER maxQrCodes;
