import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Lock, Mail, MessageSquare, ChevronDown, Shield, Zap, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { ContactSuccessModal } from "@/components/ContactSuccessModal";

// Declare global grecaptcha type
declare global {
  interface Window {
    grecaptcha: any;
  }
}

const FAQs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is EterBox?",
        a: "EterBox is a modern, secure password manager that helps you store and manage all your passwords in one encrypted vault. With military-grade encryption (AES-256), you can safely store credentials for all your online accounts."
      },
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button on the home page, enter your email and create a strong master password. You can also enable biometric authentication (Face ID or fingerprint) for faster login."
      },
      {
        q: "Is EterBox free?",
        a: "Yes! EterBox offers a free plan with up to 10 passwords and 2 folders. For more storage and features, upgrade to Basic ($12.99/month) or Corporate ($29/month)."
      }
    ]
  },
  {
    category: "Security",
    questions: [
      {
        q: "How secure is EterBox?",
        a: "EterBox uses military-grade AES-256-GCM encryption for all your passwords. Your master password is hashed with bcrypt, and we implement zero-knowledge architecture - even our team cannot access your passwords."
      },
      {
        q: "What happens if I forget my master password?",
        a: "Unfortunately, if you forget your master password, your account cannot be recovered due to our zero-knowledge encryption. This is a security feature that ensures only you can access your data. We recommend using a password manager to store your master password or enabling biometric authentication."
      },
      {
        q: "Can EterBox be hacked?",
        a: "While no system is 100% secure, EterBox implements industry-leading security practices: AES-256 encryption, HTTPS/TLS 1.3, rate limiting, CSRF protection, and regular security audits. Your passwords are encrypted before leaving your device."
      },
      {
        q: "What is 2FA and why should I enable it?",
        a: "Two-Factor Authentication adds an extra security layer to your account. After entering your password, you'll need to enter a code from an authenticator app (like Google Authenticator). This prevents unauthorized access even if someone has your password."
      }
    ]
  },
  {
    category: "Features",
    questions: [
      {
        q: "Can I organize my passwords into folders?",
        a: "Yes! You can create folders to organize your passwords by category (Work, Personal, Banking, etc.). Free plan includes 2 folders, Basic plan 10 folders, and Corporate plan 100 folders."
      },
      {
        q: "Can I generate strong passwords?",
        a: "Yes! EterBox includes a built-in password generator that creates strong, random passwords. You can customize the length and character types. Free plan allows 10 generated passwords, Basic 300, and Corporate unlimited."
      },
      {
        q: "Can I export my passwords?",
        a: "Yes! Basic and Corporate plans can export passwords as JSON or CSV files. This is useful for backups or migrating to another service. Free plan does not support export."
      },
      {
        q: "Does EterBox work offline?",
        a: "EterBox requires an internet connection to sync your passwords across devices. However, once loaded, the app can work in offline mode with cached data."
      }
    ]
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        q: "What's the difference between plans?",
        a: "Free: 10 passwords, 2 folders, no export. Basic: 100 passwords, 10 folders, export feature. Corporate: 1000 passwords, 100 folders, export, 24/7 support, automatic backups."
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes! You can cancel your subscription anytime from your Settings. You'll have access until the end of your billing period."
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a 30-day money-back guarantee for new subscriptions. If you're not satisfied, contact support@eterbox.com for a full refund."
      },
      {
        q: "Are there discounts for annual plans?",
        a: "Yes! Annual plans offer discounts: Basic $160/year (11% off) and Corporate $280/year (7% off) compared to monthly billing."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "What devices does EterBox support?",
        a: "EterBox works on all modern devices: Windows, macOS, Linux, iOS, and Android. You can access it through any web browser or install it as a PWA (Progressive Web App)."
      },
      {
        q: "How do I sync passwords across devices?",
        a: "Your passwords are automatically synced to our secure servers. Simply log in on any device and all your passwords will be available."
      },
      {
        q: "Is there a mobile app?",
        a: "EterBox is a web application that works on mobile browsers. You can also install it as a PWA for a native app-like experience with offline support."
      }
    ]
  },
  {
    category: "Privacy & Legal",
    questions: [
      {
        q: "Does EterBox sell my data?",
        a: "No! We never sell, share, or use your data for marketing. We're committed to your privacy and comply with GDPR, CCPA, and other privacy regulations."
      },
      {
        q: "Can authorities access my passwords?",
        a: "No. Due to our zero-knowledge encryption, even with a court order, we cannot access your passwords. Only you have the encryption key (your master password)."
      },
      {
        q: "Where are my passwords stored?",
        a: "Your encrypted passwords are stored on secure servers. We use industry-standard encryption and security practices to protect your data."
      }
    ]
  }
];

export default function Support() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Getting Started");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const submitMutation = trpc.contact.submitContactForm.useMutation();

  // Load reCAPTCHA script
  useEffect(() => {
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (!recaptchaSiteKey) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación del lado del cliente
    if (formData.name.length < 2) {
      toast.error("Name must be at least 2 characters", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }
    
    if (formData.subject.length < 5) {
      toast.error("Subject must be at least 5 characters", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }
    
    if (formData.message.length < 10) {
      toast.error("Message must be at least 10 characters", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }
    
    try {
      let recaptchaToken: string | undefined;
      
      // Get reCAPTCHA token if available
      const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      if (recaptchaLoaded && recaptchaSiteKey && window.grecaptcha) {
        try {
          recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'submit_support' });
        } catch (error) {
          console.error('reCAPTCHA error:', error);
          // Continue without reCAPTCHA if it fails
        }
      }
      
      await submitMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Clear form
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to send message. Please try again.";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const categories = Array.from(new Set(FAQs.map(faq => faq.category)));
  const activeFAQs = FAQs.find(faq => faq.category === activeCategory)?.questions || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/20 bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <img src="/logo.png" alt="EterBox Logo" className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold">EterBox</h1>
          </div>
          <Button onClick={() => setLocation("/")} variant="ghost" className="text-sm md:text-base">← Back</Button>
        </div>
      </header>

      <main className="container py-8 md:py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Support & Help Center</h2>
          <p className="text-muted-foreground text-base md:text-lg">Have questions? We're here to help! Check our FAQ or contact our support team.</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Card className="p-6 border border-border/20 hover:border-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Security First</h3>
                <p className="text-sm text-muted-foreground">Military-grade AES-256 encryption for all your passwords</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border/20 hover:border-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Fast & Easy</h3>
                <p className="text-sm text-muted-foreground">Biometric login with Face ID or fingerprint</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border/20 hover:border-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Our team is always here to help you</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-[15px] font-medium text-sm whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? "bg-accent text-background"
                      : "bg-card border border-border/20 text-foreground hover:border-accent/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {activeFAQs.map((faq, idx) => {
                const faqId = `${activeCategory}-${idx}`;
                const isExpanded = expandedFAQ === faqId;
                return (
                  <Card
                    key={faqId}
                    className="border border-border/20 overflow-hidden transition-colors hover:border-accent/50"
                  >
                    <button
                      onClick={() => setExpandedFAQ(isExpanded ? null : faqId)}
                      className="w-full p-4 flex items-start justify-between gap-4 hover:bg-card/50 transition-colors text-left"
                    >
                      <span className="font-medium text-sm md:text-base">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent flex-shrink-0 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border/20 text-sm text-muted-foreground">
                        {faq.a}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            <Card className="p-6 border border-border/20">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                    minLength={2}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                    minLength={5}
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent min-h-24"
                    required
                    minLength={10}
                    placeholder="Tell us how we can help you (at least 10 characters)"
                  />
                </div>
                <Button type="submit" className="w-full text-sm" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-border/20 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href="mailto:support@eterbox.com" className="text-sm font-medium hover:text-accent transition-colors">
                      support@eterbox.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Response Time</p>
                    <p className="text-sm font-medium">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Success Modal */}
      <ContactSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  );
}
