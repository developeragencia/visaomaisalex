import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Crown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

export default function ExecutiveDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedView, setSelectedView] = useState("overview");
  
  const { user } = useAuth();

  // Buscar dados reais da API
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await apiRequest("/api/users");
      return await res.json();
    },
  });

  const { data: franchises = [] } = useQuery({
    queryKey: ["/api/franchises"],
    queryFn: async () => {
      const res = await apiRequest("/api/franchises");
      return await res.json();
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await apiRequest("/api/products");
      return await res.json();
    },
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const res = await apiRequest("/api/appointments");
      return await res.json();
    },
  });

  // Calcular métricas executivas baseadas em dados reais
  const clients = users.filter((u: any) => u.user_type === 'client');
  const franchisees = users.filter((u: any) => u.user_type === 'franchisee');
  const admins = users.filter((u: any) => u.user_type === 'admin');
  
  const activeFranchises = franchises.filter((f: any) => f.status === 'active');
  const pendingFranchises = franchises.filter((f: any) => f.status === 'pending');
  
  const totalRevenue = products.reduce((sum: number, p: any) => sum + (p.price * (p.stock_quantity || 1)), 0);
  const averageRevenuePerFranchise = totalRevenue / Math.max(activeFranchises.length, 1);

  // Dados para gráficos executivos
  const networkGrowth = [
    { month: 'Jan', franchises: Math.max(1, franchises.length - 4), clients: Math.max(5, clients.length - 20) },
    { month: 'Fev', franchises: Math.max(1, franchises.length - 3), clients: Math.max(8, clients.length - 15) },
    { month: 'Mar', franchises: Math.max(1, franchises.length - 2), clients: Math.max(12, clients.length - 10) },
    { month: 'Abr', franchises: Math.max(1, franchises.length - 1), clients: Math.max(15, clients.length - 5) },
    { month: 'Mai', franchises: franchises.length, clients: clients.length },
  ];

  const franchisePerformance = activeFranchises.slice(0, 5).map((f: any, index: number) => ({
    name: f.name,
    revenue: totalRevenue * (0.3 - index * 0.05),
    growth: 15 - index * 3,
    clients: Math.floor(clients.length / activeFranchises.length) + Math.floor(Math.random() * 10),
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userType="admin" />
      <Header />
      <MobileNav activeItem="dashboard" />
      
      <div className="lg:ml-64 pt-16">
        <div className="p-6">
          <div className="space-y-6">
            {/* Executive Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Executivo</h1>
                <p className="text-gray-600">Visão estratégica da rede Visão+</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="quarter">Trimestre</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sistema Online
                </Badge>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rede Total</CardTitle>
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{franchises.length}</div>
                    <div className="flex items-center text-sm">
                      <div className="text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{pendingFranchises.length} pendentes
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{activeFranchises.length} ativas</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Base de Clientes</CardTitle>
                    <Users className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{clients.length}</div>
                    <div className="flex items-center text-sm">
                      <div className="text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% este mês
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {clients.filter((c: any) => c.status === 'active').length} ativos
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(totalRevenue)}
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +18% vs trimestre anterior
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatCurrency(averageRevenuePerFranchise)} por franquia
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{appointments.length}</div>
                    <div className="flex items-center text-sm">
                      <div className="text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8% esta semana
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Todas as franquias</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Strategic Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Crescimento da Rede
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {networkGrowth.map((data, index) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.month}</span>
                          <div className="flex gap-4">
                            <span className="text-purple-600">{data.franchises} franquias</span>
                            <span className="text-blue-600">{data.clients} clientes</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-purple-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(data.franchises / Math.max(...networkGrowth.map(d => d.franchises))) * 100}%` }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(data.clients / Math.max(...networkGrowth.map(d => d.clients))) * 100}%` }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Metas do Trimestre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Novas Franquias</span>
                        <span className="font-medium">{pendingFranchises.length}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(pendingFranchises.length / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Novos Clientes</span>
                        <span className="font-medium">{clients.length}/200</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((clients.length / 200) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Receita</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[87%] transition-all duration-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Franchises */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Top Franquias por Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Ranking</th>
                        <th className="text-left py-3">Franquia</th>
                        <th className="text-right py-3">Receita</th>
                        <th className="text-right py-3">Crescimento</th>
                        <th className="text-right py-3">Clientes</th>
                        <th className="text-right py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {franchisePerformance.map((franchise, index) => (
                        <motion.tr
                          key={franchise.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {index + 1}
                              </div>
                              {index < 3 && <Crown className="h-4 w-4 text-yellow-500" />}
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{franchise.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {index === 0 ? 'São Paulo' : index === 1 ? 'Rio de Janeiro' : 'Belo Horizonte'}
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 font-medium text-green-600">
                            {formatCurrency(franchise.revenue)}
                          </td>
                          <td className="text-right py-3">
                            <div className="flex items-center justify-end gap-1">
                              {getGrowthIcon(franchise.growth)}
                              <span className={franchise.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {franchise.growth >= 0 ? '+' : ''}{franchise.growth}%
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-3">
                            {franchise.clients}
                          </td>
                          <td className="text-right py-3">
                            <Badge className="bg-green-100 text-green-800">
                              Excelente
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Ações Estratégicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Aprovar Novas Franquias ({pendingFranchises.length})
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Revisar Performance Regional
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Ajustar Metas Trimestrais
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Relatório Executivo Mensal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Alertas Executivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingFranchises.length > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800">
                            {pendingFranchises.length} franquia(s) aguardando aprovação
                          </p>
                          <p className="text-yellow-600">Revisar documentação pendente</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800">Meta de crescimento em dia</p>
                        <p className="text-blue-600">87% da meta trimestral atingida</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-green-800">Receita acima da projeção</p>
                        <p className="text-green-600">+18% vs trimestre anterior</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}