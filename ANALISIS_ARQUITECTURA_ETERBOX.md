# Análisis de Arquitectura y Conexiones del Proyecto EterBox

## 1. Visión General del Proyecto

**EterBox** es un gestor de contraseñas web diseñado para ser seguro, intuitivo y fácil de usar. El proyecto se enfoca en la **seguridad**, la **privacidad** y una **experiencia de usuario** moderna. Está construido como un monorepo, separando claramente el frontend del backend, y utiliza una pila de tecnologías modernas para ofrecer una solución robusta y escalable.

## 2. Arquitectura del Proyecto

### 2.1. Estructura de Directorios

El proyecto sigue una estructura de monorepo bien organizada, lo que facilita su mantenimiento y desarrollo:

```
/eterbox
├── /client/          # Frontend (React + Vite)
├── /server/          # Backend (Node.js + Express + tRPC)
├── /drizzle/         # Esquema y migraciones de la base de datos (Drizzle ORM)
├── /shared/          # Código compartido entre cliente y servidor
├── package.json      # Dependencias y scripts del proyecto
└── ...               # Otros archivos de configuración y documentación
```

### 2.2. Pila Tecnológica (Stack)

La siguiente tabla resume las tecnologías clave utilizadas en el proyecto:

| Capa | Tecnología | Propósito |
|:---|:---|:---|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS | Interfaz de usuario moderna, rápida y con tipado seguro. |
| **Backend** | Node.js, Express.js, tRPC | Servidor robusto con APIs de tipado seguro de extremo a extremo. |
| **Base de Datos** | MySQL, Drizzle ORM | Base de datos relacional con un ORM moderno y de tipado seguro. |
| **Autenticación** | JWT, bcrypt, WebAuthn, 2FA | Múltiples capas de seguridad para la autenticación de usuarios. |
| **Servicios Externos** | Railway, Resend, PayPal | Hosting, envío de emails transaccionales y procesamiento de pagos. |

### 2.3. Flujo de Datos

El flujo de datos sigue un patrón cliente-servidor desacoplado:

1.  **Cliente (React)**: La interfaz de usuario, construida con React, se comunica con el backend a través de tRPC.
2.  **Backend (Express + tRPC)**: El servidor recibe las peticiones, ejecuta la lógica de negocio y se comunica con la base de datos.
3.  **Base de Datos (MySQL)**: Drizzle ORM gestiona todas las interacciones con la base de datos MySQL.

## 3. Base de Datos

### 3.1. Esquema y Tablas Principales

La base de datos utiliza **Drizzle ORM** para definir el esquema y las relaciones. El esquema se encuentra en `drizzle/schema.ts`. Las tablas principales son:

-   `users`: Almacena la información de los usuarios, incluyendo detalles de autenticación y suscripción.
-   `credentials`: Contiene las credenciales encriptadas de los usuarios.
-   `plans`: Define los diferentes planes de suscripción.
-   `folders`: Permite a los usuarios organizar sus credenciales.
-   `sessions`: Gestiona las sesiones activas de los usuarios para mayor seguridad.

### 3.2. Migraciones

Las migraciones de la base de datos se gestionan con `drizzle-kit`, lo que permite un control de versiones del esquema de la base de datos y facilita las actualizaciones.

## 4. Servicios Externos y Conexiones

### 4.1. Hosting y Despliegue (Railway)

El proyecto está configurado para ser desplegado en **Railway**. La documentación en `RAILWAY_DATABASE_SETUP.md` y `RAILWAY_MYSQL_CONNECTION.md` indica cómo configurar la conexión a la base de datos MySQL en Railway. La aplicación se conecta a la base de datos a través de la variable de entorno `DATABASE_URL` o `MYSQL_URL`.

### 4.2. Sistema de Emails (Resend/SMTP)

El sistema de emails transaccionales (bienvenida, recuperación de contraseña, etc.) se gestiona a través de **Resend** o un servidor **SMTP** genérico. La configuración se encuentra en los archivos `EMAIL_SYSTEM_SETUP.md` y `RESEND_SETUP.md`. Las variables de entorno clave son `RESEND_API_KEY` para Resend, o `SMTP_HOST`, `SMTP_USER` y `SMTP_PASSWORD` para una configuración SMTP tradicional.

### 4.3. Pasarela de Pagos (PayPal)

EterBox se integra con **PayPal** para gestionar las suscripciones a los planes de pago. El archivo `server/paypal-utils.ts` contiene la lógica para crear y gestionar suscripciones. La configuración requiere las variables de entorno `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET_KEY` y `PAYPAL_MODE` (`sandbox` o `live`).

### 4.4. Dominio

El dominio principal del proyecto es **eterbox.com**. Este dominio se utiliza en la configuración de CORS, en las plantillas de email y en la configuración de PayPal para las URLs de retorno.

## 5. Variables de Entorno

El archivo `.env.example` y la documentación en `ENV_VARIABLES.md` listan todas las variables de entorno necesarias para que la aplicación funcione correctamente. Estas incluyen credenciales de base de datos, claves de API para servicios externos, y secretos para la autenticación.

## 6. Scripts y Comandos

El archivo `package.json` define varios scripts para el desarrollo y la gestión del proyecto:

-   `dev`: Inicia el servidor de desarrollo.
-   `build`: Compila el frontend y el backend para producción.
-   `start`: Inicia el servidor en modo de producción.
-   `test`: Ejecuta las pruebas unitarias.
-   `db:push`: Aplica las migraciones de la base de datos.

## 7. Resumen y Próximos Pasos

El proyecto EterBox está bien estructurado y documentado. La separación entre frontend y backend, el uso de tecnologías modernas y la clara definición de los servicios externos facilitan su mantenimiento y escalabilidad. 

Para continuar con el desarrollo, te recomiendo:

1.  **Configurar el entorno de desarrollo local**: Asegúrate de tener todas las variables de entorno necesarias en un archivo `.env` y de tener acceso a una base de datos MySQL.
2.  **Revisar los errores existentes**: Analiza los problemas actuales y planifica su corrección.
3.  **Implementar nuevas funcionalidades**: Basado en el `todo.md` y los requerimientos del proyecto, puedes empezar a añadir nuevas características.
