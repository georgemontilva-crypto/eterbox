import { Shield, Users, Target, Heart, Lock, Zap } from "lucide-react";

export default function AboutUs() {
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
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Sobre EterBox</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos un equipo apasionado por la seguridad digital, dedicado a proteger tu identidad en línea con tecnología de encriptación de grado militar y una experiencia de usuario excepcional.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Target className="w-10 h-10 text-accent" />
              <h2 className="text-3xl font-bold">Nuestra Misión</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hacer que la seguridad digital sea accesible para todos. Creemos que cada persona merece proteger su identidad en línea sin comprometer la facilidad de uso. EterBox nació de la frustración con gestores de contraseñas complicados y poco seguros.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nuestra misión es simple: <strong className="text-foreground">proporcionar la seguridad más robusta del mercado con la experiencia de usuario más intuitiva</strong>. No creemos que debas elegir entre seguridad y conveniencia.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Heart className="w-10 h-10 text-accent" />
              <h2 className="text-3xl font-bold">Nuestros Valores</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Privacidad Primero:</strong>
                  <p className="text-muted-foreground">Arquitectura de conocimiento cero. Ni nosotros podemos acceder a tus contraseñas.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Transparencia Total:</strong>
                  <p className="text-muted-foreground">Código abierto en el futuro, auditorías de seguridad públicas, sin secretos.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Innovación Constante:</strong>
                  <p className="text-muted-foreground">Adoptamos las últimas tecnologías de seguridad (WebAuthn, passkeys, biometría).</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Usuario Primero:</strong>
                  <p className="text-muted-foreground">Diseñamos cada característica pensando en ti, no en métricas de negocio.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-muted/30 border border-border rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              EterBox comenzó en 2025 cuando nuestro fundador, un ingeniero de seguridad con 15 años de experiencia, perdió acceso a cuentas críticas después de que un gestor de contraseñas popular sufriera una brecha de seguridad. Esa experiencia reveló dos problemas fundamentales en la industria:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>La mayoría de los gestores de contraseñas tienen acceso a tus datos (no son verdaderamente de "conocimiento cero")</li>
              <li>Los que son seguros son tan complicados que la gente termina usando contraseñas débiles por frustración</li>
            </ul>
            <p>
              Reunimos un equipo de expertos en criptografía, diseñadores UX y desarrolladores full-stack con una visión clara: <strong className="text-foreground">crear el gestor de contraseñas más seguro del mundo que tu abuela pudiera usar sin ayuda</strong>.
            </p>
            <p>
              Después de 18 meses de desarrollo, múltiples auditorías de seguridad independientes, y pruebas con miles de usuarios beta, lanzamos EterBox en enero de 2026. Hoy, protegemos las identidades digitales de usuarios en más de 50 países.
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Tecnología de Vanguardia</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">AES-256-GCM</h3>
              <p className="text-muted-foreground">
                Encriptación de grado militar utilizada por gobiernos y bancos. Tus datos son prácticamente imposibles de descifrar sin tu contraseña maestra.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">WebAuthn/FIDO2</h3>
              <p className="text-muted-foreground">
                Autenticación biométrica sin contraseñas. Usa Face ID, Touch ID o Windows Hello para acceso instantáneo y ultra seguro.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Sincronización Instantánea</h3>
              <p className="text-muted-foreground">
                Tus contraseñas se sincronizan en tiempo real entre todos tus dispositivos, siempre encriptadas de extremo a extremo.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Nuestro Equipo</h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Somos un equipo distribuido de 25 profesionales apasionados por la seguridad y la privacidad. Nuestro equipo incluye:
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">8 Ingenieros</h3>
              <p className="text-sm text-muted-foreground">Seguridad & Backend</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">6 Desarrolladores</h3>
              <p className="text-sm text-muted-foreground">Frontend & Mobile</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">4 Diseñadores</h3>
              <p className="text-sm text-muted-foreground">UX/UI & Producto</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">7 Especialistas</h3>
              <p className="text-sm text-muted-foreground">Soporte & Marketing</p>
            </div>
          </div>
        </div>

        {/* Security Audits */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6">Auditorías de Seguridad</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            La transparencia es fundamental para nosotros. Sometemos EterBox a auditorías de seguridad independientes regularmente:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-1">✓</span>
              <span><strong className="text-foreground">Enero 2026:</strong> Auditoría completa de penetración por Cure53 (firma líder en seguridad)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-1">✓</span>
              <span><strong className="text-foreground">Diciembre 2025:</strong> Revisión criptográfica por Trail of Bits</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-1">✓</span>
              <span><strong className="text-foreground">Noviembre 2025:</strong> Auditoría de infraestructura cloud por AWS Security</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-6">
            Los reportes completos de auditoría están disponibles públicamente en nuestra <a href="/security" className="text-accent hover:underline">página de Seguridad</a>.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes Preguntas?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nos encantaría escucharte. Contáctanos en cualquier momento.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@eterbox.com"
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
            <p>© {new Date().getFullYear()} EterBox®. Todos los derechos reservados.</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="/privacy-policy" className="hover:text-foreground">Privacidad</a>
              <a href="/terms" className="hover:text-foreground">Términos</a>
              <a href="/about" className="hover:text-foreground">Sobre Nosotros</a>
              <a href="/security" className="hover:text-foreground">Seguridad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
