import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Crown, Star, Gift, Check, Eye, Calendar, CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function ClientPlans() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: () => apiRequest('GET', '/api/plans'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const activePlans = plans.filter((plan: any) => plan.active);

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'premium': return <Crown className="h-6 w-6" />;
      case 'gold': return <Star className="h-6 w-6" />;
      default: return <Gift className="h-6 w-6" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'premium': return 'from-purple-500 to-purple-600';
      case 'gold': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const handleSelectPlan = (planId: number) => {
    toast({
      title: "Plano Selecionado",
      description: "Em breve você será redirecionado para o pagamento.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType="client" />
        <div className="flex-1 overflow-hidden">
          <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando planos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="client" />
      <div className="flex-1 overflow-hidden">
        <div className="p-6 pb-20 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/client/profile">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Perfil
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
                Planos Disponíveis
              </h1>
              <p className="text-gray-600">
                Escolha o plano ideal para suas necessidades de cuidados visuais
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePlans.map((plan: any) => (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    plan.type === 'premium' ? 'ring-2 ring-purple-500 scale-105' : ''
                  }`}
                >
                  {plan.type === 'premium' && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      MAIS POPULAR
                    </div>
                  )}
                  
                  <CardHeader className={`bg-gradient-to-r ${getPlanColor(plan.type)} text-white`}>
                    <div className="flex items-center justify-between">
                      {getPlanIcon(plan.type)}
                      <Badge variant="secondary" className="text-gray-900">
                        {plan.type === 'premium' ? 'Premium' : 
                         plan.type === 'gold' ? 'Gold' : 'Básico'}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      R$ {(plan.price / 100).toFixed(2)}
                      <span className="text-lg font-normal opacity-80">/mês</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <CardDescription className="mb-6 text-gray-600">
                      {plan.description}
                    </CardDescription>
                    
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-900">Benefícios Inclusos:</h4>
                      
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm">
                          {plan.consultations_limit} consultas por mês
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm">
                          {plan.measurements_limit} medições ópticas por mês
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Agendamento online prioritário</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Cartão digital personalizado</span>
                      </div>
                      
                      {plan.type === 'premium' && (
                        <>
                          <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500" />
                            <span className="text-sm">Atendimento 24/7</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500" />
                            <span className="text-sm">Desconto de 20% em produtos</span>
                          </div>
                        </>
                      )}
                      
                      {plan.type === 'gold' && (
                        <div className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">Desconto de 15% em produtos</span>
                        </div>
                      )}
                      
                      {plan.features && (
                        <div className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">{plan.features}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        plan.type === 'premium' 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      Escolher {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {activePlans.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum plano disponível
                </h3>
                <p className="text-gray-500">
                  No momento não há planos ativos. Entre em contato conosco para mais informações.
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Precisa de ajuda para escolher?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Nossa equipe está pronta para ajudar você a encontrar o plano ideal
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Falar com Consultor
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Agendar Consulta
                    </Button>
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