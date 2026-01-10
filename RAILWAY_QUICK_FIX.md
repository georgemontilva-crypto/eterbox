# Railway Quick Fix Guide

## 🚨 Paso 1: Arreglar el Deployment Crasheado

### En Railway, ve a Settings del servicio **eterbox**:

1. **Pre-deploy Command:** 
   - **BORRA** el contenido actual (`npm run migrate`)
   - **DÉJALO VACÍO** o escribe: `echo "No pre-deploy needed"`

2. **Custom Start Command:**
   - **BORRA** el contenido actual (`pnpm db:push`)
   - **ESCRIBE:** `npm run start`

3. **Guarda los cambios** (Save)

Railway automáticamente hará un nuevo deploy y debería funcionar correctamente.

---

## 📊 Paso 2: Inicializar la Base de Datos

### Opción A: Usar el Query Editor de MySQL (MÁS FÁCIL)

1. En Railway, haz clic en el servicio **MySQL** (no el de eterbox)
2. Ve a la pestaña **"Query"**
3. Abre el archivo `init-database.sql` que creé
4. **Copia TODO el contenido** del archivo
5. **Pégalo** en el Query Editor de Railway
6. Haz clic en **"Run"** o **"Execute"**

Esto creará todas las tablas e insertará los 3 planes (Free, Basic, Corporate).

### Opción B: Usar Railway CLI (Más técnico)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar comandos
railway run node seed-plans-updated.mjs
```

---

## ✅ Paso 3: Verificar que Todo Funciona

### 1. Verificar el Deployment

- En Railway, ve a **Deployments**
- El último deploy debería mostrar ✅ **"Success"**
- Haz clic en el deploy y verifica que no haya errores en los logs

### 2. Verificar la Base de Datos

En el Query Editor de MySQL, ejecuta:

```sql
SELECT id, name, price, yearlyPrice, maxKeys, maxFolders FROM plans;
```

Deberías ver 3 planes:

| id | name      | price | yearlyPrice | maxKeys | maxFolders |
|----|-----------|-------|-------------|---------|------------|
| 1  | Free      | 0.00  | 0.00        | 3       | 1          |
| 2  | Basic     | 15.00 | 160.00      | 25      | 5          |
| 3  | Corporate | 25.00 | 280.00      | 2500    | 1500       |

### 3. Verificar la Página de Pricing

- Ve a: `https://eterbox-production.up.railway.app/pricing`
- Deberías ver las 3 tarjetas de planes con precios
- Los botones "Monthly" y "Yearly" deberían funcionar

---

## 🔧 Troubleshooting

### Error: "Table already exists"

No pasa nada, el script usa `CREATE TABLE IF NOT EXISTS`, así que no duplicará tablas.

### Error: "Duplicate entry"

El script usa `ON DUPLICATE KEY UPDATE`, así que actualizará los planes existentes en lugar de crear duplicados.

### El deployment sigue crasheado

Verifica que:
1. El Custom Start Command sea exactamente: `npm run start`
2. No haya espacios extra al inicio o final
3. Las variables de entorno estén configuradas correctamente

### La página de Pricing sigue vacía

1. Verifica que los planes existan en la base de datos (usa la query de arriba)
2. Verifica que el servicio de eterbox esté corriendo (no crasheado)
3. Revisa los logs del deployment en Railway

---

## 📝 Comandos Correctos para Railway

**Pre-deploy Command:** (vacío o `echo "No pre-deploy needed"`)

**Custom Start Command:** `npm run start`

**Build Command:** (Railway lo detecta automáticamente, no cambiar)

---

## ⚠️ Importante

- **NO pongas** `pnpm db:push` en Custom Start Command
- **NO pongas** `npm run migrate` en Pre-deploy Command (no existe ese script)
- Estos comandos se ejecutan **una sola vez manualmente**, no en cada deploy
