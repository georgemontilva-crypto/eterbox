# Sistema de Cobro Automático y Renovación de Suscripciones

## 📋 Descripción

Este sistema maneja automáticamente:
- ✅ Renovaciones de suscripciones
- ✅ Recordatorios de pago (7, 3 y 1 día antes)
- ✅ Expiración automática de suscripciones vencidas
- ✅ Registro de pagos en `payment_history`
- ✅ Envío de emails de confirmación

---

## 🚀 Funcionalidades Implementadas

### 1. **Contador de Días Restantes**

**Backend:**
- `listUsers` en `/server/api/routers/admin.ts` ahora devuelve `days_remaining`
- `getUserPlan` en `/server/routers.ts` devuelve `subscriptionEndDate`

**Frontend:**
- Columna "Días Restantes" en la tabla de usuarios del admin
- Badge con colores según días restantes:
  - 🔴 Rojo: ≤ 3 días
  - 🟠 Naranja: ≤ 7 días
  - 🟢 Verde: > 7 días
- `RenewalBanner` en el dashboard del usuario muestra días restantes

### 2. **Cambio de Plan Manual**

Cuando un admin cambia el plan de un usuario en `/server/api/routers/admin.ts`:
- **Plan Free (planId 1):** Sin fecha de expiración
- **Planes Pagos (planId 2, 3):** Establece 30 días desde hoy

### 3. **Registro Automático de Pagos**

Cuando un usuario compra un plan en `/server/routers.ts` (líneas 661-675):
- Se registra en `payment_history`
- Se actualiza `subscriptionEndDate`
- Se envía email de confirmación

### 4. **Sistema de Renovación Automática**

**Servicio:** `/server/subscription-renewal-service.ts`

Funciones principales:
- `getUsersWithExpiringSubscriptions(days)` - Obtiene usuarios con suscripciones por expirar
- `sendPaymentReminders(days)` - Envía recordatorios de pago
- `expireOverdueSubscriptions()` - Expira suscripciones vencidas y baja a Free
- `processAutomaticRenewals()` - Procesa renovaciones automáticas con PayPal
- `runDailySubscriptionTasks()` - Ejecuta todas las tareas diarias

**Router:** `/server/api/routers/subscription.ts`

Endpoints:
- `subscription.getExpiringSubscriptions` - Ver suscripciones por expirar (admin)
- `subscription.sendPaymentReminders` - Enviar recordatorios manualmente (admin)
- `subscription.runSubscriptionTasks` - Ejecutar tareas manualmente (super admin)
- `subscription.getMySubscription` - Ver info de suscripción propia

---

## ⚙️ Configuración

### 1. **Base de Datos**

Ejecuta este SQL en TablePlus para inicializar fechas:

```sql
-- Establecer fechas para usuarios con planes pagos
UPDATE users 
SET 
  subscriptionStartDate = NOW(),
  subscriptionEndDate = DATE_ADD(NOW(), INTERVAL 30 DAY),
  subscriptionStatus = 'active'
WHERE planId != 1;

-- Verificar
SELECT 
  id, name, email, planId, subscriptionEndDate,
  DATEDIFF(subscriptionEndDate, NOW()) as dias_restantes
FROM users;
```

### 2. **Cron Job en Railway**

**Opción A: Cron Job Service (Recomendado)**

1. En Railway, crea un nuevo servicio "Cron Job"
2. Configura:
   - **Schedule:** `0 9 * * *` (todos los días a las 9 AM)
   - **Command:** `pnpm tsx server/cron/subscription-tasks.ts`
3. Usa las mismas variables de entorno que el servicio principal

**Opción B: Endpoint Manual**

Ejecuta manualmente desde el panel de admin:
```typescript
const { data } = await trpc.subscription.runSubscriptionTasks.mutate();
```

### 3. **Variables de Entorno**

Asegúrate de tener configuradas:
```env
PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_SECRET_KEY=tu_secret_key
PAYPAL_MODE=sandbox  # o "live" en producción
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=tu_api_key
SUPPORT_EMAIL=noreply@mail.eterbox.com
VITE_APP_URL=https://eterbox.com
```

---

## 🔄 Flujo de Renovación Automática

### Día -7 (7 días antes de expirar)
1. Cron job detecta suscripciones que expiran en 7 días
2. Envía email de recordatorio al usuario
3. Si tiene `paypalSubscriptionId`, indica que se renovará automáticamente

### Día -3 (3 días antes)
1. Envía segundo recordatorio
2. Insta a actualizar método de pago si es necesario

### Día -1 (1 día antes)
1. Envía último recordatorio
2. **Si tiene `paypalSubscriptionId`:**
   - Verifica estado de suscripción en PayPal
   - Si está activa, extiende `subscriptionEndDate` por 30/365 días
   - Registra pago en `payment_history`
   - Envía email de confirmación

### Día 0 (día de expiración)
1. Si no se renovó automáticamente:
   - Cambia `subscriptionStatus` a `'expired'`
   - Baja a plan Free (`planId = 1`)
   - Establece `subscriptionEndDate = NULL`
   - Envía email de expiración

---

## 🧪 Pruebas

### Probar Recordatorios Manualmente

En el panel de admin, ejecuta:
```typescript
// Enviar recordatorios a usuarios que expiran en 7 días
await trpc.subscription.sendPaymentReminders.mutate({ daysBeforeExpiry: 7 });

// Ver usuarios con suscripciones por expirar
const users = await trpc.subscription.getExpiringSubscriptions.query({ daysBeforeExpiry: 7 });
```

### Probar Todas las Tareas

Solo super admins:
```typescript
const results = await trpc.subscription.runSubscriptionTasks.mutate();
console.log(results);
// { renewed: 2, reminders: 5, expired: 1 }
```

### Simular Expiración

En TablePlus:
```sql
-- Establecer fecha de expiración a mañana
UPDATE users 
SET subscriptionEndDate = DATE_ADD(NOW(), INTERVAL 1 DAY)
WHERE id = 6;

-- Establecer fecha de expiración a ayer (para probar expiración)
UPDATE users 
SET subscriptionEndDate = DATE_SUB(NOW(), INTERVAL 1 DAY)
WHERE id = 6;
```

---

## 📊 Monitoreo

### Ver Suscripciones por Expirar

```sql
SELECT 
  u.id,
  u.name,
  u.email,
  p.name as plan_name,
  u.subscriptionEndDate,
  DATEDIFF(u.subscriptionEndDate, NOW()) as dias_restantes,
  u.subscriptionStatus,
  u.paypalSubscriptionId
FROM users u
LEFT JOIN plans p ON u.planId = p.id
WHERE u.subscriptionEndDate IS NOT NULL
  AND u.planId != 1
ORDER BY u.subscriptionEndDate ASC;
```

### Ver Historial de Pagos

```sql
SELECT 
  ph.*,
  u.name as user_name,
  u.email
FROM payment_history ph
LEFT JOIN users u ON ph.user_id = u.id
ORDER BY ph.created_at DESC
LIMIT 50;
```

---

## 🔐 Seguridad

- ✅ Solo admins pueden ver suscripciones de otros usuarios
- ✅ Solo super admins pueden ejecutar tareas de renovación manualmente
- ✅ Los emails de recordatorio solo se envían a usuarios con suscripciones activas
- ✅ Las renovaciones automáticas verifican el estado de PayPal antes de procesar

---

## 📝 Notas Importantes

1. **PayPal Subscriptions vs One-Time Payments:**
   - Actualmente el sistema usa **one-time payments**
   - Para renovación 100% automática, necesitas implementar **PayPal Subscriptions**
   - El campo `paypalSubscriptionId` está preparado para esto

2. **Webhooks de PayPal:**
   - Para renovaciones completamente automáticas, configura webhooks en PayPal
   - URL: `https://tu-dominio.com/api/paypal/webhook`
   - Eventos: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `PAYMENT.SALE.COMPLETED`

3. **Emails:**
   - Los emails usan el servicio configurado en `SMTP_*` (Resend recomendado)
   - Personaliza los templates en `/server/subscription-renewal-service.ts`

4. **Timezone:**
   - El cron job se ejecuta en UTC
   - Ajusta el schedule según tu timezone

---

## 🆘 Troubleshooting

### Los recordatorios no se envían

1. Verifica que el cron job esté corriendo
2. Revisa logs en Railway
3. Verifica credenciales SMTP
4. Ejecuta manualmente: `trpc.subscription.sendPaymentReminders.mutate({ daysBeforeExpiry: 7 })`

### Las suscripciones no expiran

1. Verifica que `subscriptionEndDate` esté en el pasado
2. Ejecuta manualmente: `trpc.subscription.runSubscriptionTasks.mutate()`
3. Revisa logs del cron job

### Los días restantes no aparecen

1. Verifica que `subscriptionEndDate` no sea NULL
2. Ejecuta el UPDATE en TablePlus
3. Recarga el panel de admin

---

## 🎯 Próximos Pasos

1. ✅ Implementar PayPal Subscriptions para renovación 100% automática
2. ✅ Configurar webhooks de PayPal
3. ✅ Agregar panel de métricas de suscripciones en admin
4. ✅ Implementar descuentos y cupones
5. ✅ Agregar notificaciones push para recordatorios

---

¿Preguntas? Contacta al equipo de desarrollo.
