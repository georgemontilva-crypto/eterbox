# Configuración de Email y reCAPTCHA

## 📧 Configuración de Email

### Opción recomendada: Resend (más fácil y confiable)

1. Crear cuenta en: https://resend.com/
2. Verificar tu dominio (o usar el dominio de prueba que te dan)
3. Ir a **API Keys** y crear una nueva clave
4. Copiar la clave API

**Configurar en Railway:**
```bash
RESEND_API_KEY=re_tu_clave_api_aqui
SUPPORT_EMAIL=onboarding@resend.dev  # O tu dominio verificado
ADMIN_CONTACT_EMAIL=tu-email@gmail.com  # Email donde recibirás los mensajes
```

**Nota importante sobre Resend:**
- El campo `from` debe ser un email de tu dominio verificado
- Para pruebas, usa `onboarding@resend.dev`
- Para producción, verifica tu dominio en Resend

---

## 📧 Configuración alternativa: SMTP

### Opción 1: Gmail
1. Ir a tu cuenta de Google: https://myaccount.google.com/
2. Navegar a **Seguridad** → **Verificación en dos pasos** (debe estar activada)
3. Buscar **Contraseñas de aplicaciones**
4. Crear una nueva contraseña de aplicación para "Correo"
5. Copiar la contraseña generada (16 caracteres)

### Configurar variables de entorno:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-de-aplicacion
SUPPORT_EMAIL=support@eterbox.com
ADMIN_CONTACT_EMAIL=contact@eterbox.com
```

### Opción 2: Otros proveedores SMTP
- **SendGrid**: smtp.sendgrid.net (puerto 587)
- **Mailgun**: smtp.mailgun.org (puerto 587)
- **AWS SES**: email-smtp.region.amazonaws.com (puerto 587)

## 🔒 Configuración de Google reCAPTCHA v3

### Paso 1: Crear cuenta en reCAPTCHA
1. Ir a: https://www.google.com/recaptcha/admin/create
2. Iniciar sesión con tu cuenta de Google
3. Registrar un nuevo sitio:
   - **Etiqueta**: EterBox
   - **Tipo de reCAPTCHA**: reCAPTCHA v3
   - **Dominios**: 
     - `localhost` (para desarrollo)
     - `eterbox.com` (tu dominio de producción)
     - `*.railway.app` (si usas Railway)
   - Aceptar los términos de servicio

### Paso 2: Obtener las claves
Después de crear el sitio, obtendrás:
- **Site Key** (clave pública) - para el frontend
- **Secret Key** (clave secreta) - para el backend

### Paso 3: Configurar variables de entorno

#### Backend (Railway o servidor):
```bash
RECAPTCHA_SECRET_KEY=tu-secret-key-aqui
```

#### Frontend (en Railway, agregar como variable de entorno):
```bash
VITE_RECAPTCHA_SITE_KEY=tu-site-key-aqui
```

## 🚀 Configuración en Railway

### Variables de entorno necesarias:
1. Ve a tu proyecto en Railway
2. Selecciona tu servicio
3. Ve a la pestaña **Variables**
4. Agrega las siguientes variables:

```
# Email con Resend (RECOMENDADO)
RESEND_API_KEY=re_tu_clave_api
SUPPORT_EMAIL=onboarding@resend.dev
ADMIN_CONTACT_EMAIL=tu-email@gmail.com

# reCAPTCHA
RECAPTCHA_SECRET_KEY=tu-secret-key
VITE_RECAPTCHA_SITE_KEY=tu-site-key
```

**O si prefieres usar SMTP:**
```
# Email con SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-de-aplicacion
SUPPORT_EMAIL=support@eterbox.com
ADMIN_CONTACT_EMAIL=contact@eterbox.com

# reCAPTCHA
RECAPTCHA_SECRET_KEY=tu-secret-key
VITE_RECAPTCHA_SITE_KEY=tu-site-key
```

## ✅ Verificar la configuración

### Email:
1. Enviar un mensaje desde el formulario de contacto
2. Revisar los logs del servidor en Railway
3. Verificar que el email llegue a `ADMIN_CONTACT_EMAIL`

### reCAPTCHA:
1. Abrir la consola del navegador (F12)
2. Enviar el formulario de contacto
3. Verificar que no haya errores de reCAPTCHA
4. En la consola de Google reCAPTCHA, revisar las estadísticas de uso

## 🐛 Solución de problemas

### Email no se envía:
- Verificar que las credenciales SMTP sean correctas
- Revisar los logs del servidor para ver errores específicos
- Asegurarse de que el puerto 587 no esté bloqueado
- Verificar que la contraseña de aplicación de Gmail sea correcta

### reCAPTCHA no funciona:
- Verificar que el dominio esté registrado en la consola de reCAPTCHA
- Asegurarse de que ambas claves (site key y secret key) estén configuradas
- Revisar la consola del navegador para errores de JavaScript
- Verificar que el script de reCAPTCHA se cargue correctamente

## 📝 Notas importantes

- **reCAPTCHA v3** es invisible y no interrumpe la experiencia del usuario
- El score de reCAPTCHA debe ser >= 0.5 para aprobar (configurable en el código)
- Los emails se envían de forma asíncrona y no bloquean la respuesta al usuario
- Si SMTP no está configurado, el formulario seguirá funcionando pero no enviará emails
