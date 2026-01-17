import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import QRDashboard from "./pages/QRDashboard";
import QRRedirect from "./pages/QRRedirect";
import Shared from "./pages/Shared";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import Legal from "./pages/Legal";
import Verify2FA from "./pages/Verify2FA";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import SecurityCompliance from "./pages/SecurityCompliance";
import AboutUs from "./pages/AboutUs";
import Security from "./pages/Security";
import FAQ from "./pages/FAQ";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { SplashScreen } from "./components/SplashScreen";
import { CookieConsent } from "./components/CookieConsent";
import { useState, useEffect } from "react";
import { useInactivityTimer } from "./hooks/useInactivityTimer";
import { InactivityWarningModal } from "./components/InactivityWarningModal";
import { Toaster } from "@/components/ui/sonner";
import { useLenis } from "./hooks/useLenis";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showWarning, setShowWarning] = useState(false);

  // 15 minutos de inactividad total, advertencia 1 minuto antes
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos
  const WARNING_TIME = 60 * 1000; // 1 minuto antes

  const handleWarning = () => {
    setShowWarning(true);
  };

  const handleTimeout = () => {
    logout();
    setLocation('/login');
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    extendSession();
  };

  const handleLogoutNow = () => {
    setShowWarning(false);
    logout();
    setLocation('/login');
  };

  const { extendSession } = useInactivityTimer({
    timeout: INACTIVITY_TIMEOUT,
    warningTime: WARNING_TIME,
    onWarning: handleWarning,
    onTimeout: handleTimeout,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  return (
    <>
      <Component />
      <InactivityWarningModal
        isOpen={showWarning}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogoutNow}
        remainingSeconds={60}
      />
    </>
  );
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-accent" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/support" component={Support} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/security-compliance" component={SecurityCompliance} />
      <Route path="/about" component={AboutUs} />
      <Route path="/security" component={Security} />
      <Route path="/faq" component={FAQ} />
      <Route path="/verify-2fa" component={Verify2FA} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/qr/:shortCode" component={QRRedirect} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/qr-codes" component={() => <ProtectedRoute component={QRDashboard} />} />
      <Route path="/shared" component={() => <ProtectedRoute component={Shared} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
      <Route path="/legal" component={() => <ProtectedRoute component={Legal} />} />
      <Route path="/change-password" component={() => <ProtectedRoute component={ChangePassword} />} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Theme Guideline:
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  // Inicializar Lenis para scroll suave
  useLenis();
  
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    return !splashShown; // Show splash only if not shown yet
  });

  useEffect(() => {
    // Mark splash as shown for this session
    if (showSplash) {
      sessionStorage.setItem('splashShown', 'true');
    }
  }, [showSplash]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <SplashScreen 
        onFinish={handleSplashFinish}
        isAuthenticated={false}
      />
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ErrorBoundary>
            <Router />
            <CookieConsent />
            <Toaster />
          </ErrorBoundary>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
