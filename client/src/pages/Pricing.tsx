import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Check, Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { data: plans } = trpc.plans.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/20 bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <Lock className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold">EterBox</h1>
          </div>
          <Button onClick={() => setLocation("/")} variant="ghost">
            Back
          </Button>
        </div>
      </header>

      <main className="container py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">Choose the plan that's right for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan) => (
            <Card key={plan.id} className={`p-8 border rounded-[15px] ${plan.name === "Basic" ? "border-accent" : "border-border/20"}`}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
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
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm">{plan.maxKeys} Credentials</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm">{plan.maxFolders} Folders</span>
                </div>
              </div>
              <Button className="w-full">{plan.name === "Free" ? "Get Started" : "Subscribe"}</Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
