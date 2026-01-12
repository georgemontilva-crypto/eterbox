# Configuración de Resend para Envío de Emails

Este documento explica cómo configurar Resend para habilitar el envío de emails en EterBox (bienvenida, recuperación de contraseña, notificaciones de seguridad).

## 📧 ¿Qué es Resend?

[Resend](https://resend.com) es un servicio moderno de envío de emails para desarrolladores. Ofrece:
- API simple y confiable
- Templates HTML profesionales
- Entrega garantizada
- Analytics y tracking
- Plan gratuito: 3,000 emails/mes

## 🔑 Obtener API Key de Resend

### Paso 1: Crear cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Haz clic en "Sign Up" o "Get Started"
3. Regístrate con tu email (o GitHub)
4. Verifica tu email

### Paso 2: Crear API Key

1. Una vez dentro del dashboard, ve a **API Keys** en el menú lateral
2. Haz clic en **"Create API Key"**
3. Asigna un nombre descriptivo: `EterBox Production` o `EterBox Development`
4. Selecciona los permisos:
   - ✅ **Sending access** (requerido)
   - ✅ **Full access** (recomendado para producción)
5. Haz clic en **"Create"**
6. **⚠️ IMPORTANTE**: Copia la API Key inmediatamente. Solo se muestra una vez.
   - Formato: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### Paso 3: Verificar dominio (Opcional pero recomendado)

Para enviar emails desde tu propio dominio (ej: `noreply@eterbox.com`):

1. En el dashboard de Resend, ve a **Domains**
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio: `eterbox.com`
4. Agrega los registros DNS que Resend te proporciona:
   - **SPF** (TXT record)
   - **DKIM** (TXT record)
   - **DMARC** (TXT record)
5. Espera la verificación (puede tomar hasta 48 horas)

**Nota**: Si no verificas un dominio, los emails se enviarán desde `onboarding@resend.dev` (funcional pero menos profesional).

## ⚙️ Configurar en Railway (Producción)

### Opción 1: Desde el Dashboard de Railway

1. Ve a [railway.app](https://railway.app)
2. Selecciona tu proyecto **EterBox**
3. Haz clic en tu servicio
4. Ve a la pestaña **"Variables"**
5. Haz clic en **"New Variable"**
6. Agrega:
   - **Variable name**: `RESEND_API_KEY`
   - **Value**: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx` (tu API Key)
7. Haz clic en **"Add"**
8. Railway redesplegará automáticamente tu aplicación

### Opción 2: Desde Railway CLI

```bash
railway variables set RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Opción 3: Desde archivo `.env` (solo desarrollo local)

**⚠️ NUNCA subas este archivo a GitHub**

```bash
# .env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
SUPPORT_EMAIL=noreply@eterbox.com  # Email "From" para envíos
```

## 🧪 Probar la Configuración

### Prueba 1: Registro de nuevo usuario

1. Crea una nueva cuenta en tu aplicación
2. Deberías recibir un **email de bienvenida** con:
   - Saludo personalizado
   - Guía de primeros pasos
   - Botón "Go to Dashboard"

### Prueba 2: Recuperación de contraseña

1. En la página de login, haz clic en **"Forgot Password?"**
2. Ingresa tu email
3. Deberías recibir un **email de recuperación** con:
   - Link de reset (válido por 15 minutos)
   - Instrucciones de seguridad

### Prueba 3: Cambio de contraseña

1. Ve a **Settings** → **Change Password**
2. Cambia tu contraseña
3. Deberías recibir un **email de notificación** con:
   - Confirmación del cambio
   - Detalles (hora, IP)
   - Instrucciones si no fuiste tú

## 📊 Monitorear Envíos

### Dashboard de Resend

1. Ve a [resend.com/emails](https://resend.com/emails)
2. Verás todos los emails enviados:
   - ✅ **Delivered**: Email entregado exitosamente
   - ⏳ **Queued**: En cola de envío
   - ❌ **Failed**: Error en el envío (revisa logs)

### Logs en Railway

```bash
# Ver logs del servidor
railway logs

# Buscar errores de email
railway logs | grep "email"
```

## 🔧 Solución de Problemas

### Error: "Failed to send email: API key not found"

**Causa**: `RESEND_API_KEY` no está configurada o es incorrecta.

**Solución**:
1. Verifica que la variable esté en Railway
2. Confirma que el formato sea correcto: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Regenera la API Key en Resend si es necesario

### Error: "Failed to send email: Invalid from address"

**Causa**: El email `SUPPORT_EMAIL` no está verificado en Resend.

**Solución**:
1. Verifica tu dominio en Resend (ver Paso 3 arriba)
2. O usa el dominio por defecto: `onboarding@resend.dev`

### Los emails no llegan

**Posibles causas**:
1. **Carpeta de spam**: Revisa la carpeta de spam/junk
2. **Dominio no verificado**: Verifica tu dominio en Resend
3. **Límite de envíos**: Revisa tu cuota en el dashboard de Resend
4. **Email inválido**: Confirma que el email del destinatario sea válido

## 📈 Límites y Pricing

### Plan Gratuito
- **3,000 emails/mes**
- Perfecto para desarrollo y pequeños proyectos
- Sin tarjeta de crédito requerida

### Plan Pro ($20/mes)
- **50,000 emails/mes**
- Dominio personalizado
- Soporte prioritario
- Analytics avanzados

### Plan Enterprise (Custom)
- Emails ilimitados
- SLA garantizado
- Soporte dedicado
- IP dedicada

## 🔐 Seguridad

### Mejores Prácticas

1. **Nunca expongas tu API Key**:
   - ❌ No la subas a GitHub
   - ❌ No la incluyas en el código frontend
   - ✅ Usa variables de entorno

2. **Rota las API Keys periódicamente**:
   - Cada 3-6 meses
   - Inmediatamente si sospechas compromiso

3. **Usa diferentes keys para desarrollo y producción**:
   - `RESEND_API_KEY_DEV`
   - `RESEND_API_KEY_PROD`

4. **Monitorea el uso**:
   - Revisa el dashboard de Resend regularmente
   - Configura alertas para uso inusual

## 📚 Recursos Adicionales

- [Documentación oficial de Resend](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Resend Status Page](https://status.resend.com)
- [Soporte de Resend](mailto:support@resend.com)

## ✅ Checklist de Configuración

- [ ] Cuenta creada en Resend
- [ ] API Key generada y copiada
- [ ] Dominio verificado (opcional)
- [ ] Variable `RESEND_API_KEY` agregada en Railway
- [ ] Variable `SUPPORT_EMAIL` configurada
- [ ] Aplicación redesplegada en Railway
- [ ] Email de bienvenida probado (registro)
- [ ] Email de recuperación probado (forgot password)
- [ ] Email de cambio de contraseña probado (change password)
- [ ] Monitoreo configurado en dashboard de Resend

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo o revisa los logs en Railway.
