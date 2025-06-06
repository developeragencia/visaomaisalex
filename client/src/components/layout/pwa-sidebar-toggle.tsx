import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export function PWASidebarToggle() {
  const [showSidebar, setShowSidebar] = useState(() => {
    // Verifica se há um valor salvo no localStorage
    const saved = localStorage.getItem("pwa-show-sidebar");
    return saved ? JSON.parse(saved) : false;
  });

  // Salva a preferência do usuário no localStorage
  useEffect(() => {
    localStorage.setItem("pwa-show-sidebar", JSON.stringify(showSidebar));
    // Adiciona ou remove a classe no documento para controlar a exibição da sidebar
    if (showSidebar) {
      document.documentElement.classList.add("pwa-show-sidebar");
    } else {
      document.documentElement.classList.remove("pwa-show-sidebar");
    }
  }, [showSidebar]);

  // Apenas exibe o toggle em telas pequenas
  return (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Button
        size="sm"
        variant="outline"
        className="rounded-full bg-white shadow-md"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}