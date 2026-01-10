# Panel de Administración Empresarial - EterBox

## Documento de Requerimientos Funcionales

### Versión: 2.0 Enterprise
### Fecha: Enero 2025

---

## 🔐 1. Seguridad y Control de Acceso

### 1.1 Autenticación Multifactor (MFA)
- [ ] MFA obligatorio para todos los administradores
- [ ] Soporte para TOTP (Google Authenticator, Authy)
- [ ] Códigos de respaldo para recuperación
- [ ] Opción de WebAuthn (Face ID, Touch ID, YubiKey)
- [ ] Verificación por SMS (opcional)

### 1.2 Roles y Permisos Granulares
- [ ] **SuperAdmin**: Acceso total al sistema
- [ ] **Admin**: Gestión de usuarios y configuración básica
- [ ] **Auditor**: Solo lectura, acceso a logs y reportes
- [ ] **Soporte**: Gestión limitada de usuarios (sin eliminar)
- [ ] **Moderador**: Revisión de actividad sospechosa

### 1.3 Permisos Específicos
- [ ] `users.view` - Ver lista de usuarios
- [ ] `users.create` - Crear usuarios
- [ ] `users.edit` - Editar usuarios
- [ ] `users.delete` - Eliminar usuarios
- [ ] `users.block` - Bloquear/desbloquear usuarios
- [ ] `logs.view` - Ver logs de auditoría
- [ ] `logs.export` - Exportar logs
- [ ] `settings.view` - Ver configuración
- [ ] `settings.edit` - Modificar configuración
- [ ] `backup.create` - Crear backups
- [ ] `backup.restore` - Restaurar backups
- [ ] `reports.generate` - Generar reportes
- [ ] `alerts.manage` - Gestionar alertas

### 1.4 Registro de Actividad (Audit Logs)
- [ ] Log de cada acción administrativa
- [ ] Información capturada:
  - Usuario que ejecuta la acción
  - Tipo de acción (CREATE, UPDATE, DELETE, VIEW)
  - Recurso afectado (usuario, configuración, etc.)
  - Timestamp con zona horaria
  - IP de origen
  - User-Agent (navegador/dispositivo)
  - Datos antes y después del cambio (para auditoría)
  - Resultado de la acción (éxito/fallo)

### 1.5 Alertas en Tiempo Real
- [ ] Intentos de login fallidos (3+ en 5 minutos)
- [ ] Acceso desde IP desconocida
- [ ] Acceso desde país inusual
- [ ] Cambios en configuración crítica
- [ ] Eliminación masiva de usuarios
- [ ] Exportación de datos sensibles
- [ ] Notificaciones por:
  - Email
  - Dashboard (badge de notificaciones)
  - Webhook (integración con Slack/Discord)

---

## 📊 2. Gestión de Usuarios

### 2.1 CRUD Completo
- [x] Crear usuarios manualmente
- [x] Editar información de usuarios
- [x] Eliminar usuarios (con confirmación)
- [x] Asignar planes
- [x] Cambiar roles
- [ ] Asignar permisos individuales
- [ ] Gestión por grupos

### 2.2 Estados de Cuenta
- [ ] **Active**: Usuario activo normal
- [ ] **Blocked**: Bloqueado por admin (no puede iniciar sesión)
- [ ] **Suspended**: Suspendido temporalmente (por actividad sospechosa)
- [ ] **Pending**: Pendiente de verificación de email
- [ ] **Deleted**: Marcado para eliminación (soft delete)

### 2.3 Historial de Usuario
- [ ] Fecha de registro
- [ ] Último acceso (fecha, hora, IP, dispositivo)
- [ ] Historial de cambios de plan
- [ ] Historial de cambios de contraseña
- [ ] Credenciales almacenadas (cantidad, sin ver contenido)
- [ ] Carpetas creadas
- [ ] Pagos realizados
- [ ] Accesos desde diferentes IPs/países

### 2.4 Acciones Masivas
- [ ] Bloquear múltiples usuarios
- [ ] Cambiar plan a múltiples usuarios
- [ ] Exportar lista de usuarios seleccionados
- [ ] Enviar notificación a múltiples usuarios

---

## 🔎 3. Auditoría y Monitoreo

### 3.1 Panel de Métricas
- [ ] Total de usuarios (activos, bloqueados, pendientes)
- [ ] Nuevos registros (hoy, esta semana, este mes)
- [ ] Usuarios por plan (Free, Basic, Corporate)
- [ ] Accesos recientes (últimas 24h, 7 días, 30 días)
- [ ] Credenciales almacenadas (total en el sistema)
- [ ] Carpetas creadas (total)
- [ ] Intentos de login fallidos
- [ ] Países de origen de usuarios
- [ ] Dispositivos más usados

### 3.2 Gráficos y Visualizaciones
- [ ] Gráfico de línea: Nuevos usuarios por día/semana/mes
- [ ] Gráfico de barras: Usuarios por plan
- [ ] Gráfico de pastel: Distribución de roles
- [ ] Mapa de calor: Accesos por país
- [ ] Timeline: Actividad reciente

### 3.3 Reportes Exportables
- [ ] **Reporte de Usuarios**
  - Formato: CSV, PDF, Excel
  - Filtros: Fecha, plan, rol, estado
  - Contenido: Nombre, email, plan, fecha registro, último acceso
  
- [ ] **Reporte de Auditoría**
  - Formato: CSV, PDF
  - Filtros: Usuario, acción, fecha, IP
  - Contenido: Timestamp, usuario, acción, recurso, IP, resultado

- [ ] **Reporte de Seguridad**
  - Formato: PDF
  - Contenido: Intentos fallidos, accesos sospechosos, alertas generadas
  
- [ ] **Reporte de Cumplimiento (Compliance)**
  - Formato: PDF
  - Contenido: Políticas aplicadas, auditorías realizadas, cambios críticos

### 3.4 Filtros Avanzados
- [ ] Búsqueda por usuario (nombre, email)
- [ ] Filtro por fecha (rango personalizado)
- [ ] Filtro por IP o rango de IPs
- [ ] Filtro por acción (CREATE, UPDATE, DELETE, VIEW)
- [ ] Filtro por recurso (users, settings, credentials)
- [ ] Filtro por resultado (éxito, fallo)
- [ ] Combinación de múltiples filtros

### 3.5 Integración con SIEM
- [ ] Webhook para enviar logs a sistemas externos
- [ ] Formato estándar: JSON, Syslog
- [ ] Integración con:
  - Splunk
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Datadog
  - Sumo Logic

---

## ⚙️ 4. Configuración del Sistema

### 4.1 Políticas de Contraseñas
- [ ] Longitud mínima (configurable: 8-32 caracteres)
- [ ] Requerir mayúsculas
- [ ] Requerir minúsculas
- [ ] Requerir números
- [ ] Requerir caracteres especiales
- [ ] Caducidad de contraseña (30, 60, 90 días, nunca)
- [ ] Historial de contraseñas (no reutilizar últimas N contraseñas)
- [ ] Bloqueo después de N intentos fallidos

### 4.2 Proveedores de Autenticación
- [ ] Email/Password (nativo)
- [ ] Google OAuth
- [ ] Apple OAuth
- [ ] Microsoft OAuth
- [ ] LDAP/Active Directory
- [ ] SAML 2.0 (SSO empresarial)
- [ ] Configuración de cada proveedor desde el panel

### 4.3 Cifrado y Seguridad
- [ ] Algoritmo de cifrado (AES-256-GCM actual)
- [ ] Rotación de llaves de cifrado
- [ ] Frecuencia de rotación (manual, automática cada N días)
- [ ] Backup de llaves anteriores
- [ ] Configuración de sesiones (timeout, renovación)

### 4.4 Notificaciones
- [ ] Configuración de email (SMTP)
- [ ] Plantillas de email personalizables
- [ ] SMS (integración con Twilio)
- [ ] Push notifications (web push)
- [ ] Webhooks personalizados
- [ ] Frecuencia de notificaciones (inmediata, diaria, semanal)

---

## 🛡️ 5. Resguardo y Recuperación

### 5.1 Backups Automáticos
- [ ] Backup diario automático (configurable)
- [ ] Backup semanal
- [ ] Backup mensual
- [ ] Retención: últimos 7 diarios, 4 semanales, 12 mensuales
- [ ] Cifrado de backups
- [ ] Almacenamiento en S3 o compatible

### 5.2 Backups Manuales
- [ ] Botón "Crear Backup Ahora"
- [ ] Descripción personalizada del backup
- [ ] Lista de backups disponibles
- [ ] Tamaño de cada backup
- [ ] Fecha y hora de creación

### 5.3 Restauración
- [ ] Seleccionar backup de la lista
- [ ] Vista previa de contenido (metadatos)
- [ ] Confirmación con contraseña del admin
- [ ] Proceso de restauración con barra de progreso
- [ ] Validación de integridad antes de restaurar
- [ ] Opción de restauración parcial (solo usuarios, solo configuración)

### 5.4 Pruebas de Integridad
- [ ] Verificación automática de backups
- [ ] Checksum/hash de cada backup
- [ ] Alerta si un backup está corrupto
- [ ] Prueba de restauración en entorno de prueba

---

## 🎯 6. Extras Recomendados

### 6.1 Modo Auditoría (Read-Only)
- [ ] Rol especial "Auditor"
- [ ] Solo puede ver, no modificar
- [ ] Acceso a:
  - Lista de usuarios (sin editar)
  - Logs completos
  - Reportes
  - Métricas y dashboard
- [ ] No puede:
  - Crear/editar/eliminar usuarios
  - Cambiar configuración
  - Crear backups
  - Exportar datos sensibles (solo reportes)

### 6.2 Dashboard Visual
- [ ] Indicadores de seguridad:
  - 🔴 Credenciales caducadas
  - 🟡 Usuarios sin MFA
  - 🟢 Sistema saludable
- [ ] Mapa mundial con accesos
- [ ] Países inusuales resaltados
- [ ] Timeline de eventos importantes
- [ ] Widget de alertas recientes

### 6.3 Soporte Multilingüe
- [ ] Español (ES)
- [ ] Inglés (EN)
- [ ] Portugués (PT)
- [ ] Francés (FR)
- [ ] Selector de idioma en el panel
- [ ] Traducciones de:
  - Interfaz completa
  - Emails de notificación
  - Reportes PDF
  - Logs (mantener inglés técnico)

---

## 📋 Priorización de Implementación

### Fase 1 (Crítico) - 2 semanas
1. Sistema de roles y permisos (RBAC)
2. Audit logs básico
3. Estados de cuenta de usuario
4. Dashboard con métricas básicas

### Fase 2 (Alto) - 2 semanas
5. Alertas de seguridad
6. Reportes exportables (CSV/PDF)
7. Filtros avanzados
8. Historial de usuario

### Fase 3 (Medio) - 2 semanas
9. Configuración de políticas de contraseñas
10. Backups automáticos y manuales
11. Modo auditoría (read-only)
12. Soporte multilingüe en admin panel

### Fase 4 (Bajo) - 2 semanas
13. Integración con SIEM
14. Proveedores de autenticación adicionales
15. Dashboard visual avanzado
16. Acciones masivas

---

## 🔧 Stack Tecnológico Recomendado

### Backend
- **Base de datos**: MySQL (actual) + Redis (cache de sesiones)
- **Audit Logs**: Tabla dedicada con índices optimizados
- **Queue System**: BullMQ para procesamiento de reportes
- **File Storage**: S3 para backups y reportes generados

### Frontend
- **Charts**: Recharts o Chart.js
- **Tables**: TanStack Table (React Table v8)
- **Export**: jsPDF, xlsx, papaparse
- **Maps**: Leaflet o Google Maps API
- **Notifications**: Sonner (ya implementado)

### Seguridad
- **Rate Limiting**: Express Rate Limit
- **IP Tracking**: express-ip
- **GeoIP**: geoip-lite
- **Encryption**: crypto (Node.js nativo)

---

## 📊 Métricas de Éxito

- ✅ 100% de acciones administrativas loggeadas
- ✅ Tiempo de respuesta < 2s en dashboard
- ✅ Reportes generados en < 10s
- ✅ Backups completados en < 5 minutos
- ✅ 0 accesos no autorizados
- ✅ Cumplimiento con GDPR, SOC 2, ISO 27001

---

## 🚀 Próximos Pasos

1. Revisar y aprobar este documento
2. Crear esquema de base de datos para nuevas tablas
3. Implementar Fase 1 (sistema RBAC y audit logs)
4. Iterar con feedback del equipo
