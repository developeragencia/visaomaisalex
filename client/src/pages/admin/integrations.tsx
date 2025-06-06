import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/sidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap,
  Settings,
  Globe,
  Smartphone,
  Mail,
  CreditCard,
  BarChart3,
  Shield,
  Bell,
  Link,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: any;
  color: string;
  config?: any;
}

export default function AdminIntegrations() {
  const [activeIntegrations, setActiveIntegrations] = useState<Record<string, boolean>>({
    whatsapp: true,
    sms: false,
    email: true,
    stripe: true,
    mercadopago: false,
    googleanalytics: true,
    facebook: false,
    instagram: true
  });

  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const integrations: Integration[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Envie notificações e confirmações via WhatsApp',
      category: 'Comunicação',
      status: 'connected',
      icon: Smartphone,
      color: 'green'
    },
    {
      id: 'sms',
      name: 'SMS Gateway',
      description: 'Serviço de SMS para lembretes e alertas',
      category: 'Comunicação',
      status: 'disconnected',
      icon: Smartphone,
      color: 'blue'
    },
    {
      id: 'email',
      name: 'Email Marketing',
      description: 'Campanhas de email automatizadas',
      category: 'Comunicação',
      status: 'connected',
      icon: Mail,
      color: 'purple'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Processamento de pagamentos online',
      category: 'Pagamentos',
      status: 'connected',
      icon: CreditCard,
      color: 'indigo'
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Gateway de pagamento brasileiro',
      category: 'Pagamentos',
      status: 'disconnected',
      icon: CreditCard,
      color: 'yellow'
    },
    {
      id: 'googleanalytics',
      name: 'Google Analytics',
      description: 'Análise de dados e comportamento',
      category: 'Analytics',
      status: 'connected',
      icon: BarChart3,
      color: 'red'
    },
    {
      id: 'facebook',
      name: 'Facebook Pixel',
      description: 'Rastreamento para campanhas publicitárias',
      category: 'Marketing',
      status: 'error',
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'instagram',
      name: 'Instagram API',
      description: 'Integração com Instagram Business',
      category: 'Marketing',
      status: 'connected',
      icon: Globe,
      color: 'pink'
    }
  ];

  const categories = ['Todos', 'Comunicação', 'Pagamentos', 'Analytics', 'Marketing'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredIntegrations = selectedCategory === 'Todos' 
    ? integrations 
    : integrations.filter(int => int.category === selectedCategory);

  const handleToggleIntegration = (integrationId: string) => {
    setActiveIntegrations(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
    
    toast({
      title: "Integração atualizada",
      description: `${integrations.find(i => i.id === integrationId)?.name} foi ${activeIntegrations[integrationId] ? 'desativada' : 'ativada'}.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <XCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const toggleApiKeyVisibility = (integrationId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userType="admin" activeItem="integrations" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Integrações
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Configure e gerencie integrações com serviços externos
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Integração
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="communication">Comunicação</TabsTrigger>
                <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              {/* Visão Geral */}
              <TabsContent value="overview" className="space-y-6">
                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Conectadas</p>
                          <p className="text-lg font-semibold">{integrations.filter(i => i.status === 'connected').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <XCircle className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Desconectadas</p>
                          <p className="text-lg font-semibold">{integrations.filter(i => i.status === 'disconnected').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Com Erro</p>
                          <p className="text-lg font-semibold">{integrations.filter(i => i.status === 'error').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total</p>
                          <p className="text-lg font-semibold">{integrations.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filtros */}
                <div className="flex gap-4 mb-6">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Lista de Integrações */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIntegrations.map((integration) => {
                    const IconComponent = integration.icon;
                    return (
                      <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 bg-${integration.color}-100 dark:bg-${integration.color}-900/30 rounded-lg`}>
                                <IconComponent className={`h-5 w-5 text-${integration.color}-600`} />
                              </div>
                              <div>
                                <CardTitle className="text-sm">{integration.name}</CardTitle>
                                <Badge variant="outline" className="text-xs">
                                  {integration.category}
                                </Badge>
                              </div>
                            </div>
                            <Switch
                              checked={activeIntegrations[integration.id]}
                              onCheckedChange={() => handleToggleIntegration(integration.id)}
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {integration.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(integration.status)}>
                              {getStatusIcon(integration.status)}
                              <span className="ml-1">
                                {integration.status === 'connected' ? 'Conectada' : 
                                 integration.status === 'error' ? 'Erro' : 'Desconectada'}
                              </span>
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Configurar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Comunicação */}
              <TabsContent value="communication" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      WhatsApp Business API
                    </CardTitle>
                    <CardDescription>
                      Configure o WhatsApp para envio de notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">Conectado</p>
                          <p className="text-sm text-green-600 dark:text-green-400">Última sincronização: agora</p>
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-token">Token de Acesso</Label>
                        <div className="flex gap-2">
                          <Input
                            id="whatsapp-token"
                            type={showApiKeys.whatsapp ? "text" : "password"}
                            value="EAAb4ZCqBWXQwBO..."
                            readOnly
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility('whatsapp')}
                          >
                            {showApiKeys.whatsapp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-phone">Número do WhatsApp</Label>
                        <Input
                          id="whatsapp-phone"
                          value="+55 11 99999-9999"
                          placeholder="Número com WhatsApp Business"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Input
                          id="webhook-url"
                          value="https://visaomais.app/webhook/whatsapp"
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="verify-token">Token de Verificação</Label>
                        <div className="flex gap-2">
                          <Input
                            id="verify-token"
                            type={showApiKeys.whatsapp_verify ? "text" : "password"}
                            value="meu_token_secreto_123"
                            readOnly
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility('whatsapp_verify')}
                          >
                            {showApiKeys.whatsapp_verify ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button>Testar Conexão</Button>
                      <Button variant="outline">Salvar Configurações</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Marketing
                    </CardTitle>
                    <CardDescription>
                      Configure o SMTP para envio de emails
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">Servidor SMTP</Label>
                        <Input
                          id="smtp-host"
                          value="smtp.gmail.com"
                          placeholder="smtp.exemplo.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Porta</Label>
                        <Input
                          id="smtp-port"
                          value="587"
                          placeholder="587"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtp-user">Usuário</Label>
                        <Input
                          id="smtp-user"
                          value="noreply@visaomais.com"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtp-pass">Senha</Label>
                        <div className="flex gap-2">
                          <Input
                            id="smtp-pass"
                            type={showApiKeys.smtp ? "text" : "password"}
                            value="app_password_123"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility('smtp')}
                          >
                            {showApiKeys.smtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button>Testar Email</Button>
                      <Button variant="outline">Salvar Configurações</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pagamentos */}
              <TabsContent value="payments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Stripe
                    </CardTitle>
                    <CardDescription>
                      Gateway de pagamento internacional
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">Conectado</p>
                          <p className="text-sm text-green-600 dark:text-green-400">Webhook ativo</p>
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="stripe-public">Chave Pública</Label>
                        <Input
                          id="stripe-public"
                          value="pk_live_51HW..."
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stripe-secret">Chave Secreta</Label>
                        <div className="flex gap-2">
                          <Input
                            id="stripe-secret"
                            type={showApiKeys.stripe ? "text" : "password"}
                            value="sk_live_51HW..."
                            readOnly
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility('stripe')}
                          >
                            {showApiKeys.stripe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                        <div className="flex gap-2">
                          <Input
                            id="stripe-webhook"
                            type={showApiKeys.stripe_webhook ? "text" : "password"}
                            value="whsec_1234..."
                            readOnly
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility('stripe_webhook')}
                          >
                            {showApiKeys.stripe_webhook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Estatísticas</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">R$ 45.280</p>
                          <p className="text-sm text-gray-500">Este mês</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">187</p>
                          <p className="text-sm text-gray-500">Transações</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">98.5%</p>
                          <p className="text-sm text-gray-500">Taxa de sucesso</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Mercado Pago
                    </CardTitle>
                    <CardDescription>
                      Gateway de pagamento brasileiro
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Não configurado</p>
                          <p className="text-sm text-gray-500">Configure para aceitar Pix e boleto</p>
                        </div>
                      </div>
                      <Button>Configurar</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Marketing */}
              <TabsContent value="marketing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Google Analytics
                    </CardTitle>
                    <CardDescription>
                      Análise de tráfego e comportamento do usuário
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">Conectado</p>
                          <p className="text-sm text-green-600 dark:text-green-400">Coletando dados</p>
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ga-id">ID de Medição (GA4)</Label>
                        <Input
                          id="ga-id"
                          value="G-XXXXXXXXXX"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                        <Input
                          id="gtm-id"
                          value="GTM-XXXXXXX"
                          placeholder="GTM-XXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Métricas Recentes</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-xl font-bold">2.543</p>
                          <p className="text-sm text-gray-500">Visitantes (7d)</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">4.2</p>
                          <p className="text-sm text-gray-500">Páginas/sessão</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">3:42</p>
                          <p className="text-sm text-gray-500">Tempo médio</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">68.3%</p>
                          <p className="text-sm text-gray-500">Novos visitantes</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Facebook Pixel
                    </CardTitle>
                    <CardDescription>
                      Rastreamento para campanhas publicitárias
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800 dark:text-red-200">Erro na configuração</p>
                          <p className="text-sm text-red-600 dark:text-red-400">Verifique o ID do pixel</p>
                        </div>
                      </div>
                      <Button variant="outline">Corrigir</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}