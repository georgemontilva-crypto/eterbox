# 📁 Guía de Instalación - Sistema de Compartir Carpetas

## ✅ Cambios Implementados

### **Backend**
- ✅ Tabla `folder_shares` en base de datos
- ✅ Endpoints tRPC para compartir/descompartir carpetas
- ✅ Validación de planes Corporate/Enterprise
- ✅ Envío de email de notificación con Resend
- ✅ Funciones de base de datos en `server/folder-shares-db.ts`

### **Frontend**
- ✅ Modal `ShareFolderModal` para gestionar compartidos
- ✅ Página `/shared` para ver carpetas compartidas conmigo
- ✅ Sección "Shared with Me" en Dashboard
- ✅ Badge "Shared" en carpetas compartidas
- ✅ Indicador de número de usuarios compartidos
- ✅ Botón de compartir en cada carpeta
- ✅ Traducciones completas (EN/ES)

---

## 🗄️ Paso 1: Ejecutar Migración SQL en TablePlus

### **Instrucciones:**

1. **Abre TablePlus** y conéctate a tu base de datos TiDB de EterBox

2. **Copia y ejecuta el siguiente SQL:**

```sql
-- Create folder_shares table
CREATE TABLE IF NOT EXISTS folder_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folder_id INT NOT NULL,
  owner_id INT NOT NULL,
  shared_with_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign keys
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Prevent duplicate shares
  UNIQUE KEY unique_folder_share (folder_id, shared_with_user_id),
  
  -- Indexes for performance
  INDEX idx_folder_id (folder_id),
  INDEX idx_owner_id (owner_id),
  INDEX idx_shared_with_user_id (shared_with_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

3. **Verifica que la tabla se creó correctamente:**

```sql
SHOW TABLES LIKE 'folder_shares';
DESCRIBE folder_shares;
```

4. **Resultado esperado:**
   - Deberías ver la tabla `folder_shares` con 6 columnas
   - 3 foreign keys configuradas
   - 1 unique constraint
   - 3 índices

---

## 🚀 Paso 2: Verificar Deployment en Railway

El código ya fue pusheado a GitHub. Railway debería estar haciendo el deployment automáticamente.

### **Verifica el deployment:**

1. Ve a tu dashboard de Railway
2. Busca el proyecto **EterBox**
3. Revisa los logs de deployment
4. Espera a que el status sea **"Deployed"** ✅

### **Tiempo estimado:** 3-5 minutos

---

## 🧪 Paso 3: Probar la Funcionalidad

### **Requisitos para probar:**
- ✅ 2 usuarios registrados en EterBox
- ✅ 1 usuario con plan **Corporate** o **Enterprise**
- ✅ Al menos 1 carpeta creada

### **Flujo de prueba:**

#### **1. Compartir una carpeta**
1. Inicia sesión con el usuario que tiene plan Corporate/Enterprise
2. Ve al Dashboard
3. Haz click en el botón **Users** (👥) de una carpeta
4. Se abre el modal "Share Folder"
5. Ingresa el email del otro usuario
6. Click en **"Share"**
7. ✅ Deberías ver un mensaje de éxito
8. ✅ El otro usuario recibe un **email de notificación**

#### **2. Ver carpeta compartida**
1. Inicia sesión con el usuario que recibió la carpeta
2. Ve al Dashboard
3. ✅ Deberías ver una sección **"Shared with Me"**
4. ✅ La carpeta compartida aparece con badge **"Shared"**
5. ✅ Muestra "by [nombre del dueño]"
6. Click en la carpeta compartida
7. ✅ Puedes ver todas las credenciales (solo lectura)
8. ✅ Puedes copiar las contraseñas
9. ❌ NO puedes editar ni eliminar

#### **3. Gestionar compartidos**
1. Vuelve al usuario dueño de la carpeta
2. Click en el botón **Users** (👥) de la carpeta
3. ✅ Deberías ver la lista de usuarios compartidos
4. Click en **"Remove access"** de un usuario
5. ✅ El usuario es removido
6. ✅ Ya no puede ver la carpeta

#### **4. Indicador de compartidos**
1. En el Dashboard del dueño
2. ✅ Las carpetas compartidas muestran un badge con el número de usuarios
3. Ejemplo: **👥 2** (compartida con 2 personas)

---

## 📧 Paso 4: Verificar Email de Notificación

### **Contenido del email:**

**Asunto (EN):** `EterBox - [Owner Name] shared "[Folder Name]" with you`  
**Asunto (ES):** `EterBox - [Owner Name] compartió "[Folder Name]" contigo`

### **Características del email:**
- ✅ Diseño profesional con tema oscuro
- ✅ Nombre de la carpeta destacado
- ✅ Información del dueño (nombre + email)
- ✅ Badge "Read Only" / "Solo Lectura"
- ✅ Botón "View Shared Folder" → `/shared`
- ✅ Advertencia de seguridad
- ✅ Traducción automática según idioma del usuario

### **Verificar en Resend:**
1. Ve a tu dashboard de Resend
2. Busca en "Emails" el email enviado
3. Revisa que se envió correctamente
4. Verifica el contenido HTML

---

## 🔐 Paso 5: Validación de Planes

### **Restricciones implementadas:**

| Plan | Puede Compartir Carpetas |
|------|--------------------------|
| **Free** | ❌ NO |
| **Basic** | ❌ NO |
| **Premium** | ❌ NO |
| **Corporate** | ✅ SÍ |
| **Enterprise** | ✅ SÍ |

### **Probar restricción:**
1. Inicia sesión con usuario **Free/Basic/Premium**
2. Intenta compartir una carpeta
3. ✅ Deberías ver mensaje: **"Corporate or Enterprise Plan Required"**
4. ✅ Botón de "Upgrade Plan"

---

## 📱 Navegación

### **Nuevas rutas agregadas:**

| Ruta | Descripción |
|------|-------------|
| `/shared` | Ver carpetas compartidas conmigo |

### **Menú lateral (Mobile):**
- ✅ Nuevo botón **"Shared with Me"** / **"Compartido Conmigo"**
- ✅ Ubicado debajo de "Dashboard"

---

## 🎨 Elementos Visuales

### **Dashboard - Your Folders:**
```
📁 Marketing Accounts  5 credentials  [👥 3]  [+] [✏️] [👥] [🗑️] [→]
```
- Badge **👥 3** = Compartida con 3 usuarios

### **Dashboard - Shared with Me:**
```
📁 Client Passwords  12 credentials  [🔒 Shared]  by john@company.com  [→]
```
- Badge **🔒 Shared** = Carpeta compartida (solo lectura)

---

## 🌐 Traducciones Agregadas

### **Español:**
- "Compartir Carpeta"
- "Compartido con"
- "Solo Lectura"
- "Remover acceso"
- "¡Carpeta compartida exitosamente! El usuario ha sido notificado."
- "Compartido Conmigo"
- "Compartida"

### **Inglés:**
- "Share Folder"
- "Shared with"
- "Read Only"
- "Remove access"
- "Folder shared successfully! The user has been notified."
- "Shared with Me"
- "Shared"

---

## ⚠️ Notas Importantes

### **Seguridad:**
- ✅ Solo el dueño puede compartir/descompartir
- ✅ Los usuarios compartidos tienen acceso **READ-ONLY**
- ✅ No pueden editar, eliminar ni mover credenciales
- ✅ No pueden compartir con otros usuarios
- ✅ Si se elimina la carpeta, se eliminan todos los shares

### **Base de Datos:**
- ✅ Foreign keys con `ON DELETE CASCADE`
- ✅ Unique constraint para evitar duplicados
- ✅ Índices para optimizar queries

### **Performance:**
- ✅ Query optimizado con JOINs
- ✅ Índices en columnas frecuentemente consultadas
- ✅ Carga lazy de carpetas compartidas

---

## 🐛 Troubleshooting

### **Problema: La tabla no se crea**
**Solución:**
- Verifica que estás conectado a la base de datos correcta
- Asegúrate de que las tablas `folders` y `users` existen
- Revisa los permisos de tu usuario de base de datos

### **Problema: No se envía el email**
**Solución:**
- Verifica que `RESEND_API_KEY` está configurado en Railway
- Revisa los logs del servidor: `Failed to send folder shared email`
- El share se crea igual, solo falla el email

### **Problema: No aparece el botón de compartir**
**Solución:**
- Verifica que el usuario tiene plan Corporate o Enterprise
- Limpia caché del navegador
- Revisa que el deployment se completó correctamente

### **Problema: No veo carpetas compartidas**
**Solución:**
- Asegúrate de que alguien te compartió una carpeta
- Refresca la página
- Verifica en `/shared` también

---

## 📊 Métricas de Éxito

### **Después de la implementación, deberías poder:**

- ✅ Compartir carpetas con otros usuarios (Corporate/Enterprise)
- ✅ Ver carpetas compartidas en Dashboard
- ✅ Recibir email de notificación al ser agregado
- ✅ Acceder a credenciales compartidas (solo lectura)
- ✅ Gestionar usuarios con acceso a carpetas
- ✅ Ver indicador de número de usuarios compartidos
- ✅ Navegar a página `/shared`
- ✅ Todo en español e inglés

---

## 🎯 Próximos Pasos Sugeridos

1. **Notificaciones en tiempo real** (WebSockets)
2. **Permisos granulares** (read, write, admin)
3. **Compartir por link** (sin necesidad de registro)
4. **Expiración de shares** (acceso temporal)
5. **Audit log** (quién accedió a qué y cuándo)
6. **Compartir credenciales individuales** (no solo carpetas)

---

## 📞 Soporte

Si tienes algún problema durante la implementación:

1. Revisa los logs de Railway
2. Verifica la consola del navegador (F12)
3. Revisa los logs del servidor
4. Contacta al equipo de desarrollo

---

**¡Sistema de Compartir Carpetas listo para producción!** 🎉
