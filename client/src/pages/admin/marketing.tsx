import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/layout/sidebar";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { 
  Megaphone, 
  Plus, 
  Send,
  Mail,
  MessageSquare,
  Target,
  Users,
  Calendar,
  BarChart3,
  Eye,
  TrendingUp,
  Play,
  Pause,
  Edit
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type User } from "@shared/schema";

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  subject: string;
  content: string;
  targetAudience: string;
  startDate: string;
  endDate?: string;
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  budget?: number;
}

export default function AdminMarketing() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      type: "email",
      subject: "",
      content: "",
      targetAudience: "all",
      startDate: "",
      endDate: "",
      budget: 0
    },
  });

  // Buscar usuários para segmentação
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: () => apiRequest("/api/users")
  });

  // Campanhas de exemplo
  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Promoção Óculos de Sol - Verão 2024",
      type: "email",
      status: "active",
      subject: "☀️ Até 50% OFF em Óculos de Sol",
      content: "Aproveite nossa promoção especial de verão...",
      targetAudience: "clients",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      sentCount: 1250,
      openRate: 68.5,
      clickRate: 12.3,
      conversionRate: 4.2,
      budget: 5000
    },
    {
      id: "2",
      name: "Lembrete de Consulta",
      type: "whatsapp",
      status: "active",
      subject: "Consulta Agendada",
      content: "Olá! Lembramos que sua consulta está marcada para...",
      targetAudience: "scheduled",
      startDate: "2024-01-10",
      sentCount: 324,
      openRate: 95.2,
      clickRate: 0,
      conversionRate: 0,
      budget: 500
    },
    {
      id: "3",
      name: "Newsletter Mensal - Janeiro",
      type: "email",
      status: "completed",
      subject: "Novidades da Visão+ - Janeiro",
      content: "Confira as últimas novidades em cuidados visuais...",
      targetAudience: "all",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      sentCount: 2150,
      openRate: 42.8,
      clickRate: 8.9,
      conversionRate: 2.1,
      budget: 2000
    },
    {
      id: "4",
      name: "Campanha Dia das Mães",
      type: "email",
      status: "scheduled",
      subject: "Presente especial para sua mãe",
      content: "Mostre o seu amor com um presente único...",
      targetAudience: "clients",
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      budget: 8000
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Agendada</Badge>;
      case "completed":
        return <Badge variant="secondary">Concluída</Badge>;
      case "paused":
        return <Badge className="bg-orange-100 text-orange-800">Pausada</Badge>;
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case "push":
        return <Send className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const onSubmit = (data: any) => {
    toast({
      title: "Campanha criada!",
      description: "A campanha foi criada e está pronta para ser enviada."
    });
    setIsCreateModalOpen(false);
    form.reset();
  };

  const handleToggleCampaign = (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toast({
      title: newStatus === 'active' ? "Campanha ativada" : "Campanha pausada",
      description: `A campanha foi ${newStatus === 'active' ? 'ativada' : 'pausada'} com sucesso.`
    });
  };

  // Estatísticas gerais
  const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
  const averageOpenRate = campaigns.filter(c => c.openRate).reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.filter(c => c.openRate).length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userType="admin" activeItem="marketing" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Marketing & Campanhas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie campanhas de marketing e comunicação
              </p>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Campanha</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Campanha</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Promoção de Verão..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Campanha</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="email">Email Marketing</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="push">Notificação Push</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto/Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Assunto da mensagem..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conteúdo da Mensagem</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Digite o conteúdo da campanha..."
                              className="resize-none h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Público-Alvo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o público" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Todos os usuários</SelectItem>
                              <SelectItem value="clients">Apenas clientes</SelectItem>
                              <SelectItem value="franchisees">Apenas franqueados</SelectItem>
                              <SelectItem value="active">Usuários ativos</SelectItem>
                              <SelectItem value="inactive">Usuários inativos</SelectItem>
                              <SelectItem value="scheduled">Com consultas agendadas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Início</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Orçamento (R$)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="button" variant="outline">
                        Salvar Rascunho
                      </Button>
                      <Button type="submit">
                        Criar e Enviar
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
                <Megaphone className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCampaigns}</div>
                <p className="text-xs text-muted-foreground">Em andamento</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enviado</CardTitle>
                <Send className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Mensagens</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageOpenRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Média geral</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {(totalBudget / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Investido</p>
              </CardContent>
            </Card>
          </div>

          {/* Segmentação de Público */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Segmentação de Público
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total de Usuários</span>
                    <span className="font-semibold">{users.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Clientes</span>
                    <span className="font-semibold text-blue-600">
                      {users.filter(u => u.user_type === 'client').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Franqueados</span>
                    <span className="font-semibold text-purple-600">
                      {users.filter(u => u.user_type === 'franchisee').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Usuários Ativos</span>
                    <span className="font-semibold text-green-600">
                      {users.filter(u => u.status === 'active').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance por Canal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <span className="font-semibold">65.2%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </div>
                    <span className="font-semibold">89.5%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">SMS</span>
                    </div>
                    <span className="font-semibold">78.1%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      <span className="text-sm font-medium">Push</span>
                    </div>
                    <span className="font-semibold">45.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Campanhas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.filter(c => c.status === 'scheduled').map((campaign) => (
                    <div key={campaign.id} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium text-sm">{campaign.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(campaign.startDate).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTypeIcon(campaign.type)}
                        <span className="text-xs text-gray-500 capitalize">{campaign.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Campanhas */}
          <Card>
            <CardHeader>
              <CardTitle>Todas as Campanhas</CardTitle>
              <CardDescription>
                {campaigns.length} campanha(s) criada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {getTypeIcon(campaign.type)}
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{campaign.subject}</p>
                        <p className="text-sm text-gray-500">
                          Público: {campaign.targetAudience} • Início: {new Date(campaign.startDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {campaign.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleCampaign(campaign.id, campaign.status)}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </Button>
                        )}
                        
                        {campaign.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleCampaign(campaign.id, campaign.status)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Reativar
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        
                        <Button size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Relatório
                        </Button>
                      </div>
                    </div>

                    {campaign.sentCount && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500">Enviadas</p>
                          <p className="text-lg font-semibold">{campaign.sentCount?.toLocaleString()}</p>
                        </div>
                        
                        {campaign.openRate && (
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Taxa de Abertura</p>
                            <p className="text-lg font-semibold text-green-600">{campaign.openRate}%</p>
                          </div>
                        )}
                        
                        {campaign.clickRate && (
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Taxa de Clique</p>
                            <p className="text-lg font-semibold text-blue-600">{campaign.clickRate}%</p>
                          </div>
                        )}
                        
                        {campaign.conversionRate && (
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Conversão</p>
                            <p className="text-lg font-semibold text-purple-600">{campaign.conversionRate}%</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}