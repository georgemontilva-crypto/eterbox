import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border/20 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <img src="/logo.png" alt="EterBox Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-xl sm:text-2xl font-bold">EterBox</span>
          </div>
          <Button variant="ghost" onClick={() => setLocation("/")}>
            {t("common.back")}
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="container max-w-4xl py-12 px-4">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 10, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              EterBox ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our password management service ("Service"). This policy complies with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Account Information:</strong> Email address, name (optional), and master password (encrypted)</li>
              <li><strong>Payment Information:</strong> Billing details processed through secure third-party payment processors (PayPal, Stripe)</li>
              <li><strong>Support Communications:</strong> Information you provide when contacting customer support</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Encrypted Data</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your stored credentials, passwords, and notes are encrypted on your device using AES-256 encryption before being transmitted to our servers. We cannot access, view, or decrypt this data due to our zero-knowledge architecture.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Usage Data:</strong> IP address, browser type, device information, access times</li>
              <li><strong>Cookies and Tracking:</strong> See our <a href="/cookies" className="text-accent hover:underline">Cookie Policy</a> for details</li>
              <li><strong>Log Data:</strong> Server logs for security and performance monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve the Service</li>
              <li><strong>Account Management:</strong> To manage your account and subscription</li>
              <li><strong>Communication:</strong> To send service-related notifications, updates, and security alerts</li>
              <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              <li><strong>Analytics:</strong> To understand how users interact with the Service and improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under GDPR, we process your personal data based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you've subscribed to</li>
              <li><strong>Legitimate Interests:</strong> For security, fraud prevention, and service improvement</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Consent:</strong> For marketing communications (you can withdraw consent at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Third-party vendors who assist in operating the Service (e.g., hosting, payment processing, email delivery)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
              <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of EterBox, our users, or others</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Important:</strong> Your encrypted credentials are never shared with third parties and cannot be accessed by anyone, including EterBox.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Encryption:</strong> AES-256 encryption for stored credentials, TLS/SSL for data in transit</li>
              <li><strong>Zero-Knowledge Architecture:</strong> Your master password and encrypted data are never accessible to us</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication for our systems</li>
              <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
              <li><strong>Incident Response:</strong> Procedures to detect and respond to security incidents</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under GDPR, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@eterbox.com. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data only as long as necessary to provide the Service and comply with legal obligations. Account data is retained while your account is active. After account deletion, we may retain certain information for legal, security, and backup purposes for up to 90 days, after which it is permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the European Commission, to protect your data in accordance with GDPR requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the Service. The "Last updated" date at the top of this policy indicates when it was last revised. Continued use of the Service after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, contact us at:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Data Protection Officer:</strong><br />
              Email: privacy@eterbox.com<br />
              Support: <a href="/support" className="text-accent hover:underline">EterBox Support Center</a>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>EU Representative (if applicable):</strong><br />
              [EU Representative Name and Contact Information]
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Supervisory Authority:</strong><br />
              You have the right to lodge a complaint with your local data protection authority if you believe we have not complied with applicable data protection laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
