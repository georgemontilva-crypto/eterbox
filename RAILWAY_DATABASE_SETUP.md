# Railway Database Setup Guide

## Paso 1: Ejecutar Migraciones (Crear Tablas)

Primero necesitas crear todas las tablas en la base de datos de Railway.

### Opción A: Usar el comando de Drizzle (Recomendado)

```bash
pnpm db:push
```

Este comando:
1. Lee el esquema de `drizzle/schema.ts`
2. Genera las migraciones necesarias
3. Aplica los cambios a la base de datos

### Opción B: Ejecutar SQL manualmente

Si `pnpm db:push` no funciona, puedes ejecutar el SQL manualmente en Railway:

1. Ve a tu proyecto en Railway
2. Selecciona el servicio de MySQL
3. Ve a la pestaña **"Query"**
4. Copia y pega el contenido de `drizzle/schema.ts` convertido a SQL

## Paso 2: Poblar la Base de Datos con Planes

Una vez que las tablas estén creadas, necesitas insertar los 3 planes iniciales (Free, Basic, Corporate).

### Ejecutar el script de seeding:

```bash
node seed-plans-updated.mjs
```

Este script:
- Se conecta a la base de datos usando `DATABASE_URL`
- Inserta o actualiza los 3 planes con todos los campos correctos
- Muestra una tabla con los planes creados

### Variables de entorno necesarias:

Asegúrate de que `DATABASE_URL` esté configurada en Railway:

```
DATABASE_URL=mysql://user:password@host:port/database
```

## Paso 3: Verificar que los Planes Existen

Ejecuta esta query en Railway para verificar:

```sql
SELECT id, name, price, yearlyPrice, maxKeys, maxFolders, maxGeneratedKeys FROM plans;
```

Deberías ver 3 planes:

| id | name      | price | yearlyPrice | maxKeys | maxFolders | maxGeneratedKeys |
|----|-----------|-------|-------------|---------|------------|------------------|
| 1  | Free      | 0     | 0           | 3       | 1          | 10               |
| 2  | Basic     | 15    | 160         | 25      | 5          | 300              |
| 3  | Corporate | 25    | 280         | 2500    | 1500       | -1               |

## Paso 4: Crear Usuario de Prueba (Opcional)

Si quieres probar la aplicación sin OAuth, puedes crear un usuario manualmente:

```sql
INSERT INTO users (openId, name, email, avatar, planId, createdAt, updatedAt)
VALUES ('test-user-123', 'Test User', 'test@example.com', NULL, 1, NOW(), NOW());
```

## Troubleshooting

### Error: "Table doesn't exist"

Ejecuta `pnpm db:push` para crear las tablas.

### Error: "DATABASE_URL is not defined"

Verifica que la variable de entorno esté configurada en Railway.

### Error: "Duplicate entry"

Los planes ya existen. El script los actualizará automáticamente.

## Comandos Útiles

```bash
# Ver el esquema actual
pnpm drizzle-kit introspect

# Generar migraciones
pnpm drizzle-kit generate

# Aplicar migraciones
pnpm drizzle-kit migrate

# Push directo (sin migraciones)
pnpm db:push
```

## Notas Importantes

- **No elimines los planes existentes** - El script los actualiza automáticamente
- **Backup antes de cambios** - Railway hace backups automáticos, pero es buena práctica
- **Verifica las variables de entorno** - Asegúrate de que todas estén configuradas correctamente
