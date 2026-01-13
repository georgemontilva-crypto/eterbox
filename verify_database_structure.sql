-- ============================================
-- SCRIPT DE VERIFICACIÓN DE ESTRUCTURA DE BASE DE DATOS
-- Panel de Administración EterBox
-- ============================================

-- 1. LISTAR TODAS LAS TABLAS EN LA BASE DE DATOS
-- ============================================
SHOW TABLES;

-- 2. VERIFICAR ESTRUCTURA DE TABLA: users
-- ============================================
DESCRIBE users;
-- Columnas esperadas: id, name, email, password, planId, createdAt, updatedAt

-- 3. VERIFICAR ESTRUCTURA DE TABLA: plans
-- ============================================
DESCRIBE plans;
-- Columnas esperadas: id, name, price, features, etc.

-- 4. VERIFICAR ESTRUCTURA DE TABLA: admin_permissions
-- ============================================
DESCRIBE admin_permissions;
-- Columnas esperadas: id, user_id, is_super_admin, can_view_users, can_edit_users, 
-- can_delete_users, can_send_bulk_emails, can_view_revenue, can_manage_admins, can_view_analytics

-- 5. VERIFICAR SI EXISTE TABLA: payment_history
-- ============================================
SHOW TABLES LIKE 'payment_history';
-- Si no existe, necesitas ejecutar: create_payment_history_table.sql

-- 6. VERIFICAR ESTRUCTURA DE TABLA: payment_history (si existe)
-- ============================================
DESCRIBE payment_history;
-- Columnas esperadas: id, user_id, amount, status, created_at, etc.

-- 7. VERIFICAR SI EXISTE TABLA: bulk_emails
-- ============================================
SHOW TABLES LIKE 'bulk_emails';
-- Si no existe, necesitas ejecutar: create_bulk_emails_table.sql

-- 8. VERIFICAR ESTRUCTURA DE TABLA: bulk_emails (si existe)
-- ============================================
DESCRIBE bulk_emails;
-- Columnas esperadas: id, subject, message, sent_by, sent_at, recipient_count, etc.

-- 9. VERIFICAR ÍNDICES EN TABLA users
-- ============================================
SHOW INDEX FROM users;

-- 10. VERIFICAR ÍNDICES EN TABLA admin_permissions
-- ============================================
SHOW INDEX FROM admin_permissions;

-- ============================================
-- NOTAS:
-- - Ejecuta estos comandos uno por uno en TablePlus
-- - Si alguna tabla no existe, verás un error o resultado vacío
-- - Las tablas críticas son: users, plans, admin_permissions
-- - Las tablas opcionales son: payment_history, bulk_emails
-- ============================================
