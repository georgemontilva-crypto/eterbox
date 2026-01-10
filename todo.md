# EterBox - Security Vault TODO

## ✅ Completado

### Panel de Administración Básico
- [x] Crear router admin con protección de rol
- [x] Crear página Admin.tsx con UI completa
- [x] Estadísticas básicas (total usuarios, admins, planes)
- [x] Lista de usuarios con paginación
- [x] Búsqueda por nombre/email
- [x] Filtro por rol (user/admin)
- [x] Crear usuarios manualmente
- [x] Editar usuarios (nombre, email, rol, plan)
- [x] Eliminar usuarios con confirmación
- [x] Verificar emails de usuarios
- [x] Protecciones de seguridad (no auto-demotion/auto-delete)
- [x] Tests unitarios para admin router

### Autenticación y Seguridad Básica
- [x] Sistema de login con email/contraseña
- [x] Registro de usuarios
- [x] Verificación de email
- [x] Cambio de contraseña
- [x] Logout
- [x] Protección de rutas

### Correcciones de Bugs
- [x] Fix routing error (react-router-dom → wouter)
- [x] Implementar funcionalidad de cambio de contraseña

---

## 🚧 En Progreso

### Fase 1: Sistema RBAC y Audit Logs (Prioridad Alta)
- [ ] Diseñar esquema de base de datos para:
  - [ ] Tabla `roles` (id, name, description)
  - [ ] Tabla `permissions` (id, name, resource, action, description)
  - [ ] Tabla `role_permissions` (role_id, permission_id)
  - [ ] Tabla `user_permissions` (user_id, permission_id) - permisos individuales
  - [ ] Tabla `audit_logs` (id, user_id, action, resource, resource_id, ip, user_agent, data_before, data_after, timestamp, status)
  - [ ] Tabla `user_sessions` (id, user_id, ip, country, device, last_activity, created_at)

- [ ] Implementar sistema RBAC:
  - [ ] Crear roles predefinidos (SuperAdmin, Admin, Auditor, Soporte, Moderador)
  - [ ] Definir permisos granulares (users.view, users.create, users.edit, users.delete, etc.)
  - [ ] Middleware de verificación de permisos
  - [ ] Hook usePermissions() para frontend
  - [ ] Componente <Can permission="..."> para mostrar/ocultar UI

- [ ] Implementar Audit Logging:
  - [ ] Middleware para capturar IP y User-Agent
  - [ ] Función logAuditAction() reutilizable
  - [ ] Integrar en todas las mutaciones admin
  - [ ] Capturar datos antes/después del cambio
  - [ ] Página de visualización de logs en admin panel

---

## 📋 Backlog (Ordenado por Prioridad)

### Fase 2: Alertas y Reportes (Prioridad Alta)
- [ ] Sistema de alertas de seguridad:
  - [ ] Detectar intentos de login fallidos (3+ en 5 min)
  - [ ] Detectar acceso desde IP desconocida
  - [ ] Detectar acceso desde país inusual (GeoIP)
  - [ ] Tabla `security_alerts` en BD
  - [ ] Panel de alertas en admin dashboard
  - [ ] Notificaciones por email

- [ ] Sistema de reportes:
  - [ ] Reporte de usuarios (CSV, PDF, Excel)
  - [ ] Reporte de auditoría (CSV, PDF)
  - [ ] Reporte de seguridad (PDF)
  - [ ] Filtros avanzados (fecha, usuario, acción, IP)
  - [ ] Queue system con BullMQ para generación async
  - [ ] Almacenamiento de reportes en S3

### Fase 3: Configuración y Backups (Prioridad Media)
- [ ] Panel de configuración del sistema:
  - [ ] Políticas de contraseñas (longitud, complejidad, caducidad)
  - [ ] Configuración de sesiones (timeout)
  - [ ] Configuración de notificaciones (SMTP, plantillas)
  - [ ] Tabla `system_settings` en BD

- [ ] Sistema de backups:
  - [ ] Backups automáticos (diario, semanal, mensual)
  - [ ] Backup manual con botón
  - [ ] Lista de backups disponibles
  - [ ] Restauración con validación de integridad
  - [ ] Almacenamiento cifrado en S3
  - [ ] Pruebas de integridad automáticas

- [ ] Estados de cuenta de usuario:
  - [ ] Agregar campo `status` a tabla users (active, blocked, suspended, pending, deleted)
  - [ ] Botones para cambiar estado en admin panel
  - [ ] Validación en login según estado
  - [ ] Historial de cambios de estado

### Fase 4: Dashboard Avanzado y Multilingüe (Prioridad Media)
- [ ] Dashboard visual mejorado:
  - [ ] Gráficos con Recharts (usuarios por día, por plan, por país)
  - [ ] Mapa de calor de accesos por país
  - [ ] Timeline de eventos importantes
  - [ ] Indicadores de seguridad (credenciales caducadas, usuarios sin MFA)
  - [ ] Widget de alertas recientes

- [ ] Modo auditoría (read-only):
  - [ ] Rol "Auditor" con permisos solo de lectura
  - [ ] Vista especial sin botones de edición
  - [ ] Acceso a logs y reportes
  - [ ] No puede exportar datos sensibles

- [ ] Soporte multilingüe en admin panel:
  - [ ] Español (ES)
  - [ ] Inglés (EN)
  - [ ] Portugués (PT)
  - [ ] Selector de idioma
  - [ ] Traducir toda la UI del admin panel
  - [ ] Traducir emails de notificación

### Fase 5: Integraciones y Avanzado (Prioridad Baja)
- [ ] Integración con SIEM:
  - [ ] Webhook para enviar logs a sistemas externos
  - [ ] Formato JSON estándar
  - [ ] Configuración de endpoints en admin panel

- [ ] Proveedores de autenticación adicionales:
  - [ ] LDAP/Active Directory
  - [ ] SAML 2.0 (SSO empresarial)
  - [ ] Configuración desde admin panel

- [ ] Acciones masivas:
  - [ ] Selección múltiple de usuarios
  - [ ] Bloquear múltiples usuarios
  - [ ] Cambiar plan a múltiples usuarios
  - [ ] Exportar usuarios seleccionados
  - [ ] Enviar notificación masiva

- [ ] Historial detallado de usuario:
  - [ ] Tabla `user_history` en BD
  - [ ] Cambios de plan
  - [ ] Cambios de contraseña
  - [ ] Accesos desde diferentes IPs/países
  - [ ] Credenciales almacenadas (cantidad)
  - [ ] Vista de historial en admin panel

---

## 🐛 Bugs Conocidos

### Bugs en Producción
- [ ] Usuario admin no puede hacer login (pendiente crear en BD de producción)
  - Solución: Ejecutar script create-admin-production.mjs en Railway

---

## 📝 Notas Técnicas

### Stack Tecnológico para Nuevas Features
- **Charts**: Recharts
- **Tables**: TanStack Table (React Table v8)
- **Export**: jsPDF, xlsx, papaparse
- **Maps**: Leaflet
- **GeoIP**: geoip-lite
- **Queue**: BullMQ
- **Cache**: Redis (considerar agregar)

### Consideraciones de Seguridad
- Todos los logs deben ser inmutables (no se pueden editar/eliminar)
- Backups deben estar cifrados con AES-256-GCM
- Reportes con datos sensibles requieren confirmación adicional
- Rate limiting en endpoints de admin (max 100 req/min)
- Validar permisos en backend, no solo frontend

### Cumplimiento Normativo
- GDPR: Derecho al olvido (soft delete), exportación de datos
- SOC 2: Audit logs completos, backups, controles de acceso
- ISO 27001: Políticas de contraseñas, rotación de llaves, MFA

---

## 🎯 Métricas de Éxito

- ✅ 100% de acciones administrativas loggeadas
- ✅ Tiempo de respuesta < 2s en dashboard
- ✅ Reportes generados en < 10s
- ✅ Backups completados en < 5 minutos
- ✅ 0 accesos no autorizados


## 🐛 Bug Urgente - Cambio de contraseña no funciona en producción
- [x] Verificar que Railway hizo el deployment del último commit
- [x] Verificar logs de Railway para errores
- [x] Probar endpoint changePassword localmente
- [x] Verificar que el endpoint existe en producción
- [x] Página /change-password funciona correctamente
- [x] Menú lateral del Dashboard no navega a /change-password
- [x] Agregar onClick al menú item "Change Password" en MobileMenu
- [x] Agregar validación y manejo de errores
- [x] Agregar mutation de changePassword
- [ ] Desplegar fix
