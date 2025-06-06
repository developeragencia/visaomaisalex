import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MenuToggle() {
  // Estado para controlar a visibilidade do menu
  const [isOpen, setIsOpen] = useState(false);

  // Função simples para abrir/fechar menu
  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Manipula diretamente os elementos HTML
    if (newState) {
      // Abre o menu
      document.body.classList.add('menu-open');
      document.querySelector('.sidebar')?.classList.add('sidebar-open');
      document.querySelector('.overlay')?.classList.add('overlay-visible');
    } else {
      // Fecha o menu
      document.body.classList.remove('menu-open');
      document.querySelector('.sidebar')?.classList.remove('sidebar-open');
      document.querySelector('.overlay')?.classList.remove('overlay-visible');
    }
  };

  // Botão do menu (visível apenas em mobile)
  return (
    <Button
      onClick={toggleMenu}
      className="menu-toggle fixed top-4 left-4 z-50 md:hidden shadow-md"
      size="icon"
      variant={isOpen ? "secondary" : "default"}
      aria-label="Menu"
    >
      {isOpen ? <X size={22} /> : <Menu size={22} />}
    </Button>
  );
}