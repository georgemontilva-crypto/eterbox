# Instrucciones para IA: Despliegue de EterBox en Hostinger Node.js Apps

## Contexto del Proyecto

**Nombre:** EterBox - Security Vault  
**Stack:** Vite + React + tRPC + Express.js + MySQL  
**Node version:** 22.x  
**Package manager:** pnpm  

## Problema Actual

El usuario está intentando desplegar la aplicación en **Hostinger Node.js Apps** pero enfrenta el siguiente problema:

1. Hostinger solo muestra un campo de **"Build command"** en la configuración
2. NO hay un campo separado de **"Start command"**
3. El build se completa exitosamente, pero el servidor no se inicia
4. Esto resulta en un error 403 Forbidden al acceder al sitio

## Análisis Técnico

### ¿Por qué falla?

Hostinger Node.js Apps está diseñado principalmente para aplicaciones **frontend** (React, Vue, Angular) y algunas **backend específicas** (Next.js, Express.js puro).

EterBox es una aplicación **fullstack** que combina:
- Frontend: Vite + React (se construye a archivos estáticos)
- Backend: Express.js + tRPC (servidor Node.js que debe mantenerse corriendo)

Cuando Hostinger ejecuta `pnpm run build`, construye ambos (frontend y backend), pero **no inicia el servidor** porque no ejecuta automáticamente el script `start` del package.json.

### Estructura del proyecto

```
eterbox/
├── client/          # Frontend React
├── server/          # Backend Express + tRPC
├── dist/            # Output del build
│   ├── public/      # Frontend compilado (archivos estáticos)
│   └── index.js     # Backend compilado (servidor Node.js)
├── package.json
└── vite.config.ts
```

### Scripts en package.json

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "hostinger": "pnpm install && pnpm build && NODE_ENV=production node dist/index.js"
  }
}
```

## Solución Propuesta

### Opción 1: Modificar el Build Command (Recomendado)

Cambiar el build command en Hostinger para que ejecute tanto el build como el start:

**Build command en Hostinger:**
```bash
pnpm run build && pnpm start
```

**Problema potencial:** El comando `pnpm start` puede bloquear el proceso de build porque mantiene el servidor corriendo. Hostinger podría interpretar esto como un build que nunca termina.

### Opción 2: Crear un script unificado

Modificar el package.json para crear un script que Hostinger pueda ejecutar:

```json
{
  "scripts": {
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "hostinger:deploy": "pnpm install && pnpm run build && pnpm start"
  }
}
```

**Build command en Hostinger:**
```bash
pnpm run hostinger:deploy
```

### Opción 3: Usar archivo de inicio automático

Crear un archivo `index.js` en la raíz que Hostinger pueda reconocer como entry point:

**Crear `/home/ubuntu/eterbox/index.js`:**
```javascript
// Entry point for Hostinger
// This file starts the server after build
import './dist/index.js';
```

Luego configurar en Hostinger:
- **Build command:** `pnpm run build`
- Hostinger debería detectar automáticamente `index.js` y ejecutarlo

### Opción 4: Usar Procfile (si Hostinger lo soporta)

Crear un archivo `Procfile` en la raíz:

```
web: NODE_ENV=production node dist/index.js
```

## Configuración en Hostinger

### Paso 1: Subir el proyecto

1. Descargar el ZIP desde Manus (Management UI → Code → Download all files)
2. En Hostinger, ir a **Websites → Add Website → Node.js Apps**
3. Seleccionar **"Upload your website files"**
4. Subir el archivo ZIP

### Paso 2: Configurar Build Settings

**Configuración recomendada:**

- **Framework preset:** Vite
- **Node version:** 22.x
- **Package manager:** pnpm
- **Root directory:** /
- **Build command:** `pnpm run build && pnpm start` (Opción 1)
  - O: `pnpm run hostinger:deploy` (Opción 2)
  - O: `pnpm run build` (Opción 3, si se creó index.js)
- **Output directory:** dist

### Paso 3: Variables de Entorno

Agregar todas estas variables en la sección "Environment Variables" de Hostinger:

#### Base de Datos
```
DATABASE_URL=mysql://usuario:contraseña@host:3306/nombre_base_datos
```

#### Autenticación
```
JWT_SECRET=tu_jwt_secret_aleatorio_largo_y_seguro
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=tu_owner_open_id
OWNER_NAME=tu_nombre
```

#### PayPal (Modo LIVE)
```
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=tu_paypal_client_id_live
PAYPAL_SECRET_KEY=tu_paypal_secret_key_live
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id_live
```

#### SMTP (Hostinger Email)
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=tu_email@eterbox.com
SMTP_PASSWORD=tu_contraseña_email
SUPPORT_EMAIL=support@eterbox.com
```

#### Aplicación
```
VITE_APP_ID=eterbox
VITE_APP_TITLE=EterBox - Security Vault
VITE_APP_LOGO=https://tu-logo-url.com/logo.png
```

#### Analytics (si aplica)
```
VITE_ANALYTICS_ENDPOINT=tu_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=tu_website_id
```

#### Forge API (Manus)
```
BUILT_IN_FORGE_API_KEY=tu_forge_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Paso 4: Crear Base de Datos MySQL

1. En Hostinger hPanel, ir a **Databases → MySQL Databases**
2. Crear nueva base de datos:
   - Nombre: `eterbox_db`
   - Usuario: crear nuevo usuario
   - Contraseña: generar contraseña segura
3. Anotar los datos de conexión:
   - Host (generalmente `localhost` o una IP)
   - Puerto (generalmente `3306`)
   - Nombre de BD
   - Usuario
   - Contraseña
4. Formar la DATABASE_URL:
   ```
   mysql://usuario:contraseña@host:3306/eterbox_db
   ```

### Paso 5: Desplegar

1. Hacer clic en **"Deploy"**
2. Esperar a que termine el build
3. Revisar los logs para ver si hay errores
4. Si el build termina pero el sitio no funciona, revisar los logs de runtime

## Diagnóstico de Problemas

### Si el build falla

1. Revisar los logs de build en Hostinger
2. Verificar que todas las dependencias estén en `package.json`
3. Verificar que el comando de build sea correcto
4. Verificar que Node version sea 22.x

### Si el build tiene éxito pero el sitio no carga (403 Forbidden)

**Este es el problema actual.** Significa que el build terminó pero el servidor no se inició.

**Soluciones:**

1. **Verificar logs de runtime:** En Hostinger, buscar logs de runtime (no solo build logs) para ver si el servidor se está iniciando
2. **Probar Opción 1:** Cambiar build command a `pnpm run build && pnpm start`
3. **Probar Opción 3:** Crear `index.js` en la raíz y usar build command normal
4. **Contactar soporte de Hostinger:** Preguntar específicamente cómo ejecutar un servidor Express.js después del build

### Si el servidor se inicia pero hay errores de conexión a BD

1. Verificar que DATABASE_URL esté correcta
2. Verificar que la base de datos exista en Hostinger
3. Verificar que el usuario tenga permisos
4. Probar conexión desde SSH si es posible

### Si PayPal no funciona

1. Verificar que PAYPAL_MODE=live
2. Verificar que las credenciales sean de producción (no sandbox)
3. Verificar que VITE_PAYPAL_CLIENT_ID esté configurada (para el frontend)

## Alternativas a Hostinger Node.js Apps

Si Hostinger Node.js Apps no funciona, considerar estas alternativas:

### 1. Hostinger VPS
- Control total del servidor
- Puedes instalar y configurar todo manualmente
- Más complejo pero más flexible

### 2. Railway.app
- Gratis para empezar
- Soporta fullstack Node.js perfectamente
- Detección automática de build y start
- Muy fácil de usar

### 3. Render.com
- Plan gratuito disponible
- Soporta fullstack Node.js
- Configuración simple
- Buena documentación

### 4. Fly.io
- Gratis para proyectos pequeños
- Excelente para Node.js
- Deploy con un comando

## Comandos Útiles para Debugging

Si tienes acceso SSH a Hostinger:

```bash
# Ver si el servidor está corriendo
ps aux | grep node

# Ver logs del servidor
pm2 logs

# Reiniciar el servidor
pm2 restart all

# Ver estado de pm2
pm2 status

# Probar el build localmente
cd /ruta/al/proyecto
pnpm install
pnpm run build
NODE_ENV=production node dist/index.js
```

## Próximos Pasos Recomendados

1. **Intentar Opción 1:** Cambiar build command a `pnpm run build && pnpm start`
2. **Si falla, intentar Opción 3:** Crear `index.js` en la raíz
3. **Si sigue fallando:** Contactar soporte de Hostinger con esta pregunta específica:
   > "Tengo una aplicación Express.js que necesita mantener un servidor corriendo después del build. ¿Cómo configuro el start command en Node.js Apps? Solo veo el campo de Build command."
4. **Si Hostinger no puede resolverlo:** Considerar migrar a Railway o Render

## Información de Contacto del Proyecto

- **Dominio:** eterbox.com
- **Email de soporte:** support@eterbox.com
- **Plan actual:** Hostinger Business o Cloud
- **Versión Node.js:** 22.x
- **Base de datos:** MySQL

## Notas Finales

- El proyecto está completamente funcional en desarrollo (Manus)
- Todos los tests (32) están pasando
- El problema es específicamente con el despliegue en Hostinger
- La aplicación necesita un servidor Node.js corriendo 24/7, no solo archivos estáticos
- Hostinger Node.js Apps puede tener limitaciones para aplicaciones fullstack

---

**Fecha de creación:** 2026-01-09  
**Última actualización:** 2026-01-09  
**Creado por:** Manus AI Assistant
