# Bold API Pagos en Línea - Notas de Implementación

## URL Base
```
https://api.online.payments.bold.co
```

## Autenticación
Header: `Authorization: x-api-key <BOLD_API_KEY>`

## Endpoints Principales

### 1. Crear Intención de Pago
```
POST /v1/payment-intent
```

**Body:**
```json
{
  "reference_id": "unique-order-id",
  "amount": {
    "currency": "COP",
    "total_amount": 100000,
    "tip_amount": 0,
    "taxes": []
  },
  "description": "Suscripción EterBox - Plan Basic",
  "callback_url": "https://eterbox.com/api/webhooks/bold",
  "customer": {
    "name": "Cliente",
    "email": "cliente@email.com",
    "phone": "3001234567"
  }
}
```

**Response:**
```json
{
  "reference_id": "unique-order-id",
  "status": "ACTIVE",
  "bold_transaction_id": "TXN123",
  "creation_date": "timestamp"
}
```

### 2. Realizar Intento de Pago
```
POST /v1/payment-attempt
```

**Body:**
```json
{
  "reference_id": "unique-order-id",
  "payment_method": {
    "type": "CARD",
    "card": {
      "number": "4111111111111111",
      "cvv": "123",
      "expiration_month": "12",
      "expiration_year": "2025",
      "cardholder_name": "CLIENTE"
    }
  }
}
```

### 3. Consultar Estado de Pago
```
GET /v1/payment-intent/{reference_id}
```

### 4. Webhook
Bold enviará notificaciones POST a `callback_url` cuando cambie el estado del pago.

**Payload del Webhook:**
```json
{
  "reference_id": "unique-order-id",
  "status": "APPROVED|REJECTED|PENDING",
  "bold_transaction_id": "TXN123",
  "payment_method": "CARD|PSE|NEQUI",
  "amount": 100000
}
```

## Estados de Pago
- `ACTIVE`: Intención creada, esperando pago
- `APPROVED`: Pago aprobado
- `REJECTED`: Pago rechazado
- `PENDING`: Pago pendiente (PSE, Nequi)
- `REFUNDED`: Reembolsado
- `VOIDED`: Anulado

## Métodos de Pago Soportados
- `CARD`: Tarjetas de crédito/débito
- `PSE`: Pagos PSE (requiere callback_url)
- `NEQUI`: Pagos con Nequi
- `DAVIPLATA`: Pagos con Daviplata

## Ambiente de Pruebas (Sandbox)
- Usar API Key de pruebas
- Tarjeta de prueba: `4111111111111111`
- CVV: cualquier 3 dígitos
- Fecha: cualquier fecha futura

## Variables de Entorno Necesarias
```
BOLD_API_KEY=<llave de producción>
BOLD_API_KEY_SANDBOX=<llave de pruebas>
BOLD_WEBHOOK_SECRET=<para validar webhooks>
```

## Flujo de Suscripción EterBox
1. Usuario selecciona plan (Basic $15 o Corporate $25)
2. Backend crea intención de pago con Bold
3. Frontend redirige a checkout de Bold o procesa pago
4. Bold envía webhook cuando pago es aprobado
5. Backend actualiza plan del usuario en BD
6. Usuario recibe email de confirmación
