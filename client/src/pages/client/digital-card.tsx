import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { 
  CreditCard, 
  QrCode, 
  Download, 
  Share2, 
  Eye, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Wallet
} from "lucide-react";

export default function ClientDigitalCard() {
  const { user } = useAuth();

  // Buscar dados do plano do usuário
  const { data: userPlan } = useQuery({
    queryKey: ['/api/user-plan', user?.id],
    enabled: !!user?.id
  });

  // Buscar estatísticas do usuário
  const { data: userStats } = useQuery({
    queryKey: ['/api/client/stats', user?.id],
    enabled: !!user?.id
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="client" />
      <MobileNav />
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cartão Digital</h1>
            <p className="text-gray-600">Seu cartão de cliente Visão+ digital</p>
          </div>

          {/* Cartão Digital Principal */}
          <div className="relative">
            <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              
              <CardContent className="p-8 relative">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <img 
                      src="/attached_assets/Visão+ - Horizontal (inverso).png" 
                      alt="Visão+" 
                      className="h-8 mb-4"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPlZpc8OjbyE8L3RleHQ+PC9zdmc+";
                      }}
                    />
                    <h2 className="text-2xl font-bold">{user?.name || 'Cliente Visão+'}</h2>
                    <p className="text-purple-100">Membro desde {new Date().getFullYear()}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">
                      {userPlan?.plan?.name || 'Plano Básico'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-purple-200 text-sm">ID do Cliente</p>
                    <p className="text-xl font-mono">{user?.id?.toString().padStart(6, '0')}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Consultas Restantes</p>
                    <p className="text-xl font-bold">{userPlan?.plan?.consultations_per_year || 12}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Exames Restantes</p>
                    <p className="text-xl font-bold">{userPlan?.plan?.exams_per_year || 6}</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-purple-200 text-sm">Email</p>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                  <div className="text-right">
                    <QrCode className="h-12 w-12 text-white/80" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações do Cartão */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-5 w-5" />
              Baixar
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Share2 className="h-5 w-5" />
              Compartilhar
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <QrCode className="h-5 w-5" />
              QR Code
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Wallet className="h-5 w-5" />
              Carteira
            </Button>
          </div>

          {/* Benefícios do Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Benefícios do Seu Plano
              </CardTitle>
              <CardDescription>
                Aproveite todas as vantagens do {userPlan?.plan?.name || 'seu plano'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Eye className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">Consultas Incluídas</h4>
                    <p className="text-sm text-gray-500">{userPlan?.plan?.consultations_per_year || 12} consultas por ano</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">Exames Gratuitos</h4>
                    <p className="text-sm text-gray-500">{userPlan?.plan?.exams_per_year || 6} exames por ano</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">Desconto em Produtos</h4>
                    <p className="text-sm text-gray-500">{userPlan?.plan?.discount_percentage || 15}% de desconto</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Phone className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">Suporte Prioritário</h4>
                    <p className="text-sm text-gray-500">Atendimento preferencial</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de Uso */}
          <Card>
            <CardHeader>
              <CardTitle>Seu Histórico</CardTitle>
              <CardDescription>
                Acompanhe o uso dos seus benefícios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {userStats?.appointmentsThisYear || 0}
                  </div>
                  <p className="text-sm text-gray-500">Consultas este ano</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {userStats?.measurementsCount || 0}
                  </div>
                  <p className="text-sm text-gray-500">Medições realizadas</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {userStats?.totalSavings || 0}%
                  </div>
                  <p className="text-sm text-gray-500">Economia acumulada</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato da Franquia */}
          <Card>
            <CardHeader>
              <CardTitle>Sua Franquia Visão+</CardTitle>
              <CardDescription>
                Informações de contato da sua unidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-gray-500">Rua das Flores, 123 - Centro</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-gray-500">(11) 9999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-500">contato@visaomais.com.br</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}