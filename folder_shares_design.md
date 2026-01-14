# Diseño de Sistema de Compartir Carpetas

## Requisitos
- Solo usuarios con planes **Corporate** y **Enterprise** pueden compartir carpetas
- Los usuarios compartidos tienen permisos de **solo lectura**
- Pueden **ver** y **copiar** credenciales, pero NO modificar
- Indicador visual en carpetas mostrando número de usuarios compartidos
- Página "Shared" en menú lateral para ver carpetas compartidas conmigo
- Gestión de acceso: agregar/remover usuarios por email

## Esquema de Base de Datos

### Tabla: `folder_shares`
```sql
CREATE TABLE folder_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folderId INT NOT NULL,                    -- ID de la carpeta compartida
  ownerId INT NOT NULL,                     -- ID del propietario de la carpeta
  sharedWithUserId INT NOT NULL,            -- ID del usuario con quien se comparte
  permission ENUM('read') DEFAULT 'read',   -- Permisos (solo lectura por ahora)
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE CASCADE,
  FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sharedWithUserId) REFERENCES users(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_share (folderId, sharedWithUserId)  -- Evitar duplicados
);

CREATE INDEX idx_folder_shares_folder ON folder_shares(folderId);
CREATE INDEX idx_folder_shares_shared_with ON folder_shares(sharedWithUserId);
```

## Endpoints tRPC

### `folder.shareFolder`
- **Input:** `{ folderId, userEmail }`
- **Validaciones:**
  - Usuario autenticado tiene plan Corporate o Enterprise
  - La carpeta pertenece al usuario autenticado
  - El usuario a compartir existe y está verificado
  - No compartir con uno mismo
  - No duplicar shares existentes
- **Output:** `{ success, message, share }`

### `folder.unshareFolder`
- **Input:** `{ shareId }` o `{ folderId, sharedWithUserId }`
- **Validaciones:**
  - Usuario autenticado es el propietario de la carpeta
- **Output:** `{ success, message }`

### `folder.getFolderShares`
- **Input:** `{ folderId }`
- **Validaciones:**
  - Usuario autenticado es el propietario
- **Output:** `[ { id, user: { id, name, email }, createdAt } ]`

### `folder.getSharedWithMe`
- **Input:** ninguno (usa userId del contexto)
- **Output:** `[ { folder, owner: { name, email }, sharedAt } ]`

### `folder.getMyFolders` (modificar)
- Agregar campo `sharedCount` a cada carpeta
- Incluir carpetas compartidas conmigo con flag `isShared: true`

## Componentes UI

### `ShareFolderModal.tsx`
- Input para email del usuario
- Lista de usuarios con acceso actual
- Botón para remover acceso
- Badge mostrando plan requerido (Corporate/Enterprise)

### `SharedPage.tsx`
- Lista de carpetas compartidas conmigo
- Mostrar propietario de cada carpeta
- Click para ver credenciales (solo lectura)
- Botón "Copy" para duplicar credenciales a mi cuenta

### Modificaciones en `Dashboard.tsx`
- Badge con número de usuarios en cada carpeta compartida
- Icono de "share" si la carpeta está compartida
- Deshabilitar botón de compartir para planes Free y Basic

### Modificaciones en `Sidebar`
- Nueva opción "Shared" con icono de Users
- Contador de carpetas compartidas conmigo

## Flujo de Usuario

### Compartir una carpeta (Owner)
1. Click en icono de "share" en carpeta
2. Modal se abre
3. Ingresar email del usuario
4. Click "Share"
5. Sistema valida plan y usuario
6. Se crea el share
7. Badge actualiza mostrando +1 usuario

### Ver carpetas compartidas (Shared User)
1. Click en "Shared" en sidebar
2. Ver lista de carpetas compartidas conmigo
3. Click en carpeta
4. Ver credenciales (solo lectura)
5. Opción "Copy to My Vault" para duplicar

### Gestionar acceso (Owner)
1. Click en badge de usuarios compartidos
2. Ver lista de usuarios con acceso
3. Click en "Remove" para revocar acceso
4. Confirmación y actualización

## Traducciones

### Español
- "Compartir carpeta"
- "Compartido conmigo"
- "Gestionar acceso"
- "Solo lectura"
- "Copiar a mi bóveda"
- "Compartido con X usuarios"
- "Esta función requiere plan Corporate o Enterprise"

### Inglés
- "Share folder"
- "Shared with me"
- "Manage access"
- "Read only"
- "Copy to my vault"
- "Shared with X users"
- "This feature requires Corporate or Enterprise plan"
