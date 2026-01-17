import { useLocation } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Cookie, 
  DollarSign, 
  Lock,
  ChevronRight 
} from "lucide-react";

export default function Legal() {
  const [, setLocation] = useLocation();

  const legalSections = [
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Read our terms and conditions for using EterBox services",
      path: "/terms",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Lock,
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal data",
      path: "/privacy-policy",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Cookie,
      title: "Cookie Policy",
      description: "Understand how we use cookies and similar technologies",
      path: "/cookie-policy",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: DollarSign,
      title: "Refund Policy",
      description: "Review our refund and cancellation policy",
      path: "/refund-policy",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Explore our security measures and compliance certifications",
      path: "/security-compliance",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <AppLayout currentPath="/legal">
      <main className="container px-4 py-6 md:py-16 max-w-4xl overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Legal Information</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Access our legal documents and policies
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          {legalSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.path}
                className="p-4 md:p-6 border border-border/20 overflow-hidden max-w-full
                  hover:border-accent/40 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setLocation(section.path)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${section.bgColor} flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2">
                      {section.title}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground break-words">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-4 md:p-6 border border-border/20 mt-6 overflow-hidden max-w-full">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 break-words">
                If you have questions about our legal policies, please contact our support team.
              </p>
              <Button
                variant="outline"
                onClick={() => setLocation("/support")}
                className="w-full sm:w-auto"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </AppLayout>
  );
}
