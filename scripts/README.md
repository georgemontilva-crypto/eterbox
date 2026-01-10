# Scripts de Administración

## Actualizar Plan Corporativo a Ilimitado

Este script actualiza el plan Corporativo en la base de datos para mostrar "Ilimitado" en lugar de números.

### Cómo ejecutar en Railway:

1. Ve a tu proyecto en Railway: https://railway.app
2. Selecciona tu servicio de Node.js
3. Ve a "Settings" → "Deploy"
4. Cambia "Custom Start Command" a: `node scripts/update-corporate-unlimited.mjs`
5. Guarda y espera el deployment (1-2 minutos)
6. Revisa los logs - deberías ver "✅ DONE! Corporate plan is now unlimited."
7. **IMPORTANTE:** Restaura el comando a: `npm run start`

---

## Crear Usuario Administrador en Producción

Este script crea un usuario administrador en la base de datos de producción (Railway).

### Cómo ejecutar en Railway:

#### Opción 1: Usando Railway CLI (Recomendado)

1. Instala Railway CLI si no lo tienes:
   ```bash
   npm install -g @railway/cli
   ```

2. Inicia sesión en Railway:
   ```bash
   railway login
   ```

3. Vincula tu proyecto:
   ```bash
   railway link
   ```

4. Ejecuta el script:
   ```bash
   railway run node scripts/create-admin-production.mjs
   ```

#### Opción 2: Desde el Dashboard de Railway

1. Ve a tu proyecto en Railway: https://railway.app
2. Selecciona tu servicio de Node.js
3. Ve a la pestaña "Settings"
4. En "Deploy Triggers", habilita "Custom Start Command" temporalmente
5. Cambia el comando a: `node scripts/create-admin-production.mjs`
6. Guarda y espera el deployment
7. Revisa los logs para ver las credenciales
8. **IMPORTANTE:** Restaura el comando original después: `npm run start`

#### Opción 3: Usando el Query Editor de Railway (MySQL)

Si prefieres ejecutar SQL directamente:

1. Ve a tu base de datos MySQL en Railway
2. Abre el "Query Editor"
3. Ejecuta este SQL:

```sql
-- Primero, hashea la contraseña "Admin123!" usando bcrypt con 12 rounds
-- El hash resultante es: $2b$12$9ubaAfJjJ0W6CuA.rKqcK.tJA85Md.CG7QB7SidUK2SIx/w2WSvEC

INSERT INTO users (name, email, password, role, emailVerified, loginMethod, planId, twoFactorEnabled, webauthnEnabled, createdAt)
VALUES (
  'Administrator',
  'admin@eterbox.com',
  '$2b$12$9ubaAfJjJ0W6CuA.rKqcK.tJA85Md.CG7QB7SidUK2SIx/w2WSvEC',
  'admin',
  1,
  'email',
  1,
  0,
  0,
  NOW()
)
ON DUPLICATE KEY UPDATE
  password = '$2b$12$9ubaAfJjJ0W6CuA.rKqcK.tJA85Md.CG7QB7SidUK2SIx/w2WSvEC',
  emailVerified = 1,
  loginMethod = 'email',
  role = 'admin';
```

### Credenciales del Administrador

Después de ejecutar el script, podrás iniciar sesión con:

- **Email:** `admin@eterbox.com`
- **Contraseña:** `Admin123!`
- **URL Login:** https://eterbox.com/login
- **Panel Admin:** https://eterbox.com/admin

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login por seguridad.

### Verificar que funcionó

1. Ve a https://eterbox.com/login
2. Ingresa las credenciales de arriba
3. Deberías poder iniciar sesión exitosamente
4. Ve a https://eterbox.com/admin para acceder al panel de administración
