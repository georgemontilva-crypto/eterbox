# Variables de Entorno Necesarias para EterBox

Este documento lista todas las variables de entorno que necesitas configurar en Hostinger.

## Variables de Base de Datos (REQUERIDAS)

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=eterbox_db
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DATABASE_URL=mysql://tu_usuario_db:tu_contraseña_db@localhost:3306/eterbox_db
```

**Cómo obtenerlas:**
1. En Hostinger hPanel, ve a "Bases de Datos → MySQL Databases"
2. Crea una nueva base de datos llamada `eterbox_db`
3. Crea un usuario y contraseña
4. Hostinger te dará el host (generalmente `localhost`)

## Variables de Autenticación (REQUERIDAS)

```
JWT_SECRET=genera_una_clave_secreta_larga_y_aleatoria
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

**JWT_SECRET:** Genera una clave aleatoria de al menos 32 caracteres. Puedes usar:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Variables de PayPal (REQUERIDAS para pagos)

```
PAYPAL_CLIENT_ID=tu_client_id_aqui
PAYPAL_SECRET_KEY=tu_secret_key_aqui
PAYPAL_MODE=live
VITE_PAYPAL_CLIENT_ID=tu_client_id_aqui
```

**Cómo obtenerlas:**
1. Ve a https://developer.paypal.com
2. Inicia sesión con tu cuenta PayPal
3. Ve a "My Apps & Credentials"
4. Crea una nueva app o usa una existente
5. Copia el "Client ID" y "Secret"
6. Para producción, usa las credenciales de "Live"
7. Para pruebas, usa "Sandbox" y cambia `PAYPAL_MODE=sandbox`

## Variables de SMTP (REQUERIDAS para emails)

```
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_USER=tu_email@dominio.com
SMTP_PASSWORD=tu_contraseña_smtp
SUPPORT_EMAIL=support@tudominio.com
```

**Opciones de proveedores SMTP:**

### Gmail (Gratis):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password
```
**Nota:** Necesitas generar una "App Password" en tu cuenta de Google

### SendGrid (Gratis hasta 100 emails/día):
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=tu_api_key_de_sendgrid
```

### Mailgun (Gratis hasta 5,000 emails/mes):
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@tu-dominio.mailgun.org
SMTP_PASSWORD=tu_contraseña_mailgun
```

### Hostinger Email (Si tienes email en Hostinger):
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=tu_email@tudominio.com
SMTP_PASSWORD=tu_contraseña_email
```

## Variables de la Aplicación (REQUERIDAS)

```
VITE_APP_TITLE=EterBox
VITE_APP_LOGO=https://tudominio.com/logo.png
VITE_APP_ID=eterbox
OWNER_NAME=Tu Nombre
OWNER_OPEN_ID=tu_open_id_de_manus
```

**Notas:**
- `VITE_APP_TITLE`: El nombre que aparecerá en el navegador
- `VITE_APP_LOGO`: URL pública de tu logo (opcional)
- `OWNER_NAME`: Tu nombre o el nombre de tu empresa
- `OWNER_OPEN_ID`: Tu ID de usuario en Manus (puedes dejarlo como está)

## Variables Opcionales (Proporcionadas por Manus)

Estas variables son opcionales y solo necesarias si usas servicios de Manus:

```
BUILT_IN_FORGE_API_KEY=opcional
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=opcional
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_ANALYTICS_ENDPOINT=opcional
VITE_ANALYTICS_WEBSITE_ID=opcional
```

## Resumen de Prioridades

### CRÍTICAS (La app no funcionará sin estas):
- ✅ Todas las variables de Base de Datos
- ✅ JWT_SECRET
- ✅ PAYPAL_CLIENT_ID y PAYPAL_SECRET_KEY
- ✅ Variables SMTP
- ✅ VITE_APP_TITLE

### IMPORTANTES (Funcionalidad limitada sin estas):
- ⚠️ VITE_PAYPAL_CLIENT_ID (necesaria para checkout en el frontend)
- ⚠️ SUPPORT_EMAIL

### OPCIONALES (Mejoran la experiencia):
- 🔵 VITE_APP_LOGO
- 🔵 Variables de Analytics
- 🔵 Variables de Forge API

## Cómo Configurarlas en Hostinger

1. En el panel de Hostinger, ve a tu aplicación Node.js
2. Busca la sección "Environment Variables" o "Variables de Entorno"
3. Haz clic en "Add Variable" o "Agregar Variable"
4. Ingresa el nombre de la variable (ej: `DB_HOST`)
5. Ingresa el valor (ej: `localhost`)
6. Repite para cada variable
7. Guarda los cambios
8. Reinicia la aplicación

## Verificación

Después de configurar todas las variables, verifica que la aplicación funcione:

1. Visita tu URL de Hostinger
2. Intenta iniciar sesión
3. Intenta crear una credencial
4. Intenta actualizar a un plan de pago
5. Verifica que lleguen los emails de confirmación

Si algo no funciona, revisa los logs en Hostinger para ver qué variable falta.
