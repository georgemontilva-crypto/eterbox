# Guía de Despliegue en Hostinger - EterBox (VERSIÓN FINAL)

## ✅ Solución Implementada

El proyecto ha sido completamente reestructurado para evitar problemas de permisos con esbuild en Hostinger:

**Cambios clave:**
- ✅ **Build simplificado:** Solo compila el frontend (Vite)
- ✅ **Sin esbuild:** El backend se ejecuta directamente con `tsx` (sin compilación)
- ✅ **Sin binarios:** No hay problemas de permisos
- ✅ **Probado:** Build y servidor funcionan correctamente

## 📋 Requisitos Previos

- Plan de Hostinger: Business o Cloud (con soporte para Node.js Apps)
- Base de datos MySQL creada en Hostinger
- Credenciales de PayPal (modo LIVE)
- Email SMTP configurado en Hostinger

## 🚀 Pasos de Despliegue

### Paso 1: Descargar el Proyecto

1. En Manus, ve al **Management UI** (panel derecho)
2. Haz clic en la pestaña **"Code"**
3. Haz clic en **"Download all files"**
4. Guarda el archivo ZIP

### Paso 2: Crear Base de Datos en Hostinger

1. Inicia sesión en **Hostinger hPanel**
2. Ve a **Databases → MySQL Databases**
3. Haz clic en **"Create Database"**
4. Configura:
   - **Database name:** `eterbox_db`
   - **Username:** crea un usuario nuevo (ej: `eterbox_user`)
   - **Password:** genera una contraseña segura
5. **Anota estos datos:**
   ```
   Host: localhost (o la IP que te proporcione Hostinger)
   Port: 3306
   Database: eterbox_db
   Username: eterbox_user
   Password: [tu_contraseña]
   ```
6. Forma la `DATABASE_URL`:
   ```
   mysql://eterbox_user:tu_contraseña@localhost:3306/eterbox_db
   ```

### Paso 3: Subir el Proyecto a Hostinger

1. En Hostinger hPanel, ve a **Websites**
2. Haz clic en **"Add Website"**
3. Selecciona **"Node.js Apps"**
4. Selecciona **"Upload your website files"**
5. Haz clic en **"Upload"** y sube el archivo ZIP que descargaste
6. Espera a que se descomprima

### Paso 4: Configurar Build Settings

**CONFIGURACIÓN EXACTA:**

- **Framework preset:** `Vite`
- **Node version:** `22.x`
- **Package manager:** `pnpm`
- **Root directory:** `/` (raíz)
- **Build command:** `pnpm run build`
- **Output directory:** `dist`

**IMPORTANTE:** Hostinger ejecutará automáticamente `pnpm start` después del build.

### Paso 5: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega todas estas variables:

#### 🗄️ Base de Datos
```
DATABASE_URL=mysql://eterbox_user:tu_contraseña@localhost:3306/eterbox_db
```

#### 🔐 Autenticación y Seguridad
```
JWT_SECRET=genera_un_string_aleatorio_muy_largo_y_seguro_minimo_32_caracteres
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=tu_owner_open_id_de_manus
OWNER_NAME=Tu Nombre
```

#### 💳 PayPal (Modo LIVE - Producción)
```
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=tu_client_id_de_paypal_produccion
PAYPAL_SECRET_KEY=tu_secret_key_de_paypal_produccion
VITE_PAYPAL_CLIENT_ID=tu_client_id_de_paypal_produccion
```

**IMPORTANTE:** Asegúrate de usar credenciales de **producción** (LIVE), no de sandbox.

#### 📧 SMTP (Email de Hostinger)
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=support@eterbox.com
SMTP_PASSWORD=tu_contraseña_de_email
SUPPORT_EMAIL=support@eterbox.com
```

**Nota:** Debes crear el email `support@eterbox.com` en Hostinger primero (hPanel → Email → Create Email Account).

#### 🎨 Aplicación
```
VITE_APP_ID=eterbox
VITE_APP_TITLE=EterBox - Security Vault
VITE_APP_LOGO=https://tu-dominio.com/logo.png
```

#### 📊 Analytics (Opcional)
```
VITE_ANALYTICS_ENDPOINT=tu_endpoint_de_analytics
VITE_ANALYTICS_WEBSITE_ID=tu_website_id
```

#### 🔧 Forge API (Manus - Opcional)
```
BUILT_IN_FORGE_API_KEY=tu_forge_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Paso 6: Desplegar

1. Verifica que todas las variables de entorno estén configuradas
2. Haz clic en **"Deploy"**
3. Espera a que termine el build (puede tardar 2-5 minutos)
4. Hostinger ejecutará automáticamente `pnpm start` después del build
5. Tu sitio estará disponible en el dominio temporal de Hostinger

### Paso 7: Conectar tu Dominio

1. Una vez que el deployment esté **"Completed"** y funcionando
2. Ve a **Websites → [Tu sitio] → Settings → Domains**
3. Haz clic en **"Add Domain"**
4. Ingresa `eterbox.com`
5. Sigue las instrucciones para conectar el dominio

## 🔍 Verificación Post-Despliegue

### 1. Verificar que el sitio carga
- Abre el dominio temporal de Hostinger
- Deberías ver la página de inicio de EterBox
- Verifica que el diseño se vea correctamente

### 2. Verificar autenticación
- Haz clic en "Login" o "Sign Up"
- Intenta crear una cuenta
- Verifica que puedas iniciar sesión

### 3. Verificar base de datos
- Crea una carpeta de prueba
- Crea una credencial de prueba
- Verifica que se guarden correctamente

### 4. Verificar PayPal
- Ve a la página de Pricing
- Intenta hacer un pago de prueba (puedes cancelarlo antes de completar)
- Verifica que el checkout de PayPal se abra correctamente

### 5. Verificar emails
- Usa la función de "Contact Support"
- Envía un mensaje de prueba
- Verifica que llegue a `support@eterbox.com`

## 🐛 Solución de Problemas

### Problema: Build falla

**Síntomas:** El deployment muestra "Build failed"

**Soluciones:**
1. Revisa los logs de build en Hostinger
2. Verifica que el **Package manager** esté en `pnpm` (no `npm`)
3. Verifica que **Node version** sea `22.x`
4. Verifica que **Build command** sea exactamente `pnpm run build`
5. Si ves errores de esbuild, asegúrate de descargar la última versión del proyecto (que ya no usa esbuild)

### Problema: Build exitoso pero sitio no carga (403 Forbidden)

**Síntomas:** El build termina pero al abrir el sitio sale error 403

**Soluciones:**
1. Ve a los logs de **Runtime** (no solo build logs) en Hostinger
2. Verifica que el servidor se haya iniciado correctamente
3. Busca mensajes como "Server running on http://localhost:XXXX/"
4. Si no ves ese mensaje, el servidor no se inició

**Si el servidor no inicia:**
- Verifica que todas las variables de entorno estén configuradas
- Verifica que `DATABASE_URL` esté correcta
- Contacta al soporte de Hostinger

### Problema: Error de conexión a base de datos

**Síntomas:** El sitio carga pero al intentar crear cuenta sale error

**Soluciones:**
1. Verifica que `DATABASE_URL` esté correcta
2. Verifica que la base de datos exista en Hostinger
3. Verifica que el usuario tenga permisos
4. Prueba la conexión:
   ```
   mysql://usuario:contraseña@host:3306/nombre_bd
   ```
5. Asegúrate de que no haya espacios ni caracteres especiales mal escapados

### Problema: PayPal no funciona

**Síntomas:** El checkout de PayPal no se abre o muestra error

**Soluciones:**
1. Verifica que `PAYPAL_MODE=live` (no `sandbox`)
2. Verifica que las credenciales sean de **producción**
3. Verifica que `VITE_PAYPAL_CLIENT_ID` esté configurada (para el frontend)
4. Revisa la consola del navegador para ver errores de JavaScript

### Problema: Emails no se envían

**Síntomas:** Los emails de confirmación no llegan

**Soluciones:**
1. Verifica que el email `support@eterbox.com` exista en Hostinger
2. Verifica las credenciales SMTP
3. Verifica que `SMTP_HOST=smtp.hostinger.com`
4. Verifica que `SMTP_PORT=587`
5. Revisa los logs del servidor para ver errores de SMTP

## 📝 Notas Importantes

### Sobre el Build

El comando `pnpm run build` ahora **solo** construye el frontend (Vite) → `dist/public/`

El backend **NO se compila**, se ejecuta directamente con `tsx` en producción.

Hostinger ejecutará automáticamente `pnpm start` después del build, que ejecuta:
```
NODE_ENV=production tsx server/_core/index.ts
```

### Sobre tsx

`tsx` es un ejecutor de TypeScript que permite ejecutar código TypeScript directamente sin compilación previa. Es perfecto para producción en este caso porque:
- ✅ No requiere binarios con permisos especiales
- ✅ Es rápido y eficiente
- ✅ Funciona en cualquier entorno Node.js

### Sobre las Variables de Entorno

**NUNCA** subas las variables de entorno al repositorio de GitHub. Siempre configúralas directamente en Hostinger.

### Sobre el Dominio

El dominio `eterbox.com` debe estar apuntando a los nameservers de Hostinger para que funcione correctamente.

## 🆘 Soporte

Si tienes problemas que no puedes resolver:

1. **Soporte de Hostinger:** Chat en vivo 24/7 en hPanel
2. **Documentación de Hostinger:** https://www.hostinger.com/support
3. **Logs del servidor:** Revisa los logs en Hostinger para ver errores específicos

## ✅ Checklist Final

Antes de considerar el despliegue completo, verifica:

- [ ] El sitio carga correctamente
- [ ] Puedes crear una cuenta y hacer login
- [ ] Puedes crear carpetas y credenciales
- [ ] El checkout de PayPal funciona
- [ ] Los emails se envían correctamente
- [ ] El dominio `eterbox.com` está conectado
- [ ] El SSL está activo (candado verde en el navegador)
- [ ] La aplicación funciona en móvil
- [ ] El 2FA funciona correctamente
- [ ] El generador de contraseñas funciona

## 🎉 ¡Listo!

Tu aplicación EterBox debería estar completamente funcional en Hostinger.

---

**Última actualización:** 2026-01-09  
**Versión del proyecto:** 5cdb93ef (sin esbuild, usa tsx)  
**Creado por:** Manus AI Assistant
