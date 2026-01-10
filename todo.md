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
- [x] Desplegar fix


## 🔍 Auditoría de Menú Lateral (Mobile Menu)
- [ ] Dashboard - Verificar navegación
- [ ] Two-Factor Auth - Verificar setup y disable
- [ ] Change Password - Verificar funcionalidad (FIXED)
- [ ] View Plan - Verificar navegación a pricing
- [ ] Settings - Verificar submenú
- [ ] Language - Verificar cambio de idioma
- [ ] Password Generator - Verificar generación y copia
- [ ] Payment History - Verificar listado de pagos
- [ ] Logout - Verificar cierre de sesión


## 🔐 Mejoras de Seguridad 2FA
- [x] Crear popup de bienvenida después del registro (Welcome2FAModal)
- [x] Sugerir activación de 2FA en el popup
- [x] Agregar botón "Activar Ahora" y "Más Tarde"
- [x] Implementar verificación de 2FA en el login (twoFactor.verifyLogin)
- [x] Crear página/modal de verificación 2FA durante login (Verify2FALogin)
- [x] Validar token 2FA antes de permitir acceso
- [x] Agregar opción de usar backup codes en login
- [x] Probar flujo completo de registro → popup → activación 2FA
- [x] Probar flujo de login con 2FA activado
- [x] Checkpoint guardado (24d55016)
- [ ] Desplegar cambios a producción (Railway)


## 🔧 Correcciones de Navegación y Logout
- [x] Verificar que el botón de logout funcione correctamente
- [x] Cambiar redirección después del login: `/` → `/dashboard`
- [x] Cambiar redirección después del registro: `/login` → `/dashboard`
- [x] Cambiar redirección después del logout: implementado en useAuth (redirige a `/`)
- [x] Verificar que logout limpie el token correctamente (localStorage.removeItem)
- [x] Actualizar login biométrico para redirigir a dashboard
- [x] Actualizar registro biométrico para mostrar popup 2FA
- [x] Probar flujo completo de login → dashboard → logout → home
- [x] Verificar que el servidor funcione correctamente
- [x] Desplegar a producción (push a GitHub) - Commit 93681a8


## 🎨 Mejoras de UX y Diseño
- [x] Plan Corporativo debe mostrar "Ilimitado" en lugar de números (actualizado en DB y frontend)
- [ ] Verificar que multiidioma funcione en TODAS las páginas y componentes
- [ ] Asegurar que español cambie TODO a español
- [ ] Asegurar que inglés cambie TODO a inglés
- [ ] Unificar diseño visual de login, register, y todas las páginas de auth
- [ ] Mantener consistencia con el diseño del resto de la aplicación
- [x] Crear popup biométrico después del registro (BiometricSetupModal)
- [x] Popup debe ofrecer habilitar Face ID/huella
- [x] Usuario puede aceptar o rechazar la configuración biométrica
- [x] Agregar traducciones para el popup biométrico
- [x] Probar flujo completo de registro
- [x] Verificar que el servidor funcione correctamente
- [ ] Desplegar cambios a producción


## 🐛 Bug - Dashboard no muestra "Ilimitado"
- [x] Encontrar dónde el dashboard muestra 0/999999 (Dashboard.tsx líneas 355, 359)
- [x] Verificar lógica - ya muestra "∞" cuando el plan tiene -1
- [x] Aplicar en Credentials Used y Folders Used
- [x] Crear script update-corporate-unlimited.mjs para producción
- [x] Actualizar base de datos local a -1
- [ ] Ejecutar script en Railway para actualizar producción
- [ ] Verificar en eterbox.com que muestra "∞" en lugar de 999999


## 🔐 Autenticación Biométrica en Settings
- [x] Agregar opción "Biometric Authentication" en el menú hamburguesa (MobileMenu)
- [x] Crear vista que muestre estado actual (activado/desactivado)
- [x] Mostrar lista de beneficios de autenticación biométrica
- [x] Agregar botón para activar biométrico (abre modal de configuración)
- [x] Agregar botón para desactivar biométrico (con confirmación)
- [x] Integrar con endpoints tRPC: checkBiometricStatus y disableBiometric
- [x] Agregar traducciones completas en LanguageContext (EN/ES)
- [x] Mover hooks fuera de condiciones para evitar errores React
- [x] Probar flujo completo de activación desde Settings
- [x] Guardar checkpoint y desplegar a producción


## 🔧 Fix Corporate Plan - Mostrar "Unlimited" en lugar de 999999
- [x] Encontrar dónde se muestra 0/999999 en el dashboard
- [x] Actualizar lógica para mostrar "Unlimited" o "Ilimitado" cuando el límite es 999999 o -1
- [x] Agregar traducciones para "Unlimited" e "Ilimitado" (usa símbolo ∞)
- [x] Actualizar base de datos local: cambiar maxCredentials y maxFolders de 999999 a -1
- [x] Crear script para actualizar producción (update-corporate-unlimited-prod.mjs)
- [x] Probar en local
- [x] Deploy a producción


## 🎨 Agregar Favicon y Logo
- [x] Copiar logo PNG al directorio public/
- [x] Actualizar index.html para usar el nuevo favicon
- [x] Actualizar Header component para mostrar logo junto al texto "EterBox"
- [x] Actualizado en Home, Dashboard, Pricing, Register, Settings, Support
- [x] Probar en navegador
- [x] Guardar checkpoint y deploy


## 🔑 Agregar Login en el menú del Home y unificar estilos
- [x] Agregar botón "Login" en el header del Home (desktop y mobile)
- [x] Verificar que Login page tenga el mismo estilo visual que Register
- [x] Unificar diseño de ambas páginas (header, formulario, colores)
- [x] Agregar traducciones completas para Login
- [x] Probar navegación y estilos


## 🔧 Fix Autenticación Biométrica (Face ID/Huella)
- [x] Revisar implementación actual de WebAuthn en backend
- [x] Verificar configuración de RP ID y origin
- [x] Configurar variables de entorno WEBAUTHN_RP_ID y WEBAUTHN_ORIGIN
- [x] Revisar generación de challenges en registro y login
- [x] Verificar almacenamiento de credenciales en base de datos
- [x] Agregar logs detallados para debugging en Register y Dashboard
- [x] Mejorar manejo de errores con mensajes específicos
- [x] Agregar verificación de disponibilidad de autenticador de plataforma
- [x] Conectar evento de Settings con Dashboard para activar biométrico
- [x] Probar en HTTPS en producción (eterbox.com)
- [x] Probar flujo completo: registro → activación → login
- [x] Deploy y prueba en producción


## 🔧 Fix Sign In Button Navigation
- [x] Corregir botón "Login" en Home para redirigir a /login (antes iba a /)
- [x] Actualizado en desktop y mobile
- [x] Push a GitHub para deploy


## 💰 Actualizar Planes de Precios
- [x] Actualizar base de datos local:
  - Free: 10 credenciales, 2 carpetas
  - Basic: $15, 100 credenciales, 20 carpetas
  - Corporate: $25, 500 credenciales, 200 carpetas
- [x] Actualizar página de Pricing con nuevos límites
- [x] Actualizar descripciones de planes
- [x] Crear script para actualizar producción (update-plans-production.mjs)
- [x] Probar flujo de upgrade de planes
- [x] Deploy a producción


## 🎨 Actualizar Diseño de Verificación 2FA
- [x] Actualizar Verify2FALogin component con estilo de Login/Register
- [x] Cambiar fondo degradado por bg-background
- [x] Actualizar colores, bordes y espaciado (border-border, rounded-[15px])
- [x] Agregar logo en header
- [x] Configurar redirección a /dashboard después de verificación exitosa
- [x] Probar flujo completo de login con 2FA
- [x] Deploy


## 🔧 Fix Plan Limits Display en Dashboard
- [x] Investigar por qué muestra "0/∞" en lugar de límites reales
- [x] Verificar que getUserPlan devuelve maxKeys y maxFolders correctos
- [x] Base de datos actualizada con nuevos límites (Corporate: 500/200)
- [x] Servidor reiniciado para cargar nuevos valores
- [x] Dashboard ya muestra límites correctos automáticamente
- [x] Deploy


## 🔐 Implementar Login Biométrico Directo (Discoverable Credentials)
- [x] Actualizar registro biométrico para crear discoverable credentials (resident keys)
- [x] Cambiar residentKey: 'preferred' a 'required' y userVerification: 'required'
- [x] Agregar userID en opciones de registro
- [x] Crear endpoint generateUsernamelessAuthOptions (sin email)
- [x] Crear endpoint verifyUsernamelessAuth (identifica usuario por credential)
- [x] Actualizar Login page: botón biométrico sin requerir email
- [x] Implementar flujo: click → Face ID/huella → identificar usuario → dashboard
- [x] Agregar logs detallados para debugging
- [x] Compilación exitosa sin errores TypeScript
- [ ] Probar en dispositivo real con Face ID/Touch ID (requiere HTTPS)
- [x] Deploy


## 📱 Detección de Plataforma y Mejora de Errores Biométricos
- [x] Crear utilidad para detectar plataforma (iOS/Android/Desktop)
- [x] Funciones: detectPlatform(), getBiometricTypeName(), getBiometricDescription()
- [x] Actualizar Login: mostrar "Face ID" con icono en iOS
- [x] Actualizar Login: mostrar "Fingerprint" con icono en Android
- [x] Mejorar mensaje de error "Credential not found"
- [x] Agregar guía para re-registrar credenciales antiguas
- [x] Actualizar BiometricSetupModal con detección de plataforma
- [x] Actualizar MobileMenu Settings con detección de plataforma
- [x] Iconos y textos dinámicos según plataforma
- [ ] Probar en iOS y Android (requiere dispositivos reales)
- [x] Deploy


## 📱 Mejorar UX Móvil - Add Credential y Generador de Contraseñas
- [x] Arreglar modal Add Credential: permitir scroll cuando aparece teclado
- [x] Reducir altura de inputs y espaciado en móvil (space-y-3, py-2.5)
- [x] Hacer modal scrollable con max-height (85vh, overflow-y-auto)
- [x] Agregar text-base para evitar zoom automático en iOS
- [x] Crear componente PasswordGeneratorModal con UI moderna
- [x] Opciones: longitud (8-32), mayúsculas, minúsculas, números, símbolos
- [x] Botón "Copy" para copiar contraseña generada
- [x] Indicador de fortaleza de contraseña (Weak/Medium/Strong/Very Strong)
- [x] Generación segura con crypto.getRandomValues()
- [x] Agregar botón "Generate Password" debajo de "Create Folder" en Dashboard
- [x] Botón con icono de candado y texto "Generate Password"
- [x] Conectar botón con PasswordGeneratorModal
- [x] Optimizar espaciado y tamaños para móvil
- [x] Compilación exitosa sin errores TypeScript
- [x] Hot reload funciona correctamente
- [ ] Probar en dispositivo móvil real (requiere despliegue)
- [x] Deploy


## 🍔 Fix Hamburger Menu Toggle
- [x] Revisar MobileMenu component para arreglar toggle
- [x] Botón hamburguesa ya implementado con setOpen(true) y onOpenChange
- [x] Toggle funciona correctamente (abre con click, cierra con Sheet onOpenChange)
- [ ] Probar en móvil después de deploy

## 📱 Convertir a PWA (Progressive Web App)
- [x] Crear manifest.json con metadata de la app
- [x] Generar iconos PWA en múltiples tamaños (192x192, 512x512)
- [x] Configurar theme_color (#3b82f6), background_color (#000000), display: standalone
- [x] Agregar meta tags para iOS (apple-mobile-web-app)
- [x] Agregar shortcuts para Dashboard y Add Credential
- [ ] Implementar service worker para offline support
- [ ] Configurar caching strategy para assets estáticos
- [ ] Agregar botón "Add to Home Screen" prompt
- [ ] Probar instalación en iOS y Android
- [ ] Deploy

## ✅ PWA Implementation Completada (Checkpoint Actual)
- [x] Generados iconos PWA en múltiples tamaños (72, 96, 128, 144, 152, 192, 384, 512)
- [x] Generado icono maskable para Android
- [x] Generadas splash screens para iOS (8 tamaños diferentes)
- [x] Actualizado manifest.json con todos los iconos
- [x] Agregados meta tags de iOS splash screens en index.html
- [x] Creado componente SplashScreen con logo y nombre "EterBox"
- [x] Integrado SplashScreen en App.tsx (se muestra en primera visita y en modo PWA)
- [x] Implementado Service Worker con estrategia network-first
- [x] Registrado Service Worker en main.tsx
- [x] Configurado caching de assets estáticos
- [x] PWA lista para instalación en iOS y Android
