import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Settings, User, Headset, LogOut, Glasses, MoreVertical, Menu } from "lucide-react";
// Logo substituído por texto
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  // Fetch unread notifications count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
    queryFn: async () => {
      const response = await apiRequest("/api/notifications/unread-count");
      return response;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  const unreadCount = unreadData?.count || 0;
  
  // Handle scroll event to add background color
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <motion.header 
      className={`bg-white text-gray-800 py-4 px-6 z-20 sticky top-0 transition-all duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="md:hidden flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="menu-button"
            onClick={() => {
              const sidebar = document.querySelector('.sidebar');
              const overlay = document.querySelector('.sidebar-overlay');
              if (sidebar && overlay) {
                sidebar.classList.toggle('sidebar-open');
                sidebar.classList.toggle('flex');
                sidebar.classList.toggle('hidden');
                overlay.classList.toggle('hidden');
                if (sidebar.classList.contains('sidebar-open')) {
                  sidebar.classList.remove('-translate-x-full');
                  sidebar.classList.add('translate-x-0');
                } else {
                  sidebar.classList.add('-translate-x-full');
                  sidebar.classList.remove('translate-x-0');
                }
              }
            }}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="h-8 flex items-center">
            <img 
              src="/logo-horizontal.png" 
              alt="Visão+" 
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-3">
          <div className="h-10 flex items-center">
            <img 
              src="/logo-horizontal.png" 
              alt="Visão+" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Bem-vindo ao seu painel</h1>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2 rounded-full relative hover:bg-gray-100">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-xl p-2">
                <DropdownMenuLabel className="text-primary font-medium">Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {unreadCount === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <p className="text-sm font-medium">Consulta agendada</p>
                        <p className="text-xs text-gray-500">Você tem uma consulta amanhã às 14:00</p>
                        <p className="text-xs text-gray-400 mt-1">há 1 hora</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <p className="text-sm font-medium">Resultado do exame</p>
                        <p className="text-xs text-gray-500">Seu exame está pronto para visualização</p>
                        <p className="text-xs text-gray-400 mt-1">há 2 horas</p>
                      </div>
                    </div>
                  )}
                </div>
                {unreadCount > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center text-primary cursor-pointer">
                      Marcar todas como lidas
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-gray-100">
                <Avatar className="h-9 w-9 border-2 border-primary">
                  <AvatarFallback className="bg-primary text-white font-medium">
                    {getInitials(user?.name || "Usuário")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
                  <p className="text-xs text-gray-500 mt-1">{user?.user_type === 'admin' ? 'Administrador' : user?.user_type === 'franchisee' ? 'Franqueado' : 'Cliente'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
              <DropdownMenuLabel className="text-primary font-medium">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="py-2 cursor-pointer rounded-lg hover:bg-gray-100">
                  <User className="mr-3 h-4 w-4 text-primary" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 cursor-pointer rounded-lg hover:bg-gray-100">
                  <Settings className="mr-3 h-4 w-4 text-primary" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 cursor-pointer rounded-lg hover:bg-gray-100">
                  <Headset className="mr-3 h-4 w-4 text-primary" />
                  <span>Suporte</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => logoutMutation.mutate()} 
                className="py-2 cursor-pointer rounded-lg text-red-500 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
