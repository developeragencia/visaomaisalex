import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
// Logo Visão+
import { 
  Home, 
  Eye, 
  FileText, 
  Calendar, 
  CreditCard, 
  ShoppingCart,
  User,
  Headset,
  LogOut,
  Settings,
  Store,
  Users,
  BarChart3,
  FileBarChart,
  PackageOpen,
  UserPlus,
  Building,
  Bell,
  Tag,
  Shield,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  userType: "client" | "franchisee" | "admin";
}

function SidebarLink({ href, icon, label, isActive }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive?: boolean;
}) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start py-3 px-4 mb-2 text-white hover:bg-white/10 rounded-xl",
          isActive && "bg-white/20 text-white"
        )}
      >
        <span className="w-5 text-center mr-3">
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </Button>
    </Link>
  );
}

export function Sidebar({ userType }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const clientLinks = [
    { href: "/client/dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { href: "/client/appointments", icon: <Calendar size={18} />, label: "Agendamentos" },
    { href: "/client/optical-measurement", icon: <Eye size={18} />, label: "Medições" },
    { href: "/client/products", icon: <ShoppingCart size={18} />, label: "Produtos" },
    { href: "/client/digital-card", icon: <CreditCard size={18} />, label: "Cartão Digital" }
  ];
  
  const franchiseeLinks = [
    { href: "/franchisee/dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { href: "/franchisee/sales", icon: <ShoppingCart size={18} />, label: "Vendas" },
    { href: "/franchisee/clients", icon: <Users size={18} />, label: "Clientes" },
    { href: "/franchisee/reports", icon: <BarChart3 size={18} />, label: "Relatórios" },
    { href: "/franchisee/inventory", icon: <PackageOpen size={18} />, label: "Estoque" },
    { href: "/franchisee/appointments", icon: <Calendar size={18} />, label: "Agendamentos" }
  ];
  
  const adminLinks = [
    { href: "/admin/dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { href: "/admin/franchises", icon: <Building size={18} />, label: "Franquias" },
    { href: "/admin/users", icon: <Users size={18} />, label: "Usuários" },
    { href: "/admin/plans", icon: <Shield size={18} />, label: "Planos" },
    { href: "/admin/products", icon: <PackageOpen size={18} />, label: "Produtos" },
    { href: "/admin/financial", icon: <FileBarChart size={18} />, label: "Financeiro" },
    { href: "/admin/marketing", icon: <Tag size={18} />, label: "Marketing" },
    { href: "/admin/integrations", icon: <Settings size={18} />, label: "Integrações" },
    { href: "/admin/monitoring", icon: <Bell size={18} />, label: "Monitoramento" }
  ];
  
  const links = 
    userType === "admin" 
      ? adminLinks 
      : userType === "franchisee" 
        ? franchiseeLinks 
        : clientLinks;
  
  const settingLinks = [
    { href: `/${userType}/profile`, icon: <User size={18} />, label: "Meu Perfil" },
    { href: `/${userType}/support`, icon: <Headset size={18} />, label: "Suporte" }
  ];

  return (
    <>
      {/* Menu Toggle Button - Apenas Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative w-64 h-screen bg-primary flex-col overflow-y-auto z-50 transition-transform duration-300",
        "md:flex",
        isOpen ? "flex translate-x-0" : "hidden md:flex -translate-x-full md:translate-x-0"
      )}>
        {/* Logo área */}
        <div className="px-6 mb-8 pt-16 md:pt-6">
          <div className="bg-white rounded-xl p-3 mb-3 flex justify-center">
            <div className="h-8 flex items-center justify-center">
              <img 
                src="/logo-horizontal.png" 
                alt="Visão+" 
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
          <p className="text-white/70 text-sm">Painel de {userType === 'admin' ? 'Administrador' : userType === 'franchisee' ? 'Franqueado' : 'Cliente'}</p>
        </div>
      
        <nav className="px-4 flex-1">
          <div className="mb-8">
            <p className="text-xs font-medium text-white/60 mb-3 px-4 uppercase tracking-wider">Menu principal</p>
            
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={location === link.href}
              />
            ))}
          </div>
          
          <div className="mb-6">
            <p className="text-xs font-medium text-white/60 mb-3 px-4 uppercase tracking-wider">Configurações</p>
            
            {settingLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={location === link.href}
              />
            ))}
            
            <Button
              variant="ghost"
              className="w-full justify-start py-3 px-4 mb-2 text-white hover:bg-white/10 rounded-xl"
              onClick={() => logoutMutation.mutate()}
            >
              <span className="w-5 text-center mr-3">
                <LogOut size={18} />
              </span>
              <span className="font-medium">Sair</span>
            </Button>
          </div>
        </nav>
        
        <div className="px-6 mt-auto">
          <div className="pt-4 border-t border-white/20 text-xs text-white/50">
            Desenvolvido por <a href="https://alexdesenvolvedor.com.br" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">Alex Developer</a>
          </div>
        </div>
      </div>
    </>
  );
}