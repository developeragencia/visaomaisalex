import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  Calendar, 
  Eye, 
  ShoppingCart, 
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Activity,
  Award,
  ShoppingBag,
  Heart,
  TrendingUp,
  ChevronRight
} from "lucide-react";
// import { apiRequest } from "@/lib/queryClient"; // Removido para evitar erro
import { type Appointment, type Measurement, type Product } from "@shared/schema";

export default function ClientDashboard() {
  const { user } = useAuth();

  // Dados mock para evitar erros
  const appointments: any[] = [];
  const measurements: any[] = [];
  const products: any[] = [];

  // Dados calculados (usando dados mock seguros)
  const nextAppointment = null;
  const completedAppointments = 0;
  const latestMeasurement = null;

  return (
    <>
      <MobileNavigation />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar 
          userType="client" 
          activeItem="home"
        />
        
        <div className="flex-1 overflow-auto pt-16 md:pt-0 pb-20 md:pb-0">
          <div className="p-6">
          {/* Grid de Boas-vindas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Card Principal de Boas-vindas */}
            <div className="lg:col-span-2 bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-purple-800/90 backdrop-blur-sm rounded-2xl p-8 text-white border border-purple-500/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Olá, {user?.name || user?.username}! 👋
                  </h1>
                  <p className="text-purple-100 text-lg">
                    Bem-vindo ao seu painel Visão+. Aqui você pode acompanhar seus agendamentos e cuidar da sua saúde visual.
                  </p>
                </div>
              </div>
              
              {/* Status da Próxima Consulta */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-full">
                      <Calendar className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-100 mb-1">Consultas</p>
                      <p className="font-semibold">Nenhuma consulta agendada</p>
                      <p className="text-sm text-purple-200">Agende sua próxima consulta</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card de Status da Assinatura */}
            <div className="bg-gradient-to-br from-purple-500/20 via-purple-600/20 to-purple-700/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-xl">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Status da Assinatura
                </h3>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-2 px-4 mb-4">
                  <p className="font-semibold">Plano Premium Ativo</p>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center justify-between">
                    <span>Consultas Incluídas:</span>
                    <span className="font-semibold">Ilimitadas</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Validade:</span>
                    <span className="font-semibold">Dez 2024</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Próxima Cobrança:</span>
                    <span className="font-semibold">15/01/2025</span>
                  </p>
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  Gerenciar Plano
                </Button>
              </div>
            </div>
          </div>

          {/* Grid de Recursos Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-600/10 to-blue-700/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group">
              <div className="p-3 bg-blue-500/20 rounded-full w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Medições</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {measurements.length} medição(ões) realizadas
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver Todas
              </Button>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 via-green-600/10 to-green-700/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all cursor-pointer group">
              <div className="p-3 bg-green-500/20 rounded-full w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Consultas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {completedAppointments} consulta(s) realizadas
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Agendar Nova
              </Button>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 via-orange-600/10 to-orange-700/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer group">
              <div className="p-3 bg-orange-500/20 rounded-full w-fit mb-4 group-hover:bg-orange-500/30 transition-colors">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Produtos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {products.length} produto(s) disponíveis
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Explorar
              </Button>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 via-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group">
              <div className="p-3 bg-purple-500/20 rounded-full w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cartão Digital</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Acesso rápido aos seus dados
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Visualizar
              </Button>
            </div>
          </div>

          {/* Benefícios da Assinatura */}
          <div className="bg-gradient-to-br from-purple-50/50 via-purple-100/50 to-purple-200/50 dark:from-purple-900/20 dark:via-purple-800/20 dark:to-purple-700/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-200/50 dark:border-purple-700/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Seus Benefícios Premium
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Aproveite ao máximo todos os recursos inclusos no seu plano
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200/30">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-sm">Consultas Ilimitadas</p>
                  <p className="text-xs text-gray-500">Sem limite mensal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200/30">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-sm">Medições Avançadas</p>
                  <p className="text-xs text-gray-500">Tecnologia premium</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200/30">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-sm">Desconto em Produtos</p>
                  <p className="text-xs text-gray-500">Até 20% off</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200/30">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-sm">Suporte Prioritário</p>
                  <p className="text-xs text-gray-500">Atendimento VIP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Consultas Realizadas</p>
                    <p className="text-2xl font-bold text-blue-600">{completedAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-900/30 dark:to-green-800/30 border-green-200/50 dark:border-green-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Medições Salvas</p>
                    <p className="text-2xl font-bold text-green-600">{measurements.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Última Medição</p>
                    <p className="text-lg font-bold text-purple-600">
                      Nenhuma
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200/50 dark:border-orange-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Produtos Favoritos</p>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}