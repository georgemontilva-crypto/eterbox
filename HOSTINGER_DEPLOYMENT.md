# Guía de Despliegue de EterBox en Hostinger

## Requisitos Previos

- Cuenta de Hostinger con plan que soporte Node.js
- Acceso a una base de datos MySQL/PostgreSQL
- Credenciales de PayPal (Client ID y Secret Key)
- Servidor SMTP configurado (para envío de emails)

## Paso 1: Exportar el Código desde Manus

### Opción A: Descargar directamente
1. En Manus, abre el Management UI (panel derecho)
2. Ve a la pestaña **"Code"**
3. Haz clic en **"Download all files"**
4. Guarda el archivo ZIP en tu computadora

### Opción B: Exportar a GitHub (Recomendado)
1. En Manus Management UI, ve a **Settings → GitHub**
2. Haz clic en **"Create Repository"**
3. Selecciona tu cuenta de GitHub
4. Nombra el repositorio (ej: "eterbox")
5. Haz clic en **"Create"**
6. Manus exportará todo el código a GitHub

## Paso 2: Configurar Base de Datos

### En Hostinger:
1. Ve a **hPanel → Bases de Datos → MySQL Databases**
2. Crea una nueva base de datos:
   - Nombre: `eterbox_db`
   - Usuario: crea un usuario nuevo
   - Contraseña: genera una contraseña segura
3. **Guarda estos datos:**
   - Host: `localhost` o la IP que te proporcione Hostinger
   - Puerto: `3306` (MySQL) o `5432` (PostgreSQL)
   - Nombre de BD: `eterbox_db`
   - Usuario: el que creaste
   - Contraseña: la que generaste

## Paso 3: Desplegar en Hostinger

### Si usaste GitHub:
1. En Hostinger, ve a la página de **Deploy Node.js Web App**
2. Selecciona **"Import Git repository"**
3. Haz clic en **"Connect with GitHub"**
4. Autoriza a Hostinger
5. Selecciona el repositorio `eterbox`
6. Configura:
   - **Branch:** `main`
   - **Build command:** `pnpm install && pnpm build`
   - **Start command:** `pnpm start`
   - **Node version:** `22.x`

### Si descargaste el ZIP:
1. En Hostinger, selecciona **"Upload your files"**
2. Haz clic en **"Continue"**
3. Sube el archivo ZIP
4. Hostinger lo descomprimirá automáticamente
5. Configura:
   - **Build command:** `pnpm install && pnpm build`
   - **Start command:** `pnpm start`
   - **Node version:** `22.x`

## Paso 4: Configurar Variables de Entorno

En Hostinger, ve a la sección de **Environment Variables** y agrega:

### Variables de Base de Datos:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=eterbox_db
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DATABASE_URL=mysql://tu_usuario_db:tu_contraseña_db@localhost:3306/eterbox_db
```

### Variables de Autenticación:
```
JWT_SECRET=genera_una_clave_secreta_larga_y_aleatoria
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### Variables de PayPal:
```
PAYPAL_CLIENT_ID=tu_client_id_de_paypal
PAYPAL_SECRET_KEY=tu_secret_key_de_paypal
PAYPAL_MODE=live
VITE_PAYPAL_CLIENT_ID=tu_client_id_de_paypal
```

### Variables de SMTP (Email):
```
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_USER=tu_email@dominio.com
SMTP_PASSWORD=tu_contraseña_smtp
SUPPORT_EMAIL=support@tudominio.com
```

### Variables de la Aplicación:
```
VITE_APP_TITLE=EterBox
VITE_APP_LOGO=https://tu-dominio.com/logo.png
OWNER_NAME=Tu Nombre
OWNER_OPEN_ID=tu_open_id_de_manus
```

### Variables del Frontend:
```
VITE_FRONTEND_FORGE_API_KEY=tu_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

## Paso 5: Inicializar la Base de Datos

Una vez desplegada la aplicación:

1. Conéctate a tu base de datos MySQL desde Hostinger (phpMyAdmin)
2. Ejecuta el siguiente script SQL para crear las tablas:

```sql
-- Este script se ejecutará automáticamente con drizzle-kit
-- Solo necesitas asegurarte de que la base de datos esté creada
```

Alternativamente, si Hostinger te da acceso SSH:

```bash
cd /ruta/a/tu/aplicacion
pnpm db:push
```

## Paso 6: Verificar el Despliegue

1. Hostinger te proporcionará una URL temporal (ej: `tu-app.hostinger.com`)
2. Visita esa URL en tu navegador
3. Deberías ver la página principal de EterBox
4. Prueba iniciar sesión con Google/GitHub
5. Verifica que puedas crear credenciales y carpetas

## Paso 7: Configurar Dominio Personalizado

1. En Hostinger, ve a **Domains**
2. Selecciona tu dominio o compra uno nuevo
3. Apunta el dominio a tu aplicación Node.js
4. Hostinger configurará automáticamente el SSL

## Solución de Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que las credenciales de DB_HOST, DB_USER, DB_PASSWORD sean correctas
- Asegúrate de que la base de datos esté creada
- Verifica que el usuario tenga permisos sobre la base de datos

### Error: "PayPal not configured"
- Verifica que VITE_PAYPAL_CLIENT_ID esté configurado
- Asegúrate de que PAYPAL_MODE sea "live" o "sandbox"
- Reinicia la aplicación después de agregar las variables

### Error: "Port already in use"
- Hostinger asigna automáticamente el puerto
- No necesitas configurar PORT manualmente

### La aplicación se reinicia constantemente
- Verifica los logs en Hostinger
- Asegúrate de que todas las variables de entorno estén configuradas
- Verifica que el comando de inicio sea correcto: `pnpm start`

## Notas Importantes

1. **Backups:** Hostinger hace backups automáticos, pero también exporta tu código a GitHub regularmente
2. **Escalado:** Si necesitas más recursos, considera upgrade de plan en Hostinger
3. **Monitoreo:** Revisa los logs regularmente en el panel de Hostinger
4. **Seguridad:** Nunca compartas tus variables de entorno o credenciales

## Soporte

Si tienes problemas:
- Revisa los logs en Hostinger
- Consulta la documentación de Hostinger para Node.js
- Contacta al soporte de Hostinger si el problema persiste

---

**¡Listo!** Tu aplicación EterBox debería estar funcionando en Hostinger.
