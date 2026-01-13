import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EmailTemplateData {
  [key: string]: string | number;
}

export class EmailTemplateService {
  private templatesPath: string;

  constructor() {
    this.templatesPath = path.join(__dirname, 'email-templates');
  }

  /**
   * Load and render an email template with provided data
   */
  async renderTemplate(templateName: string, data: EmailTemplateData): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.html`);
      let template = await fs.readFile(templatePath, 'utf-8');

      // Replace all placeholders with actual data
      for (const [key, value] of Object.entries(data)) {
        const placeholder = `{{${key}}}`;
        template = template.replace(new RegExp(placeholder, 'g'), String(value));
      }

      return template;
    } catch (error) {
      console.error(`[EmailTemplateService] Error rendering template ${templateName}:`, error);
      throw new Error(`Failed to render email template: ${templateName}`);
    }
  }

  /**
   * Get translations for welcome email
   */
  getWelcomeEmailData(userName: string, lang: 'en' | 'es' = 'en'): EmailTemplateData {
    const translations = {
      en: {
        lang: 'en',
        title: 'Welcome to EterBox',
        welcome_title: 'Welcome to EterBox!',
        greeting: 'Hello',
        welcome_message: 'Thank you for joining EterBox! We\'re excited to help you secure your passwords and credentials with military-grade encryption.',
        features_title: 'What you can do with EterBox:',
        feature_1: 'Store unlimited passwords securely',
        feature_2: 'Organize credentials in folders',
        feature_3: 'Enable two-factor authentication (2FA)',
        feature_4: 'Access from any device with biometric login',
        cta_button: 'Go to Dashboard',
        closing: 'Welcome aboard!',
        team_name: 'The EterBox Team',
        footer_rights: 'All rights reserved.',
        footer_support: 'Support',
        footer_privacy: 'Privacy Policy',
      },
      es: {
        lang: 'es',
        title: 'Bienvenido a EterBox',
        welcome_title: '¡Bienvenido a EterBox!',
        greeting: 'Hola',
        welcome_message: '¡Gracias por unirte a EterBox! Estamos emocionados de ayudarte a proteger tus contraseñas y credenciales con cifrado de grado militar.',
        features_title: 'Lo que puedes hacer con EterBox:',
        feature_1: 'Almacenar contraseñas ilimitadas de forma segura',
        feature_2: 'Organizar credenciales en carpetas',
        feature_3: 'Habilitar autenticación de dos factores (2FA)',
        feature_4: 'Acceder desde cualquier dispositivo con login biométrico',
        cta_button: 'Ir al Dashboard',
        closing: '¡Bienvenido a bordo!',
        team_name: 'El Equipo de EterBox',
        footer_rights: 'Todos los derechos reservados.',
        footer_support: 'Soporte',
        footer_privacy: 'Política de Privacidad',
      },
    };

    return {
      ...translations[lang],
      user_name: userName,
    };
  }

  /**
   * Get data for new registration admin notification
   */
  getNewRegistrationAdminData(userName: string, userEmail: string, userPlan: string): EmailTemplateData {
    return {
      user_name: userName,
      user_email: userEmail,
      user_plan: userPlan,
      registration_date: new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
    };
  }

  /**
   * Get translations for purchase confirmation email
   */
  getPurchaseConfirmationData(
    userName: string,
    planName: string,
    amount: number,
    transactionId: string,
    lang: 'en' | 'es' = 'en'
  ): EmailTemplateData {
    const translations = {
      en: {
        lang: 'en',
        title: 'Purchase Confirmation',
        purchase_title: 'Purchase Confirmed!',
        greeting: 'Hello',
        purchase_message: 'Thank you for upgrading your EterBox plan! Your payment has been processed successfully.',
        invoice_title: 'Invoice Details',
        invoice_number_label: 'Invoice #',
        invoice_date_label: 'Date',
        plan_description: 'Monthly subscription',
        subtotal_label: 'Subtotal',
        tax_label: 'Tax',
        total_label: 'Total',
        payment_method_label: 'Payment Method',
        payment_method: 'PayPal',
        cta_button: 'View Dashboard',
        closing: 'Thank you for your purchase!',
        team_name: 'The EterBox Team',
        footer_rights: 'All rights reserved.',
        footer_support: 'Support',
        footer_privacy: 'Privacy Policy',
      },
      es: {
        lang: 'es',
        title: 'Confirmación de Compra',
        purchase_title: '¡Compra Confirmada!',
        greeting: 'Hola',
        purchase_message: '¡Gracias por mejorar tu plan de EterBox! Tu pago ha sido procesado exitosamente.',
        invoice_title: 'Detalles de la Factura',
        invoice_number_label: 'Factura #',
        invoice_date_label: 'Fecha',
        plan_description: 'Suscripción mensual',
        subtotal_label: 'Subtotal',
        tax_label: 'Impuestos',
        total_label: 'Total',
        payment_method_label: 'Método de Pago',
        payment_method: 'PayPal',
        cta_button: 'Ver Dashboard',
        closing: '¡Gracias por tu compra!',
        team_name: 'El Equipo de EterBox',
        footer_rights: 'Todos los derechos reservados.',
        footer_support: 'Soporte',
        footer_privacy: 'Política de Privacidad',
      },
    };

    const tax = amount * 0.1; // 10% tax
    const subtotal = amount - tax;

    return {
      ...translations[lang],
      user_name: userName,
      plan_name: planName,
      invoice_number: transactionId.substring(0, 12).toUpperCase(),
      invoice_date: new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
        dateStyle: 'long',
      }),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: amount.toFixed(2),
    };
  }

  /**
   * Get data for new sale admin notification
   */
  getNewSaleAdminData(
    customerName: string,
    customerEmail: string,
    planName: string,
    amount: number,
    transactionId: string,
    planFeatures: string
  ): EmailTemplateData {
    return {
      customer_name: customerName,
      customer_email: customerEmail,
      plan_name: planName,
      amount: amount.toFixed(2),
      payment_method: 'PayPal',
      transaction_id: transactionId,
      purchase_date: new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
      plan_features: planFeatures,
    };
  }

  /**
   * Get data for contact form notification
   */
  getContactFormData(
    contactName: string,
    contactEmail: string,
    contactSubject: string,
    contactMessage: string
  ): EmailTemplateData {
    return {
      contact_name: contactName,
      contact_email: contactEmail,
      contact_subject: contactSubject,
      contact_message: contactMessage,
      contact_date: new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
    };
  }

  /**
   * Get data for newsletter subscription notification
   */
  getNewsletterSubscriptionData(
    subscriberEmail: string,
    source: string,
    totalSubscribers: number
  ): EmailTemplateData {
    return {
      subscriber_email: subscriberEmail,
      subscription_date: new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
      subscription_source: source,
      total_subscribers: totalSubscribers.toString(),
    };
  }

  /**
   * Get data for login alert
   */
  getLoginAlertData(
    userName: string,
    ipAddress: string,
    device: string,
    location: string
  ): EmailTemplateData {
    return {
      user_name: userName,
      login_date: new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
      ip_address: ipAddress,
      device: device,
      location: location,
    };
  }

  /**
   * Get data for failed login alert
   */
  getFailedLoginAlertData(
    userName: string,
    attemptCount: number,
    ipAddress: string,
    location: string
  ): EmailTemplateData {
    return {
      user_name: userName,
      attempt_count: attemptCount.toString(),
      attempt_date: new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
      ip_address: ipAddress,
      location: location,
    };
  }
}

export const emailTemplateService = new EmailTemplateService();
