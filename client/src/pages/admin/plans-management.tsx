import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Search, Plus, Edit, Trash2, Crown, Star, Gift } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { PlanFormModal } from "@/components/admin/plan-form-modal";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";

export default function PlansManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: () => apiRequest('GET', '/api/plans'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (planData: any) => apiRequest('POST', '/api/plans', planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      toast({ title: "Plano criado com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao criar plano", 
        description: "Tente novamente mais tarde",
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PATCH', `/api/plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      toast({ title: "Plano atualizado com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao atualizar plano", 
        description: "Tente novamente mais tarde",
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (planId: number) => apiRequest('DELETE', `/api/plans/${planId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      toast({ title: "Plano excluído com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao excluir plano", 
        description: "Tente novamente mais tarde",
        variant: "destructive" 
      });
    },
  });

  const filteredPlans = plans.filter(plan => 
    plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePlans = plans.filter(p => p.active).length;

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'gold': return <Star className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'premium': return 'from-purple-500 to-purple-600';
      case 'gold': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Overlay para fechar o menu mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden sidebar-overlay hidden"
        onClick={() => {
          const sidebar = document.querySelector('.sidebar');
          const overlay = document.querySelector('.sidebar-overlay');
          if (sidebar && overlay) {
            sidebar.classList.remove('sidebar-open', 'flex', 'translate-x-0');
            sidebar.classList.add('hidden', '-translate-x-full');
            overlay.classList.add('hidden');
          }
        }}
      ></div>
      
      <Sidebar userType="admin" />
      <div className="lg:pl-72">
        <Header />
        
        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Planos</h1>
              <p className="mt-2 text-gray-600">
                Configure e gerencie os planos de assinatura da Visão+
              </p>
            </motion.div>

            {/* Estatísticas dos planos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-green-100">Planos Ativos</p>
                      <p className="text-3xl font-bold">{activePlans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-blue-100">Total de Planos</p>
                      <p className="text-3xl font-bold">{plans.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Crown className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-purple-100">Planos Premium</p>
                      <p className="text-3xl font-bold">{plans.filter(p => p.type === 'premium').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cards dos planos em destaque */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {plans.slice(0, 3).map((plan) => (
                <Card key={plan.id} className={`bg-gradient-to-r ${getPlanColor(plan.type)} text-white`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {getPlanIcon(plan.type)}
                      <Badge variant="secondary" className="text-gray-900">
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold mb-2">{formatCurrency(plan.price)}</p>
                    <p className="text-sm opacity-90 mb-4">{plan.description}</p>
                    <div className="space-y-1">
                      <p className="text-sm">• {plan.consultations_limit} consultas/mês</p>
                      <p className="text-sm">• {plan.measurements_limit} medições/mês</p>
                      {plan.features && (
                        <p className="text-sm">• {plan.features}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Todos os Planos ({plans.length})
                  </CardTitle>
                  <PlanFormModal 
                    onSave={(planData) => createMutation.mutate(planData)}
                    isLoading={createMutation.isPending}
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar planos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plano</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Limites</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getPlanIcon(plan.type)}
                            <div className="ml-3">
                              <p className="font-semibold">{plan.name}</p>
                              <p className="text-sm text-gray-500">{plan.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.type === 'premium' ? 'default' : 'secondary'}>
                            {plan.type === 'premium' ? 'Premium' : 
                             plan.type === 'gold' ? 'Gold' : 'Básico'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(plan.price)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p>{plan.consultations_limit} consultas</p>
                            <p>{plan.measurements_limit} medições</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.active ? 'default' : 'secondary'}>
                            {plan.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <PlanFormModal 
                              plan={plan}
                              onSave={(planData) => updateMutation.mutate({ id: plan.id, data: planData })}
                              isLoading={updateMutation.isPending}
                            />
                            <DeleteConfirmationModal
                              title="Excluir Plano"
                              description={`Tem certeza que deseja excluir o plano "${plan.name}"? Esta ação não pode ser desfeita.`}
                              onConfirm={() => deleteMutation.mutate(plan.id)}
                              isLoading={deleteMutation.isPending}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredPlans.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum plano encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Menu mobile para celular */}
      <MobileNav activeItem="plans" />
    </div>
  );
}