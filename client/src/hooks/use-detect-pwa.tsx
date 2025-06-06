import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar se o aplicativo está sendo executado como PWA instalado
 * com suporte especial para dispositivos móveis e iOS
 */
export function useDetectPWA() {
  const [isPWA, setIsPWA] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      // Detecta se o app está rodando em modo standalone (instalado)
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        (window.navigator as any).standalone === true; // Para iOS Safari

      // Detecta dispositivos móveis
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      setIsPWA(isStandalone);
      setIsMobileDevice(isMobile);
      
      // Para debugging
      console.log('Ambiente:', { 
        isPWA: isStandalone, 
        isMobile, 
        userAgent: navigator.userAgent 
      });
    };

    // Executa a verificação quando o componente é montado
    checkPWA();

    // Verifica novamente quando a janela é redimensionada
    window.addEventListener('resize', checkPWA);
    
    return () => {
      window.removeEventListener('resize', checkPWA);
    };
  }, []);

  return { isPWA, isMobileDevice };
}