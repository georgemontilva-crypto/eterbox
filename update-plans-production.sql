-- ========================================
-- EterBox - Update Plans for Production
-- ========================================
-- This script updates all 4 subscription plans:
-- 1. Free: 10 credentials, 2 folders
-- 2. Basic: $12.99/month, 100 credentials, 10 folders
-- 3. Corporate: $29/month, 1000 credentials, 100 folders + audits, backup, 24/7 support
-- 4. Enterprise: $99/month, unlimited credentials/folders, 20 members + all Corporate features
--
-- Execute this in Railway MySQL Query Editor or MySQL Workbench
-- ========================================

-- Update Free Plan
INSERT INTO plans (id, name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, features, isActive, createdAt, updatedAt)
VALUES (
  1,
  'Free',
  'Perfect for getting started',
  10,
  2,
  10,
  0.00,
  0.00,
  0,
  JSON_ARRAY(
    '10 credentials',
    '2 folders',
    'Basic encryption',
    'Password generator (10/month)'
  ),
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  maxKeys = VALUES(maxKeys),
  maxFolders = VALUES(maxFolders),
  maxGeneratedKeys = VALUES(maxGeneratedKeys),
  price = VALUES(price),
  yearlyPrice = VALUES(yearlyPrice),
  yearlyDiscount = VALUES(yearlyDiscount),
  features = VALUES(features),
  isActive = VALUES(isActive),
  updatedAt = NOW();

-- Update Basic Plan
INSERT INTO plans (id, name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, features, isActive, createdAt, updatedAt)
VALUES (
  2,
  'Basic',
  'For freelancers and professionals',
  100,
  10,
  300,
  12.99,
  140.00,
  11,
  JSON_ARRAY(
    '100 credentials',
    '10 folders',
    'Military-grade encryption',
    'Password generator (300/month)',
    '2FA support',
    'Priority email support'
  ),
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  maxKeys = VALUES(maxKeys),
  maxFolders = VALUES(maxFolders),
  maxGeneratedKeys = VALUES(maxGeneratedKeys),
  price = VALUES(price),
  yearlyPrice = VALUES(yearlyPrice),
  yearlyDiscount = VALUES(yearlyDiscount),
  features = VALUES(features),
  isActive = VALUES(isActive),
  updatedAt = NOW();

-- Update Corporate Plan (NEW FEATURES: audits, backup, 24/7 support)
INSERT INTO plans (id, name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, features, isActive, createdAt, updatedAt)
VALUES (
  3,
  'Corporate',
  'For teams and small businesses',
  1000,
  100,
  -1,
  29.00,
  300.00,
  7,
  JSON_ARRAY(
    '1000 credentials',
    '100 folders',
    'Military-grade encryption',
    'Unlimited password generation',
    '2FA support',
    'Complete audits and compliance',
    'Automatic backup',
    '24/7 dedicated support'
  ),
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  maxKeys = VALUES(maxKeys),
  maxFolders = VALUES(maxFolders),
  maxGeneratedKeys = VALUES(maxGeneratedKeys),
  price = VALUES(price),
  yearlyPrice = VALUES(yearlyPrice),
  yearlyDiscount = VALUES(yearlyDiscount),
  features = VALUES(features),
  isActive = VALUES(isActive),
  updatedAt = NOW();

-- Create Enterprise Plan (NEW PLAN)
INSERT INTO plans (id, name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, features, isActive, createdAt, updatedAt)
VALUES (
  4,
  'Enterprise',
  'For corporations and clients with critical security needs',
  -1,
  -1,
  -1,
  99.00,
  1080.00,
  9,
  JSON_ARRAY(
    'Unlimited credentials',
    'Unlimited folders',
    'Military-grade encryption',
    'Unlimited password generation',
    '2FA support',
    'Advanced multi-user (up to 20 members)',
    'Complete audits and compliance',
    'Automatic backup',
    '24/7 dedicated support',
    'Custom integrations',
    'Dedicated account manager'
  ),
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  maxKeys = VALUES(maxKeys),
  maxFolders = VALUES(maxFolders),
  maxGeneratedKeys = VALUES(maxGeneratedKeys),
  price = VALUES(price),
  yearlyPrice = VALUES(yearlyPrice),
  yearlyDiscount = VALUES(yearlyDiscount),
  features = VALUES(features),
  isActive = VALUES(isActive),
  updatedAt = NOW();

-- Verify the update
SELECT 
  id,
  name,
  CASE 
    WHEN maxKeys = -1 THEN 'Unlimited'
    ELSE CAST(maxKeys AS CHAR)
  END AS 'Credentials',
  CASE 
    WHEN maxFolders = -1 THEN 'Unlimited'
    ELSE CAST(maxFolders AS CHAR)
  END AS 'Folders',
  CONCAT('$', price) AS 'Price/Month',
  CONCAT('$', yearlyPrice) AS 'Price/Year',
  CONCAT(yearlyDiscount, '%') AS 'Discount',
  isActive AS 'Active'
FROM plans
ORDER BY id;

-- ========================================
-- INSTRUCTIONS:
-- ========================================
-- 1. Go to Railway Dashboard
-- 2. Select your MySQL database
-- 3. Click "Query" tab
-- 4. Copy and paste this entire script
-- 5. Click "Run" or press Ctrl+Enter
-- 6. Check the SELECT output to verify all plans are correct
-- ========================================
