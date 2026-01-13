import { Shield, DollarSign } from "lucide-react";

export default function RefundPolicy() {
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
            <DollarSign className="w-12 h-12 text-accent" />
            <div>
              <h1 className="text-4xl font-bold">Política de Reembolsos</h1>
              <p className="text-muted-foreground mt-2">
                Última actualización: Enero 2026
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-lg leading-relaxed">
                En EterBox, queremos que estés completamente satisfecho con nuestro servicio. Esta Política de Reembolsos describe las condiciones bajo las cuales puedes solicitar un reembolso, cómo procesamos las devoluciones, y qué esperar durante el proceso.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Garantía de Satisfacción de 30 Días</h2>
              
              <p>
                Ofrecemos una <strong>garantía de satisfacción de 30 días</strong> para nuevas suscripciones premium (Básico y Corporativo).
              </p>

              <h3 className="text-xl font-semibold mt-6">1.1 Elegibilidad</h3>
              <p>
                Puedes solicitar un reembolso completo si:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Es tu primera suscripción a un plan de pago en EterBox</li>
                <li>Solicitas el reembolso dentro de los primeros 30 días desde la fecha de compra</li>
                <li>No has violado nuestros <a href="/terms" className="text-accent hover:underline">Términos y Condiciones</a></li>
                <li>No has abusado del servicio o realizado actividades fraudulentas</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">1.2 Proceso</h3>
              <p>
                Para solicitar un reembolso bajo esta garantía:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Envía un email a <a href="mailto:refunds@eterbox.com" className="text-accent hover:underline">refunds@eterbox.com</a></li>
                <li>Incluye tu dirección de email registrada y número de orden</li>
                <li>Opcionalmente, comparte el motivo de tu insatisfacción (nos ayuda a mejorar)</li>
                <li>Procesaremos tu solicitud en 3-5 días hábiles</li>
                <li>El reembolso se reflejará en tu método de pago original en 5-10 días hábiles</li>
              </ol>

              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Nota:</strong> No necesitas proporcionar una razón detallada. Respetamos tu decisión y procesaremos tu reembolso sin preguntas innecesarias.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Reembolsos Fuera del Período de 30 Días</h2>
              
              <p>
                Después de los primeros 30 días, los reembolsos se evalúan caso por caso.
              </p>

              <h3 className="text-xl font-semibold mt-6">2.1 Circunstancias Excepcionales</h3>
              <p>
                Consideraremos reembolsos parciales o completos en casos como:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Problemas técnicos graves:</strong> Si el servicio ha estado inaccesible durante períodos prolongados</li>
                <li><strong>Cargos duplicados:</strong> Si se te cobró dos veces por error</li>
                <li><strong>Facturación incorrecta:</strong> Si se te cobró un monto incorrecto</li>
                <li><strong>Circunstancias médicas o personales:</strong> Evaluadas individualmente con documentación</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">2.2 Reembolsos NO Disponibles</h3>
              <p>
                No ofrecemos reembolsos en los siguientes casos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cambio de opinión después de 30 días</li>
                <li>Falta de uso del servicio (no iniciar sesión no califica para reembolso)</li>
                <li>Incompatibilidad con dispositivos no soportados</li>
                <li>Violación de nuestros Términos de Servicio</li>
                <li>Cuentas suspendidas o terminadas por abuso</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Cancelación de Suscripción</h2>
              
              <h3 className="text-xl font-semibold mt-6">3.1 Cómo Cancelar</h3>
              <p>
                Puedes cancelar tu suscripción en cualquier momento:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Inicia sesión en tu cuenta de EterBox</li>
                <li>Ve a <strong>Configuración → Suscripción</strong></li>
                <li>Haz clic en "Cancelar Suscripción"</li>
                <li>Confirma la cancelación</li>
              </ol>

              <h3 className="text-xl font-semibold mt-6">3.2 Efecto de la Cancelación</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tu suscripción permanecerá activa hasta el final del período de facturación actual</li>
                <li>No se te cobrará en el próximo ciclo de renovación</li>
                <li>Mantendrás acceso completo hasta la fecha de vencimiento</li>
                <li>Después de la fecha de vencimiento, tu cuenta se convertirá al plan gratuito</li>
                <li>Tus datos permanecerán intactos, pero con las limitaciones del plan gratuito</li>
              </ul>

              <div className="bg-muted border border-border rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Importante:</strong> Cancelar tu suscripción NO elimina tu cuenta. Si deseas eliminar tu cuenta completamente, debes hacerlo por separado en Configuración → Cuenta → Eliminar Cuenta.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Reembolsos Prorrateados</h2>
              
              <p>
                En general, NO ofrecemos reembolsos prorrateados por tiempo no utilizado, excepto en estas situaciones:
              </p>

              <h3 className="text-xl font-semibold mt-6">4.1 Cambios de Precio</h3>
              <p>
                Si aumentamos el precio de tu plan y no aceptas el nuevo precio, puedes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancelar antes de la renovación (sin reembolso del período actual)</li>
                <li>Continuar con el precio anterior hasta el final de tu período actual</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">4.2 Downgrade de Plan</h3>
              <p>
                Si cambias de un plan superior a uno inferior:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El cambio se aplica al inicio del próximo ciclo de facturación</li>
                <li>NO se reembolsa la diferencia del período actual</li>
                <li>Mantienes las características del plan superior hasta la renovación</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Métodos de Reembolso</h2>
              
              <h3 className="text-xl font-semibold mt-6">5.1 Método de Pago Original</h3>
              <p>
                Los reembolsos se procesan al método de pago original:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tarjeta de crédito/débito (Stripe):</strong> 5-10 días hábiles</li>
                <li><strong>PayPal:</strong> 3-5 días hábiles</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">5.2 Métodos de Pago Expirados</h3>
              <p>
                Si tu tarjeta ha expirado o la cuenta de PayPal está cerrada:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contáctanos en <a href="mailto:refunds@eterbox.com" className="text-accent hover:underline">refunds@eterbox.com</a></li>
                <li>Proporcionaremos métodos alternativos de reembolso</li>
                <li>Puede requerir verificación adicional de identidad</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Cargos Duplicados o Erróneos</h2>
              
              <p>
                Si notas un cargo duplicado o incorrecto:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contáctanos inmediatamente en <a href="mailto:billing@eterbox.com" className="text-accent hover:underline">billing@eterbox.com</a></li>
                <li>Proporciona:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Tu dirección de email registrada</li>
                    <li>Número de orden o ID de transacción</li>
                    <li>Captura de pantalla del cargo</li>
                    <li>Descripción del problema</li>
                  </ul>
                </li>
                <li>Investigaremos y resolveremos en 24-48 horas</li>
                <li>Si se confirma el error, procesaremos el reembolso inmediatamente</li>
              </ol>

              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Garantía:</strong> Los errores de facturación confirmados se reembolsan al 100% sin excepciones, independientemente del tiempo transcurrido.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Plan Gratuito</h2>
              
              <p>
                El plan gratuito de EterBox es permanentemente gratuito y no requiere información de pago. No hay cargos ocultos ni períodos de prueba que se conviertan automáticamente en suscripciones de pago.
              </p>

              <p className="mt-4">
                <strong>Características del Plan Gratuito:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Almacenamiento ilimitado de contraseñas</li>
                <li>Sincronización entre dispositivos</li>
                <li>Generador de contraseñas</li>
                <li>Autenticación de dos factores (2FA)</li>
                <li>Soporte por email</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Disputas y Contracargos</h2>
              
              <p>
                <strong>Por favor, contáctanos antes de iniciar un contracargo.</strong>
              </p>

              <h3 className="text-xl font-semibold mt-6">8.1 Proceso de Disputa</h3>
              <p>
                Si tienes un problema con un cargo:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contáctanos primero en <a href="mailto:billing@eterbox.com" className="text-accent hover:underline">billing@eterbox.com</a></li>
                <li>Resolveremos la mayoría de problemas en 24-48 horas</li>
                <li>Si no estás satisfecho, puedes iniciar una disputa formal</li>
              </ol>

              <h3 className="text-xl font-semibold mt-6">8.2 Contracargos</h3>
              <p>
                Los contracargos tienen consecuencias:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tu cuenta será suspendida inmediatamente</li>
                <li>Se te cobrará una tarifa de procesamiento de contracargo ($25 USD)</li>
                <li>Perderás acceso a tus datos hasta que se resuelva la disputa</li>
                <li>Si el contracargo es injustificado, tu cuenta puede ser terminada permanentemente</li>
              </ul>

              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Advertencia:</strong> Los contracargos fraudulentos violan nuestros Términos de Servicio y pueden resultar en acciones legales. Siempre intenta resolver problemas directamente con nosotros primero.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Tiempo de Procesamiento</h2>
              
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left">Tipo de Reembolso</th>
                      <th className="border border-border px-4 py-2 text-left">Tiempo de Aprobación</th>
                      <th className="border border-border px-4 py-2 text-left">Tiempo de Procesamiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">Garantía 30 días</td>
                      <td className="border border-border px-4 py-2">1-3 días hábiles</td>
                      <td className="border border-border px-4 py-2">5-10 días hábiles</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">Cargo duplicado</td>
                      <td className="border border-border px-4 py-2">24-48 horas</td>
                      <td className="border border-border px-4 py-2">3-7 días hábiles</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">Circunstancias excepcionales</td>
                      <td className="border border-border px-4 py-2">5-10 días hábiles</td>
                      <td className="border border-border px-4 py-2">7-14 días hábiles</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Los tiempos de procesamiento dependen de tu banco o proveedor de pago y pueden variar.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Contacto</h2>
              
              <p>
                Para solicitudes de reembolso o preguntas sobre facturación:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li><strong>Reembolsos:</strong> <a href="mailto:refunds@eterbox.com" className="text-accent hover:underline">refunds@eterbox.com</a></li>
                <li><strong>Facturación:</strong> <a href="mailto:billing@eterbox.com" className="text-accent hover:underline">billing@eterbox.com</a></li>
                <li><strong>Soporte general:</strong> <a href="mailto:support@eterbox.com" className="text-accent hover:underline">support@eterbox.com</a></li>
              </ul>

              <p className="mt-6">
                <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (UTC-5)
              </p>
            </section>

            {/* Footer note */}
            <div className="border-t border-border pt-8 mt-12">
              <p className="text-sm text-muted-foreground">
                Esta Política de Reembolsos complementa nuestros <a href="/terms" className="text-accent hover:underline">Términos y Condiciones</a>. En caso de conflicto, prevalecen los Términos y Condiciones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EterBox®. Todos los derechos reservados.</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="/privacy-policy" className="hover:text-foreground">Privacidad</a>
              <a href="/terms" className="hover:text-foreground">Términos</a>
              <a href="/cookie-policy" className="hover:text-foreground">Cookies</a>
              <a href="/refund-policy" className="hover:text-foreground">Reembolsos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
