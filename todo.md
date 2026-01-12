# EterBox - Security Vault TODO

## 🚨 URGENTE - Botón Admin Visible para No-Admin
- [x] Revisar endpoint admin.isAdmin - devuelve true incorrectamente (bug encontrado)
- [x] Corregir lógica de verificación de permisos (isAdmin y isSuperAdmin)
- [x] Verificar protección de ruta /admin (ya estaba correcta - redirige a 404)
- [x] Probar con usuario no-admin en local
- [x] Mejorar página 404 con tema y traducciones
- [ ] Deployment a Railway
- [ ] Verificar en producción

## ✅ COMPLETADO - Errores SQL en Producción
- [x] Corregir todas las queries SQL con created_at → createdAt
- [x] Corregir todas las queries SQL con updated_at → updatedAt  
- [x] Corregir todas las queries SQL con plan_id → planId
- [x] Corregir todas las queries SQL con subscription_end_date → subscriptionEndDate
- [x] Corregir acceso a result[0] en todas las queries de admin-service.ts
- [x] Verificar que botón "Administration" solo se muestra para admins (ya estaba correcto)
- [x] Guardar checkpoint con todas las correcciones (21dc5d17)
- [ ] Railway hará deployment automático desde GitHub
- [ ] Verificar que admin panel funciona correctamente en producción

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


## 🔄 Smart Routing en Splash Screen
- [x] Modificar SplashScreen para detectar estado de autenticación
- [x] Si usuario NO está logueado → redirigir a Home (/)
- [x] Si usuario SÍ está logueado → redirigir a Dashboard (/dashboard)
- [x] Integrar useAuth hook en App.tsx
- [x] Pasar isAuthenticated como prop a SplashScreen
- [x] Usar useLocation de wouter para redirección
- [ ] Probar flujo completo con y sin autenticación
- [ ] Deploy a producción


## 🚫 Eliminar OAuth de Manus
- [x] Buscar todas las referencias a OAuth en el código
- [x] Eliminar redirects al portal de Manus (portal.manus.im)
- [x] Actualizar useAuth hook para no usar OAuth
- [x] Actualizar const.ts: getLoginUrl() ahora retorna /login
- [x] Eliminar rutas /api/oauth/callback del servidor
- [x] Limpiar imports relacionados con OAuth en server/index.ts
- [x] Renombrar oauth.ts a oauth.ts.backup
- [x] Eliminar localStorage manus-runtime-user-info
- [ ] Reiniciar servidor y probar que la app funcione sin OAuth
- [ ] Deploy a producción


## 🐛 Fix Splash Screen Loop (CRITICAL)
- [x] Identificado: Splash screen en primera visita web causa loop infinito
- [x] Problema: useAuth() en App.tsx causaba redirect automático a /login
- [x] Desactivado temporalmente para debugging
- [x] Probado: sin splash funciona perfectamente
- [x] Solución: remover useAuth() de App.tsx (solo usar en rutas protegidas)
- [x] Splash screen desactivado temporalmente hasta implementar correctamente
- [x] Probar en dev server: funciona correctamente
- [ ] Deploy a producción


## 🎨 Home Page Redesign & Legal Compliance (Current Sprint)
- [x] Remove pricing section from home page
- [x] Expand platform information with more details about features and security
- [x] Add compelling CTAs (Call-to-Actions) with engaging phrases
- [x] Improve value proposition and messaging

## 💰 Pricing Plan Updates
- [x] Remove 2FA (Two-Factor Authentication) from Free plan features
- [x] Update plan features in database (drizzle schema)
- [x] Update Pricing page to reflect Free plan without 2FA

## 🔗 Footer Enhancements
- [x] Add footer navigation links (About, Contact, Support, Legal)
- [x] Create newsletter subscription form in footer
- [x] Integrate newsletter subscription with backend (save to database)
- [ ] Add social media links (optional)

## ⚖️ Legal Pages & Compliance (HIGH PRIORITY - Legal Protection)
- [x] Create Terms of Service page with comprehensive legal protection
- [x] Create Privacy Policy page (GDPR compliant)
- [x] Create Cookie Policy page
- [x] Add routes for legal pages in App.tsx
- [x] Link legal pages from footergal disclaimers and liability limitations are included
- [ ] Add data processing agreements
- [ ] Include user rights (access, deletion, portability)
- [ ] Add dispute resolution and governing law clauses


## 🍪 Cookie Consent Banner
- [x] Create cookie consent banner component
- [x] Implement localStorage to remember user choice
- [x] Add "Accept All", "Reject", and "Customize" options
- [x] Link to Cookie Policy from banner
- [x] Add banner to App.tsx (global)
- [x] Tested and working correctly


## 🌐 Language Consistency Fix (CRITICAL)
- [ ] Fix registration page showing Spanish when site is in English
- [ ] Fix login page showing Spanish when site is in English  
- [ ] Ensure all pages respect selected language (English/Spanish)
- [ ] Test language switching across all pages
- [ ] Verify dashboard maintains selected language


## 🌓 Dark Mode / Light Mode Toggle
- [ ] Set dark mode as default theme
- [ ] Implement theme toggle button in header
- [ ] Create dark mode color scheme
- [ ] Update all pages to support dark mode
- [ ] Save theme preference in localStorage
- [ ] Add smooth transition between themes


## 🌓 Dark Mode / Light Mode Toggle
- [x] Set dark mode as default theme
- [x] Implement theme toggle button in header
- [x] Create dark mode color scheme
- [x] Update all pages to support dark mode
- [x] Save theme preference in localStorage
- [x] Add smooth transition between themes
- [x] Dynamic logo switching based on theme
- [x] Update PWA icons with branded logo


## 📱 Mobile Menu Redesign (Drawer Style)
- [x] Create drawer-style mobile menu with slide-in animation
- [x] Add header with logo and EterBox name
- [x] Add close button (X) in top right
- [x] Group menu items in rounded card with dark background
- [x] Add theme toggle with iOS-style switch at bottom
- [x] Add primary action button (Contact/Sign Up) at bottom
- [x] Use brand colors (blue accent)
- [x] Add smooth transitions and animations
- [x] Add language selector in mobile menu


## 🐛 Bug Fixes (Current)
- [ ] Fix missing translation key "home.nav.home" in mobile menu
- [ ] Fix DialogContent accessibility error (missing DialogTitle)
- [ ] Add all missing translation keys for new features


## 🐛 Bug Fixes (Current)
- [x] Fix missing translation keys in mobile menu (home.nav.home, settings.theme, settings.language)
- [x] Fix Register/Login pages language consistency (convert hardcoded Spanish to use t() translation function)
- [x] Fix DialogContent accessibility error (verified all DialogContent have DialogTitle)


## 🔒 Security Audit (CRITICAL)
- [x] Review encryption implementation (AES-256-GCM) ✅ STRONG
- [x] Verify password hashing (bcrypt rounds) ✅ 12 rounds
- [x] Check JWT token security and expiration ✅ 7 days, now requires JWT_SECRET
- [x] Audit SQL injection protection ✅ Drizzle ORM (parameterized queries)
- [x] Verify XSS protection ✅ React auto-escaping, minimal dangerouslySetInnerHTML
- [ ] Check CSRF protection ⚠️ NOT IMPLEMENTED (csurf deprecated, need alternative)
- [x] Review rate limiting implementation ✅ IMPLEMENTED (general 100/15min, auth 5/15min)
- [x] Audit input validation and sanitization ✅ Zod validation on all endpoints
- [x] Check HTTP security headers (HSTS, CSP, X-Frame-Options, etc.) ✅ IMPLEMENTED (Helmet)
- [x] Review secret management and environment variables ✅ Now requires ENCRYPTION_KEY & JWT_SECRET
- [x] Verify WebAuthn implementation security ✅ Standard W3C implementation
- [x] Check 2FA implementation security ✅ TOTP with backup codes
- [x] Audit database access controls ✅ protectedProcedure middleware
- [ ] Review error handling (no sensitive data leaks) ⚙️ Needs review
- [x] Check for hardcoded secrets or credentials ✅ Only test secrets in test files
- [x] Verify HTTPS enforcement ✅ Redirect in production
- [x] Review CORS configuration ✅ IMPLEMENTED (whitelist origins)
- [ ] Audit session management ⚙️ JWT-based, no revocation yet
- [x] Check for dependency vulnerabilities ✅ FIXED (@trpc 11.8.1, express 5.2.1)
- [x] Create comprehensive security report ✅ SECURITY_AUDIT_REPORT.md


## 🔐 Security Improvements Phase 2 (Priority 2)
- [x] Implement CSRF protection with csrf-csrf package ✅
- [x] Create JWT session revocation system (active sessions table) ✅
- [x] Implement password strength validation with zxcvbn ✅
- [x] Add frontend password strength indicator ✅
- [ ] Create session management UI in settings ⚙️ TODO
- [ ] Add "Close all other sessions" feature
- [ ] Write tests for CSRF protection
- [ ] Write tests for session revocation
- [ ] Write tests for password strength validation


## 🔐 Security Phase 3 - Complete Implementation
- [ ] Create Sessions Management UI in Settings
- [ ] Add "Active Sessions" panel showing device, location, last activity
- [ ] Implement "Close this session" button
- [ ] Implement "Close all other sessions" button
- [ ] Integrate CSRF token in tRPC client
- [ ] Add CSRF validation middleware in tRPC server
- [ ] Create security events logging system
- [ ] Log failed login attempts
- [ ] Log password changes
- [ ] Log session revocations
- [ ] Send email notifications for security events

## 📄 Legal & Informational Pages
- [x] Create About Us page ✅
- [x] Create Privacy Policy page ✅
- [x] Create Cookie Policy page ✅
- [x] Create Security page ✅
- [x] Create Terms & Conditions page ✅ (already existed)
- [x] Create Refund Policy page ✅
- [x] Create detailed FAQ page ✅
- [x] Update footer with legal links ✅ (links in all pages)
- [x] Update navigation with info pages ✅ (routes added to App.tsx)


## 📧 Email Notifications System
- [x] Create email service with Resend/SMTP integration ✅
- [x] Design professional HTML email templates (security, marketing, updates) ✅
- [x] Create notification preferences in database (already exists: notification_preferences table) ✅
- [x] Implement security event emails (anomalous login, new device, password change, 2FA enabled) ✅
- [x] Implement marketing emails (promotions, updates, announcements) ✅
- [x] Build notification preferences UI in Settings page ✅
- [ ] Add unsubscribe functionality with one-click links ⚙️ TODO
- [ ] Integrate with auth events (login, register, password change) ⚙️ TODO
- [ ] Add email rate limiting (prevent spam) ⚙️ TODO
- [ ] Test email delivery and rendering across clients ⚙️ TODO


## 👑 Admin Panel (PRIORITY)
- [x] Update database schema with admin roles and permissions ✅
- [x] Create admin_permissions table ✅
- [x] Create analytics data aggregation service ✅
- [x] Create admin router with protected procedures (super admin only) ✅
- [x] Build analytics dashboard with charts (users growth, revenue, activity) ✅
- [x] Create user management UI (list, edit, delete, change plans) ✅
- [x] Build bulk email sender UI with templates ✅
- [x] Create revenue panel with financial metrics ✅
- [x] Implement payment reminder system (5 days before expiration) ✅
- [x] Create admin management UI (add/remove admins, set permissions) ✅
- [x] Add admin button in navbar (visible only for admins) ✅
- [x] Implement role-based access control middleware ✅
- [x] Create admin route guard ✅
- [x] Design admin panel with light/dark mode support ✅
- [x] Add analytics charts library (recharts) ✅


## 🐛 Critical Bug Fix
- [x] Fix "Database connection failed" error on login page ✅
- [x] Verify DATABASE_URL configuration ✅
- [x] Check db.ts connection handling ✅
- [x] Reset database and create fresh admin user ✅
- [x] Fix "Database connection failed" error on register page (same issue) ✅
- [x] Review auth router error handling ✅
- [x] Fix error messages to show actual errors instead of generic message ✅
- [x] Fix getDb() to properly initialize drizzle with mysql2 connection pool ✅


## 🐛 Rate Limiter Bug
- [x] Fix "Unexpected token 'T', Too many a... is not valid JSON" error ✅
- [x] Adjust rate limiter to be less aggressive during development ✅
- [x] Ensure rate limiter returns proper JSON responses ✅
- [x] Disable rate limiter completely in development mode ✅


## 🚨 CRITICAL: Database Connection Failed
- [x] Review server logs for exact error ✅ (Found express-rate-limit trust proxy issue)
- [x] Verify DATABASE_URL is set correctly ✅
- [x] Test direct database connection ✅
- [x] Fix getDb() initialization issue ✅
- [x] Ensure mysql2 pool is created properly ✅
- [x] Add Express 'trust proxy' setting for rate limiter ✅

- [x] Mejorar diseño del menú desplegable de escritorio para que sea igual al de móvil
- [x] Agregar botón de "Administración" que solo aparezca para admin@eterbox.com
- [x] Agregar logo en el menú desplegable
- [x] Fix ERR_ERL_PERMISSIVE_TRUST_PROXY error by configuring trust proxy correctly for Railway (trust proxy: 1)

- [x] Actualizar precio del Plan Basic de $9/mes a $12.99/mes
- [x] Eliminar mención de certificaciones (ISO, SOC2, GDPR) del Plan Enterprise
- [x] Verificar y completar traducciones de planes en inglés y español
- [x] Actualizar características de todos los planes según nueva especificación
- [x] Ocultar scrollbar del menú desplegable manteniendo funcionalidad

- [x] Reorganizar header del menú móvil: eliminar texto "EterBox" duplicado arriba y mover logo+texto del header inferior a la posición superior
- [x] Arreglar botón de Administration para que navegue correctamente a /admin


## 📧 Sistema de Correos Profesional con Hostinger Mail
- [x] Crear plantillas HTML profesionales para correos (bienvenida, compra, contacto, newsletter)
- [x] Crear servicio de plantillas de correo (EmailTemplateService)
- [x] Implementar correo de bienvenida al cliente cuando se registra
- [x] Enviar notificación a join@eterbox.com cuando alguien se registra
- [x] Implementar correo de confirmación de compra con invoice al cliente
- [x] Enviar notificación a sales@eterbox.com cuando alguien compra un plan
- [x] Crear router de contacto con endpoint submitContactForm
- [x] Implementar formulario de contacto que envíe a contact@eterbox.com
- [x] Crear endpoint subscribeNewsletter
- [x] Implementar newsletter subscription que envíe a contact@eterbox.com
- [ ] Configurar variables de entorno en Railway: ADMIN_JOIN_EMAIL, ADMIN_SALES_EMAIL, ADMIN_CONTACT_EMAIL
- [ ] Crear buzones en Hostinger Mail: noreply@eterbox.com, join@eterbox.com, sales@eterbox.com, contact@eterbox.com
- [ ] Configurar SMTP_USER=noreply@eterbox.com en Railway
- [ ] Probar todos los flujos de correo en producción


## 🎨 Mejoras de Menú y Planes

- [ ] Eliminar logo/candado del header del menú desplegable de PC
- [ ] Agregar botón X para cerrar el menú desplegable de PC
- [ ] Actualizar plan Corporate: agregar auditorías, backup automático, soporte 24/7
- [ ] Crear nuevo plan Enterprise: $99/mes ($90/año anual)
- [ ] Plan Enterprise: Multiusuario avanzado (hasta 20 miembros)
- [ ] Plan Enterprise: Auditorías completas y cumplimiento normativo
- [ ] Plan Enterprise: Soporte dedicado 24/7
- [ ] Corregir Dashboard: mostrar límites reales según plan (no infinito para Corporate)
- [ ] Actualizar base de datos: Corporate 1000 credenciales/100 carpetas
- [ ] Crear plan Enterprise en base de datos con límites correctos


## ✅ Mejoras UI/UX y Planes - Enero 11, 2026
- [x] Menú desplegable de PC: Logo eliminado del header, botón X agregado
- [x] Plan Corporate actualizado con nuevas características:
  - [x] Auditorías completas y cumplimiento normativo
  - [x] Backup automático
  - [x] Soporte dedicado 24/7
- [x] Plan Enterprise creado ($99/mes, $1080/año):
  - [x] Credenciales ilimitadas
  - [x] Carpetas ilimitadas
  - [x] Multiusuario avanzado (hasta 20 miembros)
  - [x] Todas las características del plan Corporate
  - [x] Integraciones personalizadas
  - [x] Gerente de cuenta dedicado
- [x] Página de Pricing actualizada con 4 planes (grid 2x2 en desktop)
- [x] Traducciones agregadas para nuevas características
- [x] Dashboard ya muestra correctamente límites (∞ para ilimitado)
- [x] Script SQL creado para actualizar producción (update-plans-production.sql)


## 🎨 Alineación de Botones en Pricing - Enero 11, 2026
- [x] Alinear todos los botones "Subscribe Now" y "Get Started" a la misma altura
- [x] Usar flex-grow para que las tarjetas tengan altura consistente
- [x] Asegurar que el botón esté siempre al final de cada tarjeta
- [x] Eliminar sección "Secure payment powered by PayPal" del footer de Pricing


## 🗄️ Migración de Base de Datos - Enero 11, 2026
- [x] Crear script de migración migrate-plans.mjs
- [x] Actualizar package.json con comando de migración
- [x] Crear MIGRATION-README.md con instrucciones
- [ ] Hacer deploy a Railway vía GitHub
- [ ] Ejecutar `pnpm migrate` en Railway
- [ ] Verificar que los planes se actualicen correctamente

## 🐛 Bug - Panel de Administración no muestra datos
- [x] Verificar permisos del usuario admin@eterbox.com en Railway
- [x] Actualizar todos los permisos a 1 (actualmente algunos están en 0)
- [x] Corregir conversión de tinyint a boolean en getAdminPermissions()
- [x] Deploy a producción (checkpoint e3e66180)
- [ ] Verificar en producción que el panel muestre usuarios y estadísticas correctamente

## 🔒 Seguridad - Proteger ruta /admin
- [x] Crear endpoint tRPC para verificar si el usuario es admin (ya existía)
- [x] Agregar verificación en la página AdminDashboard.tsx
- [x] Redirigir a 404 si el usuario no es admin
- [x] Probar localmente que funcione correctamente
- [x] Deploy a producción (commit afd51b6)
- [x] BUG: La redirección no funciona correctamente - se queda en "Cargando datos..."
- [x] Corregir: Mejorar lógica de redirección para manejar todos los casos (commit b8e4362)
- [ ] Verificar en producción que usuarios no-admin sean redirigidos a 404

## 🐛 Bug - Verificación de email impide login
- [ ] Investigar por qué aparece "Please verify your email before logging in"
- [ ] Verificar si los usuarios tienen emailVerified en false
- [ ] Marcar usuarios existentes como verificados en Railway
- [ ] Probar que el login funcione sin problemas
- [x] Ocultar botón "Admin" en el menú hamburguesa para usuarios no-admin (commit 5d015ef)

## 🚨 BUG CRÍTICO - getAdminPermissions devuelve null
- [ ] Error SQL en Railway: ER_BAD_FIELD_ERROR - columna desconocida
- [ ] getAdminPermissions() devuelve null en lugar de los permisos
- [ ] Revisar query SQL en admin-service.ts
- [ ] Corregir y hacer deployment urgente

## 🔧 Redirección /admin para usuarios sin login
- [x] Revisar ProtectedRoute - ahora redirige a /login si no hay sesión
- [x] Corregir import de useLocation en App.tsx
- [x] Flujo correcto: sin login → /admin → /login
- [ ] Deployment a Railway
- [ ] Verificar en producción

## 🎨 Mejorar página 404 para usuarios logueados
- [x] Detectar si usuario está autenticado en NotFound.tsx
- [x] Cambiar botón "Go Home" a "Go to Dashboard" si está logueado
- [x] Redirigir a /dashboard en lugar de /
- [x] Agregar traducción goDashboard
- [ ] Deployment a Railway

## 🎯 Mejoras UX Credenciales + Exportar/Importar
- [x] Mostrar campo "Notes" en la vista de credencial
- [x] Agregar botón copiar al lado de Username
- [x] Agregar botón copiar al lado de Email
- [x] Mejorar layout de credenciales con labels claros
- [x] Implementar exportar credenciales (JSON/CSV) - Solo Basic, Corporate, Enterprise
- [x] Crear ExportCredentialsModal con opciones JSON y CSV
- [x] Agregar botón de exportar en Dashboard (solo planes pagos)
- [x] Advertencia de seguridad en modal de exportación
- [x] Implementar importar credenciales
- [x] Crear ImportCredentialsModal con soporte JSON y CSV
- [x] Agregar botón de importar en Dashboard (solo planes pagos)
- [x] Mostrar resultados de importación (exitosos/fallidos)
- [x] Agregar badge "Para Pequeñas Empresas" en plan Corporate
- [x] Agregar badge "Para Grandes Empresas" en plan Enterprise
- [x] Mencionar exportar/importar en features de planes pagos
- [x] Agregar traducciones para badges y features
- [ ] Deployment a Railway

## 📱 Optimización Interfaz Móvil
- [x] Mejorar layout de tarjetas de estadísticas (Current Plan, Credentials Used, Folders Used)
- [x] Poner texto al lado del título en lugar de abajo para ahorrar espacio vertical
- [x] Optimizar tarjeta de credencial dentro de carpetas para móvil
- [x] Mejorar espaciado y organización en vista móvil
- [x] Reducir padding y usar truncate para textos largos
- [x] Mejorar tamaños de fuente para móvil
- [ ] Deployment a Railway

## 📱 Vista Colapsable y Header Carpetas Móvil
- [x] Reducir tamaño del nombre de carpeta en móvil (text-lg en móvil, text-2xl en desktop)
- [x] Apilar botones verticalmente (Add New Credential sobre Add Existing)
- [x] Reducir altura y ancho de botones en móvil (h-9 en móvil, h-10 en desktop)
- [x] Implementar estado colapsado/expandido para credenciales
- [x] Por defecto mostrar solo título/plataforma (colapsado)
- [x] Click para expandir y ver username, email, password, notas
- [x] Aplicar a credenciales en Dashboard
- [x] Aplicar a credenciales dentro de carpetas
- [x] Icono ChevronDown con rotación animada
- [x] Reducir tamaño de botones de acción (h-7 w-7)
- [ ] Deployment a Railway

## 🎨 Reorganización Tarjetas Estadísticas y Banner
- [x] Reorganizar tarjetas de estadísticas en una sola fila horizontal (grid-cols-3)
- [x] Cada tarjeta con título arriba y dato abajo (layout vertical flex-col)
- [x] Eliminar grid de 2 filas, usar una sola fila
- [x] Reducir padding (p-3 en móvil, p-4 en desktop)
- [x] Ajustar banner "Upgrade Your Plan" con texto más corto ("Get more credentials and folders")
- [x] Agregar padding a la derecha del texto para separar del botón (pr-4 md:pr-8)
- [x] Agregar gap-4 entre texto y botón
- [x] Botón con shrink-0 para evitar que se achique
- [x] Quitar decimales de precios ($319 en lugar de $319.2)
- [x] Usar Math.round() en lugar de toFixed(2) en Pricing.tsx
- [ ] Deployment a Railway

## 🔢 Eliminar Decimales de Precios Principales
- [x] Encontrar donde se muestran los precios principales ($139.08, $319.2)
- [x] Aplicar Math.round() al precio principal en Pricing.tsx
- [x] Verificar que funcione en planes mensuales y anuales
- [ ] Deployment a Railway
