-- ============================================
-- AGREGAR CAMPOS DE SUSCRIPCIÓN A TABLA USERS
-- ============================================

-- Agregar campo subscriptionEndDate si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscriptionEndDate DATETIME NULL COMMENT 'Fecha de expiración de la suscripción';

-- Agregar campo subscriptionStatus si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscriptionStatus ENUM('active', 'expired', 'cancelled', 'trial') DEFAULT 'active' COMMENT 'Estado de la suscripción';

-- Agregar campo billingCycle si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS billingCycle ENUM('monthly', 'yearly') DEFAULT 'monthly' COMMENT 'Ciclo de facturación (mensual o anual)';

-- Agregar campo paymentMethodId si no existe (para PayPal o Stripe)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS paymentMethodId VARCHAR(255) NULL COMMENT 'ID del método de pago guardado (PayPal subscription ID o Stripe payment method)';

-- Agregar campo lastPaymentDate si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS lastPaymentDate DATETIME NULL COMMENT 'Fecha del último pago exitoso';

-- Agregar campo autoRenew si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS autoRenew BOOLEAN DEFAULT TRUE COMMENT 'Si la suscripción se renueva automáticamente';

-- Crear índice para buscar suscripciones que expiran pronto
CREATE INDEX IF NOT EXISTS idx_subscription_end_date ON users(subscriptionEndDate);

-- Crear índice para buscar suscripciones por estado
CREATE INDEX IF NOT EXISTS idx_subscription_status ON users(subscriptionStatus);

-- ============================================
-- ACTUALIZAR USUARIOS EXISTENTES
-- ============================================

-- Establecer fecha de expiración para usuarios con planes pagos (30 días desde hoy como ejemplo)
UPDATE users 
SET subscriptionEndDate = DATE_ADD(NOW(), INTERVAL 30 DAY),
    subscriptionStatus = 'active',
    billingCycle = 'monthly',
    autoRenew = TRUE
WHERE planId != 1 AND subscriptionEndDate IS NULL;

-- Los usuarios Free no tienen fecha de expiración
UPDATE users 
SET subscriptionEndDate = NULL,
    subscriptionStatus = 'active',
    autoRenew = FALSE
WHERE planId = 1;

-- ============================================
-- VERIFICAR CAMBIOS
-- ============================================
SELECT 
  id,
  name,
  email,
  planId,
  subscriptionEndDate,
  subscriptionStatus,
  billingCycle,
  autoRenew,
  DATEDIFF(subscriptionEndDate, NOW()) as dias_restantes
FROM users
ORDER BY id;
