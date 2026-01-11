import { Shield, Cookie } from "lucide-react";

export default function CookiePolicy() {
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
          <div className="flex items-center gap-4">
            <Cookie className="w-12 h-12 text-accent" />
            <div>
              <h1 className="text-4xl font-bold">Política de Cookies</h1>
              <p className="text-muted-foreground mt-2">
                Última actualización: Enero 2026
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-lg leading-relaxed">
                Esta Política de Cookies explica qué son las cookies, cómo las usamos en EterBox, qué tipos de cookies utilizamos, y cómo puedes controlarlas. Al usar nuestro sitio web, aceptas el uso de cookies de acuerdo con esta política.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. ¿Qué son las Cookies?</h2>
              
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora, tablet, smartphone) cuando visitas un sitio web. Permiten que el sitio web recuerde tus acciones y preferencias durante un período de tiempo, para que no tengas que volver a configurarlas cada vez que regreses.
              </p>
              
              <p className="mt-4">
                Las cookies pueden ser:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies de sesión:</strong> Temporales, se eliminan cuando cierras el navegador</li>
                <li><strong>Cookies persistentes:</strong> Permanecen en tu dispositivo durante un tiempo determinado</li>
                <li><strong>Cookies propias:</strong> Establecidas por EterBox</li>
                <li><strong>Cookies de terceros:</strong> Establecidas por servicios externos que usamos</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Cookies que Usamos</h2>
              
              <h3 className="text-xl font-semibold mt-6">2.1 Cookies Estrictamente Necesarias</h3>
              <p>
                Estas cookies son esenciales para que el sitio web funcione correctamente. No puedes desactivarlas sin afectar la funcionalidad del sitio.
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left">Cookie</th>
                      <th className="border border-border px-4 py-2 text-left">Propósito</th>
                      <th className="border border-border px-4 py-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2"><code>auth_token</code></td>
                      <td className="border border-border px-4 py-2">Mantiene tu sesión iniciada</td>
                      <td className="border border-border px-4 py-2">7 días</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2"><code>csrf-token</code></td>
                      <td className="border border-border px-4 py-2">Protección contra ataques CSRF</td>
                      <td className="border border-border px-4 py-2">Sesión</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2"><code>cookie_consent</code></td>
                      <td className="border border-border px-4 py-2">Recuerda tus preferencias de cookies</td>
                      <td className="border border-border px-4 py-2">1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mt-8">2.2 Cookies de Funcionalidad</h3>
              <p>
                Estas cookies permiten que el sitio web recuerde tus preferencias y proporcione funcionalidades mejoradas.
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left">Cookie</th>
                      <th className="border border-border px-4 py-2 text-left">Propósito</th>
                      <th className="border border-border px-4 py-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2"><code>language</code></td>
                      <td className="border border-border px-4 py-2">Recuerda tu idioma preferido</td>
                      <td className="border border-border px-4 py-2">1 año</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2"><code>theme</code></td>
                      <td className="border border-border px-4 py-2">Recuerda tu tema (claro/oscuro)</td>
                      <td className="border border-border px-4 py-2">1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mt-8">2.3 Cookies Analíticas</h3>
              <p>
                Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, recopilando información de forma anónima.
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left">Cookie</th>
                      <th className="border border-border px-4 py-2 text-left">Propósito</th>
                      <th className="border border-border px-4 py-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2"><code>_analytics_id</code></td>
                      <td className="border border-border px-4 py-2">Identificador anónimo para análisis de uso</td>
                      <td className="border border-border px-4 py-2">2 años</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2"><code>_analytics_session</code></td>
                      <td className="border border-border px-4 py-2">Rastrea la duración de la sesión</td>
                      <td className="border border-border px-4 py-2">30 minutos</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Nota:</strong> Todas nuestras cookies analíticas son anónimas y no rastrean información personal identificable.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Cookies de Terceros</h2>
              
              <p>
                Algunos servicios externos que usamos pueden establecer sus propias cookies:
              </p>

              <h3 className="text-xl font-semibold mt-6">3.1 Procesadores de Pago</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>PayPal:</strong> Para procesar pagos de forma segura</li>
                <li><strong>Stripe:</strong> Para procesar pagos con tarjeta</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Estas cookies solo se establecen cuando realizas un pago. Consulta sus políticas de privacidad para más información.
              </p>

              <h3 className="text-xl font-semibold mt-6">3.2 Proveedores de Autenticación</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google OAuth:</strong> Si eliges iniciar sesión con Google</li>
                <li><strong>Apple Sign In:</strong> Si eliges iniciar sesión con Apple</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Cómo Controlar las Cookies</h2>
              
              <h3 className="text-xl font-semibold mt-6">4.1 Configuración del Navegador</h3>
              <p>
                La mayoría de los navegadores web te permiten controlar las cookies a través de la configuración. Puedes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ver qué cookies están almacenadas y eliminarlas individualmente</li>
                <li>Bloquear cookies de terceros</li>
                <li>Bloquear todas las cookies</li>
                <li>Eliminar todas las cookies al cerrar el navegador</li>
              </ul>

              <p className="mt-4">
                <strong>Instrucciones por navegador:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
                <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos de sitios web</li>
                <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio → Cookies y datos del sitio</li>
              </ul>

              <div className="bg-muted border border-border rounded-lg p-4 mt-6">
                <p className="text-sm">
                  <strong>⚠️ Advertencia:</strong> Bloquear o eliminar cookies puede afectar la funcionalidad de EterBox. Por ejemplo, no podrás mantener tu sesión iniciada o guardar tus preferencias.
                </p>
              </div>

              <h3 className="text-xl font-semibold mt-8">4.2 Banner de Consentimiento</h3>
              <p>
                Cuando visitas EterBox por primera vez, te mostramos un banner de consentimiento de cookies. Puedes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Aceptar todas:</strong> Permite todas las cookies</li>
                <li><strong>Rechazar:</strong> Solo permite cookies esenciales</li>
                <li><strong>Personalizar:</strong> Elige qué tipos de cookies aceptar</li>
              </ul>
              
              <p className="mt-4">
                Puedes cambiar tus preferencias en cualquier momento desde la configuración de tu cuenta.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Tecnologías Similares</h2>
              
              <p>
                Además de cookies, también usamos:
              </p>

              <h3 className="text-xl font-semibold mt-6">5.1 Local Storage</h3>
              <p>
                Almacenamos datos localmente en tu navegador para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cachear datos de la bóveda para acceso offline</li>
                <li>Guardar preferencias de interfaz</li>
                <li>Mejorar el rendimiento de la aplicación</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">5.2 Session Storage</h3>
              <p>
                Datos temporales que se eliminan al cerrar la pestaña:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Estado temporal de la aplicación</li>
                <li>Datos de formularios no enviados</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Actualizaciones de esta Política</h2>
              
              <p>
                Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en nuestras prácticas o por razones operativas, legales o regulatorias. Te notificaremos cualquier cambio significativo publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Más Información</h2>
              
              <p>
                Si tienes preguntas sobre nuestra Política de Cookies, contáctanos:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li><strong>Email:</strong> <a href="mailto:privacy@eterbox.com" className="text-accent hover:underline">privacy@eterbox.com</a></li>
                <li><strong>Soporte:</strong> <a href="mailto:support@eterbox.com" className="text-accent hover:underline">support@eterbox.com</a></li>
              </ul>

              <p className="mt-6">
                Para más información sobre cómo protegemos tu privacidad, consulta nuestra <a href="/privacy-policy" className="text-accent hover:underline">Política de Privacidad</a>.
              </p>
            </section>
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
