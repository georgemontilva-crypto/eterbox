import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 10, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using EterBox ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              EterBox provides a secure password management service that allows users to store, manage, and access their credentials through encrypted storage. The Service includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Encrypted password storage with AES-256 encryption</li>
              <li>Password generation tools</li>
              <li>Folder organization for credentials</li>
              <li>Two-factor authentication (2FA) for eligible plans</li>
              <li>Cross-device synchronization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>3.1 Account Creation:</strong> You must provide accurate, current, and complete information during the registration process and keep your account information updated.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>3.2 Master Password:</strong> You are solely responsible for maintaining the confidentiality of your master password. EterBox uses zero-knowledge architecture, meaning we cannot access, recover, or reset your master password. If you lose your master password, you will permanently lose access to your encrypted data.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>3.3 Account Security:</strong> You are responsible for all activities that occur under your account. You must immediately notify EterBox of any unauthorized use of your account or any other breach of security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Distribute malware, viruses, or any harmful code</li>
              <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Subscription Plans and Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>5.1 Plans:</strong> EterBox offers multiple subscription plans (Free, Basic, Corporate) with different features and limitations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>5.2 Payments:</strong> Paid subscriptions are billed in advance on a monthly or yearly basis. All fees are non-refundable except as required by law or as explicitly stated in these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>5.3 Automatic Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date. You can cancel your subscription at any time through your account settings.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>5.4 Price Changes:</strong> EterBox reserves the right to modify subscription prices with 30 days' advance notice. Continued use of the Service after price changes constitutes acceptance of the new prices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data and Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>6.1 Zero-Knowledge Architecture:</strong> EterBox employs zero-knowledge encryption, meaning your data is encrypted on your device before being transmitted to our servers. We cannot access, view, or decrypt your stored credentials.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>6.2 Data Ownership:</strong> You retain all rights to your data. EterBox claims no ownership over any content you store in the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>6.3 Data Backup:</strong> While we implement regular backups, you are responsible for maintaining your own backups of critical data.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For more information, please review our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ETERBOX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              EterBox's total liability for any claims arising out of or relating to these Terms or the Service shall not exceed the amount you paid to EterBox in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Warranty Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ETERBOX DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless EterBox and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>10.1 Termination by You:</strong> You may terminate your account at any time by contacting support or through your account settings.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>10.2 Termination by EterBox:</strong> We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>10.3 Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease. You may export your data before termination. After termination, we may delete your data in accordance with our data retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              EterBox reserves the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use of the Service after changes become effective constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law and Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization], except that either party may seek injunctive or other equitable relief in any court of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Email: legal@eterbox.com<br />
              Support: <a href="/support" className="text-accent hover:underline">EterBox Support Center</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
