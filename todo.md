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
