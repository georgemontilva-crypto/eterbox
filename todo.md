# EterBox - Security Vault TODO

## Fase 1: Base de Datos y Esquema
- [x] Crear tablas de usuarios con campos de 2FA
- [x] Crear tabla de planes (Free, Básico, Corporativo)
- [x] Crear tabla de suscripciones de usuarios
- [x] Crear tabla de carpetas
- [x] Crear tabla de claves/credenciales con encriptación
- [x] Crear tabla de intentos de login fallidos
- [x] Crear tabla de logs de actividad
- [x] Crear tabla de notificaciones por correo

## Fase 2: Autenticación 2FA
- [x] Implementar generación de códigos TOTP
- [x] Crear endpoint para verificar 2FA
- [x] Implementar backup codes
- [x] Crear UI para setup de 2FA
- [ ] Implementar verificación de 2FA en login
- [x] Crear tests para autenticación 2FA

## Fase 3: Integración PayPal
- [x] Configurar claves de PayPal
- [x] Crear utilidades de PayPal
- [x] Implementar checkout de PayPal
- [ ] Crear webhooks para eventos de PayPal
- [x] Implementar actualización de planes en base de datos
- [x] Crear tests para pagos

## Fase 4: Gestión de Carpetas y Claves
- [x] Implementar encriptación de contraseñas (AES-256)
- [x] Crear procedimiento para guardar claves encriptadas
- [x] Crear procedimiento para recuperar claves desencriptadas
- [x] Implementar límites de claves por plan
- [x] Implementar límites de carpetas por plan
- [x] Crear validaciones de límites
- [ ] Crear tests para encriptación

## Fase 5: Dashboard Principal
- [x] Crear layout del dashboard
- [x] Mostrar información del usuario
- [x] Mostrar plan actual y límites
- [x] Mostrar resumen de carpetas
- [x] Mostrar resumen de claves
- [x] Crear botones de acción (crear carpeta, crear clave)
- [ ] Implementar estadísticas de uso

## Fase 6: Búsqueda y Filtrado
- [x] Implementar búsqueda por plataforma
- [x] Implementar filtrado por carpeta
- [x] Implementar búsqueda por usuario
- [x] Implementar búsqueda por correo
- [x] Crear UI para búsqueda y filtros
- [x] Optimizar queries de búsqueda

## Fase 7: Sistema de Soporte
- [x] Crear tabla para tickets de soporte
- [x] Implementar formulario de contacto
- [x] Configurar envío de correos a support@eterbox.com
- [x] Crear confirmación de recepción al usuario
- [ ] Implementar respuestas automáticas

## Fase 8: Notificaciones por Correo
- [x] Implementar notificaciones de login sospechoso
- [x] Implementar alertas de intentos fallidos
- [x] Implementar notificaciones de cambio de contraseña
- [x] Implementar recordatorios de renovación de plan
- [x] Crear templates de correos
- [ ] Implementar cola de envío de correos

## Fase 9: Multilenguaje
- [x] Configurar i18n (inglés/español)
- [x] Traducir todas las cadenas de texto
- [x] Crear selector de idioma
- [x] Guardar preferencia de idioma del usuario
- [ ] Traducir correos

## Fase 10: Diseño UI
- [x] Implementar diseño estilo Apple
- [x] Usar colores negro y gris oscuro
- [x] Implementar bordes azul neón
- [x] Usar tipografía Montserrat
- [x] Aplicar bordes redondeados de 15px
- [x] Hacer diseño completamente responsive
- [x] Evitar desbordamiento horizontal
- [x] Crear componentes reutilizables

## Fase 11: Seguridad y Testing
- [ ] Implementar rate limiting en login
- [ ] Implementar CSRF protection
- [ ] Crear tests de seguridad
- [ ] Crear tests de integración
- [ ] Crear tests de UI
- [ ] Validar encriptación de datos

## Fase 12: Despliegue
- [ ] Preparar documentación de despliegue
- [ ] Configurar variables de entorno
- [ ] Crear guía de instalación en Hostinger
- [ ] Realizar pruebas finales


## Bugs Encontrados y Fixes
- [x] Error NOT_FOUND en dashboard - planes no inicializados en BD
- [x] Necesario script de seeding para planes iniciales
- [x] Errores de tipos de TypeScript en componentes
- [x] Estructura de datos de credenciales y planes


## Implementación UI Interactiva
- [x] Modal para crear credenciales
- [x] Modal para crear carpetas
- [x] Página de gestión de planes con cambio de plan
- [x] Integración PayPal en UI
- [x] CRUD completo de credenciales
- [x] CRUD completo de carpetas
- [x] Mostrar/ocultar contraseñas
- [x] Copiar contraseñas al portapapeles
- [ ] Búsqueda y filtrado


## Bugs Críticos a Resolver
- [ ] Error de React: setLocation() durante render en Home.tsx
- [ ] Error NOT_FOUND: credentials.create mutation no encontrada


## Bugs Nuevos Reportados
- [x] Modal de crear credenciales no muestra selector de carpetas
- [x] Dashboard no muestra lista de carpetas creadas
- [x] Botón de mostrar contraseña (ojito) no desencripta y muestra la contraseña


## Nuevas Funcionalidades Solicitadas
- [x] Popup de límite de carpetas alcanzado con botón para ir a planes
- [x] Guardar credenciales en carpetas seleccionadas correctamente


#### Nuevas Solicitudes del Usuario
- [x] Agregar botón "Add Credential" en cada carpeta para crear credenciales directamente
- [x] Agregar opción de mover credencial existente a una carpeta
- [x] Agregar barra de búsqueda para filtrar carpetas y credenciales

- [x] Mejorar búsqueda para mostrar resultados en tiempo real
- [x] Agregar botón para expandir/contraer carpetas y ocultar credenciales

- [x] Mostrar resultados de búsqueda combinados (carpetas + credenciales)
- [x] Agregar animación de loading mientras se busca
- [x] Incluir platformName en búsqueda de credenciales


## Bugs Reportados - Búsqueda
- [x] Contador de items incorrecto en resultados de búsqueda
- [x] Carpeta no se expande al hacer clic en resultado de búsqueda


## Vista Detallada de Carpeta
- [x] Vista expandida de carpeta al hacer clic en resultado de búsqueda
- [x] Botón para volver al dashboard
- [x] Botón para añadir nuevas credenciales a la carpeta
- [x] Lista completa de credenciales de la carpeta
- [x] Opción de añadir credenciales existentes a la carpeta
- [x] Filtro interno por título de credencial dentro de cada carpeta


## Bugs - Eliminación de Carpetas
- [x] Eliminar carpeta no debe eliminar credenciales automáticamente
- [x] Contador de credenciales no se actualiza después de eliminar
- [x] Agregar popup de confirmación con opciones: eliminar solo carpeta o carpeta + credenciales
- [x] Si se elimina solo carpeta, mover credenciales a "Your Credentials" (sin carpeta)


## Bug - Contador de Carpetas
- [x] El contador foldersUsed no se decrementa al eliminar una carpeta
- [x] Corregir lógica para actualizar contador al crear/eliminar carpetas


## Menú Móvil Hamburguesa
- [x] Crear menú hamburguesa para vista móvil
- [x] Despliegue desde izquierda a derecha
- [x] Opciones: activar 2FA, cambiar contraseña, cerrar sesión, ver plan, settings


## Mejoras Menú Móvil
- [x] Logo a la derecha en vista móvil
- [x] Opciones se abren en pantalla completa
- [x] Header con menú persistente para seguir navegando


## Unificar Menú PC y Móvil
- [x] Hacer que el menú en PC sea igual que en móvil (hamburguesa)
- [x] Opciones se despliegan en pantalla completa en ambos dispositivos


## Bug - Accesibilidad
- [x] Agregar DialogTitle oculto al SheetContent para accesibilidad


## Funcionalidades Pendientes
- [x] Integración PayPal checkout funcional (botones Upgrade Plan)
- [x] Funcionalidad real de 2FA con códigos QR y validación TOTP
- [x] Sistema multilenguaje (EN/ES) con selector de idioma


## Funcionalidades Completadas en Esta Sesión
- [x] Contexto de idioma (LanguageContext) con traducciones EN/ES
- [x] Selector de idioma en el menú hamburguesa
- [x] UI de 2FA con generación de QR, verificación TOTP y códigos de respaldo
- [x] Integración PayPal con creación de órdenes y captura de pagos
- [x] Página de precios actualizada con flujo de pago PayPal
- [x] Tests unitarios para 2FA y traducciones


## Bug - Desbordamiento 2FA
- [x] Corregir desbordamiento del código de entrada manual en la vista de 2FA


## Nuevas Funcionalidades Solicitadas - Enero 2025
- [x] Corregir traducciones instantáneas en página principal (Home.tsx)
- [x] Agregar opción de pago anual en planes (Basic: $160/año, Corporate: $280/año)
- [x] Mostrar porcentaje de descuento en planes anuales
- [x] Actualizar límites plan Corporate (2500 claves, 1500 carpetas)
- [x] Implementar generador de claves seguras
- [x] Límites de generación: Free=10, Basic=300, Corporate=ilimitado
- [x] Opción de agregar clave generada como credencial
- [x] Anuncio de renovación próxima en dashboard
- [x] Checkout de PayPal integrado con estética de la web
- [x] Opción de pagar con tarjeta mediante PayPal


## Bug - Error require is not defined
- [x] Corregir error "require is not defined" en el dashboard (problema de CommonJS en navegador)


## Mejora - Crear credencial desde generador
- [x] Agregar botón para crear credencial con la contraseña generada
- [x] Abrir formulario con la contraseña pre-llenada


## Bug - Checkout PayPal duplicado y cargando infinito
- [x] Eliminar botón duplicado de tarjeta de débito/crédito
- [x] Corregir el cargando infinito al hacer click en pagar con tarjeta


## Bug - PayPal Client ID no configurado en frontend
- [x] Verificar y corregir la variable VITE_PAYPAL_CLIENT_ID


## Bug - Problemas en checkout de PayPal
- [x] Corregir scroll del modal de tarjeta para poder ver todos los campos
- [x] Corregir monto cero en el cobro de PayPal (precios actualizados en DB)
- [x] Crear pantalla de gracias con detalles del plan adquirido


## Nuevas Funcionalidades - Historial y Emails
- [x] Verificar modo de PayPal (live vs sandbox) - Está en modo LIVE
- [x] Crear tabla de historial de pagos en base de datos
- [x] Implementar endpoints para historial de pagos
- [x] Enviar email de confirmación cuando el cliente se une a un plan
- [x] Crear UI de historial de pagos en el dashboard (menú hamburguesa)


## Verificación 2FA en Login
- [x] Analizar flujo de autenticación actual (OAuth)
- [x] Implementar verificación 2FA en el backend después del login
- [x] Crear UI de verificación 2FA (pantalla de código TOTP)
- [x] Permitir usar códigos de respaldo si no tiene acceso al autenticador
- [x] Crear tests para la verificación 2FA en login


## Preparación para Despliegue en Hostinger
- [x] Crear archivo de configuración para Hostinger
- [x] Documentar variables de entorno necesarias
- [x] Crear guía paso a paso de despliegue


## Corrección para Hostinger
- [x] Verificar y corregir script start en package.json
- [x] Asegurar compatibilidad con despliegue en Hostinger
- [x] Agregar script especial 'hostinger' que combina install + build + start


## Corrección para limitación de Hostinger (Build Command único)
- [x] Modificar package.json para que el comando build también inicie el servidor
- [x] Crear script de inicio automático post-build (start-server.sh)
- [x] Actualizar documentación HOSTINGER_DEPLOYMENT.md con la nueva solución


## Corrección de error de build en Hostinger
- [ ] Revertir cambios en package.json que causan error durante build
- [ ] Investigar método correcto para que Hostinger ejecute start después de build
- [ ] Aplicar solución compatible con infraestructura de Hostinger
- [ ] Actualizar documentación con método correcto


## Reestructuración para compatibilidad con Hostinger Node.js Apps
- [x] Modificar servidor para usar solo Express.js (sin Vite dev server) - Ya estaba configurado correctamente
- [x] Configurar Express para servir archivos estáticos del build de Vite - Ya estaba configurado correctamente
- [x] Actualizar package.json con scripts correctos para Hostinger
- [x] Crear documento de instrucciones para otra IA (INSTRUCCIONES_PARA_IA.md)
- [x] Analizar el problema de Hostinger Node.js Apps


## Reestructuración completa para Hostinger (Opción 2)
- [x] Crear nuevo entry point server.js en la raíz
- [x] Simplificar servidor Express para solo servir estáticos y API (ya estaba correcto)
- [x] Modificar package.json con scripts optimizados para Hostinger
- [x] Configurar PORT dinámico para Hostinger (ya estaba implementado)
- [x] Probar build completo localmente - ✅ Exitoso
- [x] Crear guía de despliegue actualizada (GUIA_DESPLIEGUE_HOSTINGER_FINAL.md)


## Solución error EACCES de esbuild en Hostinger
- [x] Cambiar de esbuild CLI a esbuild API (build-server.mjs)
- [x] Modificar package.json con nuevo script de build
- [x] Probar build localmente - ✅ Exitoso
- [x] Actualizar guía de despliegue


## Solución definitiva: Eliminar esbuild completamente
- [x] Modificar package.json para usar tsx en producción
- [x] Eliminar server.js y build-server.mjs (ya no necesarios)
- [x] Simplificar build para solo compilar frontend (sin backend)
- [x] Corregir ruta de archivos estáticos en vite.ts
- [x] Probar build y servidor - ✅ Exitoso sin errores


## Configuración de Railway y autenticación local
- [ ] Inicializar base de datos en Railway (ejecutar migraciones)
- [ ] Deshabilitar OAuth de Manus en el código
- [ ] Implementar sistema de autenticación local (email/password)
- [ ] Actualizar código en GitHub
- [ ] Redesplegar en Railway
- [ ] Conectar dominio eterbox.com de Hostinger
- [ ] Verificar funcionamiento completo


## Corrección de diseño responsive en Home (Landing Page)
- [x] Agregar menú hamburguesa en móvil con opciones de navegación
- [x] Hacer navegación responsive (ocultar botones en móvil, mostrar menú)
- [x] Ajustar tamaños de texto para móvil (títulos, párrafos)
- [x] Hacer botones full-width en móvil
- [x] Agregar padding responsive en todas las secciones
- [x] Eliminar scale-105 en móvil para evitar overflow
- [x] Agregar overflow-x-hidden al contenedor principal
- [x] Reducir tamaños de iconos en móvil
- [x] Ajustar espaciado entre elementos para móvil


## Eliminar scroll horizontal en toda la aplicación
- [x] Agregar reglas CSS globales para prevenir overflow horizontal
- [x] Aplicar overflow-x-hidden a html y body
- [x] Verificar que no haya elementos que causen desbordamiento


## Bug - Página de Pricing no accesible sin login
- [x] Permitir acceso a la página de Pricing sin autenticación (endpoint ya es público)
- [x] Crear script actualizado de seeding para inicializar planes en Railway
- [x] Crear script SQL completo (init-database.sql) para ejecutar en Railway Query Editor
- [x] Crear guía de solución rápida (RAILWAY_QUICK_FIX.md)
- [ ] Usuario debe arreglar Custom Start Command en Railway (cambiar a npm run start)
- [ ] Usuario debe ejecutar init-database.sql en Railway MySQL Query Editor
- [ ] Verificar que el botón "View Pricing" funcione desde Home


## Crear endpoint temporal para inicializar base de datos
- [x] Crear endpoint /api/init-db que ejecute SQL de inicialización
- [x] Push a GitHub y esperar deployment en Railway
- [ ] Usuario visita https://eterbox.com/api/init-db para inicializar
- [ ] Eliminar endpoint por seguridad después de inicializar


## Bug - Endpoint init-db con error de DATABASE_URL
- [x] Cambiar de DATABASE_URL a MYSQL_URL en init-db-endpoint.ts
- [x] Push a GitHub y esperar deployment
- [ ] Usuario visita https://eterbox.com/api/init-db nuevamente


## Mostrar planes sin base de datos
- [x] Hardcodear planes en la página de Pricing
- [x] Hacer que "View Pricing" en Home haga scroll a la sección de planes
- [x] Eliminar dependencia de base de datos para mostrar planes públicos


## Sistema de Autenticación Completo y Panel de Administración
- [ ] Inicializar base de datos en Railway (ejecutar migraciones)
- [ ] Implementar registro/login con Email y Contraseña
- [ ] Configurar Google OAuth para registro/login
- [ ] Configurar Apple OAuth para registro/login
- [ ] Crear página de registro con las 3 opciones
- [ ] Crear página de login con las 3 opciones
- [ ] Guardar usuarios en base de datos con su método de autenticación
- [ ] Guardar información de planes comprados en tabla de usuarios
- [ ] Crear panel de administración (/admin)
- [ ] Mostrar lista de todos los usuarios registrados
- [ ] Mostrar plan actual de cada usuario
- [ ] Permitir editar/eliminar usuarios desde admin
- [ ] Proteger ruta /admin solo para administradores
- [ ] Probar todo el flujo de registro, login y compra de planes


## Bug - Railway deployment crasheando por endpoint init-db
- [x] Eliminar endpoint temporal /api/init-db
- [x] Eliminar archivo server/init-db-endpoint.ts
- [x] Eliminar import y registro del endpoint en server/_core/index.ts
- [x] Push a GitHub y verificar que deployment funcione


## Bug - Railway crash por MYSQL_URL inválida
- [x] Revisar drizzle.config.ts y asegurar que use MYSQL_PUBLIC_URL o construya URL correctamente
- [x] Actualizar drizzle.config.ts para usar DATABASE_URL || MYSQL_URL || MYSQL_PUBLIC_URL
- [x] Actualizar server/db.ts getDb() para usar las mismas variables de fallback
- [x] Push a GitHub y verificar deployment


## Bug - Railway sigue crasheando por migraciones automáticas
- [ ] Revisar package.json y deshabilitar migraciones automáticas en start
- [ ] Asegurar que la app pueda iniciar sin base de datos configurada
- [ ] Push a GitHub y verificar deployment exitoso


## Implementación Completa de Autenticación y Admin Panel

### Fase 1: Verificación de Railway
- [ ] Confirmar que eterbox.com está online sin crashes
- [ ] Verificar que el Custom Start Command es solo `npm run start`

### Fase 2: Inicialización de Base de Datos
- [x] Crear endpoint temporal /api/setup-database
- [ ] Usuario visita https://eterbox.com/api/setup-database para inicializar
- [ ] Eliminar endpoint temporal después de inicializar

### Fase 3: Autenticación Email/Password
- [ ] Crear página de registro (/register) con formulario email/password
- [ ] Crear página de login (/login) con formulario email/password
- [ ] Implementar hash de contraseñas con bcrypt
- [ ] Crear endpoints tRPC para register y login
- [ ] Implementar JWT para sesiones
- [ ] Agregar validación de email y contraseña

### Fase 4: Google OAuth
- [ ] Crear credenciales OAuth en Google Cloud Console
- [ ] Configurar redirect URI para eterbox.com
- [ ] Implementar flujo de OAuth con Google
- [ ] Agregar botón "Sign in with Google" en login/register
- [ ] Guardar usuarios de Google en base de datos

### Fase 5: Apple OAuth
- [ ] Crear App ID en Apple Developer
- [ ] Configurar Sign in with Apple
- [ ] Implementar flujo de OAuth con Apple
- [ ] Agregar botón "Sign in with Apple" en login/register
- [ ] Guardar usuarios de Apple en base de datos

### Fase 6: Panel de Administración
- [ ] Crear página /admin protegida (solo para admin)
- [ ] Mostrar lista de todos los usuarios registrados
- [ ] Mostrar plan actual de cada usuario
- [ ] Agregar filtros por método de login (Google/Apple/Email)
- [ ] Agregar búsqueda de usuarios
- [ ] Mostrar estadísticas (total usuarios, por plan, etc.)
- [ ] Permitir cambiar plan de usuario manualmente
- [ ] Permitir eliminar usuarios

### Fase 7: Testing
- [ ] Probar registro con email/password
- [ ] Probar login con email/password
- [ ] Probar Google OAuth completo
- [ ] Probar Apple OAuth completo
- [ ] Probar acceso a panel admin
- [ ] Verificar que usuarios no-admin no pueden acceder a /admin

### Fase 8: Deployment Final
- [ ] Push todos los cambios a GitHub
- [ ] Verificar deployment en Railway
- [ ] Confirmar que todo funciona en producción


## Bug - Error de sintaxis SQL en setup-database
- [x] Arreglar sintaxis SQL para compatibilidad con MySQL de Railway
- [x] Cambiar openId a open_id para evitar palabra reservada
- [x] Push a GitHub y verificar que funcione


## Usar Drizzle migrations en lugar de SQL manual
- [x] Modificar setup-database para usar drizzle-kit push
- [x] Insertar planes iniciales después de crear tablas
- [x] Push a GitHub y verificar en Railway


## Eliminar endpoint temporal de setup-database
- [x] Eliminar archivo server/setup-database.ts
- [x] Eliminar import y registro del endpoint en server/_core/index.ts
- [x] Push a GitHub y verificar deployment en Railway


## Sistema de Autenticación Completo (Seguridad Grado Militar)
- [x] Analizar sistema OAuth actual de Manus
- [x] Actualizar schema de base de datos para email/password
- [x] Cambiar encriptación de credenciales de openId a userId
- [x] Implementar encriptación AES-256-GCM para credenciales
- [x] Implementar bcrypt con 12 rounds para contraseñas
- [x] Crear servicio de autenticación con JWT
- [x] Crear servicio de criptografía con derivación de claves
- [x] Agregar protección contra timing attacks
- [ ] Implementar rate limiting en endpoints de auth
- [ ] Implementar auditoría completa de accesos
- [ ] Agregar headers de seguridad (HSTS, CSP, etc)
- [ ] Implementar protección CSRF
- [ ] Crear página de registro (/register) con Email/Password
- [ ] Crear página de login (/login) con Email/Password
- [ ] Implementar hash de contraseñas con bcrypt
- [ ] Integrar Google OAuth en páginas de registro/login
- [ ] Integrar Apple OAuth en páginas de registro/login
- [ ] Crear tRPC procedures para registro y login
- [ ] Implementar manejo de sesiones con JWT
- [ ] Proteger rutas que requieren autenticación
- [ ] Crear tests para autenticación

## Panel de Administración
- [ ] Crear página /admin con protección de acceso
- [ ] Implementar verificación de rol admin
- [ ] Mostrar lista de todos los usuarios registrados
- [ ] Mostrar plan actual de cada usuario
- [ ] Mostrar fecha de registro y último login
- [ ] Implementar búsqueda y filtrado de usuarios
- [ ] Agregar opción para cambiar plan de usuario
- [ ] Agregar opción para desactivar/eliminar usuario
- [ ] Mostrar estadísticas generales (total usuarios, usuarios por plan)
- [ ] Crear tests para panel admin


## Autenticación Biométrica (WebAuthn)
- [x] Agregar campos de WebAuthn a la tabla de usuarios
- [x] Instalar @simplewebauthn/server y @simplewebauthn/browser
- [x] Crear servicio WebAuthn para Face ID/Touch ID/Huella
- [x] Crear endpoints tRPC para registro WebAuthn
- [x] Crear endpoints tRPC para autenticación WebAuthn
- [x] Integrar routers de auth y webauthn en appRouter principal
- [ ] Implementar UI para activar biometría después del registro
- [ ] Implementar login con Face ID/Touch ID/Huella
- [ ] Agregar fallback a contraseña si biometría falla
- [ ] Crear tests para WebAuthn


## Panel de Administración
- [ ] Crear sistema de roles (admin/user)
- [ ] Crear middleware de autorización para admin
- [ ] Crear endpoints tRPC para gestión de usuarios
- [ ] Crear endpoint para listar todos los usuarios
- [ ] Crear endpoint para crear usuario manualmente
- [ ] Crear endpoint para asignar/cambiar plan de usuario
- [ ] Crear endpoint para eliminar usuario
- [ ] Crear endpoint para suspender/activar usuario
- [ ] Crear página /admin con autenticación requerida
- [ ] Crear tabla de usuarios con filtros y búsqueda
- [ ] Crear modal para crear nuevo usuario
- [ ] Crear modal para editar usuario y asignar plan
- [ ] Crear confirmación para eliminar usuario
- [ ] Mostrar estadísticas de usuarios por plan
- [ ] Asegurar que las contraseñas NUNCA se muestren en el admin


## Panel de Administración Completado
- [x] Crear middleware de autenticación admin (adminProcedure)
- [x] Crear router tRPC con endpoints protegidos (/server/api/routers/admin.ts)
- [x] Implementar listUsers con paginación, búsqueda y filtros
- [x] Implementar getStats para estadísticas del sistema
- [x] Implementar createUser para crear usuarios manualmente
- [x] Implementar updateUserPlan para asignar planes
- [x] Implementar updateUserRole para cambiar roles (user/admin)
- [x] Implementar deleteUser con protección contra auto-eliminación
- [x] Implementar verifyUserEmail para verificar emails manualmente
- [x] Crear página /admin con UI completa
- [x] Crear ruta protegida AdminRoute en App.tsx
- [x] Diseñar UI con estadísticas (total users, admins, users por plan)
- [x] Crear tabla de usuarios con columnas: nombre, email, rol, plan, verificado
- [x] Implementar búsqueda por nombre/email
- [x] Implementar filtro por rol (user/admin)
- [x] Crear modal para crear nuevos usuarios
- [x] Crear modal para editar usuarios (cambiar plan y rol)
- [x] Crear modal de confirmación para eliminar usuarios
- [x] Implementar paginación con botones prev/next
- [x] Agregar botón "Back to Dashboard" en header
- [x] Proteger contra demotion/deletion del propio admin
- [x] Asegurar que las contraseñas NUNCA sean visibles para admins (solo hashes)
- [x] Tests unitarios para funcionalidad admin (10 tests)


## Crear Usuario Administrador Inicial
- [x] Verificar conexión a base de datos
- [x] Crear script para insertar usuario admin
- [x] Ejecutar script y crear usuario admin con credenciales seguras
- [x] Verificar que el usuario admin se creó correctamente
- [x] Proporcionar credenciales de acceso al usuario


## Bug - Login con usuario admin falla
- [ ] Verificar que el usuario admin existe en la base de datos
- [ ] Verificar que la contraseña está hasheada correctamente
- [ ] Revisar el servicio de autenticación (auth.service.ts)
- [ ] Probar el flujo de login completo
- [ ] Corregir cualquier problema encontrado
