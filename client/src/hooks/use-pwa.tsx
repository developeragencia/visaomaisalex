import { useState, useEffect } from 'react';

export function usePWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Detecta se o aplicativo está sendo executado em modo standalone (instalado)
    const isInStandaloneMode = () => {
      return (window.matchMedia('(display-mode: standalone)').matches) || 
             (window.matchMedia('(display-mode: fullscreen)').matches) || 
             (window.navigator as any).standalone === true;
    };

    // Simplificamos a implementação para evitar problemas com addEventListener
    setIsPWA(isInStandaloneMode());
    
    // Verificação periódica para maior compatibilidade
    const checkInterval = setInterval(() => {
      setIsPWA(isInStandaloneMode());
    }, 1000);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  return isPWA;
}