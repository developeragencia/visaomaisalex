import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Eye,
  Calendar,
  UserPlus,
  TrendingDown
} from "lucide-react";

export default function FranchiseeDashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [, setLocation] = useLocation();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Formulário para novo cliente
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema.extend({
      password: insertUserSchema.shape.password.default("123456")
    })),
    defaultValues: {
      username: "",
      password: "123456",
      name: "",
      cpf: "",
      phone: "",
      user_type: "client",
      status: "active"
    }
  });

  // Mutation para criar novo cliente
  const createClientMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Erro ao criar cliente");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Cliente criado com sucesso!",
        description: "O novo cliente foi adicionado ao sistema."
      });
      setIsNewClientDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao criar cliente",
        description: "Tente novamente ou verifique os dados.",
        variant: "destructive"
      });
    }
  });

  // Dados simulados do banco
  const dashboardData = {
    totalSales: 28500,
    totalClients: 142,
    monthlyGrowth: 12.5,
    pendingOrders: 8,
    topProducts: [
      { name: 'Óculos Ray-Ban', sales: 45, revenue: 15200 },
      { name: 'Lentes Transitions', sales: 32, revenue: 9800 },
      { name: 'Armação Oakley', sales: 28, revenue: 8400 }
    ],
    recentSales: [
      { client: 'Maria Silva', value: 450, time: '10:30', status: 'completed' },
      { client: 'João Santos', value: 720, time: '11:15', status: 'pending' },
      { client: 'Ana Costa', value: 320, time: '14:20', status: 'completed' }
    ],
    monthlyRevenue: [
      { month: 'Jan', value: 24000 },
      { month: 'Fev', value: 26000 },
      { month: 'Mar', value: 28500 }
    ]
  };

  const notifications = [
    { type: 'sale', client: 'Maria Silva', value: 450, status: 'completed', time: '10:30' },
    { type: 'appointment', client: 'João Santos', action: 'Agendamento confirmado', time: '11:15' },
    { type: 'stock', product: 'Lente Progressive', action: 'Baixo estoque', alert: true },
    { type: 'payment', client: 'Ana Costa', value: 320, status: 'approved', time: '14:20' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="franchisee" />
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Franqueado</h1>
              <p className="text-gray-600">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Últimos 7 dias
              </Button>
              <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                    <DialogDescription>
                      Adicione um novo cliente ao sistema da franquia.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => createClientMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: João Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="joao@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input placeholder="000.000.000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsNewClientDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createClientMutation.isPending}
                          className="bg-primary"
                        >
                          {createClientMutation.isPending ? "Criando..." : "Criar Cliente"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {dashboardData.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  +{dashboardData.monthlyGrowth}% vs mês passado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  +12 novos este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">105</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  +8.5% vs semana passada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.pendingOrders > 5 ? (
                    <AlertTriangle className="inline h-3 w-3 mr-1 text-yellow-500" />
                  ) : (
                    <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
                  )}
                  Requer atenção
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos e tabelas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
                <CardDescription>Últimas transações realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{sale.client}</p>
                          <p className="text-sm text-gray-500">{sale.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">R$ {sale.value}</p>
                        <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                          {sale.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Produtos Mais Vendidos */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>Ranking de produtos por vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Eye className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} vendas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {product.revenue.toLocaleString()}</p>
                        <Progress value={(product.sales / 50) * 100} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas atualizações do seu negócio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notif.type === 'sale' ? 'bg-green-100' :
                      notif.type === 'appointment' ? 'bg-blue-100' :
                      notif.type === 'stock' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {notif.type === 'sale' && <DollarSign className="h-4 w-4 text-green-600" />}
                      {notif.type === 'appointment' && <Calendar className="h-4 w-4 text-blue-600" />}
                      {notif.type === 'stock' && <Package className="h-4 w-4 text-red-600" />}
                      {notif.type === 'payment' && <CheckCircle className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {notif.client && `${notif.client} - `}
                        {notif.action || `Venda de R$ ${notif.value}`}
                      </p>
                      <p className="text-sm text-gray-500">{notif.time}</p>
                    </div>
                    {notif.alert && (
                      <Badge variant="destructive">Urgente</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setLocation('/franchisee/sales')}
                >
                  <ShoppingCart className="h-6 w-6" />
                  Nova Venda
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setLocation('/franchisee/clients')}
                >
                  <UserPlus className="h-6 w-6" />
                  Cadastrar Cliente
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setLocation('/franchisee/inventory')}
                >
                  <Package className="h-6 w-6" />
                  Estoque
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setLocation('/franchisee/reports')}
                >
                  <BarChart3 className="h-6 w-6" />
                  Relatórios
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setLocation('/client/appointments')}
                >
                  <Calendar className="h-6 w-6" />
                  Agendamentos
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setLocation('/client/optical-measurement')}
                >
                  <Eye className="h-6 w-6" />
                  Medição Óptica
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setLocation('/franchisee/clients')}
                >
                  <Users className="h-6 w-6" />
                  Clientes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Menu Inferior Móvel */}
      <MobileNav activeItem="home" />
    </div>
  );
}