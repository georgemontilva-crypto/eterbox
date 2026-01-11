# Railway Rate Limiter Fix

## Problema Resuelto

**Error:** `ERR_ERL_PERMISSIVE_TRUST_PROXY`

Este error ocurría porque `app.set('trust proxy', true)` permite a cualquiera bypass el rate limiting, lo cual es un riesgo de seguridad.

## Solución Implementada

### 1. Trust Proxy Configurado Correctamente

```javascript
// Antes (INSEGURO):
app.set('trust proxy', true); // ❌ Permite bypass del rate limiting

// Ahora (SEGURO):
app.set('trust proxy', 1); // ✅ Confía solo en el primer proxy (Railway)
```

**Explicación:**
- `trust proxy: 1` significa "confiar solo en el primer proxy en la cadena"
- Railway usa un reverse proxy, así que necesitamos confiar en él para obtener la IP real del cliente
- Usar `1` en lugar de `true` previene que atacantes manipulen headers `X-Forwarded-For` para bypass el rate limiting

### 2. Rate Limiting Habilitado

**General API:**
- 100 requests por 15 minutos
- Desactivado automáticamente en desarrollo

**Autenticación (login, register, 2FA):**
- 10 intentos por 15 minutos
- Desactivado automáticamente en desarrollo
- Solo cuenta intentos fallidos (`skipSuccessfulRequests: true`)

### 3. Código Actualizado

```javascript
// Rate limiting - General API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  skip: (req) => process.env.NODE_ENV === 'development',
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests from this IP, please try again later.' });
  },
});

// Rate limiting - Authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  skip: (req) => process.env.NODE_ENV === 'development',
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many authentication attempts, please try again later.' });
  },
});

// Apply limiters
app.use('/api/', generalLimiter);
app.use("/api/trpc/auth.login", authLimiter);
app.use("/api/trpc/auth.register", authLimiter);
app.use("/api/trpc/twoFactor.verify", authLimiter);
```

## Beneficios de Seguridad

✅ **Protección contra ataques de fuerza bruta** - Máximo 10 intentos de login en 15 minutos
✅ **Protección contra DoS** - Máximo 100 requests por IP en 15 minutos
✅ **No afecta desarrollo** - Rate limiting desactivado en `NODE_ENV=development`
✅ **Configuración segura** - Solo confía en el proxy de Railway, no en todos

## Despliegue en Railway

1. **Commit y push** a GitHub:
   ```bash
   git add server/_core/index.ts
   git commit -m "fix: Configure trust proxy correctly for Railway (trust proxy: 1)"
   git push origin main
   ```

2. **Railway detectará el cambio** y desplegará automáticamente

3. **Verificar** que no hay errores en los logs de Railway

4. **Probar** login/registro en eterbox.com

## Notas Técnicas

- **Railway usa un reverse proxy** que agrega headers `X-Forwarded-For`
- **Trust proxy: 1** permite a Express leer la IP real del cliente desde ese header
- **Sin trust proxy**, todas las requests parecen venir de la misma IP (el proxy)
- **Con trust proxy: true**, cualquiera puede manipular el header y bypass el rate limiting
- **Con trust proxy: 1**, solo se confía en el primer proxy (Railway)

## Referencias

- [Express trust proxy documentation](https://expressjs.com/en/guide/behind-proxies.html)
- [express-rate-limit trust proxy warning](https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/)
- [Railway deployment docs](https://docs.railway.app/deploy/deployments)
