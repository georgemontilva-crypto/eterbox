-- ============================================
-- SCRIPT DE VERIFICACIÓN DE DATOS
-- Panel de Administración EterBox
-- ============================================

-- 1. CONTAR USUARIOS TOTALES
-- ============================================
SELECT COUNT(*) as total_usuarios FROM users;

-- 2. VER TODOS LOS USUARIOS CON SUS PLANES
-- ============================================
SELECT 
  u.id,
  u.name,
  u.email,
  u.planId as plan_id,
  u.createdAt as created_at,
  p.name as plan_name
FROM users u
LEFT JOIN plans p ON u.planId = p.id
ORDER BY u.createdAt DESC;

-- 3. CONTAR USUARIOS POR PLAN
-- ============================================
SELECT 
  p.name as plan_name,
  COUNT(u.id) as cantidad_usuarios
FROM plans p
LEFT JOIN users u ON p.id = u.planId
GROUP BY p.id, p.name
ORDER BY p.id;

-- 4. VER TODOS LOS PLANES DISPONIBLES
-- ============================================
SELECT * FROM plans;

-- 5. VER ADMINISTRADORES Y SUS PERMISOS
-- ============================================
SELECT 
  u.id,
  u.name,
  u.email,
  ap.is_super_admin,
  ap.can_view_users,
  ap.can_edit_users,
  ap.can_delete_users,
  ap.can_send_bulk_emails,
  ap.can_view_revenue,
  ap.can_manage_admins,
  ap.can_view_analytics,
  ap.createdAt as admin_since
FROM users u
INNER JOIN admin_permissions ap ON u.id = ap.user_id
ORDER BY ap.is_super_admin DESC, u.createdAt ASC;

-- 6. CONTAR ADMINISTRADORES
-- ============================================
SELECT COUNT(*) as total_admins FROM admin_permissions;

-- 7. VERIFICAR HISTORIAL DE PAGOS (si la tabla existe)
-- ============================================
SELECT COUNT(*) as total_pagos FROM payment_history;

SELECT 
  ph.id,
  ph.user_id,
  u.name as usuario,
  u.email,
  ph.amount as monto,
  ph.status as estado,
  ph.created_at as fecha
FROM payment_history ph
LEFT JOIN users u ON ph.user_id = u.id
ORDER BY ph.created_at DESC
LIMIT 10;

-- 8. CALCULAR INGRESOS TOTALES (si la tabla payment_history existe)
-- ============================================
SELECT 
  COUNT(*) as total_transacciones,
  COALESCE(SUM(amount), 0) as ingresos_totales,
  COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as ingresos_completados
FROM payment_history;

-- 9. VERIFICAR EMAILS MASIVOS ENVIADOS (si la tabla existe)
-- ============================================
SELECT COUNT(*) as total_emails_enviados FROM bulk_emails;

SELECT 
  be.id,
  be.subject as asunto,
  u.name as enviado_por,
  be.recipient_count as destinatarios,
  be.sent_at as fecha_envio
FROM bulk_emails be
LEFT JOIN users u ON be.sent_by = u.id
ORDER BY be.sent_at DESC
LIMIT 10;

-- 10. USUARIOS REGISTRADOS EN LOS ÚLTIMOS 30 DÍAS
-- ============================================
SELECT 
  DATE(createdAt) as fecha,
  COUNT(*) as nuevos_usuarios
FROM users
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(createdAt)
ORDER BY fecha DESC;

-- 11. SUSCRIPCIONES ACTIVAS (usuarios con plan premium o enterprise)
-- ============================================
SELECT COUNT(*) as suscripciones_activas 
FROM users 
WHERE planId IS NOT NULL AND planId != 1;

-- 12. USUARIOS NUEVOS EN EL ÚLTIMO MES
-- ============================================
SELECT COUNT(*) as nuevos_usuarios_mes
FROM users
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- ============================================
-- RESUMEN EJECUTIVO PARA EL PANEL DE ADMIN
-- ============================================
SELECT 
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM users WHERE planId IS NOT NULL AND planId != 1) as suscripciones_activas,
  (SELECT COUNT(*) FROM users WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as nuevos_usuarios_mes,
  (SELECT COALESCE(SUM(amount), 0) FROM payment_history WHERE status = 'completed') as ingresos_totales,
  (SELECT COUNT(*) FROM admin_permissions) as total_administradores;

-- ============================================
-- NOTAS:
-- - Si ves errores en payment_history o bulk_emails, esas tablas no existen
-- - Los queries que fallan se pueden omitir por ahora
-- - Los datos críticos son: users, plans, admin_permissions
-- ============================================
