# 🗄️ Migración de Base de Datos - Planes EterBox

Este archivo explica cómo ejecutar la migración de planes en Railway.

## 📋 ¿Qué hace la migración?

1. **Actualiza Plan Corporate (ID 3)**
   - Agrega: "Complete audits and compliance"
   - Agrega: "Automatic backup"
   - Agrega: "24/7 dedicated support"

2. **Crea Plan Enterprise (ID 4)**
   - Precio: $99/mes ($1080/año con 9% descuento)
   - Credenciales ilimitadas (maxKeys = -1)
   - Carpetas ilimitadas (maxFolders = -1)
   - 11 características premium

## 🚀 Método 1: Deploy Automático (RECOMENDADO)

### Paso 1: Subir cambios a GitHub

```bash
git add .
git commit -m "feat: Add Enterprise plan and update Corporate features"
git push origin main
```

### Paso 2: Railway detectará el cambio automáticamente

Railway hará el deploy automáticamente cuando detecte el push.

### Paso 3: Ejecutar migración manualmente en Railway

Una vez que el deploy termine:

1. Ve a Railway Dashboard
2. Selecciona tu proyecto EterBox
3. Ve a la pestaña **"Deployments"**
4. Haz clic en el deployment más reciente
5. Abre la **"Console"** o **"Shell"**
6. Ejecuta:

```bash
pnpm migrate
```

O directamente:

```bash
node migrate-plans.mjs
```

---

## ⚡ Método 2: Ejecutar desde Railway CLI (Local)

Si tienes Railway CLI instalado:

```bash
# Asegúrate de estar en el directorio del proyecto
cd /ruta/a/eterbox

# Conecta al proyecto
railway link

# Ejecuta la migración
railway run pnpm migrate
```

---

## 🔍 Verificar que la migración funcionó

### Opción A: Desde Railway Dashboard

1. Ve a Database > Data > plans
2. Verifica que existan 4 planes
3. Verifica que el plan Enterprise (ID 4) exista
4. Verifica que Corporate tenga las nuevas características

### Opción B: Desde la aplicación

1. Ve a https://eterbox.com/pricing
2. Verifica que se muestren 4 tarjetas de planes
3. Verifica que Enterprise muestre "Unlimited" o "Ilimitado"
4. Inicia sesión y ve al Dashboard
5. Verifica que muestre "∞" para planes ilimitados

---

## 🐛 Solución de Problemas

### Error: "Plan Enterprise ya existe"

La migración detecta si el plan ya existe y no lo crea de nuevo. Si necesitas actualizarlo:

1. Elimina el plan Enterprise manualmente desde Railway Dashboard
2. Ejecuta la migración de nuevo

### Error: "Cannot find module 'mysql2'"

Asegúrate de que las dependencias estén instaladas:

```bash
pnpm install
```

### Error: "Access denied"

Verifica que las variables de entorno estén configuradas correctamente en Railway:
- MYSQLHOST
- MYSQLPORT
- MYSQLUSER
- MYSQLPASSWORD
- MYSQLDATABASE

---

## 📝 Notas Técnicas

- La migración es **idempotente**: puede ejecutarse múltiples veces sin causar problemas
- Si el plan Enterprise ya existe, la migración se salta automáticamente
- Los errores en la migración NO fallan el deploy (para evitar downtime)
- La migración usa las variables de entorno de Railway automáticamente

---

## ✅ Checklist Post-Deploy

- [ ] Código subido a GitHub
- [ ] Railway hizo el deploy automáticamente
- [ ] Migración ejecutada con `pnpm migrate`
- [ ] Plan Enterprise visible en Railway Database
- [ ] Plan Corporate actualizado con nuevas características
- [ ] Página /pricing muestra 4 planes
- [ ] Dashboard muestra "∞" para planes ilimitados
- [ ] Traducciones funcionan en español e inglés

---

**Fecha de creación:** 11 de enero de 2026  
**Autor:** Manus AI  
**Proyecto:** EterBox - Security Vault
