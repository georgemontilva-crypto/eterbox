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
  "menu.documentation": { en: "Documentation", es: "Documentación" },
  "menu.documentationDesc": { en: "Policies & Security", es: "Políticas y Seguridad" },
  "menu.securityCompliance": { en: "Security & Compliance", es: "Seguridad y Cumplimiento" },
  "menu.securityComplianceDesc": { en: "Our security standards", es: "Nuestros estándares de seguridad" },
  "menu.privacyPolicy": { en: "Privacy Policy", es: "Política de Privacidad" },
  "menu.privacyPolicyDesc": { en: "How we protect your data", es: "Cómo protegemos tus datos" },
  "menu.cookiePolicy": { en: "Cookie Policy", es: "Política de Cookies" },
  "menu.cookiePolicyDesc": { en: "How we use cookies", es: "Cómo usamos las cookies" },
  "menu.termsOfService": { en: "Terms of Service", es: "Términos de Servicio" },
  "menu.termsOfServiceDesc": { en: "Our terms and conditions", es: "Nuestros términos y condiciones" },
  "menu.refundPolicy": { en: "Refund Policy", es: "Política de Reembolsos" },
  "menu.refundPolicyDesc": { en: "Our refund policy", es: "Nuestra política de reembolsos" },
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

  // Welcome 2FA Modal
  "welcome2fa.title": { en: "Welcome to EterBox!", es: "¡Bienvenido a EterBox!" },
  "welcome2fa.description": { en: "Your account has been created successfully. For enhanced security, we recommend enabling Two-Factor Authentication (2FA).", es: "Tu cuenta ha sido creada exitosamente. Para mayor seguridad, te recomendamos activar la Autenticación de Dos Factores (2FA)." },
  "welcome2fa.benefit1Title": { en: "Extra Protection", es: "Protección Extra" },
  "welcome2fa.benefit1": { en: "Add an additional layer of security to your account", es: "Añade una capa adicional de seguridad a tu cuenta" },
  "welcome2fa.benefit2Title": { en: "Prevents Unauthorized Access", es: "Previene Accesos No Autorizados" },
  "welcome2fa.benefit2": { en: "Even if someone gets your password, they won't be able to access without the 2FA code", es: "Incluso si alguien obtiene tu contraseña, no podrá acceder sin el código 2FA" },
  "welcome2fa.benefit3Title": { en: "Easy to Set Up", es: "Fácil de Configurar" },
  "welcome2fa.benefit3": { en: "It only takes 2 minutes to set up with your favorite authentication app", es: "Solo toma 2 minutos configurarlo con tu app de autenticación favorita" },
  "welcome2fa.activateNow": { en: "Activate Now", es: "Activar Ahora" },
  "welcome2fa.later": { en: "Later", es: "Más Tarde" },
  "welcome2fa.reminder": { en: "You can activate 2FA anytime from your settings", es: "Puedes activar 2FA en cualquier momento desde tu configuración" },

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
  "home.nav.security": { en: "Security", es: "Seguridad" },
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
  "home.footer.refund": { en: "Refund Policy", es: "Reembolsos" },
  "home.footer.security": { en: "Security", es: "Seguridad" },
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
  
  // Inactivity Modal
  "inactivity.title": { en: "Session Expiring Soon", es: "Sesión Por Expirar" },
  "inactivity.description": { en: "You've been inactive for a while. For your security, your session will automatically end soon.", es: "Has estado inactivo por un tiempo. Por tu seguridad, tu sesión finalizará automáticamente pronto." },
  "inactivity.secondsRemaining": { en: "seconds remaining", es: "segundos restantes" },
  "inactivity.stayLoggedIn": { en: "Stay Logged In", es: "Mantener Sesión" },
  "inactivity.logoutNow": { en: "Logout Now", es: "Cerrar Sesión" },
  
  // Forgot Password
  "login.forgotPassword": { en: "Forgot password?", es: "¿Olvidaste tu contraseña?" },
  "forgotPassword.title": { en: "Reset Password", es: "Restablecer Contraseña" },
  "forgotPassword.description": { en: "Enter your email address and we'll send you a link to reset your password.", es: "Ingresa tu dirección de email y te enviaremos un enlace para restablecer tu contraseña." },
  "forgotPassword.sendResetLink": { en: "Send Reset Link", es: "Enviar Enlace" },
  "forgotPassword.sending": { en: "Sending...", es: "Enviando..." },
  "forgotPassword.backToLogin": { en: "Back to Login", es: "Volver al Login" },
  "forgotPassword.checkEmail": { en: "Check Your Email", es: "Revisa Tu Email" },
  "forgotPassword.emailSent": { en: "If an account exists with this email, you'll receive a password reset link shortly. Please check your inbox and spam folder.", es: "Si existe una cuenta con este email, recibirás un enlace para restablecer tu contraseña en breve. Por favor revisa tu bandeja de entrada y carpeta de spam." },
  
  // Reset Password
  "resetPassword.title": { en: "Create New Password", es: "Crear Nueva Contraseña" },
  "resetPassword.description": { en: "Enter your new password below.", es: "Ingresa tu nueva contraseña abajo." },
  "resetPassword.newPassword": { en: "New Password", es: "Nueva Contraseña" },
  "resetPassword.newPasswordPlaceholder": { en: "Minimum 8 characters", es: "Mínimo 8 caracteres" },
  "resetPassword.confirmPassword": { en: "Confirm New Password", es: "Confirmar Nueva Contraseña" },
  "resetPassword.confirmPasswordPlaceholder": { en: "Repeat your new password", es: "Repite tu nueva contraseña" },
  "resetPassword.twoFactorCode": { en: "2FA Code", es: "Código 2FA" },
  "resetPassword.twoFactorPlaceholder": { en: "000000", es: "000000" },
  "resetPassword.twoFactorHelp": { en: "Enter the 6-digit code from your authenticator app", es: "Ingresa el código de 6 dígitos de tu aplicación de autenticación" },
  "resetPassword.twoFactorRequired": { en: "2FA code is required", es: "El código 2FA es requerido" },
  "resetPassword.resetPassword": { en: "Reset Password", es: "Restablecer Contraseña" },
  "resetPassword.resetting": { en: "Resetting...", es: "Restableciendo..." },
  "resetPassword.passwordMismatch": { en: "Passwords do not match", es: "Las contraseñas no coinciden" },
  "resetPassword.passwordTooShort": { en: "Password must be at least 8 characters", es: "La contraseña debe tener al menos 8 caracteres" },
  "resetPassword.success": { en: "Password Reset Successful", es: "Contraseña Restablecida" },
  "resetPassword.successMessage": { en: "Your password has been reset successfully. You can now log in with your new password.", es: "Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña." },
  "resetPassword.invalidLink": { en: "Invalid Reset Link", es: "Enlace Inválido" },
  "resetPassword.requestNewLink": { en: "Request New Link", es: "Solicitar Nuevo Enlace" },
  "resetPassword.verifying": { en: "Verifying reset link...", es: "Verificando enlace..." },
  
  // Notifications
  "notifications.title": { en: "Notifications", es: "Notificaciones" },
  "notifications.subtitle": { en: "Configure your email alerts", es: "Configura tus alertas por email" },
  "notifications.about": { en: "About Notifications", es: "Sobre las notificaciones" },
  "notifications.aboutText": { en: "Emails are sent to your registered email", es: "Se envían a tu email registrado" },
  "notifications.saved": { en: "✓ Preferences saved", es: "✓ Preferencias guardadas" },
  "notifications.error": { en: "✗ Error saving", es: "✗ Error al guardar" },
  "notifications.testSent": { en: "✓ Test notification sent. Check your email.", es: "✓ Notificación de prueba enviada. Revisa tu email." },
  "notifications.testError": { en: "✗ Error sending test notification", es: "✗ Error al enviar notificación de prueba" },
  
  "notifications.security.title": { en: "Security Alerts", es: "Alertas de Seguridad" },
  "notifications.security.desc": { en: "Receive notifications about suspicious activity, new logins, password changes, and security settings.", es: "Recibe notificaciones sobre actividad sospechosa, nuevos inicios de sesión, cambios de contraseña y configuración de seguridad." },
  "notifications.security.items": { en: "• New logins from unknown devices\n• Changes to your master password\n• 2FA activation/deactivation\n• Suspicious activity detected", es: "• Nuevos inicios de sesión desde dispositivos desconocidos\n• Cambios en tu contraseña maestra\n• Activación/desactivación de 2FA\n• Actividad sospechosa detectada" },
  "notifications.security.test": { en: "Test", es: "Probar" },
  
  "notifications.marketing.title": { en: "Promotions and Marketing", es: "Promociones y Marketing" },
  "notifications.marketing.desc": { en: "Receive special offers, exclusive discounts and news about new features.", es: "Recibe ofertas especiales, descuentos exclusivos y noticias sobre nuevas funciones." },
  
  "notifications.updates.title": { en: "Updates", es: "Actualizaciones" },
  "notifications.updates.desc": { en: "New versions and improvements", es: "Nuevas versiones y mejoras" },
  
  "notifications.activity.title": { en: "Account Activity", es: "Actividad de Cuenta" },
  "notifications.activity.desc": { en: "Summaries and reminders", es: "Resúmenes y recordatorios" },
  
  // Refund Policy
  "refund.backToHome": { en: "Back to Home", es: "Volver al Inicio" },
  "refund.title": { en: "Refund Policy", es: "Política de Reembolsos" },
  "refund.pageTitle": { en: "Refund Policy", es: "Política de Reembolsos" },
  "refund.lastUpdated": { en: "Last Updated", es: "Última Actualización" },
  "refund.updateDate": { en: "January 2026", es: "Enero 2026" },
  "refund.importantNotice": { en: "Important Notice", es: "Aviso Importante" },
  "refund.noRefundPolicy": { en: "All sales are final. No refunds will be issued except in cases of billing errors or technical issues that prevent service access.", es: "Todas las ventas son finales. No se emitirán reembolsos excepto en casos de errores de facturación o problemas técnicos que impidan el acceso al servicio." },
  "refund.noRefundExplanation": { en: "By subscribing to EterBox, you acknowledge and accept this no-refund policy.", es: "Al suscribirte a EterBox, reconoces y aceptas esta política de no reembolsos." },
  
  "refund.section1Title": { en: "1. No Refund Policy", es: "1. Política de No Reembolsos" },
  "refund.section1Content1": { en: "EterBox operates on a strict no-refund policy. All purchases of subscription plans (Basic, Corporate, and Enterprise) are final and non-refundable.", es: "EterBox opera bajo una política estricta de no reembolsos. Todas las compras de planes de suscripción (Basic, Corporate y Enterprise) son finales y no reembolsables." },
  "refund.section1Content2": { en: "This policy applies to all subscription periods, whether monthly or yearly, and regardless of usage or satisfaction with the service.", es: "Esta política se aplica a todos los períodos de suscripción, ya sean mensuales o anuales, e independientemente del uso o satisfacción con el servicio." },
  "refund.section1Content3": { en: "We encourage all users to thoroughly test our free plan before committing to a paid subscription to ensure the service meets your needs.", es: "Alentamos a todos los usuarios a probar exhaustivamente nuestro plan gratuito antes de comprometerse con una suscripción de pago para asegurar que el servicio cumple con sus necesidades." },
  
  "refund.section2Title": { en: "2. Subscription Service", es: "2. Servicio de Suscripción" },
  "refund.section2Content1": { en: "EterBox is a subscription-based service with the following characteristics:", es: "EterBox es un servicio basado en suscripción con las siguientes características:" },
  "refund.section2Point1": { en: "Subscriptions renew automatically at the end of each billing cycle (monthly or yearly)", es: "Las suscripciones se renuevan automáticamente al final de cada ciclo de facturación (mensual o anual)" },
  "refund.section2Point2": { en: "You will be charged the current subscription price at renewal unless you cancel before the renewal date", es: "Se te cobrará el precio de suscripción actual en la renovación a menos que canceles antes de la fecha de renovación" },
  "refund.section2Point3": { en: "Access to premium features continues until the end of the paid period, even if you cancel", es: "El acceso a funciones premium continúa hasta el final del período pagado, incluso si cancelas" },
  "refund.section2Point4": { en: "After cancellation, your account will automatically downgrade to the free plan at the end of the billing cycle", es: "Después de la cancelación, tu cuenta se degradará automáticamente al plan gratuito al final del ciclo de facturación" },
  
  "refund.section3Title": { en: "3. Billing and Charges", es: "3. Facturación y Cargos" },
  "refund.section3Content1": { en: "All charges are processed securely through our payment partners (PayPal and Stripe). Please note:", es: "Todos los cargos se procesan de forma segura a través de nuestros socios de pago (PayPal y Stripe). Ten en cuenta:" },
  "refund.section3Point1": { en: "Charges are made in USD and may be subject to currency conversion fees by your bank", es: "Los cargos se realizan en USD y pueden estar sujetos a tarifas de conversión de moneda por tu banco" },
  "refund.section3Point2": { en: "You are responsible for ensuring your payment method is valid and has sufficient funds", es: "Eres responsable de asegurar que tu método de pago sea válido y tenga fondos suficientes" },
  "refund.section3Point3": { en: "Failed payments may result in service interruption or account suspension", es: "Los pagos fallidos pueden resultar en interrupción del servicio o suspensión de cuenta" },
  "refund.section3Point4": { en: "We do not store your credit card information; all payment data is handled by our secure payment processors", es: "No almacenamos tu información de tarjeta de crédito; todos los datos de pago son manejados por nuestros procesadores de pago seguros" },
  
  "refund.section4Title": { en: "4. Cancellation Policy", es: "4. Política de Cancelación" },
  "refund.section4Content1": { en: "You may cancel your subscription at any time through your account settings. Upon cancellation:", es: "Puedes cancelar tu suscripción en cualquier momento a través de la configuración de tu cuenta. Al cancelar:" },
  "refund.section4Point1": { en: "Your subscription remains active until the end of the current billing period", es: "Tu suscripción permanece activa hasta el final del período de facturación actual" },
  "refund.section4Point2": { en: "You will not be charged for subsequent billing cycles", es: "No se te cobrará por ciclos de facturación posteriores" },
  "refund.section4Point3": { en: "No refund will be provided for the remaining time in your current billing period", es: "No se proporcionará reembolso por el tiempo restante en tu período de facturación actual" },
  "refund.section4Point4": { en: "Your account will automatically convert to the free plan when the paid period expires", es: "Tu cuenta se convertirá automáticamente al plan gratuito cuando expire el período pagado" },
  
  "refund.section5Title": { en: "5. Exceptions - When Refunds May Be Issued", es: "5. Excepciones - Cuándo Se Pueden Emitir Reembolsos" },
  "refund.section5Content1": { en: "We will issue refunds only in the following exceptional circumstances:", es: "Emitiremos reembolsos solo en las siguientes circunstancias excepcionales:" },
  "refund.section5Point1": { en: "Duplicate charges: If you were accidentally charged twice for the same subscription period", es: "Cargos duplicados: Si se te cobró accidentalmente dos veces por el mismo período de suscripción" },
  "refund.section5Point2": { en: "Billing errors: If you were charged an incorrect amount due to a system error", es: "Errores de facturación: Si se te cobró una cantidad incorrecta debido a un error del sistema" },
  "refund.section5Point3": { en: "Service unavailability: If our service was completely inaccessible for more than 72 consecutive hours due to technical issues on our end", es: "Indisponibilidad del servicio: Si nuestro servicio estuvo completamente inaccesible durante más de 72 horas consecutivas debido a problemas técnicos de nuestra parte" },
  "refund.section5Content2": { en: "To request a refund under these exceptions, please contact our support team at support@eterbox.com with documentation of the issue. Refund requests must be submitted within 30 days of the charge.", es: "Para solicitar un reembolso bajo estas excepciones, contacta a nuestro equipo de soporte en support@eterbox.com con documentación del problema. Las solicitudes de reembolso deben presentarse dentro de los 30 días del cargo." },
  
  "refund.section6Title": { en: "6. Free Plan - Risk-Free Trial", es: "6. Plan Gratuito - Prueba Sin Riesgo" },
  "refund.section6Content1": { en: "EterBox offers a generous free plan that allows you to test our service before committing to a paid subscription. The free plan includes up to 25 credentials, unlimited folders, and all core security features.", es: "EterBox ofrece un plan gratuito generoso que te permite probar nuestro servicio antes de comprometerte con una suscripción de pago. El plan gratuito incluye hasta 25 credenciales, carpetas ilimitadas y todas las funciones de seguridad principales." },
  "refund.section6Content2": { en: "We strongly recommend using the free plan to evaluate whether EterBox meets your needs before upgrading to a paid plan.", es: "Recomendamos encarecidamente usar el plan gratuito para evaluar si EterBox cumple con tus necesidades antes de actualizar a un plan de pago." },
  
  "refund.section7Title": { en: "7. Chargebacks and Disputes", es: "7. Contracargos y Disputas" },
  "refund.section7Content1": { en: "Please contact us before initiating a chargeback with your bank or credit card company. Chargebacks filed without first attempting to resolve the issue with us may result in:", es: "Por favor contáctanos antes de iniciar un contracargo con tu banco o compañía de tarjeta de crédito. Los contracargos presentados sin intentar primero resolver el problema con nosotros pueden resultar en:" },
  "refund.section7Content2": { en: "Consequences of unauthorized chargebacks:", es: "Consecuencias de contracargos no autorizados:" },
  "refund.section7Point1": { en: "Immediate suspension of your account and loss of access to all data", es: "Suspensión inmediata de tu cuenta y pérdida de acceso a todos los datos" },
  "refund.section7Point2": { en: "A chargeback processing fee of $25 USD will be added to your account", es: "Se agregará una tarifa de procesamiento de contracargo de $25 USD a tu cuenta" },
  "refund.section7Point3": { en: "Permanent ban from using EterBox services if the chargeback is deemed fraudulent", es: "Prohibición permanente de usar los servicios de EterBox si el contracargo se considera fraudulento" },
  
  "refund.section8Title": { en: "8. Contact Us", es: "8. Contáctanos" },
  "refund.section8Content": { en: "If you have questions about this refund policy or believe you qualify for an exception, please contact our support team. We are committed to resolving any billing issues fairly and promptly.", es: "Si tienes preguntas sobre esta política de reembolsos o crees que calificas para una excepción, contacta a nuestro equipo de soporte. Estamos comprometidos a resolver cualquier problema de facturación de manera justa y rápida." },
  "refund.contactSupport": { en: "Contact Support", es: "Contactar Soporte" },
  "refund.footerNote": { en: "By using EterBox, you acknowledge that you have read, understood, and agree to this Refund Policy.", es: "Al usar EterBox, reconoces que has leído, entendido y aceptas esta Política de Reembolsos." },
  
  // Security & Compliance
  "security.backToHome": { en: "Back to Home", es: "Volver al Inicio" },
  "security.title": { en: "Security & Compliance", es: "Seguridad y Cumplimiento" },
  "security.pageTitle": { en: "Security & Compliance", es: "Seguridad y Cumplimiento" },
  "security.pageSubtitle": { en: "EterBox is built with security at its core. Learn about our commitment to protecting your data with industry-leading encryption and security practices.", es: "EterBox está construido con la seguridad en su núcleo. Conoce nuestro compromiso de proteger tus datos con cifrado y prácticas de seguridad líderes en la industria." },
  "security.encryption": { en: "Encryption", es: "Cifrado" },
  "security.twoFactor": { en: "Two-Factor Auth", es: "Autenticación 2FA" },
  "security.secureConnection": { en: "Secure Connection", es: "Conexión Segura" },
  "security.compliant": { en: "Compliant", es: "Cumplimiento" },
  
  "security.featuresTitle": { en: "Security Features", es: "Características de Seguridad" },
  
  "security.feature1Title": { en: "End-to-End Encryption", es: "Cifrado de Extremo a Extremo" },
  "security.feature1Desc1": { en: "All your passwords and credentials are encrypted using military-grade AES-256-GCM encryption before being stored in our database.", es: "Todas tus contraseñas y credenciales se cifran usando cifrado AES-256-GCM de grado militar antes de almacenarse en nuestra base de datos." },
  "security.feature1Point1": { en: "AES-256-GCM authenticated encryption with 256-bit keys", es: "Cifrado autenticado AES-256-GCM con claves de 256 bits" },
  "security.feature1Point2": { en: "PBKDF2 key derivation with 100,000 iterations and SHA-256", es: "Derivación de clave PBKDF2 con 100,000 iteraciones y SHA-256" },
  "security.feature1Point3": { en: "Unique salt and initialization vector (IV) for each credential", es: "Salt único y vector de inicialización (IV) para cada credencial" },
  "security.feature1Point4": { en: "Authentication tags to verify data integrity", es: "Etiquetas de autenticación para verificar integridad de datos" },
  
  "security.feature2Title": { en: "Two-Factor Authentication (2FA)", es: "Autenticación de Dos Factores (2FA)" },
  "security.feature2Desc1": { en: "Add an extra layer of security to your account with time-based one-time passwords (TOTP).", es: "Agrega una capa adicional de seguridad a tu cuenta con contraseñas de un solo uso basadas en tiempo (TOTP)." },
  "security.feature2Point1": { en: "TOTP-based 2FA compatible with Google Authenticator, Authy, and other authenticator apps", es: "2FA basado en TOTP compatible con Google Authenticator, Authy y otras aplicaciones de autenticación" },
  "security.feature2Point2": { en: "10 backup codes generated for account recovery", es: "10 códigos de respaldo generados para recuperación de cuenta" },
  "security.feature2Point3": { en: "Backup codes are hashed using SHA-256 before storage", es: "Los códigos de respaldo se hashean usando SHA-256 antes de almacenarse" },
  
  "security.feature3Title": { en: "Security Monitoring & Audit Logs", es: "Monitoreo de Seguridad y Registros de Auditoría" },
  "security.feature3Desc1": { en: "We continuously monitor your account for suspicious activity and maintain detailed audit logs.", es: "Monitoreamos continuamente tu cuenta en busca de actividad sospechosa y mantenemos registros de auditoría detallados." },
  "security.feature3Point1": { en: "Activity logging for all account actions (login, password changes, credential access)", es: "Registro de actividad para todas las acciones de cuenta (login, cambios de contraseña, acceso a credenciales)" },
  "security.feature3Point2": { en: "Failed login attempt tracking with email alerts", es: "Seguimiento de intentos de login fallidos con alertas por email" },
  "security.feature3Point3": { en: "Rate limiting to prevent brute-force attacks (5 attempts per 15 minutes)", es: "Limitación de tasa para prevenir ataques de fuerza bruta (5 intentos cada 15 minutos)" },
  "security.feature3Point4": { en: "Automatic session timeout after 15 minutes of inactivity", es: "Timeout automático de sesión después de 15 minutos de inactividad" },
  
  "security.feature4Title": { en: "Infrastructure Security", es: "Seguridad de Infraestructura" },
  "security.feature4Desc1": { en: "Our infrastructure is hosted on enterprise-grade cloud platforms with industry-leading security.", es: "Nuestra infraestructura está alojada en plataformas en la nube de grado empresarial con seguridad líder en la industria." },
  "security.feature4Point1": { en: "TLS 1.3 encryption for all data in transit", es: "Cifrado TLS 1.3 para todos los datos en tránsito" },
  "security.feature4Point2": { en: "Hosted on Railway with automatic SSL certificates", es: "Alojado en Railway con certificados SSL automáticos" },
  "security.feature4Point3": { en: "Database encryption at rest with TiDB Serverless", es: "Cifrado de base de datos en reposo con TiDB Serverless" },
  
  "security.complianceTitle": { en: "Privacy & Compliance", es: "Privacidad y Cumplimiento" },
  "security.gdprDesc": { en: "We comply with the General Data Protection Regulation (GDPR) to protect the privacy rights of EU citizens. You have full control over your data with rights to access, rectify, and delete your information.", es: "Cumplimos con el Reglamento General de Protección de Datos (GDPR) para proteger los derechos de privacidad de los ciudadanos de la UE. Tienes control total sobre tus datos con derechos de acceso, rectificación y eliminación de tu información." },
  "security.ccpaDesc": { en: "We comply with the California Consumer Privacy Act (CCPA) to protect the privacy rights of California residents. You can request disclosure of data collection and opt-out of data sales.", es: "Cumplimos con la Ley de Privacidad del Consumidor de California (CCPA) para proteger los derechos de privacidad de los residentes de California. Puedes solicitar divulgación de recolección de datos y optar por no participar en ventas de datos." },
  
  "security.faqTitle": { en: "Security FAQ", es: "Preguntas Frecuentes de Seguridad" },
  "security.faq1Question": { en: "Can EterBox employees see my passwords?", es: "¿Pueden los empleados de EterBox ver mis contraseñas?" },
  "security.faq1Answer": { en: "No. All passwords are encrypted using AES-256-GCM before being stored. We do not have access to your unencrypted passwords. Even our database administrators cannot decrypt your credentials without your account.", es: "No. Todas las contraseñas se cifran usando AES-256-GCM antes de almacenarse. No tenemos acceso a tus contraseñas sin cifrar. Incluso nuestros administradores de base de datos no pueden descifrar tus credenciales sin tu cuenta." },
  "security.faq2Question": { en: "What happens if EterBox is hacked?", es: "¿Qué pasa si EterBox es hackeado?" },
  "security.faq2Answer": { en: "In the unlikely event of a breach, your passwords remain encrypted with AES-256-GCM. Without your account credentials, the encrypted data is computationally infeasible to decrypt. We also maintain rate limiting and intrusion detection to prevent unauthorized access.", es: "En el caso improbable de una brecha, tus contraseñas permanecen cifradas con AES-256-GCM. Sin tus credenciales de cuenta, los datos cifrados son computacionalmente imposibles de descifrar. También mantenemos limitación de tasa y detección de intrusiones para prevenir acceso no autorizado." },
  "security.faq3Question": { en: "How are passwords transmitted to EterBox servers?", es: "¿Cómo se transmiten las contraseñas a los servidores de EterBox?" },
  "security.faq3Answer": { en: "All communication between your browser and our servers is encrypted using TLS 1.3 (HTTPS). Your passwords are encrypted immediately upon reaching our servers before being stored in the database.", es: "Toda la comunicación entre tu navegador y nuestros servidores está cifrada usando TLS 1.3 (HTTPS). Tus contraseñas se cifran inmediatamente al llegar a nuestros servidores antes de almacenarse en la base de datos." },
  "security.faq4Question": { en: "What encryption algorithms does EterBox use?", es: "¿Qué algoritmos de cifrado usa EterBox?" },
  "security.faq4Answer": { en: "We use AES-256-GCM for credential encryption, bcrypt with 12 rounds for password hashing, PBKDF2 with 100,000 iterations for key derivation, and SHA-256 for backup code hashing.", es: "Usamos AES-256-GCM para cifrado de credenciales, bcrypt con 12 rondas para hashing de contraseñas, PBKDF2 con 100,000 iteraciones para derivación de claves, y SHA-256 para hashing de códigos de respaldo." },
  "security.faq5Question": { en: "Where is my data stored?", es: "¿Dónde se almacenan mis datos?" },
  "security.faq5Answer": { en: "Your encrypted data is stored in TiDB Serverless, a distributed SQL database with automatic encryption at rest. Our application is hosted on Railway with automatic SSL certificates and DDoS protection.", es: "Tus datos cifrados se almacenan en TiDB Serverless, una base de datos SQL distribuida con cifrado automático en reposo. Nuestra aplicación está alojada en Railway con certificados SSL automáticos y protección DDoS." },
  
  "security.responsibleDisclosureTitle": { en: "Responsible Disclosure", es: "Divulgación Responsable" },
  "security.responsibleDisclosureDesc": { en: "If you discover a security vulnerability in EterBox, please report it to us responsibly. We appreciate the security community's efforts to keep our users safe. Contact us at security@eterbox.com with details of the vulnerability.", es: "Si descubres una vulnerabilidad de seguridad en EterBox, repórtala responsablemente. Apreciamos los esfuerzos de la comunidad de seguridad para mantener a nuestros usuarios seguros. Contáctanos en security@eterbox.com con detalles de la vulnerabilidad." },
  "security.reportVulnerability": { en: "Report Vulnerability", es: "Reportar Vulnerabilidad" },
  
  "security.contactTitle": { en: "Questions About Security?", es: "¿Preguntas Sobre Seguridad?" },
  "security.contactDesc": { en: "If you have questions about our security practices or need more information, our support team is here to help.", es: "Si tienes preguntas sobre nuestras prácticas de seguridad o necesitas más información, nuestro equipo de soporte está aquí para ayudar." },
  "security.contactSupport": { en: "Contact Support", es: "Contactar Soporte" },
  "security.viewPrivacyPolicy": { en: "View Privacy Policy", es: "Ver Política de Privacidad" },
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
