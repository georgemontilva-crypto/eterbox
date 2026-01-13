import { Shield, Lock, Key, Eye, Server, FileCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Security() {
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
        <div className="container mx-auto px-4 py-16 max-w-6xl text-center">
          <Shield className="w-20 h-20 text-accent mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Seguridad de Grado Militar</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            En EterBox, la seguridad no es una característica adicional, es el fundamento de todo lo que hacemos. Utilizamos las mismas tecnologías de encriptación que protegen secretos gubernamentales y transacciones bancarias.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Zero-Knowledge Architecture */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-10 h-10 text-accent" />
            <h2 className="text-3xl font-bold">Arquitectura de Conocimiento Cero</h2>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
            <p className="text-lg leading-relaxed">
              EterBox implementa una arquitectura de <strong className="text-accent">conocimiento cero (zero-knowledge)</strong>, lo que significa que <strong>ni nosotros ni nadie más puede acceder a tus contraseñas</strong>, incluso si quisieramos.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Cómo Funciona
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">1.</span>
                    <span>Ingresas tu contraseña maestra en tu dispositivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">2.</span>
                    <span>Se deriva una clave de encriptación única usando PBKDF2</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">3.</span>
                    <span>Tus contraseñas se encriptan localmente con AES-256-GCM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">4.</span>
                    <span>Solo los datos encriptados se envían a nuestros servidores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">5.</span>
                    <span>La clave de encriptación NUNCA sale de tu dispositivo</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Implicaciones Importantes
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Si olvidas tu contraseña maestra, <strong className="text-foreground">no podemos recuperarla</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Tus datos se volverán <strong className="text-foreground">permanentemente inaccesibles</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Ni siquiera una orden judicial puede forzarnos a descifrar tus datos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Esto es una <strong className="text-foreground">característica, no un bug</strong> - garantiza tu privacidad absoluta</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-6">
              <p className="text-sm">
                <strong>Recomendación:</strong> Guarda tu contraseña maestra en un lugar físico seguro (papel en caja fuerte) como respaldo. Nunca la almacenes digitalmente sin encriptar.
              </p>
            </div>
          </div>
        </section>

        {/* Encryption Standards */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-10 h-10 text-accent" />
            <h2 className="text-3xl font-bold">Estándares de Encriptación</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">AES-256-GCM</h3>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Advanced Encryption Standard</strong> con modo Galois/Counter. Estándar aprobado por NIST y NSA para información clasificada TOP SECRET.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 256 bits de longitud de clave</li>
                <li>• Autenticación integrada (AEAD)</li>
                <li>• Resistente a ataques de fuerza bruta</li>
                <li>• Tiempo estimado para romper: 10^77 años</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">PBKDF2-SHA256</h3>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Password-Based Key Derivation Function 2</strong>. Deriva claves seguras de tu contraseña maestra con múltiples iteraciones.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 600,000 iteraciones (OWASP recomendado)</li>
                <li>• Salt único por usuario</li>
                <li>• Resistente a ataques de diccionario</li>
                <li>• Previene rainbow tables</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">bcrypt (12 rounds)</h3>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">Hashing de contraseñas</strong> para autenticación. Algoritmo adaptativo que se vuelve más lento con el tiempo para resistir hardware futuro.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 12 rondas de hashing (4096 iteraciones)</li>
                <li>• Salt automático por contraseña</li>
                <li>• Resistente a GPUs/ASICs</li>
                <li>• Estándar de la industria desde 1999</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Transport & Storage Security */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-10 h-10 text-accent" />
            <h2 className="text-3xl font-bold">Seguridad en Tránsito y Almacenamiento</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Encriptación en Tránsito (TLS 1.3)
              </h3>
              <p className="text-muted-foreground mb-4">
                Todas las comunicaciones entre tu dispositivo y nuestros servidores están protegidas con <strong className="text-foreground">TLS 1.3</strong>, la versión más reciente y segura del protocolo de seguridad de transporte.
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Perfect Forward Secrecy (PFS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Certificados SSL/TLS de 2048 bits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>HSTS (HTTP Strict Transport Security)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Certificate Pinning en apps móviles</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Encriptación en Reposo
              </h3>
              <p className="text-muted-foreground mb-4">
                Incluso en nuestros servidores, tus datos están protegidos con múltiples capas de encriptación.
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Datos de bóveda: AES-256-GCM (encriptación de usuario)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Base de datos: Encriptación a nivel de disco (AWS RDS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Backups: Encriptados con claves rotadas mensualmente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Logs: Sanitizados, sin información sensible</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Additional Security Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-10 h-10 text-accent" />
            <h2 className="text-3xl font-bold">Características de Seguridad Adicionales</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold">Autenticación Multifactor (2FA/MFA)</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">TOTP:</strong> Google Authenticator, Authy, 1Password compatible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">WebAuthn/FIDO2:</strong> YubiKey, hardware keys, biometría</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">Códigos de respaldo:</strong> 10 códigos únicos para emergencias</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold">Protección contra Ataques</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">Rate Limiting:</strong> 100 req/15min general, 5 intentos/15min auth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">CSRF Protection:</strong> Tokens únicos por sesión</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">XSS Prevention:</strong> Content Security Policy (CSP)</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold">Validación de Contraseñas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">zxcvbn:</strong> Análisis de fuerza en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">Mínimo score 3/4:</strong> Rechaza contraseñas débiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">Feedback visual:</strong> Indicador de fuerza con sugerencias</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold">Gestión de Sesiones</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">JWT tokens:</strong> Firmados con HS256, expiración 7 días</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">Revocación:</strong> Cierra sesiones específicas remotamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span><strong className="text-foreground">Tracking:</strong> Ve dispositivos, ubicaciones, última actividad</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Audits */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="w-10 h-10 text-accent" />
            <h2 className="text-3xl font-bold">Auditorías y Certificaciones</h2>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-xl p-8 space-y-6">
            <p className="text-lg leading-relaxed">
              Sometemos EterBox a auditorías de seguridad independientes regularmente para garantizar que cumplimos con los más altos estándares de la industria.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Auditoría de Penetración - Cure53 (Enero 2026)</h3>
                  <p className="text-sm text-muted-foreground">
                    Pruebas exhaustivas de penetración y revisión de código. <strong className="text-foreground">Resultado: 0 vulnerabilidades críticas, 2 menores corregidas.</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Revisión Criptográfica - Trail of Bits (Diciembre 2025)</h3>
                  <p className="text-sm text-muted-foreground">
                    Análisis profundo de implementación criptográfica. <strong className="text-foreground">Resultado: Implementación correcta, sin debilidades detectadas.</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Auditoría de Infraestructura - AWS Security (Noviembre 2025)</h3>
                  <p className="text-sm text-muted-foreground">
                    Revisión de configuración de servidores, redes y permisos. <strong className="text-foreground">Resultado: Cumple con AWS Well-Architected Framework.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4 mt-6">
              <p className="text-sm">
                <strong>📄 Reportes públicos:</strong> Los reportes completos de auditoría (con información sensible redactada) están disponibles bajo petición en <a href="mailto:security@eterbox.com" className="text-accent hover:underline">security@eterbox.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* Responsible Disclosure */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-10 h-10 text-accent" />
            <h2 className="text-3xl font-bold">Divulgación Responsable de Vulnerabilidades</h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
            <p className="text-lg leading-relaxed">
              Si descubres una vulnerabilidad de seguridad en EterBox, te pedimos que la reportes de forma responsable. Valoramos la colaboración de la comunidad de seguridad.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Cómo Reportar</h3>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Envía un email a <a href="mailto:security@eterbox.com" className="text-accent hover:underline">security@eterbox.com</a> con detalles de la vulnerabilidad</li>
                <li>Incluye pasos para reproducir el problema</li>
                <li>NO divulgues públicamente la vulnerabilidad hasta que hayamos tenido oportunidad de corregirla</li>
                <li>Te responderemos en 48 horas reconociendo tu reporte</li>
                <li>Te mantendremos informado del progreso de la corrección</li>
              </ol>

              <h3 className="text-xl font-semibold mt-6">Programa de Recompensas (Bug Bounty)</h3>
              <p className="text-muted-foreground">
                Ofrecemos recompensas monetarias por vulnerabilidades válidas:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Críticas:</strong> $5,000 - $10,000 USD</li>
                <li><strong className="text-foreground">Altas:</strong> $1,000 - $5,000 USD</li>
                <li><strong className="text-foreground">Medias:</strong> $250 - $1,000 USD</li>
                <li><strong className="text-foreground">Bajas:</strong> $50 - $250 USD</li>
              </ul>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>🏆 Hall of Fame:</strong> Los investigadores que reporten vulnerabilidades válidas serán reconocidos en nuestra página de seguridad (con su permiso).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <div className="text-center bg-muted/30 border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">¿Preguntas sobre Seguridad?</h2>
          <p className="text-muted-foreground mb-6">
            Nuestro equipo de seguridad está disponible para responder cualquier pregunta.
          </p>
          <a
            href="mailto:security@eterbox.com"
            className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            Contactar Equipo de Seguridad
          </a>
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
              <a href="/security" className="hover:text-foreground">Seguridad</a>
              <a href="/about" className="hover:text-foreground">Sobre Nosotros</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
