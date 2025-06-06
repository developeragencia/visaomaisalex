import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package,
  Calendar,
  Download,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown
} from "lucide-react";

export default function FranchiseeReports() {
  const [reportType, setReportType] = useState("financial");
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<{from: Date; to: Date} | undefined>();

  // Buscar dados dos relatórios
  const { data: financialData = {} } = useQuery({
    queryKey: ['/api/franchisee/reports/financial', timeRange, dateRange]
  });

  const { data: salesData = [] } = useQuery({
    queryKey: ['/api/franchisee/reports/sales', timeRange, dateRange]
  });

  const { data: clientsData = {} } = useQuery({
    queryKey: ['/api/franchisee/reports/clients', timeRange, dateRange]
  });

  const { data: productsData = [] } = useQuery({
    queryKey: ['/api/franchisee/reports/products', timeRange, dateRange]
  });

  // Dados para gráficos (simulados com base real)
  const monthlyRevenue = [
    { month: 'Jan', receita: 65000, despesas: 45000, lucro: 20000 },
    { month: 'Fev', receita: 72000, despesas: 48000, lucro: 24000 },
    { month: 'Mar', receita: 78000, despesas: 52000, lucro: 26000 },
    { month: 'Abr', receita: 85420, despesas: 55000, lucro: 30420 },
    { month: 'Mai', receita: 92000, despesas: 58000, lucro: 34000 },
  ];

  const dailySales = [
    { day: '01/05', vendas: 12, valor: 3400 },
    { day: '02/05', vendas: 8, valor: 2800 },
    { day: '03/05', vendas: 15, valor: 4200 },
    { day: '04/05', vendas: 10, valor: 3100 },
    { day: '05/05', vendas: 18, valor: 5200 },
    { day: '06/05', vendas: 14, valor: 3900 },
    { day: '07/05', vendas: 16, valor: 4500 },
  ];

  const productCategories = [
    { name: 'Armações', value: 45, revenue: 38250, color: '#8b5cf6' },
    { name: 'Lentes', value: 30, revenue: 25500, color: '#f97316' },
    { name: 'Óculos Sol', value: 20, revenue: 17000, color: '#06b6d4' },
    { name: 'Acessórios', value: 5, revenue: 4250, color: '#10b981' },
  ];

  const clientSegments = [
    { segment: 'Premium', clients: 45, revenue: 45000 },
    { segment: 'Regular', clients: 120, revenue: 28000 },
    { segment: 'Ocasional', clients: 85, revenue: 12420 },
  ];

  const paymentMethods = [
    { method: 'Cartão Crédito', percentage: 45, amount: 38250 },
    { method: 'PIX', percentage: 25, amount: 21250 },
    { method: 'Cartão Débito', percentage: 20, amount: 17000 },
    { method: 'Dinheiro', percentage: 10, amount: 8500 },
  ];

  const exportReport = (type: string) => {
    // Implementar exportação de relatórios
    console.log(`Exportando relatório ${type}`);
  };

  const FinancialReport = () => (
    <div className="space-y-6">
      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 85.420</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+16.8%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 55.000</div>
            <div className="flex items-center text-sm">
              <span className="text-gray-600">64% da receita</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 30.420</div>
            <div className="flex items-center text-sm">
              <span className="text-green-600">36% margem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35.2%</div>
            <div className="flex items-center text-sm">
              <span className="text-blue-600">Acima da meta</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Financeiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Despesas</CardTitle>
            <CardDescription>Comparativo mensal dos últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, '']} />
                <Bar dataKey="receita" fill="#10b981" name="Receita" />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Lucro</CardTitle>
            <CardDescription>Crescimento mensal do lucro líquido</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="lucro" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Formas de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Formas de Pagamento</CardTitle>
          <CardDescription>Distribuição dos recebimentos por método</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{method.method}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{method.percentage}%</span>
                    <span className="text-sm font-bold">R$ {method.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  label={({ method, percentage }) => `${method}: ${percentage}%`}
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8b5cf6', '#f97316', '#06b6d4', '#10b981'][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SalesReport = () => (
    <div className="space-y-6">
      {/* Vendas Diárias */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Diárias</CardTitle>
          <CardDescription>Performance de vendas dos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="right" dataKey="valor" fill="#8b5cf6" name="Valor (R$)" />
              <Line yAxisId="left" type="monotone" dataKey="vendas" stroke="#f97316" name="Quantidade" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Produtos Mais Vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Categoria</CardTitle>
          <CardDescription>Distribuição de vendas e receita por categoria de produto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {productCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <div className="text-sm text-gray-600">{category.value}% das vendas</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">R$ {category.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {productCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ClientsReport = () => (
    <div className="space-y-6">
      {/* Segmentação de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Segmentação de Clientes</CardTitle>
          <CardDescription>Clientes por perfil de compra e receita gerada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <span className="font-medium text-lg">{segment.segment}</span>
                  <div className="text-sm text-gray-600">{segment.clients} clientes</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">R$ {segment.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    R$ {(segment.revenue / segment.clients).toFixed(0)} por cliente
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aquisição de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Novos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-sm text-gray-600">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Retenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-sm text-gray-600">Clientes que retornam</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.5</div>
            <p className="text-sm text-gray-600">Meses entre compras</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="franchisee" />
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análises detalhadas do seu negócio</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <FileText className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                  <SelectItem value="products">Produtos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Período</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="12m">Últimos 12 meses</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeRange === 'custom' && (
              <div>
                <label className="text-sm font-medium">Data Específica</label>
                <div className="border rounded p-3 text-sm">
                  Selecionar período personalizado
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Relatórios */}
      {reportType === 'financial' && <FinancialReport />}
      {reportType === 'sales' && <SalesReport />}
      {reportType === 'clients' && <ClientsReport />}
      {reportType === 'products' && (
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Produtos</CardTitle>
            <CardDescription>Em desenvolvimento...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Este relatório estará disponível em breve.</p>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </div>
  );
}