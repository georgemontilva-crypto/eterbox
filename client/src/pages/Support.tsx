import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Lock, Mail, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Support() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const submitMutation = trpc.support.submitTicket.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMutation.mutateAsync(formData);
      toast.success("Support ticket submitted successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit support ticket");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/20 bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <img src="/logo.png" alt="EterBox Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">EterBox</h1>
          </div>
          <Button onClick={() => setLocation("/")} variant="ghost">Back</Button>
        </div>
      </header>

      <main className="container py-16 max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">Support</h2>
        <p className="text-muted-foreground mb-12">Have questions? We're here to help!</p>

        <Card className="p-8 border border-border/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent min-h-32"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
