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
  "menu.administration": { en: "Administration", es: "Administración" },
  
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
  
  // Verify 2FA Page (Login)
  "verify2fa.title": { en: "Two-Factor Authentication", es: "Autenticación de Dos Factores" },
  "verify2fa.welcomeBack": { en: "Welcome back", es: "Bienvenido de nuevo" },
  "verify2fa.enterCodeDesc": { en: "Enter the 6-digit code from your authenticator app", es: "Ingresa el código de 6 dígitos de tu aplicación de autenticación" },
  "verify2fa.enterBackupCodeDesc": { en: "Enter one of your backup codes", es: "Ingresa uno de tus códigos de respaldo" },
  "verify2fa.verify": { en: "Verify", es: "Verificar" },
  "verify2fa.verifyBackup": { en: "Verify Backup Code", es: "Verificar Código de Respaldo" },
  "verify2fa.verifying": { en: "Verifying...", es: "Verificando..." },
  "verify2fa.useBackupCode": { en: "Use a backup code instead", es: "Usar un código de respaldo" },
  "verify2fa.useTOTP": { en: "Use authenticator app", es: "Usar aplicación de autenticación" },
  "verify2fa.backupCodeLabel": { en: "Backup Code", es: "Código de Respaldo" },
  "verify2fa.enterCode": { en: "Please enter the 6-digit code", es: "Por favor ingresa el código de 6 dígitos" },
  "verify2fa.enterBackupCode": { en: "Please enter a backup code", es: "Por favor ingresa un código de respaldo" },
  "verify2fa.invalidCode": { en: "Invalid verification code", es: "Código de verificación inválido" },
  "verify2fa.verificationFailed": { en: "Verification failed. Please try again.", es: "La verificación falló. Por favor inténtalo de nuevo." },
  "verify2fa.tokenExpired": { en: "Your verification session has expired. Please log in again.", es: "Tu sesión de verificación ha expirado. Por favor inicia sesión de nuevo." },
  "verify2fa.tokenError": { en: "Error validating session. Please try again.", es: "Error al validar la sesión. Por favor inténtalo de nuevo." },
  "verify2fa.validating": { en: "Validating session...", es: "Validando sesión..." },
  "verify2fa.redirecting": { en: "Redirecting to login...", es: "Redirigiendo al inicio de sesión..." },
  "verify2fa.securityNote": { en: "This additional security step helps protect your account from unauthorized access.", es: "Este paso de seguridad adicional ayuda a proteger tu cuenta de accesos no autorizados." },

  // Register Page
  "register.title": { en: "Create your", es: "Crea tu cuenta" },
  "register.titleAccent": { en: "secure account", es: "segura" },
  "register.subtitle": { en: "Protect your credentials with military encryption", es: "Protege tus credenciales con encriptación militar" },
  "register.name": { en: "Full Name", es: "Nombre completo" },
  "register.namePlaceholder": { en: "John Doe", es: "Juan Pérez" },
  "register.email": { en: "Email", es: "Email" },
  "register.emailPlaceholder": { en: "you@email.com", es: "tu@email.com" },
  "register.password": { en: "Password", es: "Contraseña" },
  "register.passwordPlaceholder": { en: "Minimum 8 characters", es: "Mínimo 8 caracteres" },
  "register.confirmPassword": { en: "Confirm Password", es: "Confirmar contraseña" },
  "register.confirmPasswordPlaceholder": { en: "Repeat your password", es: "Repite tu contraseña" },
  "register.createAccount": { en: "Create Account", es: "Crear Cuenta" },
  "register.creating": { en: "Creating account...", es: "Creando cuenta..." },
  "register.hasAccount": { en: "Already have an account?", es: "¿Ya tienes una cuenta?" },
  "register.signIn": { en: "Sign in", es: "Inicia sesión" },
  "register.back": { en: "Back", es: "Volver" },
  "register.passwordMismatch": { en: "Passwords do not match", es: "Las contraseñas no coinciden" },
  "register.passwordLength": { en: "Password must be at least 8 characters", es: "La contraseña debe tener al menos 8 caracteres" },
  "register.error": { en: "Error creating account", es: "Error al crear la cuenta" },
  "register.biometricNotSupported": { en: "Your browser does not support biometric authentication. Use Safari on iOS for Face ID or Chrome/Edge on Android.", es: "Tu navegador no soporta autenticación biométrica. Usa Safari en iOS para Face ID o Chrome/Edge en Android." },
  "register.biometricNotAvailable": { en: "Your device does not have biometric authentication available (Face ID, Touch ID, or fingerprint).", es: "Tu dispositivo no tiene autenticación biométrica disponible (Face ID, Touch ID, o huella digital)." },
  "register.biometricSuccess": { en: "Biometric authentication activated successfully!", es: "¡Autenticación biométrica activada exitosamente!" },
  "register.biometricError": { en: "Error activating biometrics", es: "Error al activar biometría" },
  "register.biometricDenied": { en: "Permission denied. Please try again and accept the authentication prompt.", es: "Permiso denegado. Por favor, intenta de nuevo y acepta el prompt de autenticación." },
  "register.biometricAlreadyRegistered": { en: "This credential is already registered. Try from another device or delete the existing credential.", es: "Esta credencial ya está registrada. Intenta desde otro dispositivo o elimina la credencial existente." },

  // Login Page
  "login.subtitle": { en: "Access your secure vault", es: "Accede a tu bóveda segura" },
  "login.password": { en: "Password", es: "Contraseña" },
  "login.biometric": { en: "Biometric", es: "Biométrico" },
  "login.loggingIn": { en: "Logging in...", es: "Iniciando sesión..." },
  "login.loginButton": { en: "Login", es: "Iniciar Sesión" },
  "login.biometricDesc": { en: "Use your fingerprint or Face ID to securely access your account", es: "Usa tu huella digital o Face ID para acceder de forma segura a tu cuenta" },
  "login.authenticating": { en: "Authenticating...", es: "Autenticando..." },
  "login.biometricButton": { en: "Authenticate with Biometrics", es: "Autenticar con Biometría" },
  "login.noAccount": { en: "Don't have an account?", es: "¿No tienes una cuenta?" },
  "login.signUp": { en: "Sign Up", es: "Registrarse" },
  "login.back": { en: "Back", es: "Volver" },
  "login.completeFields": { en: "Please complete all fields", es: "Por favor completa todos los campos" },
  "login.failed": { en: "Login failed", es: "Inicio de sesión fallido" },
  "login.credentialNotFound": { en: "credential was not found. If you registered biometrics before, please go to Settings after logging in with password and re-register to enable the new secure login.", es: "credencial no encontrada. Si registraste biometría antes, por favor ve a Configuración después de iniciar sesión con contraseña y vuelve a registrar para habilitar el nuevo inicio de sesión seguro." },
  "login.sessionExpired": { en: "Authentication session expired. Please try again.", es: "Sesión de autenticación expirada. Por favor inténtalo de nuevo." },
  "login.biometricFailed": { en: "Could not authenticate. Make sure you have registered it first.", es: "No se pudo autenticar. Asegúrate de haberlo registrado primero." },
  "login.your": { en: "Your", es: "Tu" },

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
  "home.nav.home": { en: "Home", es: "Inicio" },
  "home.nav.pricing": { en: "Pricing", es: "Precios" },
  "home.nav.support": { en: "Support", es: "Soporte" },
  "home.nav.login": { en: "Login", es: "Iniciar Sesión" },
  "home.nav.signIn": { en: "Sign Up", es: "Registrarse" },
  
  // Settings
  "settings.theme": { en: "Theme", es: "Tema" },
  "settings.language": { en: "Language", es: "Idioma" },
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
  "home.why.title": { en: "Why Choose EterBox?", es: "¿Por qué elegir EterBox?" },
  "home.why.zeroKnowledge.title": { en: "Zero-Knowledge Architecture", es: "Arquitectura de Conocimiento Cero" },
  "home.why.zeroKnowledge.desc": { en: "Your passwords are encrypted on your device before reaching our servers. We can never access your data, ensuring complete privacy.", es: "Tus contraseñas se encriptan en tu dispositivo antes de llegar a nuestros servidores. Nunca podemos acceder a tus datos, garantizando privacidad total." },
  "home.why.crossPlatform.title": { en: "Access Anywhere, Anytime", es: "Acceso en Cualquier Lugar, en Cualquier Momento" },
  "home.why.crossPlatform.desc": { en: "Seamlessly sync your credentials across all your devices - desktop, mobile, and web. Your passwords follow you wherever you go.", es: "Sincroniza sin problemas tus credenciales en todos tus dispositivos: escritorio, móvil y web. Tus contraseñas te siguen donde vayas." },
  "home.why.biometric.title": { en: "Biometric Authentication", es: "Autenticación Biométrica" },
  "home.why.biometric.desc": { en: "Unlock your vault with Face ID or fingerprint. Fast, secure, and convenient access without remembering complex passwords.", es: "Desbloquea tu bóveda con Face ID o huella digital. Acceso rápido, seguro y conveniente sin recordar contraseñas complejas." },
  "home.why.autoBackup.title": { en: "Automatic Encrypted Backups", es: "Respaldos Automáticos Encriptados" },
  "home.why.autoBackup.desc": { en: "Never lose your passwords. Automatic cloud backups ensure your data is safe and recoverable, even if you lose your device.", es: "Nunca pierdas tus contraseñas. Los respaldos automáticos en la nube aseguran que tus datos estén seguros y recuperables, incluso si pierdes tu dispositivo." },
  "home.footer.rights": { en: "All rights reserved.", es: "Todos los derechos reservados." },
  "home.footer.tagline": { en: "Your trusted password manager with military-grade security.", es: "Tu gestor de contraseñas de confianza con seguridad de grado militar." },
  "home.footer.product": { en: "Product", es: "Producto" },
  "home.footer.pricing": { en: "Pricing", es: "Precios" },
  "home.footer.signUp": { en: "Sign Up", es: "Registrarse" },
  "home.footer.login": { en: "Login", es: "Iniciar Sesión" },
  "home.footer.support": { en: "Support", es: "Soporte" },
  "home.footer.helpCenter": { en: "Help Center", es: "Centro de Ayuda" },
  "home.footer.terms": { en: "Terms of Service", es: "Términos de Servicio" },
  "home.footer.privacy": { en: "Privacy Policy", es: "Política de Privacidad" },
  "home.footer.cookies": { en: "Cookie Policy", es: "Política de Cookies" },
  "home.footer.newsletter": { en: "Newsletter", es: "Boletín" },
  "home.footer.newsletterDesc": { en: "Stay updated with security tips and product news.", es: "Mantente actualizado con consejos de seguridad y noticias del producto." },
  "home.footer.emailPlaceholder": { en: "Your email", es: "Tu email" },
  "home.footer.subscribe": { en: "Subscribe", es: "Suscribirse" },

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
  "pricing.forSmallBusinesses": { en: "For Small Businesses", es: "Para Pequeñas Empresas" },
  "pricing.forLargeBusinesses": { en: "For Large Businesses", es: "Para Grandes Empresas" },
  "pricing.exportImport": { en: "Export/Import Credentials", es: "Exportar/Importar Credenciales" },
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
  "pricing.freeDesc": { en: "Perfect for getting started", es: "Perfecto para comenzar" },
  "pricing.basicDesc": { en: "For freelancers and professionals", es: "Para freelancers y profesionales" },
  "pricing.corporateDesc": { en: "For teams and small businesses", es: "Para equipos y pequeñas empresas" },
  "pricing.enterpriseDesc": { en: "For corporations and clients with critical security needs", es: "Para corporaciones y clientes con necesidades críticas de seguridad" },
  "pricing.automaticBackup": { en: "Automatic backup", es: "Backup automático" },
  "pricing.audits": { en: "Complete audits and compliance", es: "Auditorías completas y cumplimiento normativo" },
  "pricing.support24": { en: "24/7 dedicated support", es: "Soporte dedicado 24/7" },
  "pricing.multiUserAdvanced": { en: "Advanced multi-user (up to 20 members)", es: "Multiusuario avanzado (hasta 20 miembros)" },
  "pricing.securePayment": { en: "Secure payment powered by PayPal", es: "Pago seguro con PayPal" },
  
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
  
  // Biometric Setup
  "biometric.setupTitle": { en: "Enable Biometric Login", es: "Habilitar Inicio Biométrico" },
  "biometric.setupDescription": { en: "Use Face ID or fingerprint to securely access your account faster", es: "Usa Face ID o huella digital para acceder a tu cuenta de forma más rápida y segura" },
  "biometric.benefits": { en: "Benefits", es: "Beneficios" },
  "biometric.benefit1": { en: "Faster login without typing passwords", es: "Inicio de sesión más rápido sin escribir contraseñas" },
  "biometric.benefit2": { en: "Enhanced security with biometric authentication", es: "Seguridad mejorada con autenticación biométrica" },
  "biometric.benefit3": { en: "Works with Face ID, Touch ID, and fingerprint sensors", es: "Funciona con Face ID, Touch ID y sensores de huella" },
  "biometric.enableNow": { en: "Enable Now", es: "Habilitar Ahora" },
  "biometric.maybeLater": { en: "Maybe Later", es: "Quizás Luego" },
  "biometric.canEnableLater": { en: "You can enable this feature anytime from Settings", es: "Puedes habilitar esta función en cualquier momento desde Configuración" },
  "biometric.title": { en: "Biometric Authentication", es: "Autenticación Biométrica" },
  "biometric.subtitle": { en: "Use Face ID or fingerprint to login", es: "Usa Face ID o huella digital para iniciar sesión" },
  "biometric.enabled": { en: "Biometric authentication is enabled", es: "La autenticación biométrica está activada" },
  "biometric.disabled": { en: "Biometric authentication is disabled", es: "La autenticación biométrica está desactivada" },
  "biometric.enable": { en: "Enable Biometric Authentication", es: "Activar Autenticación Biométrica" },
  "biometric.disable": { en: "Disable Biometric Authentication", es: "Desactivar Autenticación Biométrica" },

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

  // Payment History
  "payments.history": { en: "Payment History", es: "Historial de Pagos" },
  "payments.historyDesc": { en: "View all your past transactions", es: "Ver todas tus transacciones anteriores" },
  "payments.noPayments": { en: "No payments yet", es: "Sin pagos aún" },
  "payments.noPaymentsDesc": { en: "Your payment history will appear here once you make a purchase.", es: "Tu historial de pagos aparecerá aquí una vez que realices una compra." },
  "payments.completed": { en: "Completed", es: "Completado" },
  "payments.pending": { en: "Pending", es: "Pendiente" },
  "payments.failed": { en: "Failed", es: "Fallido" },
  "payments.refunded": { en: "Refunded", es: "Reembolsado" },
  "payments.transactionId": { en: "Transaction ID", es: "ID de Transacción" },
  "payments.paymentMethod": { en: "Payment Method", es: "Método de Pago" },
  "payments.period": { en: "Billing Period", es: "Período de Facturación" },
  "payments.currency": { en: "Currency", es: "Moneda" },
  "payments.payerEmail": { en: "Payer Email", es: "Email del Pagador" },
  "payments.description": { en: "Description", es: "Descripción" },
  "payments.viewHistory": { en: "View Payment History", es: "Ver Historial de Pagos" },

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
  "common.email": { en: "Email", es: "Correo Electrónico" },
  "common.emailPlaceholder": { en: "your@email.com", es: "tu@correo.com" },
  "common.password": { en: "Password", es: "Contraseña" },
  "common.passwordPlaceholder": { en: "Your password", es: "Tu contraseña" },
  "common.secure": { en: "Secure", es: "Segura" },
  
  // 404 Page
  "notFound.title": { en: "Page Not Found", es: "Página No Encontrada" },
  "notFound.description": { en: "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.", es: "Lo sentimos, la página que buscas no existe. Puede haber sido movida o eliminada." },
  "notFound.goHome": { en: "Go Home", es: "Ir al Inicio" },
  "notFound.goDashboard": { en: "Go to Dashboard", es: "Ir al Panel" },
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
