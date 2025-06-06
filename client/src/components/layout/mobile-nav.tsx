import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
// Logo substituído por texto
import { useDetectPWA } from "@/hooks/use-detect-pwa";
import { 
  Home, 
  Calendar, 
  Camera, 
  ShoppingCart, 
  User,
  Store,
  FileBarChart,
  Building,
  CreditCard,
  Users
} from "lucide-react";

// Definindo tamanho fixo para garantir consistência
const iconSize = 18;

interface MobileNavProps {
  activeItem?: "home" | "appointments" | "measurement" | "products" | "profile" | "card" | "users" | "financial" | "franchises" | "clients";
}

export function MobileNav({ activeItem = "home" }: MobileNavProps) {
  const [location] = useLocation();
  const { pathname } = { pathname: location };
  const { isPWA, isMobileDevice } = useDetectPWA();
  const userType = pathname.includes("admin") 
    ? "admin" 
    : pathname.includes("franchisee") 
      ? "franchisee" 
      : "client";
  
  const clientNavItems = [
    { 
      href: "/client/dashboard", 
      icon: <Home size={iconSize} />, 
      label: "Home",
      key: "home" 
    },
    { 
      href: "/client/appointments", 
      icon: <Calendar size={iconSize} />, 
      label: "Agenda",
      key: "appointments" 
    },
    { 
      href: "/client/optical-measurement", 
      icon: <Camera size={iconSize} />, 
      label: "Medição",
      key: "measurement" 
    },
    { 
      href: "/client/products", 
      icon: <ShoppingCart size={iconSize} />, 
      label: "Produtos",
      key: "products" 
    },
    { 
      href: "/client/profile", 
      icon: <User size={iconSize} />, 
      label: "Perfil",
      key: "profile" 
    }
  ];

  const franchiseeNavItems = [
    { 
      href: "/franchisee/dashboard", 
      icon: <Home size={iconSize} />, 
      label: "Home",
      key: "home" 
    },
    { 
      href: "/franchisee/appointments", 
      icon: <Calendar size={iconSize} />, 
      label: "Agenda",
      key: "appointments" 
    },
    { 
      href: "/franchisee/clients", 
      icon: <Users size={iconSize} />, 
      label: "Clientes",
      key: "clients" 
    },
    { 
      href: "/franchisee/products", 
      icon: <ShoppingCart size={iconSize} />, 
      label: "Produtos",
      key: "products" 
    },
    { 
      href: "/franchisee/profile", 
      icon: <Store size={iconSize} />, 
      label: "Franquia",
      key: "profile" 
    }
  ];

  const adminNavItems = [
    { 
      href: "/admin/dashboard", 
      icon: <Home size={iconSize} />, 
      label: "Home",
      key: "home" 
    },
    { 
      href: "/admin/franchises", 
      icon: <Building size={iconSize} />, 
      label: "Franquias",
      key: "franchises" 
    },
    { 
      href: "/admin/users", 
      icon: <Users size={iconSize} />, 
      label: "Usuários",
      key: "users" 
    },
    { 
      href: "/admin/financial", 
      icon: <FileBarChart size={iconSize} />, 
      label: "Finanças",
      key: "financial" 
    },
    { 
      href: "/admin/profile", 
      icon: <User size={iconSize} />, 
      label: "Perfil",
      key: "profile" 
    }
  ];

  const navItems = 
    userType === "admin" 
      ? adminNavItems 
      : userType === "franchisee" 
        ? franchiseeNavItems 
        : clientNavItems;

  // Special case for membership card which isn't in the main nav
  if (activeItem === "card" && !navItems.find(item => item.key === "card")) {
    navItems.splice(3, 0, { 
      href: "/client/membership-card", 
      icon: <CreditCard size={iconSize} />, 
      label: "Cartão",
      key: "card" 
    });
    // Remove the last item to keep 5 items
    navItems.pop();
  }

  // Sempre mostra navegação móvel, independente do modo
  // Removendo verificação que causava problemas no PWA
  
  return (
    <motion.nav 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-primary py-2 px-2 md:hidden z-20 rounded-t-3xl shadow-lg mobile-nav"
    >
      {/* Logo removida conforme solicitado */}
      <div className="grid grid-cols-5 gap-1 w-full">
        {navItems.map((item) => {
          // Usar a função Link corretamente
          return (
            <div 
              key={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-1 py-2 rounded-xl transition-all cursor-pointer",
                activeItem === item.key 
                  ? "text-white bg-white/20" 
                  : "text-white/70 hover:text-white"
              )}
              onClick={() => {
                window.location.href = item.href;
              }}
            >
              <div className="flex items-center justify-center h-5 w-5">
                {item.icon}
              </div>
              <span className="text-[10px] mt-1 font-medium text-center w-full">{item.label}</span>
            </div>
          )
        })}
      </div>
    </motion.nav>
  );
}
