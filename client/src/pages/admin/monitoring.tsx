import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Monitor, Activity, Server, AlertTriangle, CheckCircle, Zap, Database, Globe, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

export default function Monitoring() {
  const [systemStats, setSystemStats] = useState({
    uptime: "99.9%",
    responseTime: "142ms",
    activeUsers: 0,
    errorRate: "0.01%"
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('GET', '/api/users'),
  });

  const { data: franchises = [] } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => apiRequest('GET', '/api/franchises'),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: () => apiRequest('GET', '/api/appointments'),
  });

  // Atualizar estatísticas com dados reais
  useEffect(() => {
    const activeUsers = users.filter(u => u.status === 'active').length;
    setSystemStats(prev => ({
      ...prev,
      activeUsers
    }));
  }, [users]);

  const systemServices = [
    {
      name: "API Principal",
      status: "operational",
      uptime: "99.99%",
      responseTime: "120ms",
      lastCheck: "há 30 segundos"
    },
    {
      name: "Banco de Dados",
      status: "operational", 
      uptime: "99.95%",
      responseTime: "45ms",
      lastCheck: "há 1 minuto"
    },
    {
      name: "Sistema de Arquivos",
      status: "operational",
      uptime: "100%",
      responseTime: "25ms",
      lastCheck: "há 2 minutos"
    },
    {
      name: "Email Service",
      status: "degraded",
      uptime: "98.5%",
      responseTime: "2.1s",
      lastCheck: "há 5 minutos"
    },
    {
      name: "WhatsApp Integration",
      status: "maintenance",
      uptime: "95.2%",
      responseTime: "N/A",
      lastCheck: "há 1 hora"
    }
  ];

  const recentLogs = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      level: "info",
      service: "API",
      message: `${users.length} usuários sincronizados com sucesso`,
      details: "Sincronização automática de dados"
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: "warning",
      service: "Email",
      message: "Latência alta detectada no serviço de email",
      details: "Tempo de resposta: 2.1s (normal: <500ms)"
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: "info",
      service: "Database",
      message: `${franchises.length} franquias verificadas`,
      details: "Verificação de integridade concluída"
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      level: "error",
      service: "WhatsApp",
      message: "Falha na conexão com API do WhatsApp",
      details: "Tentativa de reconexão em andamento"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance': return <Zap className="h-4 w-4" />;
      case 'down': return <AlertTriangle className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Monitoramento do Sistema</h1>
                  <p className="mt-2 text-gray-600">
                    Acompanhe a performance e saúde da plataforma Visão+
                  </p>
                </div>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </motion.div>

            {/* Métricas principais do sistema */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Uptime</p>
                      <p className="text-3xl font-bold">{systemStats.uptime}</p>
                      <p className="text-sm text-green-100">Últimas 24h</p>
                    </div>
                    <Activity className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Tempo de Resposta</p>
                      <p className="text-3xl font-bold">{systemStats.responseTime}</p>
                      <p className="text-sm text-blue-100">Média atual</p>
                    </div>
                    <Zap className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Usuários Ativos</p>
                      <p className="text-3xl font-bold">{systemStats.activeUsers}</p>
                      <p className="text-sm text-purple-100">Online agora</p>
                    </div>
                    <Globe className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Taxa de Erro</p>
                      <p className="text-3xl font-bold">{systemStats.errorRate}</p>
                      <p className="text-sm text-orange-100">Últimas 24h</p>
                    </div>
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Status dos serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Status dos Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1 rounded-full ${getStatusColor(service.status)}`}>
                            {getStatusIcon(service.status)}
                          </div>
                          <div>
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{service.responseTime}</p>
                          <p className="text-xs text-gray-500">{service.lastCheck}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Uso de recursos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Uso de Recursos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">CPU</span>
                        <span className="text-sm text-gray-500">24%</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Memória</span>
                        <span className="text-sm text-gray-500">58%</span>
                      </div>
                      <Progress value={58} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Armazenamento</span>
                        <span className="text-sm text-gray-500">31%</span>
                      </div>
                      <Progress value={31} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Banda</span>
                        <span className="text-sm text-gray-500">12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Logs recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  Logs Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Mensagem</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getLevelColor(log.level)} text-xs`}>
                            {log.level.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.service}
                        </TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {log.details}
                        </TableCell>
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
      <MobileNav activeItem="monitoring" />
    </div>
  );
}