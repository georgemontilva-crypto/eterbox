/**
 * TEMPORARY DATABASE INITIALIZATION ENDPOINT
 * This file should be DELETED after database is initialized
 * 
 * Visit /api/init-db to initialize the database
 */

import { Router } from 'express';
import mysql from 'mysql2/promise';

const router = Router();

const SQL_SCRIPT = `
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  maxKeys INT NOT NULL,
  maxFolders INT NOT NULL,
  maxGeneratedKeys INT NOT NULL DEFAULT 10,
  price DECIMAL(10, 2) NOT NULL,
  yearlyPrice DECIMAL(10, 2),
  yearlyDiscount INT DEFAULT 0,
  stripePriceId VARCHAR(255),
  stripeYearlyPriceId VARCHAR(255),
  features TEXT,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  twoFactorEnabled BOOLEAN NOT NULL DEFAULT FALSE,
  twoFactorSecret TEXT,
  backupCodes TEXT,
  planId INT NOT NULL DEFAULT 1,
  stripeCustomerId VARCHAR(255),
  stripeSubscriptionId VARCHAR(255),
  subscriptionStatus ENUM('active', 'canceled', 'past_due', 'unpaid') DEFAULT 'active',
  keysUsed INT NOT NULL DEFAULT 0,
  foldersUsed INT NOT NULL DEFAULT 0,
  generatedKeysUsed INT NOT NULL DEFAULT 0,
  subscriptionPeriod ENUM('monthly', 'yearly') DEFAULT 'monthly',
  subscriptionStartDate TIMESTAMP NULL,
  subscriptionEndDate TIMESTAMP NULL,
  paypalSubscriptionId VARCHAR(255),
  savedPaymentMethod TEXT,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  emailNotifications BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  folderId INT,
  platformName VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  encryptedPassword TEXT NOT NULL,
  url VARCHAR(2048),
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastUsed TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS loginAttempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  ipAddress VARCHAR(45) NOT NULL,
  userAgent TEXT,
  success BOOLEAN NOT NULL,
  reason VARCHAR(255),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activityLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  resourceType VARCHAR(50),
  resourceId INT,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  details TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supportTickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  email VARCHAR(320) NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50),
  status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  response TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolvedAt TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS emailNotifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  email VARCHAR(320) NOT NULL,
  type VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  htmlContent TEXT NOT NULL,
  status ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
  failureReason TEXT,
  sentAt TIMESTAMP NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stripeEvents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eventId VARCHAR(255) NOT NULL UNIQUE,
  eventType VARCHAR(100) NOT NULL,
  userId INT,
  data TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paymentHistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  planId INT NOT NULL,
  planName VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  period ENUM('monthly', 'yearly') NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  paypalOrderId VARCHAR(255),
  paypalTransactionId VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  payerEmail VARCHAR(320),
  payerName VARCHAR(255),
  description TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO plans (name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, stripePriceId, features, isActive)
VALUES 
  ('Free', 'Perfect for getting started', 3, 1, 10, 0.00, 0.00, 0, 'price_free', '["3 Credentials", "1 Folder", "10 Generated Keys", "AES-256 Encryption"]', TRUE),
  ('Basic', 'For individuals and small teams', 25, 5, 300, 15.00, 160.00, 11, 'price_basic_monthly', '["25 Credentials", "5 Folders", "300 Generated Keys", "AES-256 Encryption", "2FA Support"]', TRUE),
  ('Corporate', 'For enterprises and large teams', 2500, 1500, -1, 25.00, 280.00, 7, 'price_corporate_monthly', '["2500 Credentials", "1500 Folders", "Unlimited Generated Keys", "AES-256 Encryption", "2FA Support", "Priority Support"]', TRUE)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  maxKeys = VALUES(maxKeys),
  maxFolders = VALUES(maxFolders),
  maxGeneratedKeys = VALUES(maxGeneratedKeys),
  price = VALUES(price),
  yearlyPrice = VALUES(yearlyPrice),
  yearlyDiscount = VALUES(yearlyDiscount),
  features = VALUES(features),
  updatedAt = CURRENT_TIMESTAMP;
`;

router.get('/api/init-db', async (req, res) => {
  try {
    // Get DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return res.status(500).json({
        success: false,
        error: 'DATABASE_URL not configured'
      });
    }

    // Parse DATABASE_URL: mysql://user:password@host:port/database
    const match = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    
    if (!match) {
      return res.status(500).json({
        success: false,
        error: 'Invalid DATABASE_URL format'
      });
    }

    const config = {
      host: match[3],
      port: parseInt(match[4]),
      user: match[1],
      password: match[2],
      database: match[5],
      multipleStatements: true,
    };

    // Connect and execute SQL
    const connection = await mysql.createConnection(config);
    
    await connection.query(SQL_SCRIPT);
    
    // Verify plans were created
    const [plans] = await connection.query('SELECT id, name, price, yearlyPrice, maxKeys, maxFolders FROM plans');
    
    await connection.end();

    res.json({
      success: true,
      message: 'Database initialized successfully!',
      plans: plans,
      warning: 'IMPORTANT: Delete server/init-db-endpoint.ts and remove the route from server/_core/index.ts for security'
    });

  } catch (error: any) {
    console.error('Error initializing database:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
