import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Lock, Shield, Zap, ArrowRight, Check } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/20 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">EterBox</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/pricing")}>Pricing</Button>
            <Button variant="ghost" onClick={() => setLocation("/support")}>Support</Button>
            <Button onClick={() => window.location.href = getLoginUrl()}>Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your Passwords,
            <span className="text-accent"> Secured</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            EterBox is a modern, secure password manager that keeps all your credentials safe with military-grade encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="h-12 text-base">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/pricing")} className="h-12 text-base">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 border-t border-border/20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose EterBox?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors">
            <Shield className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-3">Military-Grade Encryption</h3>
            <p className="text-muted-foreground">AES-256 encryption ensures your passwords are protected with the same technology used by governments.</p>
          </div>
          <div className="p-8 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors">
            <Zap className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">Access your credentials instantly with our optimized platform built for speed and reliability.</p>
          </div>
          <div className="p-8 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors">
            <Lock className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-3">Two-Factor Auth</h3>
            <p className="text-muted-foreground">Add an extra layer of security with two-factor authentication to protect your account.</p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="container py-20 border-t border-border/20">
        <h2 className="text-4xl font-bold text-center mb-16">Simple Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 rounded-[15px] border border-border/20 bg-card hover:border-accent/50 transition-all">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="mb-6">
              <p className="text-4xl font-bold">Free</p>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">3 Credentials</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">1 Folder</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">Encryption</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">Get Started</Button>
          </div>

          <div className="p-8 rounded-[15px] border-accent bg-accent/5 scale-105 border">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <div className="mb-6">
              <p className="text-4xl font-bold">$15</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">25 Credentials</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">5 Folders</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">Encryption</span>
              </div>
            </div>
            <Button className="w-full">Subscribe Now</Button>
          </div>

          <div className="p-8 rounded-[15px] border border-border/20 bg-card hover:border-accent/50 transition-all">
            <h3 className="text-2xl font-bold mb-2">Corporate</h3>
            <div className="mb-6">
              <p className="text-4xl font-bold">$25</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">Unlimited Credentials</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">Unlimited Folders</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm">Encryption</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">Subscribe Now</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 border-t border-border/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Passwords?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join thousands of users who trust EterBox to keep their credentials safe.</p>
          <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="h-12 text-base">
            Start Free Today
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/50 py-8 mt-20">
        <div className="container text-center text-muted-foreground text-sm">
          <p>&copy; 2024 EterBox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
