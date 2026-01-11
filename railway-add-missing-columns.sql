-- Script para agregar columnas faltantes en la tabla users de Railway
-- Ejecutar en TablePlus

-- Agregar columnas relacionadas con planes y suscripciones
ALTER TABLE `users` 
ADD COLUMN `planId` INT NOT NULL DEFAULT 1 AFTER `backupCodes`,
ADD COLUMN `stripeCustomerId` VARCHAR(255) AFTER `planId`,
ADD COLUMN `stripeSubscriptionId` VARCHAR(255) AFTER `stripeCustomerId`,
ADD COLUMN `subscriptionStatus` ENUM('active', 'canceled', 'past_due', 'unpaid') DEFAULT 'active' AFTER `stripeSubscriptionId`;

-- Agregar columnas de tracking de uso
ALTER TABLE `users`
ADD COLUMN `keysUsed` INT NOT NULL DEFAULT 0 AFTER `subscriptionStatus`,
ADD COLUMN `foldersUsed` INT NOT NULL DEFAULT 0 AFTER `keysUsed`,
ADD COLUMN `generatedKeysUsed` INT NOT NULL DEFAULT 0 AFTER `foldersUsed`;

-- Agregar columnas de detalles de suscripción
ALTER TABLE `users`
ADD COLUMN `subscriptionPeriod` ENUM('monthly', 'yearly') DEFAULT 'monthly' AFTER `generatedKeysUsed`,
ADD COLUMN `subscriptionStartDate` TIMESTAMP NULL AFTER `subscriptionPeriod`,
ADD COLUMN `subscriptionEndDate` TIMESTAMP NULL AFTER `subscriptionStartDate`,
ADD COLUMN `paypalSubscriptionId` VARCHAR(255) AFTER `subscriptionEndDate`;

-- Agregar columna de método de pago guardado
ALTER TABLE `users`
ADD COLUMN `savedPaymentMethod` TEXT AFTER `paypalSubscriptionId`;

-- Agregar columnas de preferencias
ALTER TABLE `users`
ADD COLUMN `language` VARCHAR(10) NOT NULL DEFAULT 'en' AFTER `savedPaymentMethod`,
ADD COLUMN `emailNotifications` BOOLEAN NOT NULL DEFAULT TRUE AFTER `language`;

-- Agregar columnas de timestamps
ALTER TABLE `users`
ADD COLUMN `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `emailNotifications`,
ADD COLUMN `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `createdAt`,
ADD COLUMN `lastSignedIn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `updatedAt`;

-- Agregar columnas de verificación de email
ALTER TABLE `users`
ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT FALSE AFTER `loginMethod`,
ADD COLUMN `verificationToken` VARCHAR(255) AFTER `emailVerified`,
ADD COLUMN `resetToken` VARCHAR(255) AFTER `verificationToken`,
ADD COLUMN `resetTokenExpiry` TIMESTAMP NULL AFTER `resetToken`;

-- Agregar columnas de WebAuthn
ALTER TABLE `users`
ADD COLUMN `webauthnEnabled` BOOLEAN NOT NULL DEFAULT FALSE AFTER `resetTokenExpiry`,
ADD COLUMN `webauthnCredentials` TEXT AFTER `webauthnEnabled`;

-- Verificar que las columnas se agregaron correctamente
SHOW COLUMNS FROM users;
