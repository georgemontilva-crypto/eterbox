# Guía de Verificación de Base de Datos - EterBox Admin Panel

## 📋 Archivos Creados

1. **`verify_database_structure.sql`** - Verifica la estructura de las tablas
2. **`verify_database_data.sql`** - Verifica los datos en las tablas
3. **Scripts pendientes de ejecutar:**
   - `create_payment_history_table.sql` - Crear tabla de historial de pagos
   - `create_bulk_emails_table.sql` - Crear tabla de emails masivos
   - `optimize_database_indexes.sql` - Optimizar índices

## 🔧 Cómo Usar en TablePlus

### Paso 1: Conectar a la Base de Datos

1. Abre **TablePlus**
2. Conéctate a tu base de datos de Railway usando las credenciales de `DATABASE_URL`
3. Verifica que estés conectado a la base de datos correcta

### Paso 2: Verificar Estructura de Tablas

1. Abre el archivo **`verify_database_structure.sql`**
2. Ejecuta los comandos **uno por uno** o todos juntos
3. Revisa los resultados:

**Tablas que DEBEN existir:**
- ✅ `users` - Usuarios de la plataforma
- ✅ `plans` - Planes de suscripción
- ✅ `admin_permissions` - Permisos de administradores

**Tablas opcionales (pueden no existir):**
- ⚠️ `payment_history` - Historial de pagos (si no existe, ejecutar script de creación)
- ⚠️ `bulk_emails` - Emails masivos enviados (si no existe, ejecutar script de creación)

### Paso 3: Verificar Datos

1. Abre el archivo **`verify_database_data.sql`**
2. Ejecuta los comandos **uno por uno** para ver los datos
3. Revisa los resultados:

**Datos críticos para el panel de admin:**

| Query | Qué verifica | Resultado esperado |
|-------|--------------|-------------------|
| `SELECT COUNT(*) FROM users` | Total de usuarios | Debería ser > 0 (tienes 2 usuarios) |
| `SELECT * FROM users JOIN plans` | Usuarios con sus planes | Ver nombres, emails y planes |
| `SELECT * FROM admin_permissions` | Administradores | Ver quién tiene permisos de admin |
| `SELECT COUNT(*) FROM plans` | Planes disponibles | Debería ser 3 (Free, Premium, Enterprise) |

### Paso 4: Identificar Tablas Faltantes

Si ves errores como:
```
Table 'database.payment_history' doesn't exist
```

Entonces necesitas ejecutar los scripts de creación:

1. **Para payment_history:**
   - Abre `create_payment_history_table.sql`
   - Ejecuta el script completo
   - Verifica con: `SHOW TABLES LIKE 'payment_history';`

2. **Para bulk_emails:**
   - Abre `create_bulk_emails_table.sql`
   - Ejecuta el script completo
   - Verifica con: `SHOW TABLES LIKE 'bulk_emails';`

3. **Para optimizar índices:**
   - Abre `optimize_database_indexes.sql`
   - Ejecuta el script completo

## 🔍 Comandos Rápidos de Diagnóstico

### Ver todas las tablas
```sql
SHOW TABLES;
```

### Ver estructura de tabla users
```sql
DESCRIBE users;
```

### Ver todos los usuarios
```sql
SELECT id, name, email, planId, createdAt FROM users;
```

### Ver administradores
```sql
SELECT u.name, u.email, ap.is_super_admin 
FROM users u 
JOIN admin_permissions ap ON u.id = ap.user_id;
```

### Verificar si payment_history existe
```sql
SHOW TABLES LIKE 'payment_history';
```

### Resumen ejecutivo (todos los datos del panel)
```sql
SELECT 
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM users WHERE planId != 1) as suscripciones_activas,
  (SELECT COUNT(*) FROM users WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as nuevos_mes,
  (SELECT COUNT(*) FROM admin_permissions) as total_admins;
```

## 📊 Datos que Alimentan el Panel de Admin

### Tab "Resumen" (Overview)
- **Total Usuarios:** `SELECT COUNT(*) FROM users`
- **Ingresos Totales:** `SELECT SUM(amount) FROM payment_history WHERE status='completed'`
- **Suscripciones Activas:** `SELECT COUNT(*) FROM users WHERE planId != 1`
- **Nuevos Registros:** `SELECT COUNT(*) FROM users WHERE createdAt >= [período]`
- **Gráfica Registros Diarios:** `SELECT DATE(createdAt), COUNT(*) FROM users GROUP BY DATE(createdAt)`
- **Gráfica Usuarios por Plan:** `SELECT p.name, COUNT(u.id) FROM plans p LEFT JOIN users u ON p.id = u.planId GROUP BY p.id`

### Tab "Usuarios"
- **Lista de usuarios:** `SELECT u.*, p.name as plan_name FROM users u LEFT JOIN plans p ON u.planId = p.id`

### Tab "Ingresos"
- **Historial de transacciones:** `SELECT * FROM payment_history ORDER BY created_at DESC`
- **Gráfica de ingresos:** `SELECT DATE(created_at), SUM(amount) FROM payment_history GROUP BY DATE(created_at)`

### Tab "Emails Masivos"
- **Historial de emails:** `SELECT * FROM bulk_emails ORDER BY sent_at DESC`

### Tab "Administradores"
- **Lista de admins:** `SELECT u.*, ap.* FROM users u JOIN admin_permissions ap ON u.id = ap.user_id`

## ⚠️ Problemas Comunes

### Problema 1: "Table doesn't exist"
**Solución:** Ejecuta los scripts de creación de tablas correspondientes.

### Problema 2: No hay datos en users
**Solución:** Verifica que los usuarios se hayan registrado correctamente. Puedes insertar usuarios de prueba.

### Problema 3: No hay administradores
**Solución:** Ejecuta el script para crear un super admin:
```sql
INSERT INTO admin_permissions (user_id, is_super_admin, can_view_users, can_edit_users, can_delete_users, can_send_bulk_emails, can_view_revenue, can_manage_admins, can_view_analytics)
VALUES (1, 1, 1, 1, 1, 1, 1, 1, 1);
```
(Reemplaza `1` con el ID de tu usuario)

### Problema 4: payment_history vacía
**Solución:** Es normal si no has procesado pagos aún. El panel mostrará $0.00 en ingresos.

## 🎯 Checklist de Verificación

- [ ] Tabla `users` existe y tiene datos
- [ ] Tabla `plans` existe y tiene 3 planes
- [ ] Tabla `admin_permissions` existe y tiene al menos 1 admin
- [ ] Tabla `payment_history` existe (o ejecutar script de creación)
- [ ] Tabla `bulk_emails` existe (o ejecutar script de creación)
- [ ] Los usuarios tienen `name`, `email` y `planId` correctos
- [ ] Las fechas en `createdAt` están en formato correcto
- [ ] Hay al menos 1 super admin configurado

## 📞 Siguiente Paso

Después de verificar la base de datos, recarga el panel de administración en el navegador y verifica que los datos se muestren correctamente.
