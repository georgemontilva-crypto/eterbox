import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Cookies() {
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
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 10, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies help us recognize you, remember your preferences, and improve your experience on EterBox.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Essential Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies are necessary for the Service to function and cannot be disabled. They enable core functionality such as:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Authentication:</strong> Keep you logged in and maintain your session</li>
              <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
              <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Cookie Name:</strong> auth_token, session_id<br />
              <strong>Purpose:</strong> User authentication and session management<br />
              <strong>Duration:</strong> Session or 30 days
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Functional Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies enable enhanced functionality and personalization:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Language Preferences:</strong> Remember your language selection</li>
              <li><strong>Theme Settings:</strong> Store your dark/light mode preference</li>
              <li><strong>User Preferences:</strong> Remember your settings and choices</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Cookie Name:</strong> language, theme_preference<br />
              <strong>Purpose:</strong> Store user preferences<br />
              <strong>Duration:</strong> 1 year
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Analytics Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies help us understand how visitors interact with the Service:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Usage Analytics:</strong> Track page views, clicks, and navigation patterns</li>
              <li><strong>Performance Monitoring:</strong> Identify and fix technical issues</li>
              <li><strong>Feature Usage:</strong> Understand which features are most popular</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Cookie Name:</strong> _ga, _gid (Google Analytics - if used)<br />
              <strong>Purpose:</strong> Analyze user behavior and improve the Service<br />
              <strong>Duration:</strong> 2 years (_ga), 24 hours (_gid)
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.4 Marketing Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies track your activity to deliver relevant advertisements:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Advertising:</strong> Show you relevant ads on other websites</li>
              <li><strong>Retargeting:</strong> Remind you about EterBox after you leave our site</li>
              <li><strong>Campaign Tracking:</strong> Measure the effectiveness of our marketing campaigns</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Note:</strong> You can opt out of marketing cookies through our cookie consent banner or your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use third-party services that may set their own cookies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Payment Processors:</strong> PayPal, Stripe (for secure payment processing)</li>
              <li><strong>Analytics:</strong> Google Analytics (for usage statistics)</li>
              <li><strong>Email Services:</strong> Resend (for transactional emails)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These third parties have their own privacy policies. We recommend reviewing their policies to understand how they use cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. How to Control Cookies</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Cookie Consent Banner</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you first visit EterBox, you'll see a cookie consent banner. You can:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your cookie preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Browser Settings</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Most browsers allow you to control cookies through their settings:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Important:</strong> Blocking essential cookies may prevent you from using certain features of the Service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Opt-Out Links</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can opt out of specific tracking services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
              <li><strong>Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">NAI Opt-Out Tool</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Do Not Track Signals</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some browsers have a "Do Not Track" (DNT) feature that signals websites you visit that you do not want to be tracked. Currently, there is no industry standard for how to respond to DNT signals. EterBox does not respond to DNT signals at this time, but we respect your privacy choices through our cookie consent banner and browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Mobile Devices</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              On mobile devices, you can control tracking through:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>iOS:</strong> Settings → Privacy → Tracking → Allow Apps to Request to Track</li>
              <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Updates to This Cookie Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by updating the "Last updated" date at the top of this policy. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Email: privacy@eterbox.com<br />
              Support: <a href="/support" className="text-accent hover:underline">EterBox Support Center</a>
            </p>
          </section>

          <section className="bg-card/30 border border-border/20 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold mb-3">Summary of Cookie Types</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-left py-2 px-2">Purpose</th>
                    <th className="text-left py-2 px-2">Can be disabled?</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/10">
                    <td className="py-2 px-2">Essential</td>
                    <td className="py-2 px-2">Authentication, security</td>
                    <td className="py-2 px-2">No</td>
                  </tr>
                  <tr className="border-b border-border/10">
                    <td className="py-2 px-2">Functional</td>
                    <td className="py-2 px-2">Preferences, settings</td>
                    <td className="py-2 px-2">Yes</td>
                  </tr>
                  <tr className="border-b border-border/10">
                    <td className="py-2 px-2">Analytics</td>
                    <td className="py-2 px-2">Usage statistics</td>
                    <td className="py-2 px-2">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">Marketing</td>
                    <td className="py-2 px-2">Advertising, retargeting</td>
                    <td className="py-2 px-2">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
