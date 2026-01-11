-- Script para crear super admin en Railway
-- Ejecutar en TablePlus después de crear la tabla admin_permissions

-- Paso 1: Obtener el ID del usuario admin@eterbox.com
-- (Reemplaza USER_ID con el ID real que obtengas de la query siguiente)

SELECT id, name, email FROM users WHERE email = 'admin@eterbox.com';

-- Paso 2: Insertar permisos de super admin
-- IMPORTANTE: Reemplaza el número 1 con el ID real del usuario admin@eterbox.com

INSERT INTO `admin_permissions` (
  `user_id`,
  `is_super_admin`,
  `can_view_users`,
  `can_edit_users`,
  `can_delete_users`,
  `can_send_bulk_emails`,
  `can_view_revenue`,
  `can_manage_admins`,
  `can_view_analytics`,
  `created_by`,
  `created_at`,
  `updated_at`
)
VALUES (
  1,  -- REEMPLAZAR CON EL ID REAL
  1,  -- is_super_admin
  1,  -- can_view_users
  1,  -- can_edit_users
  1,  -- can_delete_users
  1,  -- can_send_bulk_emails
  1,  -- can_view_revenue
  1,  -- can_manage_admins
  1,  -- can_view_analytics
  NULL,  -- created_by (NULL porque es el primer super admin)
  NOW(),
  NOW()
);

-- Paso 3: Verificar que se creó correctamente
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
  ap.can_view_analytics
FROM users u
INNER JOIN admin_permissions ap ON u.id = ap.user_id
WHERE u.email = 'admin@eterbox.com';
