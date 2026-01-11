import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Lock, Eye, Database, Mail, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold">EterBox</span>
            </a>
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Volver al inicio
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
            <p className="text-muted-foreground">
              Última actualización: Enero 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-lg leading-relaxed">
                En EterBox, tu privacidad es nuestra máxima prioridad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal cuando utilizas nuestro servicio de gestión de contraseñas. Al usar EterBox, aceptas las prácticas descritas en esta política.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold m-0">1. Información que Recopilamos</h2>
              </div>
              
              <h3 className="text-xl font-semibold mt-6">1.1 Información de Cuenta</h3>
              <p>
                Cuando te registras en EterBox, recopilamos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Nombre completo:</strong> Para personalizar tu experiencia</li>
                <li><strong>Dirección de correo electrónico:</strong> Para autenticación, comunicaciones y recuperación de cuenta</li>
                <li><strong>Contraseña maestra:</strong> Hasheada con bcrypt (12 rounds), nunca almacenada en texto plano</li>
                <li><strong>Método de inicio de sesión:</strong> Email/contraseña, Google, Apple, o WebAuthn</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">1.2 Datos de Bóveda</h3>
              <p>
                Almacenamos tus credenciales encriptadas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contraseñas guardadas:</strong> Encriptadas con AES-256-GCM usando tu clave derivada única</li>
                <li><strong>Nombres de sitios web y URLs:</strong> Almacenados en texto plano para funcionalidad de búsqueda</li>
                <li><strong>Nombres de usuario:</strong> Almacenados en texto plano</li>
                <li><strong>Notas y campos personalizados:</strong> Encriptados con AES-256-GCM</li>
                <li><strong>Carpetas y etiquetas:</strong> Para organización de credenciales</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">1.3 Información Técnica</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dirección IP:</strong> Para seguridad y prevención de fraude</li>
                <li><strong>Información del dispositivo:</strong> Tipo de navegador, sistema operativo, agente de usuario</li>
                <li><strong>Datos de sesión:</strong> Tokens JWT, cookies de autenticación</li>
                <li><strong>Registros de actividad:</strong> Inicios de sesión, cambios de contraseña, eventos de seguridad</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">1.4 Información de Pago</h3>
              <p>
                Para suscripciones premium, procesamos pagos a través de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>PayPal:</strong> No almacenamos información de tarjetas, solo IDs de transacción</li>
                <li><strong>Stripe:</strong> Tokens seguros, últimos 4 dígitos de tarjeta, marca</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold m-0">2. Cómo Usamos tu Información</h2>
              </div>
              
              <p>Utilizamos tu información para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Proporcionar el servicio:</strong> Almacenar, sincronizar y recuperar tus contraseñas de forma segura</li>
                <li><strong>Autenticación:</strong> Verificar tu identidad y mantener tu sesión activa</li>
                <li><strong>Seguridad:</strong> Detectar y prevenir accesos no autorizados, fraude y abuso</li>
                <li><strong>Comunicaciones:</strong> Enviarte notificaciones importantes, actualizaciones de seguridad y responder a tus consultas</li>
                <li><strong>Mejoras del servicio:</strong> Analizar uso agregado (no individual) para mejorar funcionalidades</li>
                <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold m-0">3. Encriptación y Seguridad</h2>
              </div>
              
              <h3 className="text-xl font-semibold mt-6">3.1 Arquitectura de Conocimiento Cero</h3>
              <p>
                EterBox implementa una arquitectura de <strong>conocimiento cero</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tus contraseñas se encriptan en tu dispositivo antes de enviarse a nuestros servidores</li>
                <li>Usamos <strong>AES-256-GCM</strong> (estándar militar) con derivación de claves por usuario</li>
                <li>Ni nosotros ni nadie más puede descifrar tus contraseñas sin tu contraseña maestra</li>
                <li>Si olvidas tu contraseña maestra, no podemos recuperar tus datos (son irrecuperables)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">3.2 Medidas de Seguridad</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encriptación en tránsito:</strong> TLS 1.3 para todas las comunicaciones</li>
                <li><strong>Encriptación en reposo:</strong> AES-256-GCM para datos sensibles en base de datos</li>
                <li><strong>Hashing de contraseñas:</strong> bcrypt con 12 rounds de salt</li>
                <li><strong>Autenticación multifactor:</strong> TOTP (Google Authenticator compatible)</li>
                <li><strong>WebAuthn/Biométrico:</strong> Soporte para Face ID, Touch ID, Windows Hello</li>
                <li><strong>Rate limiting:</strong> Protección contra ataques de fuerza bruta</li>
                <li><strong>Headers de seguridad:</strong> HSTS, CSP, X-Frame-Options</li>
                <li><strong>Auditorías regulares:</strong> Revisiones de seguridad y pruebas de penetración</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold m-0">4. Compartir Información</h2>
              </div>
              
              <p>
                <strong>NO vendemos, alquilamos ni compartimos tu información personal con terceros para marketing.</strong>
              </p>
              
              <p className="mt-4">Compartimos información solo en estos casos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Proveedores de servicios:</strong> Hosting (AWS/Google Cloud), procesadores de pago (PayPal, Stripe), servicios de email (Resend) - todos bajo acuerdos de confidencialidad</li>
                <li><strong>Cumplimiento legal:</strong> Si es requerido por ley, orden judicial o autoridades gubernamentales</li>
                <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos, propiedad o seguridad, o la de nuestros usuarios</li>
                <li><strong>Transferencias comerciales:</strong> En caso de fusión, adquisición o venta de activos (con notificación previa)</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold m-0">5. Tus Derechos</h2>
              </div>
              
              <p>Tienes derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acceso:</strong> Solicitar una copia de tu información personal</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de tu cuenta y datos (derecho al olvido)</li>
                <li><strong>Portabilidad:</strong> Exportar tus datos en formato JSON</li>
                <li><strong>Restricción:</strong> Limitar el procesamiento de tu información</li>
                <li><strong>Objeción:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Retirar consentimiento:</strong> En cualquier momento, sin afectar la legalidad del procesamiento previo</li>
              </ul>
              
              <p className="mt-4">
                Para ejercer estos derechos, contáctanos en: <a href="mailto:privacy@eterbox.com" className="text-accent hover:underline">privacy@eterbox.com</a>
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold m-0">6. Retención de Datos</h2>
              </div>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Datos de cuenta activa:</strong> Mientras tu cuenta esté activa</li>
                <li><strong>Datos de cuenta eliminada:</strong> 30 días de período de gracia, luego eliminación permanente</li>
                <li><strong>Registros de seguridad:</strong> 90 días para investigación de incidentes</li>
                <li><strong>Datos de facturación:</strong> 7 años (requisito legal fiscal)</li>
                <li><strong>Datos anónimos agregados:</strong> Indefinidamente para análisis estadístico</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Cookies y Tecnologías Similares</h2>
              
              <p>Usamos cookies para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies esenciales:</strong> Autenticación, sesión, preferencias de idioma</li>
                <li><strong>Cookies de seguridad:</strong> CSRF tokens, detección de fraude</li>
                <li><strong>Cookies analíticas:</strong> Uso agregado del sitio (anónimo)</li>
              </ul>
              
              <p className="mt-4">
                Puedes gestionar cookies en la configuración de tu navegador. Ver nuestra <a href="/cookie-policy" className="text-accent hover:underline">Política de Cookies</a> para más detalles.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Transferencias Internacionales</h2>
              
              <p>
                Tus datos pueden ser transferidos y procesados en servidores ubicados fuera de tu país de residencia. Garantizamos que estas transferencias cumplen con las leyes de protección de datos aplicables (GDPR, CCPA) mediante:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cláusulas contractuales estándar aprobadas por la UE</li>
                <li>Certificaciones Privacy Shield (cuando aplique)</li>
                <li>Medidas de seguridad técnicas y organizativas adecuadas</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Menores de Edad</h2>
              
              <p>
                EterBox no está dirigido a menores de 16 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado datos de un menor, eliminaremos esa información inmediatamente. Si eres padre/madre y crees que tu hijo nos ha proporcionado información, contáctanos.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Cambios a esta Política</h2>
              
              <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos cambios significativos por email o mediante aviso destacado en nuestro sitio web. La fecha de "Última actualización" al inicio indica cuándo se revisó por última vez.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Contacto</h2>
              
              <p>
                Si tienes preguntas, inquietudes o solicitudes sobre esta Política de Privacidad o nuestras prácticas de datos, contáctanos:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li><strong>Email:</strong> <a href="mailto:privacy@eterbox.com" className="text-accent hover:underline">privacy@eterbox.com</a></li>
                <li><strong>Soporte:</strong> <a href="mailto:support@eterbox.com" className="text-accent hover:underline">support@eterbox.com</a></li>
                <li><strong>Sitio web:</strong> <a href="https://eterbox.com" className="text-accent hover:underline">https://eterbox.com</a></li>
              </ul>
            </section>

            {/* Footer note */}
            <div className="border-t border-border pt-8 mt-12">
              <p className="text-sm text-muted-foreground">
                Esta Política de Privacidad cumple con el Reglamento General de Protección de Datos (GDPR) de la UE, la Ley de Privacidad del Consumidor de California (CCPA) y otras leyes de privacidad aplicables.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 EterBox. Todos los derechos reservados.</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="/privacy-policy" className="hover:text-foreground">Privacidad</a>
              <a href="/terms" className="hover:text-foreground">Términos</a>
              <a href="/cookie-policy" className="hover:text-foreground">Cookies</a>
              <a href="/security" className="hover:text-foreground">Seguridad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
