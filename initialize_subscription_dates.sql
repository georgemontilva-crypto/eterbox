-- ============================================
-- INICIALIZAR FECHAS DE SUSCRIPCIÓN
-- Para usuarios existentes que tienen planes pagos
-- ============================================

-- Actualizar usuarios con planes pagos (planId != 1) que no tienen fecha de expiración
UPDATE users 
SET 
  subscriptionStartDate = NOW(),
  subscriptionEndDate = DATE_ADD(NOW(), INTERVAL 30 DAY),
  subscriptionStatus = 'active',
  subscriptionPeriod = 'monthly'
WHERE planId != 1 AND subscriptionEndDate IS NULL;

-- Los usuarios Free no tienen fecha de expiración
UPDATE users 
SET 
  subscriptionStartDate = NULL,
  subscriptionEndDate = NULL,
  subscriptionStatus = 'active',
  subscriptionPeriod = 'monthly'
WHERE planId = 1;

-- Verificar los cambios
SELECT 
  id,
  name,
  email,
  planId,
  subscriptionStartDate,
  subscriptionEndDate,
  subscriptionStatus,
  subscriptionPeriod,
  DATEDIFF(subscriptionEndDate, NOW()) as dias_restantes
FROM users
ORDER BY id;
