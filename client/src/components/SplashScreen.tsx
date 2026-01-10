import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation to complete
      setTimeout(onFinish, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black to-gray-900 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <img
          src="/logo.png"
          alt="EterBox Logo"
          className="w-32 h-32 mx-auto mb-6 animate-pulse"
        />
        <h1 className="text-5xl font-bold text-white tracking-wider font-montserrat">
          EterBox
        </h1>
        <p className="text-sm text-gray-400 mt-4 tracking-wide">
          Security Vault
        </p>
      </div>
    </div>
  );
}
