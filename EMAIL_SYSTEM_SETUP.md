# EterBox Email System Setup Guide

## 📧 Overview

Este documento describe cómo configurar el sistema completo de correos de EterBox con Hostinger Mail.

## 🎯 Flujos de Correo Implementados

### 1. Registro de Usuario
- **Cliente recibe:** Correo de bienvenida profesional con guía de características
- **Admin recibe en `join@eterbox.com`:** Notificación de nuevo registro con detalles del usuario

### 2. Compra de Plan
- **Cliente recibe:** Confirmación de compra con invoice detallado (subtotal, impuestos, total)
- **Admin recibe en `sales@eterbox.com`:** Notificación de venta con detalles del plan y transacción

### 3. Formulario de Contacto
- **Admin recibe en `contact@eterbox.com`:** Mensaje del cliente con botón de respuesta rápida

### 4. Suscripción a Newsletter
- **Admin recibe en `contact@eterbox.com`:** Notificación de nueva suscripción con estadísticas

---

## 🔧 Configuración de Variables de Entorno en Railway

### Paso 1: Acceder a Variables de Entorno
1. Ve a Railway Dashboard → Proyecto `eterbox` → Servicio `eterbox`
2. Haz clic en la pestaña **"Variables"**

### Paso 2: Configurar Credenciales de Hostinger Mail

Agrega o actualiza estas variables:

```env
# SMTP Configuration (Hostinger Mail)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=noreply@eterbox.com
SMTP_PASSWORD=tu_contraseña_de_hostinger_mail

# Email Addresses
ADMIN_JOIN_EMAIL=join@eterbox.com
ADMIN_SALES_EMAIL=sales@eterbox.com
ADMIN_CONTACT_EMAIL=contact@eterbox.com
SUPPORT_EMAIL=support@eterbox.com
```

### Paso 3: Crear Buzones en Hostinger

En Hostinger Panel:
1. Ve a **Emails** → **Email Accounts**
2. Crea estos buzones:
   - `noreply@eterbox.com` (para enviar correos automáticos)
   - `join@eterbox.com` (para recibir notificaciones de registro)
   - `sales@eterbox.com` (para recibir notificaciones de ventas)
   - `contact@eterbox.com` (para recibir mensajes de contacto y newsletter)
   - `support@eterbox.com` (para soporte al cliente)

### Paso 4: Configurar Forwarding (Opcional)

Si quieres recibir todos los correos en tu iPhone:
1. En Hostinger → **Email Forwarders**
2. Crea forwarders:
   - `join@eterbox.com` → `georgemontilva@icloud.com`
   - `sales@eterbox.com` → `georgemontilva@icloud.com`
   - `contact@eterbox.com` → `georgemontilva@icloud.com`

---

## 📝 Plantillas de Correo Creadas

### 1. `welcome.html`
Correo de bienvenida para nuevos usuarios con:
- Logo de EterBox
- Mensaje personalizado
- Lista de características principales
- Botón CTA al Dashboard
- Footer con links de soporte y privacidad

### 2. `new-registration-admin.html`
Notificación para admin cuando alguien se registra:
- Datos del usuario (nombre, email, plan)
- Fecha de registro
- Botón al Admin Panel

### 3. `purchase-confirmation.html`
Confirmación de compra para el cliente:
- Invoice detallado (número, fecha, subtotal, impuestos, total)
- Detalles del plan comprado
- Método de pago
- Botón al Dashboard

### 4. `new-sale-admin.html`
Notificación para admin cuando hay una venta:
- Información del cliente
- Detalles de la compra (plan, monto, transaction ID)
- Características del plan
- Botón al Admin Panel

### 5. `contact-form.html`
Notificación cuando alguien envía el formulario de contacto:
- Datos del remitente
- Asunto y mensaje
- Botón de respuesta rápida

### 6. `newsletter-subscription.html`
Notificación cuando alguien se suscribe al newsletter:
- Email del suscriptor
- Fecha y fuente de suscripción
- Estadísticas de suscriptores totales

---

## 🚀 Implementación en el Código

### Servicio de Plantillas (`email-template-service.ts`)
Maneja la carga y renderizado de plantillas HTML con datos dinámicos.

**Métodos principales:**
- `renderTemplate(templateName, data)`: Renderiza una plantilla con datos
- `getWelcomeEmailData(userName, lang)`: Datos para correo de bienvenida (EN/ES)
- `getPurchaseConfirmationData(...)`: Datos para confirmación de compra (EN/ES)
- `getNewRegistrationAdminData(...)`: Datos para notificación de registro
- `getNewSaleAdminData(...)`: Datos para notificación de venta
- `getContactFormData(...)`: Datos para formulario de contacto
- `getNewsletterSubscriptionData(...)`: Datos para newsletter

### Integración con Endpoints Existentes

#### Registro de Usuario (`auth.ts`)
```typescript
// Después de crear el usuario
await emailService.sendWelcomeEmail(user.email, user.name, lang);
await emailService.sendNewRegistrationNotification(user.name, user.email, user.plan);
```

#### Compra de Plan (PayPal webhook)
```typescript
// Después de procesar el pago
await emailService.sendPurchaseConfirmation(user.email, user.name, planName, amount, transactionId, lang);
await emailService.sendNewSaleNotification(user.name, user.email, planName, amount, transactionId, planFeatures);
```

#### Formulario de Contacto (nuevo endpoint)
```typescript
// POST /api/contact
await emailService.sendContactFormNotification(name, email, subject, message);
```

#### Newsletter (nuevo endpoint)
```typescript
// POST /api/newsletter
await emailService.sendNewsletterNotification(email, source, totalSubscribers);
```

---

## ✅ Checklist de Implementación

- [x] Crear plantillas HTML profesionales
- [x] Crear servicio de plantillas (`EmailTemplateService`)
- [ ] Actualizar `email-service.ts` con nuevos métodos
- [ ] Integrar con endpoint de registro
- [ ] Integrar con webhook de PayPal
- [ ] Crear endpoint de formulario de contacto
- [ ] Crear endpoint de newsletter
- [ ] Configurar variables de entorno en Railway
- [ ] Crear buzones en Hostinger Mail
- [ ] Probar todos los flujos de correo
- [ ] Verificar que los correos lleguen correctamente

---

## 🧪 Pruebas

### 1. Probar Correo de Bienvenida
1. Registra un nuevo usuario en eterbox.com
2. Verifica que el usuario reciba el correo de bienvenida
3. Verifica que `join@eterbox.com` reciba la notificación

### 2. Probar Correo de Compra
1. Compra un plan con PayPal
2. Verifica que el usuario reciba la confirmación con invoice
3. Verifica que `sales@eterbox.com` reciba la notificación

### 3. Probar Formulario de Contacto
1. Envía un mensaje desde el formulario de contacto
2. Verifica que `contact@eterbox.com` reciba el mensaje

### 4. Probar Newsletter
1. Suscríbete al newsletter
2. Verifica que `contact@eterbox.com` reciba la notificación

---

## 🎨 Personalización

### Cambiar Colores
Edita las plantillas HTML en `/server/email-templates/`:
- Azul primario: `#1e3a8a` y `#3b82f6`
- Verde (compras): `#059669` y `#10b981`
- Morado (ventas): `#7c3aed` y `#a855f7`
- Rojo (contacto): `#dc2626` y `#ef4444`
- Naranja (newsletter): `#ea580c` y `#f97316`

### Cambiar Logo
Actualiza la URL del logo en las plantillas:
```html
<img src="https://eterbox.com/logo.png" alt="EterBox" style="width: 60px; height: 60px;">
```

### Agregar Más Idiomas
Edita `email-template-service.ts` y agrega traducciones en los métodos `getWelcomeEmailData` y `getPurchaseConfirmationData`.

---

## 📞 Soporte

Si tienes problemas con el sistema de correos:
1. Verifica que las variables de entorno estén configuradas correctamente en Railway
2. Verifica que los buzones existan en Hostinger Mail
3. Revisa los logs de Railway para errores de SMTP
4. Prueba enviar un correo de prueba desde Hostinger webmail

---

## 🔒 Seguridad

- **Nunca** expongas `SMTP_PASSWORD` en el código
- Usa siempre variables de entorno
- Los correos se envían por SMTP seguro (puerto 465 con SSL)
- Las plantillas no ejecutan JavaScript (solo HTML estático)

---

## 📚 Recursos

- [Hostinger Email Documentation](https://support.hostinger.com/en/collections/1742821-email)
- [Resend Documentation](https://resend.com/docs)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

---

**Última actualización:** 11 de enero de 2026
