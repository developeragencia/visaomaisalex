import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
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

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="client" />
      <div className="flex-1 overflow-hidden md:ml-0">
        <div className="p-6 pt-20 md:pt-6 pb-20 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Olá, {user?.name || 'Usuário'}! 👋
                  </h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                    Cliente
                  </Badge>
                </div>
              </div>
              <p className="text-gray-600">
                Bem-vindo(a) ao seu painel personalizado Visão+
              </p>
            </div>

            {/* Status do Plano */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Plano Premium</h2>
                  <p className="text-purple-100 mb-4">Aproveite todos os benefícios exclusivos</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>Consultas ilimitadas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>Medições avançadas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>Suporte prioritário</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Award className="h-16 w-16 text-purple-200 mb-2" />
                  <Badge className="bg-green-500 text-white border-none">Ativo</Badge>
                </div>
              </div>
            </div>

            {/* Grid de Recursos Rápidos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div onClick={() => window.location.href = '/client/appointments'} className="block cursor-pointer">
                <Card className="hover:shadow-lg transition-shadow border-purple-200 hover:border-purple-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Agendar</h3>
                    <p className="text-sm text-gray-500">Nova consulta</p>
                  </CardContent>
                </Card>
              </div>

              <div onClick={() => window.location.href = '/client/optical-measurement'} className="block cursor-pointer">
                <Card className="hover:shadow-lg transition-shadow border-orange-200 hover:border-orange-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                      <Eye className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Medições</h3>
                    <p className="text-sm text-gray-500">Ópticas avançadas</p>
                  </CardContent>
                </Card>
              </div>

              <div onClick={() => window.location.href = '/client/products'} className="block cursor-pointer">
                <Card className="hover:shadow-lg transition-shadow border-blue-200 hover:border-blue-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Produtos</h3>
                    <p className="text-sm text-gray-500">Catálogo</p>
                  </CardContent>
                </Card>
              </div>

              <div onClick={() => window.location.href = '/client/profile'} className="block cursor-pointer">
                <Card className="hover:shadow-lg transition-shadow border-green-200 hover:border-green-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Perfil</h3>
                    <p className="text-sm text-gray-500">Meus dados</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Estatísticas Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Próxima Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Data</p>
                      <p className="text-lg font-bold text-purple-600">Nenhuma</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Produtos Favoritos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Heart className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salvos</p>
                      <p className="text-lg font-bold text-orange-600">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pontos de Fidelidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pontos</p>
                      <p className="text-lg font-bold text-blue-600">150</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
}