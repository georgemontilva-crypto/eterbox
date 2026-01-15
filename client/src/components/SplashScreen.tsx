import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  isAuthenticated: boolean;
}

export function SplashScreen({ onFinish, isAuthenticated }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash for 1.5 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation to complete
      setTimeout(() => {
        onFinish();
        // Don't redirect - let the app show the current route
      }, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        minHeight: "100vh",
        minHeight: "-webkit-fill-available",
      }}
    >
      <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <img
          src="/logo-light.png"
          alt="EterBox Logo"
          className="w-24 h-24 mx-auto mb-6 animate-pulse"
        />
        <h1 className="text-5xl font-bold text-white tracking-wider font-montserrat">
          EterBox
        </h1>
        <p className="text-sm text-gray-400 mt-4 tracking-wide">
          Your Passwords, Secured
        </p>
      </div>
    </div>
  );
}
