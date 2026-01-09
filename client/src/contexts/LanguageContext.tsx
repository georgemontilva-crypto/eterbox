import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es";

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

// All translations for the app
export const translations: Translations = {
  // Navigation & Menu
  "menu.dashboard": { en: "Dashboard", es: "Panel" },
  "menu.twoFactor": { en: "Two-Factor Auth", es: "Autenticación 2FA" },
  "menu.twoFactorDesc": { en: "Secure your account with 2FA", es: "Asegura tu cuenta con 2FA" },
  "menu.changePassword": { en: "Change Password", es: "Cambiar Contraseña" },
  "menu.changePasswordDesc": { en: "Update your account password", es: "Actualiza la contraseña de tu cuenta" },
  "menu.viewPlan": { en: "View Plan", es: "Ver Plan" },
  "menu.settings": { en: "Settings", es: "Configuración" },
  "menu.settingsDesc": { en: "Account preferences", es: "Preferencias de cuenta" },
  "menu.logout": { en: "Logout", es: "Cerrar Sesión" },
  "menu.logoutDesc": { en: "Sign out of your account", es: "Salir de tu cuenta" },
  "menu.security": { en: "Security", es: "Seguridad" },
  "menu.password": { en: "Password", es: "Contraseña" },
  "menu.subscription": { en: "Subscription", es: "Suscripción" },
  
  // Dashboard
  "dashboard.welcome": { en: "Welcome back", es: "Bienvenido de nuevo" },
  "dashboard.subtitle": { en: "Manage your passwords and credentials securely", es: "Gestiona tus contraseñas y credenciales de forma segura" },
  "dashboard.currentPlan": { en: "Current Plan", es: "Plan Actual" },
  "dashboard.credentialsUsed": { en: "Credentials Used", es: "Credenciales Usadas" },
  "dashboard.foldersUsed": { en: "Folders Used", es: "Carpetas Usadas" },
  "dashboard.addCredential": { en: "Add New Credential", es: "Añadir Credencial" },
  "dashboard.createFolder": { en: "Create Folder", es: "Crear Carpeta" },
  "dashboard.searchPlaceholder": { en: "Search folders, platforms, users, or emails...", es: "Buscar carpetas, plataformas, usuarios o emails..." },
  "dashboard.upgradeTitle": { en: "Upgrade Your Plan", es: "Mejora Tu Plan" },
  "dashboard.upgradeDesc": { en: "Get more credentials and folders with a paid plan", es: "Obtén más credenciales y carpetas con un plan de pago" },
  "dashboard.upgradeNow": { en: "Upgrade Now", es: "Mejorar Ahora" },
  "dashboard.yourFolders": { en: "Your Folders", es: "Tus Carpetas" },
  "dashboard.yourCredentials": { en: "Your Credentials", es: "Tus Credenciales" },
  "dashboard.noFolders": { en: "No folders yet. Create one to organize your credentials.", es: "Sin carpetas aún. Crea una para organizar tus credenciales." },
  "dashboard.noCredentials": { en: "No credentials yet. Add your first credential to get started.", es: "Sin credenciales aún. Añade tu primera credencial para comenzar." },
  "dashboard.noCredentialsInFolder": { en: "No credentials in this folder", es: "Sin credenciales en esta carpeta" },
  "dashboard.credential": { en: "credential", es: "credencial" },
  "dashboard.credentials": { en: "credentials", es: "credenciales" },
  "dashboard.backToDashboard": { en: "Back to Dashboard", es: "Volver al Panel" },
  "dashboard.addExisting": { en: "Add Existing", es: "Añadir Existente" },
  "dashboard.filterPlaceholder": { en: "Filter credentials...", es: "Filtrar credenciales..." },
  
  // Search Results
  "search.results": { en: "Search Results", es: "Resultados de Búsqueda" },
  "search.folders": { en: "Folders", es: "Carpetas" },
  "search.credentials": { en: "Credentials", es: "Credenciales" },
  "search.items": { en: "items", es: "elementos" },
  "search.noResults": { en: "No results found", es: "Sin resultados" },
  
  // Credentials
  "credential.platform": { en: "Platform Name", es: "Nombre de Plataforma" },
  "credential.username": { en: "Username", es: "Usuario" },
  "credential.email": { en: "Email", es: "Correo" },
  "credential.password": { en: "Password", es: "Contraseña" },
  "credential.folder": { en: "Folder (optional)", es: "Carpeta (opcional)" },
  "credential.noFolder": { en: "No folder", es: "Sin carpeta" },
  "credential.create": { en: "Create Credential", es: "Crear Credencial" },
  "credential.creating": { en: "Creating...", es: "Creando..." },
  "credential.copied": { en: "Password copied to clipboard", es: "Contraseña copiada al portapapeles" },
  
  // Folders
  "folder.name": { en: "Folder Name", es: "Nombre de Carpeta" },
  "folder.create": { en: "Create Folder", es: "Crear Carpeta" },
  "folder.creating": { en: "Creating...", es: "Creando..." },
  "folder.limitReached": { en: "Folder Limit Reached", es: "Límite de Carpetas Alcanzado" },
  "folder.limitDesc": { en: "You've reached the maximum number of folders for your plan. Upgrade to create more folders.", es: "Has alcanzado el número máximo de carpetas para tu plan. Mejora para crear más carpetas." },
  "folder.viewPlans": { en: "View Plans", es: "Ver Planes" },
  "folder.deleteTitle": { en: "Delete Folder", es: "Eliminar Carpeta" },
  "folder.deleteDesc": { en: "What would you like to do with the credentials in this folder?", es: "¿Qué te gustaría hacer con las credenciales en esta carpeta?" },
  "folder.deleteFolderOnly": { en: "Delete folder only", es: "Eliminar solo carpeta" },
  "folder.deleteFolderOnlyDesc": { en: "Credentials will be moved to 'Your Credentials'", es: "Las credenciales se moverán a 'Tus Credenciales'" },
  "folder.deleteAll": { en: "Delete folder and all credentials", es: "Eliminar carpeta y todas las credenciales" },
  "folder.deleteAllDesc": { en: "This action cannot be undone", es: "Esta acción no se puede deshacer" },
  "folder.deleting": { en: "Deleting...", es: "Eliminando..." },
  
  // Move to Folder
  "move.title": { en: "Move to Folder", es: "Mover a Carpeta" },
  "move.select": { en: "Select a folder for this credential", es: "Selecciona una carpeta para esta credencial" },
  "move.noFolder": { en: "No folder (Your Credentials)", es: "Sin carpeta (Tus Credenciales)" },
  "move.button": { en: "Move", es: "Mover" },
  "move.moving": { en: "Moving...", es: "Moviendo..." },
  
  // 2FA
  "twoFactor.title": { en: "Two-Factor Authentication", es: "Autenticación de Dos Factores" },
  "twoFactor.subtitle": { en: "Add an extra layer of security to your account", es: "Añade una capa extra de seguridad a tu cuenta" },
  "twoFactor.enable": { en: "Enable 2FA", es: "Activar 2FA" },
  "twoFactor.disable": { en: "Disable 2FA", es: "Desactivar 2FA" },
  "twoFactor.appHint": { en: "You'll need an authenticator app like Google Authenticator or Authy", es: "Necesitarás una app de autenticación como Google Authenticator o Authy" },
  "twoFactor.scanQR": { en: "Scan this QR code with your authenticator app", es: "Escanea este código QR con tu app de autenticación" },
  "twoFactor.enterCode": { en: "Enter the 6-digit code from your app", es: "Ingresa el código de 6 dígitos de tu app" },
  "twoFactor.verify": { en: "Verify & Enable", es: "Verificar y Activar" },
  "twoFactor.verifying": { en: "Verifying...", es: "Verificando..." },
  "twoFactor.backupCodes": { en: "Backup Codes", es: "Códigos de Respaldo" },
  "twoFactor.backupCodesDesc": { en: "Save these codes in a safe place. You can use them to access your account if you lose your authenticator.", es: "Guarda estos códigos en un lugar seguro. Puedes usarlos para acceder a tu cuenta si pierdes tu autenticador." },
  "twoFactor.enabled": { en: "2FA is enabled", es: "2FA está activado" },
  "twoFactor.disabled": { en: "2FA is disabled", es: "2FA está desactivado" },
  
  // Password Change
  "password.title": { en: "Change Password", es: "Cambiar Contraseña" },
  "password.subtitle": { en: "Update your account password", es: "Actualiza la contraseña de tu cuenta" },
  "password.current": { en: "Current Password", es: "Contraseña Actual" },
  "password.new": { en: "New Password", es: "Nueva Contraseña" },
  "password.confirm": { en: "Confirm New Password", es: "Confirmar Nueva Contraseña" },
  "password.update": { en: "Update Password", es: "Actualizar Contraseña" },
  "password.updating": { en: "Updating...", es: "Actualizando..." },
  
  // Plans
  "plan.title": { en: "Your Plan", es: "Tu Plan" },
  "plan.subtitle": { en: "Current subscription details", es: "Detalles de tu suscripción actual" },
  "plan.current": { en: "Current Plan", es: "Plan Actual" },
  "plan.upgrade": { en: "Upgrade Plan", es: "Mejorar Plan" },
  "plan.free": { en: "Free", es: "Gratis" },
  "plan.basic": { en: "Basic", es: "Básico" },
  "plan.corporate": { en: "Corporate", es: "Corporativo" },
  "plan.month": { en: "month", es: "mes" },
  "plan.unlimited": { en: "Unlimited", es: "Ilimitado" },
  "plan.subscribe": { en: "Subscribe Now", es: "Suscribirse Ahora" },
  "plan.currentPlan": { en: "Current Plan", es: "Plan Actual" },
  
  // Home Page
  "home.nav.pricing": { en: "Pricing", es: "Precios" },
  "home.nav.support": { en: "Support", es: "Soporte" },
  "home.nav.signIn": { en: "Sign In", es: "Iniciar Sesión" },
  "home.hero.title1": { en: "Your Passwords,", es: "Tus Contraseñas," },
  "home.hero.title2": { en: "Secured", es: "Protegidas" },
  "home.hero.subtitle": { en: "EterBox is a modern, secure password manager that keeps all your credentials safe with military-grade encryption.", es: "EterBox es un gestor de contraseñas moderno y seguro que mantiene todas tus credenciales protegidas con encriptación de grado militar." },
  "home.hero.getStarted": { en: "Get Started Free", es: "Comenzar Gratis" },
  "home.hero.viewPricing": { en: "View Pricing", es: "Ver Precios" },
  "home.features.title": { en: "Why Choose EterBox?", es: "¿Por qué elegir EterBox?" },
  "home.features.encryption.title": { en: "Military-Grade Encryption", es: "Encriptación de Grado Militar" },
  "home.features.encryption.desc": { en: "AES-256 encryption ensures your passwords are protected with the same technology used by governments.", es: "La encriptación AES-256 asegura que tus contraseñas estén protegidas con la misma tecnología usada por gobiernos." },
  "home.features.fast.title": { en: "Lightning Fast", es: "Ultra Rápido" },
  "home.features.fast.desc": { en: "Access your credentials instantly with our optimized platform built for speed and reliability.", es: "Accede a tus credenciales instantáneamente con nuestra plataforma optimizada para velocidad y confiabilidad." },
  "home.features.2fa.title": { en: "Two-Factor Auth", es: "Autenticación 2FA" },
  "home.features.2fa.desc": { en: "Add an extra layer of security with two-factor authentication to protect your account.", es: "Añade una capa extra de seguridad con autenticación de dos factores para proteger tu cuenta." },
  "home.plans.title": { en: "Simple Plans", es: "Planes Simples" },
  "home.plans.credentials": { en: "Credentials", es: "Credenciales" },
  "home.plans.folders": { en: "Folders", es: "Carpetas" },
  "home.plans.folder": { en: "Folder", es: "Carpeta" },
  "home.plans.encryption": { en: "Encryption", es: "Encriptación" },
  "home.plans.unlimited": { en: "Unlimited", es: "Ilimitado" },
  "home.plans.getStarted": { en: "Get Started", es: "Comenzar" },
  "home.plans.subscribeNow": { en: "Subscribe Now", es: "Suscribirse" },
  "home.cta.title": { en: "Ready to Secure Your Passwords?", es: "¿Listo para Proteger tus Contraseñas?" },
  "home.cta.subtitle": { en: "Join thousands of users who trust EterBox to keep their credentials safe.", es: "Únete a miles de usuarios que confían en EterBox para mantener sus credenciales seguras." },
  "home.cta.button": { en: "Start Free Today", es: "Comienza Gratis Hoy" },
  "home.footer.rights": { en: "All rights reserved.", es: "Todos los derechos reservados." },

  // Pricing Page
  "pricing.title": { en: "Simple, Transparent Pricing", es: "Precios Simples y Transparentes" },
  "pricing.subtitle": { en: "Choose the plan that's right for you", es: "Elige el plan adecuado para ti" },
  "pricing.features": { en: "Features", es: "Características" },
  "pricing.credentialsLimit": { en: "credentials", es: "credenciales" },
  "pricing.foldersLimit": { en: "folders", es: "carpetas" },
  "pricing.monthly": { en: "Monthly", es: "Mensual" },
  "pricing.yearly": { en: "Yearly", es: "Anual" },
  "pricing.year": { en: "year", es: "año" },
  "pricing.saveUp": { en: "Save up to 11%", es: "Ahorra hasta 11%" },
  "pricing.equivalentTo": { en: "Equivalent to", es: "Equivalente a" },
  "pricing.generatedKeys": { en: "generated passwords", es: "contraseñas generadas" },
  "pricing.support": { en: "Email support", es: "Soporte por email" },
  "pricing.priority": { en: "Priority support", es: "Soporte prioritario" },
  "pricing.encryption": { en: "AES-256 encryption", es: "Encriptación AES-256" },
  "pricing.twoFactor": { en: "Two-factor authentication", es: "Autenticación de dos factores" },
  "pricing.free": { en: "Free", es: "Gratis" },
  "pricing.month": { en: "month", es: "mes" },
  "pricing.credentials": { en: "Credentials", es: "Credenciales" },
  "pricing.folders": { en: "Folders", es: "Carpetas" },
  "pricing.aesEncryption": { en: "AES-256 Encryption", es: "Encriptación AES-256" },
  "pricing.twoFactorAuth": { en: "Two-Factor Authentication", es: "Autenticación de Dos Factores" },
  "pricing.currentPlan": { en: "Current Plan", es: "Plan Actual" },
  "pricing.popular": { en: "Most Popular", es: "Más Popular" },
  "pricing.getStarted": { en: "Get Started", es: "Comenzar" },
  "pricing.subscribeNow": { en: "Subscribe Now", es: "Suscribirse Ahora" },
  "pricing.processing": { en: "Processing...", es: "Procesando..." },
  "pricing.paymentSuccess": { en: "Payment successful! Your plan has been upgraded.", es: "¡Pago exitoso! Tu plan ha sido mejorado." },
  "pricing.paymentCancelled": { en: "Payment was cancelled.", es: "El pago fue cancelado." },
  "pricing.faq": { en: "Frequently Asked Questions", es: "Preguntas Frecuentes" },
  "pricing.faq1Title": { en: "Can I upgrade or downgrade my plan?", es: "¿Puedo mejorar o reducir mi plan?" },
  "pricing.faq1Answer": { en: "Yes, you can change your plan at any time. Changes take effect immediately.", es: "Sí, puedes cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente." },
  "pricing.faq2Title": { en: "Is my data secure?", es: "¿Mis datos están seguros?" },
  "pricing.faq2Answer": { en: "All your credentials are encrypted with AES-256 encryption. We never store your master password.", es: "Todas tus credenciales están encriptadas con AES-256. Nunca almacenamos tu contraseña maestra." },
  "pricing.faq3Title": { en: "What payment methods do you accept?", es: "¿Qué métodos de pago aceptan?" },
  "pricing.faq3Answer": { en: "We accept all major credit cards and PayPal for secure payments.", es: "Aceptamos todas las tarjetas de crédito principales y PayPal para pagos seguros." },
  "pricing.faq4Title": { en: "Is there a free trial?", es: "¿Hay una prueba gratuita?" },
  "pricing.faq4Answer": { en: "Yes! Start with our Free plan and upgrade anytime. No credit card required.", es: "¡Sí! Comienza con nuestro plan Gratis y mejora cuando quieras. No se requiere tarjeta de crédito." },
  
  // Support
  "support.title": { en: "Contact Support", es: "Contactar Soporte" },
  "support.subtitle": { en: "We're here to help", es: "Estamos aquí para ayudarte" },
  "support.name": { en: "Your Name", es: "Tu Nombre" },
  "support.email": { en: "Your Email", es: "Tu Correo" },
  "support.subject": { en: "Subject", es: "Asunto" },
  "support.message": { en: "Message", es: "Mensaje" },
  "support.send": { en: "Send Message", es: "Enviar Mensaje" },
  "support.sending": { en: "Sending...", es: "Enviando..." },
  "support.sent": { en: "Message sent successfully!", es: "¡Mensaje enviado exitosamente!" },
  
  // Checkout
  "checkout.title": { en: "Complete Payment", es: "Completar Pago" },
  "checkout.secure": { en: "Secure checkout", es: "Pago seguro" },
  "checkout.orderSummary": { en: "Order Summary", es: "Resumen del Pedido" },
  "checkout.billedMonthly": { en: "Billed monthly", es: "Facturado mensualmente" },
  "checkout.billedYearly": { en: "Billed yearly", es: "Facturado anualmente" },
  "checkout.paymentMethod": { en: "Select Payment Method", es: "Seleccionar Método de Pago" },
  "checkout.processing": { en: "Processing your payment...", es: "Procesando tu pago..." },
  "checkout.success": { en: "Payment Successful!", es: "¡Pago Exitoso!" },
  "checkout.successDesc": { en: "Your subscription has been activated.", es: "Tu suscripción ha sido activada." },
  "checkout.redirecting": { en: "Redirecting to dashboard...", es: "Redirigiendo al panel..." },
  "checkout.errorCreatingOrder": { en: "Error creating order", es: "Error al crear la orden" },
  "checkout.paymentSuccess": { en: "Payment completed successfully!", es: "¡Pago completado exitosamente!" },
  "checkout.paymentFailed": { en: "Payment failed. Please try again.", es: "El pago falló. Por favor intenta de nuevo." },
  "checkout.paymentError": { en: "An error occurred during payment.", es: "Ocurrió un error durante el pago." },
  "checkout.cancelled": { en: "Payment cancelled", es: "Pago cancelado" },
  "checkout.securePayment": { en: "Secured by PayPal encryption", es: "Protegido por encriptación de PayPal" },
  "checkout.paypalNotConfigured": { en: "PayPal is not configured. Please contact support.", es: "PayPal no está configurado. Por favor contacta a soporte." },
  "checkout.payWithCard": { en: "Pay with Debit or Credit Card", es: "Pagar con Tarjeta de Débito o Crédito" },
  "checkout.thankYou": { en: "Thank You!", es: "¡Gracias!" },
  "checkout.paymentConfirmed": { en: "Your payment has been confirmed successfully.", es: "Tu pago ha sido confirmado exitosamente." },
  "checkout.yourPlan": { en: "Your Plan Details", es: "Detalles de tu Plan" },
  "checkout.credentials": { en: "credentials", es: "credenciales" },
  "checkout.folders": { en: "folders", es: "carpetas" },
  "checkout.generatedKeys": { en: "generated passwords", es: "contraseñas generadas" },
  "checkout.renewalDate": { en: "Next renewal", es: "Próxima renovación" },
  "checkout.goToDashboard": { en: "Go to Dashboard", es: "Ir al Panel" },
  "checkout.emailConfirmation": { en: "A confirmation email has been sent to your email address.", es: "Se ha enviado un correo de confirmación a tu dirección de email." },

  // Renewal Banner
  "renewal.upcoming": { en: "Subscription Renewal Coming Up", es: "Renovación de Suscripción Próxima" },
  "renewal.upcomingDesc": { en: "Your {plan} plan will renew in {days} days on {date}. Make sure your payment method is up to date.", es: "Tu plan {plan} se renovará en {days} días el {date}. Asegúrate de que tu método de pago esté actualizado." },
  "renewal.expired": { en: "Subscription Expired", es: "Suscripción Expirada" },
  "renewal.expiredDesc": { en: "Your {plan} plan has expired. Renew now to continue enjoying all features.", es: "Tu plan {plan} ha expirado. Renueva ahora para seguir disfrutando de todas las funciones." },
  "renewal.renewNow": { en: "Renew Now", es: "Renovar Ahora" },
  "renewal.updatePayment": { en: "Update Payment Method", es: "Actualizar Método de Pago" },

  // Password Generator
  "generator.title": { en: "Password Generator", es: "Generador de Contraseñas" },
  "generator.usage": { en: "Usage", es: "Uso" },
  "generator.unlimited": { en: "Unlimited", es: "Ilimitado" },
  "generator.length": { en: "Password Length", es: "Longitud de Contraseña" },
  "generator.uppercase": { en: "Uppercase", es: "Mayúsculas" },
  "generator.lowercase": { en: "Lowercase", es: "Minúsculas" },
  "generator.numbers": { en: "Numbers", es: "Números" },
  "generator.symbols": { en: "Symbols", es: "Símbolos" },
  "generator.generate": { en: "Generate Password", es: "Generar Contraseña" },
  "generator.copied": { en: "Password copied!", es: "¡Contraseña copiada!" },
  "generator.limitReached": { en: "You have reached your password generation limit. Upgrade your plan for more.", es: "Has alcanzado tu límite de generación. Mejora tu plan para más." },
  "generator.secureKeys": { en: "Secure Keys", es: "Claves Seguras" },
  "generator.addAsCredential": { en: "Add as New Credential", es: "Agregar como Nueva Credencial" },
  "generator.generated": { en: "generated", es: "generadas" },

  // Common
  "common.cancel": { en: "Cancel", es: "Cancelar" },
  "common.save": { en: "Save", es: "Guardar" },
  "common.delete": { en: "Delete", es: "Eliminar" },
  "common.edit": { en: "Edit", es: "Editar" },
  "common.close": { en: "Close", es: "Cerrar" },
  "common.loading": { en: "Loading...", es: "Cargando..." },
  "common.error": { en: "An error occurred", es: "Ocurrió un error" },
  "common.success": { en: "Success!", es: "¡Éxito!" },
  "common.language": { en: "Language", es: "Idioma" },
  "common.english": { en: "English", es: "Inglés" },
  "common.spanish": { en: "Spanish", es: "Español" },
  "common.back": { en: "Back", es: "Volver" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage first
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eterbox-language");
      if (saved === "en" || saved === "es") return saved;
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("eterbox-language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
