import { Router } from 'express';
import mysql from 'mysql2/promise';

const router = Router();

const SQL_SETUP = `
-- Create plans table
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

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  open_id VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  twoFactorEnabled BOOLEAN NOT NULL DEFAULT FALSE,
  twoFactorSecret VARCHAR(255),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create userPlans table
CREATE TABLE IF NOT EXISTS userPlans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  planId INT NOT NULL,
  startDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  endDate TIMESTAMP,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (planId) REFERENCES plans(id) ON DELETE CASCADE
);

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  folderId INT,
  platform VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  email VARCHAR(320),
  encryptedPassword TEXT NOT NULL,
  notes TEXT,
  lastUsed TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE SET NULL
);

-- Create generatedKeys table
CREATE TABLE IF NOT EXISTS generatedKeys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  keyValue TEXT NOT NULL,
  strength ENUM('weak', 'medium', 'strong') NOT NULL,
  length INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create loginAttempts table
CREATE TABLE IF NOT EXISTS loginAttempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  success BOOLEAN NOT NULL,
  attemptedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create paymentHistory table
CREATE TABLE IF NOT EXISTS paymentHistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  planId INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  paymentMethod VARCHAR(50),
  transactionId VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL,
  paidAt TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (planId) REFERENCES plans(id)
);

-- Create emailNotifications table
CREATE TABLE IF NOT EXISTS emailNotifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sentAt TIMESTAMP,
  status ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create stripeEvents table
CREATE TABLE IF NOT EXISTS stripeEvents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eventId VARCHAR(255) NOT NULL UNIQUE,
  eventType VARCHAR(100) NOT NULL,
  payload TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create supportTickets table
CREATE TABLE IF NOT EXISTS supportTickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default plans
INSERT INTO plans (name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, features, isActive)
VALUES 
  ('Free', 'Perfect for personal use', 3, 1, 10, 0.00, 0.00, 0, '["3 credentials", "1 folder", "10 generated keys", "Basic security"]', TRUE),
  ('Basic', 'Ideal for individuals', 50, 10, 100, 4.99, 49.99, 17, '["50 credentials", "10 folders", "100 generated keys", "Advanced security", "Priority support"]', TRUE),
  ('Corporate', 'For teams and businesses', 999999, 999999, 999999, 14.99, 149.99, 17, '["Unlimited credentials", "Unlimited folders", "Unlimited generated keys", "Enterprise security", "24/7 support", "Team management"]', TRUE)
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

router.get('/setup-database', async (req, res) => {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
    
    if (!dbUrl) {
      return res.status(500).json({
        success: false,
        error: 'No database URL configured. Please set DATABASE_URL, MYSQL_URL, or MYSQL_PUBLIC_URL in Railway variables.'
      });
    }

    console.log('[Setup] Connecting to database...');
    const connection = await mysql.createConnection(dbUrl);
    
    console.log('[Setup] Executing SQL setup script...');
    await connection.query(SQL_SETUP);
    
    console.log('[Setup] Verifying plans...');
    const [plans] = await connection.query('SELECT id, name, price, yearlyPrice, maxKeys, maxFolders FROM plans');
    
    await connection.end();
    
    console.log('[Setup] Database setup completed successfully!');
    
    res.json({
      success: true,
      message: 'Database initialized successfully! ✅',
      plans: plans,
      note: 'This endpoint will be removed for security. Do not visit again.'
    });
    
  } catch (error: any) {
    console.error('[Setup] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to initialize database. Check Railway logs for details.'
    });
  }
});

export default router;
