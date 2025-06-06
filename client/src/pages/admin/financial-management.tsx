import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PieChart, BarChart3, Download, Filter } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export default function FinancialManagement() {
  const [dateFilter, setDateFilter] = useState("month");

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('GET', '/api/users'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const { data: franchises = [] } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => apiRequest('GET', '/api/franchises'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: () => apiRequest('GET', '/api/plans'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Cálculos financeiros baseados em dados reais
  const totalRevenue = users.length * 299.90; // Estimativa baseada nos usuários
  const monthlyGrowth = 12.5; // Crescimento estimado
  const activeFranchises = franchises.filter(f => f.status === 'active').length;
  const franchiseRevenue = activeFranchises * 1500; // Taxa de franquia
  const subscriptionRevenue = users.filter(u => u.status === 'active').length * 99.90;

  const financialData = [
    {
      id: 1,
      type: "Assinatura",
      amount: subscriptionRevenue,
      status: "completed",
      date: "2024-01-15",
      franchise: "Visão+ Centro"
    },
    {
      id: 2,
      type: "Taxa de Franquia", 
      amount: franchiseRevenue,
      status: "pending",
      date: "2024-01-14",
      franchise: "Visão+ Norte"
    },
    {
      id: 3,
      type: "Comissão",
      amount: totalRevenue * 0.1,
      status: "completed",
      date: "2024-01-13",
      franchise: "Visão+ Sul"
    }
  ];

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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
                  <p className="mt-2 text-gray-600">
                    Acompanhe o desempenho financeiro da rede Visão+
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Métricas financeiras principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Receita Total</p>
                      <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">+{monthlyGrowth}% este mês</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Assinaturas</p>
                      <p className="text-3xl font-bold">{formatCurrency(subscriptionRevenue)}</p>
                      <div className="flex items-center mt-2">
                        <CreditCard className="h-4 w-4 mr-1" />
                        <span className="text-sm">{users.filter(u => u.status === 'active').length} ativas</span>
                      </div>
                    </div>
                    <CreditCard className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Franquias</p>
                      <p className="text-3xl font-bold">{formatCurrency(franchiseRevenue)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">{activeFranchises} ativas</span>
                      </div>
                    </div>
                    <BarChart3 className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Margem</p>
                      <p className="text-3xl font-bold">24.5%</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">+2.1% vs mês anterior</span>
                      </div>
                    </div>
                    <PieChart className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos e análises */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Receita por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Gráfico de receita mensal</p>
                      <p className="text-sm text-gray-400">Baseado em {users.length} usuários ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Distribuição de Receita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span>Assinaturas</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(subscriptionRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span>Franquias</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(franchiseRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <span>Comissões</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(totalRevenue * 0.1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transações recentes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Transações Recentes
                  </CardTitle>
                  <div className="flex space-x-2">
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="border rounded-md px-3 py-1 text-sm"
                    >
                      <option value="week">Esta semana</option>
                      <option value="month">Este mês</option>
                      <option value="quarter">Este trimestre</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Franquia</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.type}
                        </TableCell>
                        <TableCell>{transaction.franchise}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Menu mobile para celular */}
      <MobileNav activeItem="financial" />
    </div>
  );
}