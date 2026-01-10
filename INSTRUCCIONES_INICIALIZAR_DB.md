# Instrucciones para Inicializar la Base de Datos de Railway

## Paso 1: Descargar el script

Descarga el archivo `init-railway-db.js` del checkpoint que te envié.

## Paso 2: Instalar dependencias

Abre una terminal (Command Prompt, PowerShell, o Terminal) en la carpeta donde descargaste el archivo y ejecuta:

```bash
npm install mysql2
```

Esto instalará la librería necesaria para conectarse a MySQL.

## Paso 3: Ejecutar el script

En la misma terminal, ejecuta:

```bash
node init-railway-db.js
```

## ¿Qué hace el script?

1. Se conecta a tu base de datos de Railway
2. Crea todas las tablas necesarias (users, plans, credentials, folders, etc.)
3. Inserta los 3 planes iniciales:
   - **Free:** 3 credenciales, 1 carpeta, $0/mes
   - **Basic:** 25 credenciales, 5 carpetas, $15/mes
   - **Corporate:** 2500 credenciales, 1500 carpetas, $25/mes
4. Muestra una tabla con los planes creados

## Resultado esperado

Deberías ver algo como:

```
🔗 Connecting to Railway MySQL database...
   Host: shuttle.proxy.rlwy.net:16106
   Database: railway

✅ Connected successfully!

📝 Creating tables and inserting data...

✅ All tables created successfully!

📊 Plans in database:
┌─────────┬────────────┬───────┬─────────────┬─────────┬────────────┬──────────────────┐
│ (index) │    name    │ price │ yearlyPrice │ maxKeys │ maxFolders │ maxGeneratedKeys │
├─────────┼────────────┼───────┼─────────────┼─────────┼────────────┼──────────────────┤
│    0    │   'Free'   │ '0.00'│   '0.00'    │    3    │     1      │        10        │
│    1    │  'Basic'   │'15.00'│  '160.00'   │   25    │     5      │       300        │
│    2    │'Corporate' │'25.00'│  '280.00'   │  2500   │    1500    │        -1        │
└─────────┴────────────┴───────┴─────────────┴─────────┴────────────┴──────────────────┘

🎉 Database initialized successfully!

✅ You can now access your Pricing page at:
   https://eterbox.com/pricing

🔌 Connection closed
```

## Troubleshooting

### Error: "Cannot find module 'mysql2'"

Ejecuta: `npm install mysql2`

### Error: "Access denied"

Las credenciales en el script están incorrectas. Verifica en Railway > MySQL > Variables.

### Error: "ECONNREFUSED"

El host o puerto están incorrectos. Verifica en Railway > MySQL > Variables > MYSQL_PUBLIC_URL.

### El script se ejecutó pero la página sigue vacía

1. Verifica que Railway haya redesplegado la aplicación correctamente
2. Ve a Railway > eterbox > Deployments y verifica que el último deploy sea exitoso
3. Revisa los logs del deployment

## Verificar que funcionó

1. Ve a: https://eterbox.com/pricing
2. Deberías ver las 3 tarjetas de planes con precios
3. Los botones "Monthly" y "Yearly" deberían funcionar

## Siguiente paso

Una vez que la base de datos esté inicializada y la página de Pricing funcione, el siguiente paso es configurar OAuth con Google y GitHub para reemplazar el sistema de autenticación de Manus.
