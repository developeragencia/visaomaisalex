import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Calendar, 
  Eye, 
  ShoppingCart, 
  User,
  CreditCard,
  Menu,
  X
} from "lucide-react";

export function MobileNavigation() {
  const [location] = useLocation();
  const { user, userType } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || userType !== 'client') return null;

  const navigationItems = [
    { name: "Início", href: "/client/dashboard", icon: Home },
    { name: "Agendamentos", href: "/client/appointments", icon: Calendar },
    { name: "Medições", href: "/client/optical-measurement", icon: Eye },
    { name: "Produtos", href: "/client/products", icon: ShoppingCart },
    { name: "Perfil", href: "/client/profile", icon: User },
  ];

  const allItems = [
    ...navigationItems,
    { name: "Cartão Digital", href: "/client/membership-card", icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Header - Roxo Sólido */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-purple-600 shadow-lg z-50">
        <div className="flex items-center h-16 px-4">
          <button
            type="button"
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-bold text-white drop-shadow-sm">Visão+</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay - Estilo Admin */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-purple-700 to-purple-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-8">
                <div className="bg-white rounded-xl p-3 shadow-lg">
                  <span className="text-lg font-bold text-purple-600">Visão+</span>
                </div>
              </div>
              <nav className="px-3 space-y-1">
                {allItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-white/20 text-white shadow-md'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className={`mr-4 h-6 w-6 ${
                          isActive ? 'text-white drop-shadow-sm' : 'text-white/70 group-hover:text-white'
                        }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation - Roxo Sólido */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-purple-600 shadow-lg z-50">
        <div className="grid grid-cols-5 gap-0.5 py-2 px-1">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white scale-105 shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 mb-1 ${isActive ? 'drop-shadow-sm' : ''}`} />
                <span className="text-[9px] leading-3 font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}