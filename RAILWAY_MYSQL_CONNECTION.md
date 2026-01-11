# Railway MySQL Connection Guide

## Problema Actual

El servicio `eterbox` tiene `DATABASE_URL` vacío, pero el servicio MySQL está creado y tiene todas las variables configuradas.

## Solución: Conectar Variables de MySQL a eterbox

### Opción 1: Usar Variable Reference (Recomendado)

1. **Ve al servicio `eterbox`** (no MySQL)
2. Haz clic en la pestaña **"Variables"**
3. Haz clic en **"+ New Variable"**
4. Selecciona **"Variable Reference"** (no "New Variable")
5. En el dropdown, selecciona el servicio **"MySQL"**
6. Busca y selecciona **`MYSQL_URL`**
7. Railway agregará automáticamente: `MYSQL_URL=${{MySQL.MYSQL_URL}}`
8. Haz clic en **"Add"**
9. Railway hará **redeploy automático**

### Opción 2: Copiar Manualmente (Alternativa)

Si la Opción 1 no funciona, puedes copiar la URL manualmente:

1. **Ve al servicio MySQL** → pestaña **"Variables"**
2. Copia el valor de **`MYSQL_URL`**:
   ```
   mysql://root:jHgXIkbBcznZdxBQhvVoOXhbWlaMpfiu@mysql.railway.internal:3306/railway
   ```

3. **Ve al servicio `eterbox`** → pestaña **"Variables"**
4. Edita la variable **`DATABASE_URL`**
5. Pega el valor copiado
6. Guarda y Railway hará redeploy

### Opción 3: Usar MYSQL_PUBLIC_URL (Para Conexión Externa)

Si necesitas conectarte desde fuera de Railway (ej: desde tu computadora local):

1. **Ve al servicio MySQL** → pestaña **"Variables"**
2. Copia el valor de **`MYSQL_PUBLIC_URL`** (tiene formato con `.railway.app`)
3. **Ve al servicio `eterbox`** → pestaña **"Variables"**
4. Edita **`DATABASE_URL`** y pega el valor
5. Guarda

**Nota:** `MYSQL_PUBLIC_URL` es más lento pero funciona desde cualquier lugar.

---

## Verificar Conexión

Después de agregar la variable, verifica en los logs de Railway:

1. Ve al servicio **`eterbox`** → pestaña **"Deployments"**
2. Haz clic en el deployment más reciente
3. Ve a **"Deploy Logs"**
4. Busca el mensaje:
   ```
   [Database] Connection established successfully
   ```

Si ves ese mensaje, ¡la conexión funciona! ✅

Si ves errores, revisa:
- Que `MYSQL_URL` esté correctamente configurado
- Que el servicio MySQL esté **Online**
- Que no haya errores de sintaxis en la URL

---

## Formato de DATABASE_URL

El formato correcto es:

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

**Ejemplo:**
```
mysql://root:jHgXIkbBcznZdxBQhvVoOXhbWlaMpfiu@mysql.railway.internal:3306/railway
```

**Componentes:**
- `USER`: root
- `PASSWORD`: jHgXIkbBcznZdxBQhvVoOXhbWlaMpfiu
- `HOST`: mysql.railway.internal (interno de Railway)
- `PORT`: 3306 (puerto por defecto de MySQL)
- `DATABASE`: railway (nombre de la base de datos)

---

## Código de Conexión (Ya Implementado)

El código en `server/db.ts` ya está preparado para usar múltiples variables:

```javascript
const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
```

Esto significa que el código intentará usar:
1. Primero `DATABASE_URL`
2. Si no existe, `MYSQL_URL`
3. Si no existe, `MYSQL_PUBLIC_URL`

Por eso, puedes dejar `DATABASE_URL` vacío y simplemente agregar `MYSQL_URL` como Variable Reference.

---

## Próximos Pasos

1. ✅ Agregar `MYSQL_URL` como Variable Reference al servicio `eterbox`
2. ✅ Esperar redeploy automático (~2-3 minutos)
3. ✅ Verificar logs para confirmar conexión exitosa
4. ✅ Probar login/registro en eterbox.com
5. ✅ Si funciona, eliminar `DATABASE_URL` vacío (opcional)

---

## Troubleshooting

### Error: "Database connection failed"

**Causa:** `DATABASE_URL` está vacío y no hay otras variables configuradas.

**Solución:** Agregar `MYSQL_URL` como Variable Reference.

### Error: "Access denied for user"

**Causa:** Credenciales incorrectas en la URL.

**Solución:** Verificar que la URL copiada sea exactamente la de Railway.

### Error: "Unknown database 'railway'"

**Causa:** La base de datos no existe.

**Solución:** Crear la base de datos ejecutando el script `init-database.sql` o usando el script `init-railway-db.js`.

### Error: "Can't connect to MySQL server"

**Causa:** El host es incorrecto o el servicio MySQL está offline.

**Solución:** 
- Verificar que MySQL esté **Online** en Railway
- Usar `mysql.railway.internal` para conexiones internas
- Usar el host público (ej: `mysql-production-xxxx.railway.app`) para conexiones externas

---

## Referencias

- [Railway Database Documentation](https://docs.railway.app/databases/mysql)
- [Railway Variable References](https://docs.railway.app/develop/variables#variable-references)
- [MySQL Connection Strings](https://dev.mysql.com/doc/refman/8.0/en/connecting-using-uri-or-key-value-pairs.html)
