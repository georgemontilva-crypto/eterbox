import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import Verify2FA from "./pages/Verify2FA";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import ChangePassword from "./pages/ChangePassword";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { SplashScreen } from "./components/SplashScreen";
import { useState, useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <NotFound />;
  }

  return <Component />;
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
      <Route path="/pricing" component={Pricing} />
      <Route path="/support" component={Support} />
      <Route path="/verify-2fa" component={Verify2FA} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
      <Route path="/change-password" component={() => <ProtectedRoute component={ChangePassword} />} />
      <Route path="/admin" component={() => <AdminRoute component={Admin} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Theme Guideline:
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  // Splash screen disabled temporarily - will be re-enabled after fixing auth issues
  // const [showSplash, setShowSplash] = useState(false);

  // useEffect(() => {
  //   const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  //   const hasSeenSplash = sessionStorage.getItem('splash_shown');
  //   
  //   if (isPWA && !hasSeenSplash) {
  //     setShowSplash(true);
  //     sessionStorage.setItem('splash_shown', 'true');
  //   }
  // }, []);

  // const handleSplashFinish = () => {
  //   setShowSplash(false);
  // };

  // if (showSplash) {
  //   return (
  //     <SplashScreen 
  //       onFinish={handleSplashFinish}
  //       isAuthenticated={false}
  //     />
  //   );
  // }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
