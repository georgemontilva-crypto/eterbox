import { useEffect, useRef, useState } from 'react';

interface UseInactivityTimerOptions {
  timeout: number; // Tiempo total de inactividad en milisegundos
  warningTime: number; // Tiempo antes del logout para mostrar advertencia (en milisegundos)
  onWarning: () => void; // Callback cuando se muestra la advertencia
  onTimeout: () => void; // Callback cuando se cumple el timeout
}

export function useInactivityTimer({
  timeout,
  warningTime,
  onWarning,
  onTimeout,
}: UseInactivityTimerOptions) {
  const [isWarningShown, setIsWarningShown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    // Limpiar timers existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Ocultar advertencia si estaba visible
    setIsWarningShown(false);

    // Configurar timer de advertencia
    warningTimeoutRef.current = setTimeout(() => {
      setIsWarningShown(true);
      onWarning();
    }, timeout - warningTime);

    // Configurar timer de logout
    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, timeout);
  };

  const extendSession = () => {
    resetTimer();
  };

  useEffect(() => {
    // Eventos que indican actividad del usuario
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Resetear timer en cualquier actividad
    const handleActivity = () => {
      if (!isWarningShown) {
        resetTimer();
      }
    };

    // Iniciar timer al montar
    resetTimer();

    // Agregar event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isWarningShown]); // Dependencia para evitar resetear cuando se muestra la advertencia

  return {
    isWarningShown,
    extendSession,
    resetTimer,
  };
}
