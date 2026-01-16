-- ============================================================
-- Migration: Add Dynamic QR Code Support
-- Created: 2026-01-16
-- Description: Adds shortCode and isDynamic fields to qr_codes table
-- ============================================================

-- Add shortCode column (unique identifier for dynamic QR redirects)
ALTER TABLE qr_codes 
  ADD COLUMN IF NOT EXISTS shortCode VARCHAR(20) UNIQUE,
  ADD INDEX IF NOT EXISTS idx_shortCode (shortCode);

-- Add isDynamic column (flag to indicate if QR uses redirect)
ALTER TABLE qr_codes 
  ADD COLUMN IF NOT EXISTS isDynamic BOOLEAN DEFAULT TRUE NOT NULL;

SELECT 'Dynamic QR fields migration completed successfully!' AS Status;
