import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function PWAToggleButton() {
  const [isPWA, setIsPWA] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    // Detecta se estamos em modo PWA
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          window.matchMedia('(display-mode: fullscreen)').matches ||
                          (window.navigator as any).standalone === true;
      setIsPWA(isStandalone);
    };
    
    checkPWA();
  }, []);
  
  // Se não estamos em modo PWA, não renderiza nada
  if (!isPWA) return null;
  
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    
    // Adiciona/remove classes para mostrar/esconder o menu lateral
    const sidebar = document.querySelector('.sidebar-pwa');
    const content = document.querySelector('.main-content');
    
    if (sidebar && content) {
      if (!menuVisible) {
        sidebar.classList.add('sidebar-visible');
        content.classList.add('main-content-pwa');
      } else {
        sidebar.classList.remove('sidebar-visible');
        content.classList.remove('main-content-pwa');
      }
    }
  };
  
  return (
    <Button
      onClick={toggleMenu}
      className="fixed bottom-20 right-4 z-50 rounded-full bg-primary shadow-lg md:hidden"
      size="icon"
    >
      <Menu className="h-5 w-5 text-white" />
    </Button>
  );
}