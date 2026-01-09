import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Check, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: plans = [] } = trpc.plans.list.useQuery();
  const createCheckoutMutation = trpc.paypal.createSubscription.useMutation();

  const handleUpgrade = async (planId: number) => {
    if (!user) {
      setLocation("/");
      return;
    }

    try {
      const result = await createCheckoutMutation.mutateAsync({
        planId: planId.toString(),
        stripePriceId: `price_${planId}`,
      });
      if (result.approvalUrl) {
        window.open(result.approvalUrl, "_blank");
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")} >
            <Lock className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold">EterBox</h1>
          </div>
          <Button onClick={() => setLocation("/")} variant="ghost">
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">Choose the plan that's right for you</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan: any) => (
            <Card
              key={plan.id}
              className={`p-8 border rounded-[15px] transition-all duration-300 ${
                plan.name === "Basic"
                  ? "border-accent bg-accent/5 scale-105"
                  : "border-border/20 hover:border-accent/50"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === "0" ? (
                  <p className="text-4xl font-bold">Free</p>
                ) : (
                  <>
                    <p className="text-4xl font-bold">${plan.price}</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{plan.maxKeys} Credentials</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{plan.maxFolders} Folders</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">AES-256 Encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">Two-Factor Authentication</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full"
                variant={plan.name === "Free" ? "outline" : "default"}
                onClick={() => {
                  if (plan.name === "Free") {
                    setLocation("/dashboard");
                  } else {
                    handleUpgrade(plan.id);
                  }
                }}
                disabled={createCheckoutMutation.isPending}
              >
                {plan.name === "Free" ? "Get Started" : createCheckoutMutation.isPending ? "Processing..." : "Subscribe Now"}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-muted-foreground text-sm">Yes, you can change your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is my data secure?</h4>
              <p className="text-muted-foreground text-sm">All your credentials are encrypted with AES-256 encryption. We never store your master password.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground text-sm">We accept all major credit cards and PayPal for secure payments.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground text-sm">Yes! Start with our Free plan and upgrade anytime. No credit card required.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
