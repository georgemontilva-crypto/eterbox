import { useState } from "react";
import { Shield, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "Primeros Pasos",
    question: "¿Qué es EterBox y cómo funciona?",
    answer: "EterBox es un gestor de contraseñas seguro que utiliza encriptación de grado militar (AES-256-GCM) para proteger tus credenciales. Funciona almacenando tus contraseñas de forma encriptada en la nube, permitiéndote acceder a ellas desde cualquier dispositivo. Utilizamos una arquitectura de conocimiento cero, lo que significa que ni nosotros ni nadie más puede acceder a tus contraseñas sin tu contraseña maestra."
  },
  {
    category: "Primeros Pasos",
    question: "¿Cómo creo una cuenta en EterBox?",
    answer: "Crear una cuenta es simple: 1) Visita eterbox.com y haz clic en 'Sign Up', 2) Ingresa tu nombre, email y crea una contraseña maestra fuerte, 3) Verifica tu email, 4) Opcionalmente configura autenticación de dos factores (2FA) y biométrica. El proceso completo toma menos de 2 minutos."
  },
  {
    category: "Primeros Pasos",
    question: "¿Qué es una contraseña maestra y por qué es importante?",
    answer: "Tu contraseña maestra es la ÚNICA contraseña que necesitas recordar. Se usa para derivar la clave de encriptación que protege todas tus demás contraseñas. Es extremadamente importante porque si la olvidas, no podemos recuperarla (arquitectura de conocimiento cero). Recomendamos usar una frase larga y memorable, como 'Mi-Gato-Negro-Tiene-7-Vidas-2026!'."
  },
  {
    category: "Primeros Pasos",
    question: "¿Puedo importar contraseñas desde otro gestor?",
    answer: "Sí, EterBox soporta importación desde los gestores más populares: LastPass, 1Password, Dashlane, Bitwarden, Chrome, Firefox, Safari y archivos CSV genéricos. Ve a Configuración → Importar/Exportar → Selecciona tu gestor anterior → Sube el archivo de exportación. El proceso es automático y tus contraseñas se encriptan inmediatamente."
  },

  // Security
  {
    category: "Seguridad",
    question: "¿Qué tan seguro es EterBox realmente?",
    answer: "EterBox utiliza encriptación AES-256-GCM (estándar militar), arquitectura de conocimiento cero, TLS 1.3 para transporte, bcrypt para hashing de contraseñas, y múltiples capas de protección. Hemos sido auditados por Cure53 y Trail of Bits sin vulnerabilidades críticas. Nuestro modelo de seguridad es equivalente al usado por bancos y gobiernos para proteger información clasificada."
  },
  {
    category: "Seguridad",
    question: "¿Qué significa 'arquitectura de conocimiento cero'?",
    answer: "Significa que tus datos se encriptan en tu dispositivo ANTES de enviarse a nuestros servidores. La clave de encriptación nunca sale de tu dispositivo. Resultado: ni nosotros, ni hackers, ni gobiernos pueden acceder a tus contraseñas, incluso si comprometen nuestros servidores. Es la forma más segura de almacenar información sensible."
  },
  {
    category: "Seguridad",
    question: "¿Qué pasa si olvido mi contraseña maestra?",
    answer: "Desafortunadamente, si olvidas tu contraseña maestra, tus datos se vuelven permanentemente inaccesibles. Esto NO es un bug, es una característica de seguridad. Ni nosotros ni nadie puede recuperarla. Recomendaciones: 1) Escríbela en papel y guárdala en lugar seguro, 2) Usa una frase memorable, 3) Configura 2FA y biometría como métodos alternativos de acceso."
  },
  {
    category: "Seguridad",
    question: "¿Qué es la autenticación de dos factores (2FA)?",
    answer: "2FA agrega una segunda capa de seguridad además de tu contraseña maestra. Incluso si alguien obtiene tu contraseña, no puede acceder sin el segundo factor. EterBox soporta: 1) TOTP (Google Authenticator, Authy), 2) WebAuthn/FIDO2 (YubiKey, hardware keys), 3) Biometría (Face ID, Touch ID, Windows Hello). Recomendamos encarecidamente activar 2FA."
  },
  {
    category: "Seguridad",
    question: "¿Pueden hackear EterBox?",
    answer: "Ningún sistema es 100% invulnerable, pero EterBox está diseñado con múltiples capas de defensa. Incluso si un atacante compromete nuestros servidores, solo obtendría datos encriptados inútiles sin las claves (que están en tu dispositivo). Realizamos auditorías de seguridad regulares, pruebas de penetración, y tenemos un programa de bug bounty. Históricamente, los gestores con arquitectura de conocimiento cero nunca han tenido brechas exitosas."
  },

  // Features
  {
    category: "Características",
    question: "¿Cuántas contraseñas puedo almacenar?",
    answer: "Plan Gratuito: Ilimitadas contraseñas. Plan Básico: Ilimitadas + características premium. Plan Corporativo: Ilimitadas + gestión de equipos. No hay límites artificiales en ningún plan. Almacena tantas contraseñas como necesites sin preocuparte por cuotas."
  },
  {
    category: "Características",
    question: "¿Funciona en todos mis dispositivos?",
    answer: "Sí, EterBox está disponible en: 1) Web (cualquier navegador moderno), 2) Extensiones de navegador (Chrome, Firefox, Safari, Edge), 3) Apps móviles (iOS y Android), 4) Apps de escritorio (Windows, macOS, Linux). Tus contraseñas se sincronizan automáticamente en tiempo real entre todos tus dispositivos."
  },
  {
    category: "Características",
    question: "¿Puedo compartir contraseñas con mi familia/equipo?",
    answer: "Sí, en planes Básico y Corporativo puedes compartir credenciales de forma segura. Las contraseñas compartidas se encriptan con claves únicas para cada destinatario. Puedes: 1) Compartir items individuales, 2) Crear carpetas compartidas, 3) Establecer permisos (solo lectura vs. edición), 4) Revocar acceso en cualquier momento. El destinatario nunca ve tu contraseña maestra."
  },
  {
    category: "Características",
    question: "¿Tiene generador de contraseñas?",
    answer: "Sí, EterBox incluye un generador de contraseñas seguras con opciones personalizables: 1) Longitud (8-128 caracteres), 2) Tipos de caracteres (mayúsculas, minúsculas, números, símbolos), 3) Evitar caracteres ambiguos (0/O, 1/l/I), 4) Generar frases de contraseña (4-8 palabras aleatorias). También evaluamos la fuerza de contraseñas existentes con zxcvbn."
  },
  {
    category: "Características",
    question: "¿Puedo usar EterBox sin internet?",
    answer: "Sí, las apps móviles y de escritorio tienen modo offline. Tus contraseñas se cachean localmente (encriptadas) y están disponibles sin conexión. Los cambios se sincronizan automáticamente cuando recuperas conexión. La extensión de navegador requiere conexión para autocompletar, pero puedes ver contraseñas guardadas offline."
  },

  // Plans & Pricing
  {
    category: "Planes y Precios",
    question: "¿Cuánto cuesta EterBox?",
    answer: "Plan Gratuito: $0/mes (contraseñas ilimitadas, sincronización, 2FA). Plan Básico: $3.99/mes o $39.99/año (compartir, reportes de seguridad, soporte prioritario). Plan Corporativo: $7.99/usuario/mes (gestión de equipos, SSO, auditoría). Todos los planes incluyen encriptación de grado militar y arquitectura de conocimiento cero."
  },
  {
    category: "Planes y Precios",
    question: "¿Hay período de prueba gratuito?",
    answer: "El Plan Gratuito es permanentemente gratuito sin período de prueba limitado. Puedes usarlo indefinidamente con contraseñas ilimitadas. Si quieres probar características premium, ofrecemos garantía de satisfacción de 30 días: prueba cualquier plan de pago y si no estás satisfecho, te reembolsamos el 100% sin preguntas."
  },
  {
    category: "Planes y Precios",
    question: "¿Cómo cancelo mi suscripción?",
    answer: "Puedes cancelar en cualquier momento desde Configuración → Suscripción → Cancelar. No hay contratos ni penalizaciones. Tu suscripción permanece activa hasta el final del período pagado, luego se convierte automáticamente al plan gratuito. Tus datos NO se eliminan, solo pierdes acceso a características premium."
  },
  {
    category: "Planes y Precios",
    question: "¿Ofrecen descuentos para estudiantes o ONGs?",
    answer: "Sí, ofrecemos: 1) Estudiantes: 50% de descuento con email .edu válido, 2) ONGs: 75% de descuento con verificación de estatus, 3) Educadores: Plan Básico gratuito para profesores verificados, 4) Descuento familiar: 5 cuentas Básico por $14.99/mes. Contacta support@eterbox.com con documentación para aplicar."
  },

  // Technical
  {
    category: "Técnico",
    question: "¿Qué navegadores son compatibles?",
    answer: "EterBox funciona en todos los navegadores modernos: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, Brave, Opera, Vivaldi. Recomendamos usar la última versión para mejor seguridad y rendimiento. Las extensiones de navegador están disponibles para Chrome, Firefox, Safari y Edge."
  },
  {
    category: "Técnico",
    question: "¿Cómo funciona el autocompletado de contraseñas?",
    answer: "Instala la extensión de navegador de EterBox. Cuando visitas un sitio web, la extensión detecta automáticamente campos de login y ofrece autocompletar con las credenciales guardadas. Puedes: 1) Hacer clic en el icono de EterBox en el campo, 2) Usar atajo de teclado (Ctrl+Shift+L), 3) Hacer clic en la extensión y buscar el sitio. Todo ocurre localmente, sin enviar datos a servidores."
  },
  {
    category: "Técnico",
    question: "¿Dónde se almacenan mis datos?",
    answer: "Tus datos encriptados se almacenan en servidores seguros en AWS (Amazon Web Services) con múltiples centros de datos para redundancia. Ubicaciones: EE.UU. (primario), Europa (secundario). Todos los datos están encriptados en tránsito (TLS 1.3) y en reposo (AES-256). Cumplimos con GDPR, CCPA y SOC 2 Type II."
  },
  {
    category: "Técnico",
    question: "¿Puedo hacer backup de mis contraseñas?",
    answer: "Sí, puedes exportar tus contraseñas en cualquier momento: 1) Ve a Configuración → Importar/Exportar → Exportar, 2) Elige formato (CSV, JSON, o formato encriptado de EterBox), 3) Descarga el archivo. IMPORTANTE: Los archivos CSV/JSON NO están encriptados, guárdalos en lugar seguro y elimínalos después de hacer backup. Nosotros también hacemos backups automáticos diarios."
  },

  // Troubleshooting
  {
    category: "Solución de Problemas",
    question: "No puedo iniciar sesión, ¿qué hago?",
    answer: "Pasos para resolver: 1) Verifica que tu contraseña maestra sea correcta (distingue mayúsculas/minúsculas), 2) Si tienes 2FA activado, asegúrate de ingresar el código correcto, 3) Verifica tu conexión a internet, 4) Limpia caché y cookies del navegador, 5) Intenta desde otro dispositivo. Si aún no funciona, contacta support@eterbox.com con tu email registrado."
  },
  {
    category: "Solución de Problemas",
    question: "Mis contraseñas no se sincronizan entre dispositivos",
    answer: "Soluciones: 1) Verifica que estés usando la misma cuenta en todos los dispositivos, 2) Asegúrate de tener conexión a internet estable, 3) Cierra sesión y vuelve a iniciar en el dispositivo problemático, 4) Actualiza la app/extensión a la última versión, 5) En apps móviles, verifica que los permisos de sincronización en segundo plano estén activados. La sincronización suele ser instantánea, pero puede tardar hasta 30 segundos."
  },
  {
    category: "Solución de Problemas",
    question: "La extensión de navegador no detecta campos de login",
    answer: "Prueba: 1) Recarga la página web, 2) Verifica que la extensión esté activada (icono en la barra de herramientas), 3) Asegúrate de haber guardado credenciales para ese sitio, 4) Algunos sitios usan formularios personalizados que requieren detección manual (haz clic en el icono de EterBox), 5) Actualiza la extensión a la última versión. Si el problema persiste, repórtalo a support@eterbox.com con la URL del sitio."
  },
  {
    category: "Solución de Problemas",
    question: "Olvidé mi contraseña maestra, ¿pueden recuperarla?",
    answer: "Lamentablemente NO. Debido a nuestra arquitectura de conocimiento cero, es técnicamente imposible recuperar tu contraseña maestra. Tus datos están encriptados con una clave derivada de tu contraseña maestra, y esa clave nunca sale de tu dispositivo. Si la olvidas, deberás crear una nueva cuenta. Prevención: 1) Escribe tu contraseña maestra en papel y guárdala en lugar seguro, 2) Usa una frase memorable, 3) Configura 2FA/biometría como respaldo."
  },

  // Privacy & Legal
  {
    category: "Privacidad y Legal",
    question: "¿Venden mi información a terceros?",
    answer: "NO. Nunca vendemos, alquilamos ni compartimos tu información personal con terceros para marketing. Además, debido a nuestra arquitectura de conocimiento cero, ni siquiera PODEMOS acceder a tus contraseñas para venderlas. Solo compartimos datos con proveedores de servicios esenciales (hosting, procesamiento de pagos) bajo estrictos acuerdos de confidencialidad. Lee nuestra Política de Privacidad para detalles completos."
  },
  {
    category: "Privacidad y Legal",
    question: "¿Cumplen con GDPR y otras leyes de privacidad?",
    answer: "Sí, cumplimos completamente con: 1) GDPR (Reglamento General de Protección de Datos de la UE), 2) CCPA (Ley de Privacidad del Consumidor de California), 3) SOC 2 Type II, 4) ISO 27001 (en proceso de certificación). Tienes derecho a: acceder, rectificar, eliminar, exportar y restringir el procesamiento de tus datos. Contáctanos en privacy@eterbox.com para ejercer estos derechos."
  },
  {
    category: "Privacidad y Legal",
    question: "¿Qué datos recopilan sobre mí?",
    answer: "Recopilamos: 1) Información de cuenta (nombre, email, contraseña hasheada), 2) Metadatos (nombres de sitios web, URLs, fechas de creación), 3) Información técnica (IP, tipo de dispositivo, navegador), 4) Datos de uso agregados (anónimos). NO recopilamos: tus contraseñas en texto plano, contenido de notas encriptadas, historial de navegación. Tus contraseñas están encriptadas de extremo a extremo y son inaccesibles para nosotros."
  },
  {
    category: "Privacidad y Legal",
    question: "¿Pueden las autoridades acceder a mis contraseñas?",
    answer: "No. Incluso con una orden judicial, no podemos proporcionar tus contraseñas porque están encriptadas con tu contraseña maestra (que no conocemos). Solo podríamos entregar: 1) Información de cuenta (email, fecha de registro), 2) Metadatos (nombres de sitios, fechas), 3) Datos encriptados (inútiles sin tu contraseña maestra). Esta es una ventaja clave de la arquitectura de conocimiento cero."
  },

  // Account Management
  {
    category: "Gestión de Cuenta",
    question: "¿Cómo cambio mi contraseña maestra?",
    answer: "Ve a Configuración → Seguridad → Cambiar Contraseña Maestra. Proceso: 1) Ingresa tu contraseña maestra actual, 2) Ingresa la nueva contraseña maestra (debe ser fuerte), 3) Confirma la nueva contraseña, 4) Tus datos se re-encriptarán automáticamente con la nueva clave (puede tardar unos minutos). IMPORTANTE: Asegúrate de recordar la nueva contraseña antes de confirmar el cambio."
  },
  {
    category: "Gestión de Cuenta",
    question: "¿Cómo elimino mi cuenta permanentemente?",
    answer: "Ve a Configuración → Cuenta → Eliminar Cuenta. Proceso: 1) Ingresa tu contraseña maestra para confirmar, 2) Opcionalmente exporta tus datos antes de eliminar, 3) Confirma la eliminación. Tu cuenta entrará en período de gracia de 30 días (puedes recuperarla contactando soporte). Después de 30 días, todos tus datos se eliminan permanentemente y de forma irrecuperable. Las suscripciones activas se cancelan automáticamente."
  },
  {
    category: "Gestión de Cuenta",
    question: "¿Puedo tener múltiples cuentas?",
    answer: "Sí, puedes crear múltiples cuentas con diferentes emails (por ejemplo, una personal y una de trabajo). Sin embargo, cada cuenta es independiente y no comparte contraseñas entre sí. Si necesitas separar contraseñas dentro de una cuenta, usa carpetas. Para equipos, considera el Plan Corporativo que permite gestión centralizada de múltiples usuarios."
  },

  // Support
  {
    category: "Soporte",
    question: "¿Cómo contacto al soporte?",
    answer: "Opciones de soporte: 1) Email: support@eterbox.com (respuesta en 24-48 horas), 2) Centro de ayuda: eterbox.com/support (artículos y guías), 3) Chat en vivo: Disponible para planes Básico y Corporativo (lunes-viernes 9am-6pm UTC-5), 4) FAQ: Esta página. Para problemas de seguridad urgentes, contacta security@eterbox.com."
  },
  {
    category: "Soporte",
    question: "¿En qué idiomas está disponible EterBox?",
    answer: "Actualmente disponible en: Español, Inglés, Portugués, Francés, Alemán, Italiano. Puedes cambiar el idioma en Configuración → Idioma. Estamos trabajando en agregar más idiomas. Si quieres ayudar con traducciones, contacta translate@eterbox.com."
  }
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const filteredFAQs = selectedCategory === "Todos" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

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

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-accent/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <HelpCircle className="w-20 h-20 text-accent mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Preguntas Frecuentes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre EterBox. Si no encuentras lo que buscas, contáctanos en <a href="mailto:support@eterbox.com" className="text-accent hover:underline">support@eterbox.com</a>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">FILTRAR POR CATEGORÍA</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("Todos")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "Todos"
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border hover:bg-muted"
              }`}
            >
              Todos ({faqData.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                {category} ({faqData.filter(item => item.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-1">{item.question}</h3>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 pt-2 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿No encontraste tu respuesta?</h2>
          <p className="text-muted-foreground mb-6">
            Nuestro equipo de soporte está aquí para ayudarte. Responderemos en menos de 24 horas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@eterbox.com"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Enviar Email
            </a>
            <a
              href="/support"
              className="px-6 py-3 bg-card border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Centro de Soporte
            </a>
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
              <a href="/faq" className="hover:text-foreground">FAQ</a>
              <a href="/support" className="hover:text-foreground">Soporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
