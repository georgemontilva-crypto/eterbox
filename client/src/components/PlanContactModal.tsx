import React, { useState } from "react";
import { X, Phone, Mail, User, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { trpc } from "../lib/trpc";

interface PlanContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
}

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+52", country: "MX" },
  { code: "+34", country: "ES" },
  { code: "+44", country: "UK" },
  { code: "+54", country: "AR" },
  { code: "+55", country: "BR" },
  { code: "+56", country: "CL" },
  { code: "+57", country: "CO" },
  { code: "+58", country: "VE" },
  { code: "+51", country: "PE" },
  { code: "+593", country: "EC" },
  { code: "+591", country: "BO" },
  { code: "+595", country: "PY" },
  { code: "+598", country: "UY" },
  { code: "+506", country: "CR" },
  { code: "+507", country: "PA" },
  { code: "+503", country: "SV" },
  { code: "+502", country: "GT" },
  { code: "+504", country: "HN" },
  { code: "+505", country: "NI" },
  { code: "+509", country: "HT" },
  { code: "+1-809", country: "DO" },
];

export function PlanContactModal({ isOpen, onClose, planName, planPrice }: PlanContactModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    agreeToContact: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const contactMutation = trpc.sales.contactForPlan.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: "", email: "", countryCode: "+1", phone: "", agreeToContact: false });
      }, 2000);
    },
    onError: (error) => {
      console.error('Error submitting contact form:', error);
      setError(t("planContact.submitError"));
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeToContact) {
      setError(t("planContact.agreeError"));
      return;
    }

    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode} ${formData.phone}`,
      planName,
      planPrice,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("planContact.successTitle")}</h3>
            <p className="text-muted-foreground">{t("planContact.successMessage")}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">{t("planContact.title")}</h2>
            <p className="text-muted-foreground mb-1">
              {t("planContact.subtitle")}: <span className="font-semibold text-foreground">{planName}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {planPrice}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  {t("planContact.name")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t("planContact.namePlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  {t("planContact.email")}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t("planContact.emailPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {t("planContact.phone")}
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.country} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="123 456 7890"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={formData.agreeToContact}
                  onChange={(e) => setFormData({ ...formData, agreeToContact: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="agree" className="text-sm text-muted-foreground">
                  {t("planContact.agreeText")} <span className="font-semibold text-foreground">{planName}</span>
                </label>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {contactMutation.isPending ? t("planContact.submitting") : t("planContact.submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
