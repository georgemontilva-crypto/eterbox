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
- [ ] Crear UI para setup de 2FA
- [ ] Implementar verificación de 2FA en login
- [ ] Crear tests para autenticación 2FA

## Fase 3: Integración PayPal
- [x] Configurar claves de PayPal
- [x] Crear utilidades de PayPal
- [ ] Implementar checkout de PayPal
- [ ] Crear webhooks para eventos de PayPal
- [ ] Implementar actualización de planes en base de datos
- [ ] Crear tests para pagos

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
- [ ] Implementar búsqueda por plataforma
- [ ] Implementar filtrado por carpeta
- [ ] Implementar búsqueda por usuario
- [ ] Implementar búsqueda por correo
- [ ] Crear UI para búsqueda y filtros
- [ ] Optimizar queries de búsqueda

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
- [ ] Configurar i18n (inglés/español)
- [ ] Traducir todas las cadenas de texto
- [ ] Crear selector de idioma
- [ ] Guardar preferencia de idioma del usuario
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


### Nuevas Solicitudes del Usuario
- [x] Agregar botón "Add Credential" en cada carpeta para crear credenciales directamente
- [x] Agregar opción de mover credencial existente a una carpeta
