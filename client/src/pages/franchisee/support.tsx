import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/layout/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  Video, 
  CheckCircle,
  AlertCircle,
  Send,
  Download,
  ExternalLink
} from "lucide-react";

export default function FranchiseeSupport() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  });

  // Buscar tickets do usuário logado
  const { data: userTickets = [], isLoading } = useQuery({
    queryKey: ['/api/support-tickets', user?.id],
    enabled: !!user?.id
  });

  // Mutation para criar ticket
  const createTicketMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/support-tickets`, 'POST', {
      ...data,
      user_id: user?.id
    }),
    onSuccess: () => {
      toast({
        title: "✅ Ticket criado com sucesso!",
        description: "Nossa equipe entrará em contato em até 2 horas."
      });
      
      setTicketForm({
        subject: '',
        category: '',
        priority: '',
        description: ''
      });
      
      // Atualizar cache
      queryClient.invalidateQueries({ queryKey: ['/api/support-tickets'] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao criar ticket",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.priority || !ticketForm.description) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Preencha todos os campos do formulário.",
        variant: "destructive"
      });
      return;
    }
    
    createTicketMutation.mutate(ticketForm);
  };

  const supportChannels = [
    {
      title: "Chat Online",
      description: "Suporte instantâneo via chat",
      icon: <MessageCircle className="h-6 w-6" />,
      status: "Disponível",
      action: "Iniciar Chat",
      available: true
    },
    {
      title: "Telefone",
      description: "(11) 4000-1234",
      icon: <Phone className="h-6 w-6" />,
      status: "08h às 18h",
      action: "Ligar Agora",
      available: true
    },
    {
      title: "Email",
      description: "suporte@visaomais.com",
      icon: <Mail className="h-6 w-6" />,
      status: "24h",
      action: "Enviar Email",
      available: true
    },
    {
      title: "Videochamada",
      description: "Suporte técnico avançado",
      icon: <Video className="h-6 w-6" />,
      status: "Agendamento",
      action: "Agendar",
      available: true
    }
  ];

  const faqItems = [
    {
      question: "Como cadastrar um novo cliente?",
      answer: "Acesse o painel Dashboard e clique no botão 'Novo Cliente'. Preencha os dados obrigatórios e salve."
    },
    {
      question: "Como gerar relatórios de vendas?",
      answer: "Vá até a seção 'Relatórios' no menu lateral e selecione o período desejado."
    },
    {
      question: "Como atualizar o estoque de produtos?",
      answer: "Na área 'Estoque', você pode editar as quantidades diretamente ou importar planilhas."
    },
    {
      question: "Problemas com o sistema de pagamento?",
      answer: "Verifique sua conexão com internet e entre em contato conosco se persistir."
    }
  ];

  const resources = [
    {
      title: "Manual do Franqueado",
      description: "Guia completo de utilização do sistema",
      icon: <FileText className="h-5 w-5" />,
      action: "Download PDF"
    },
    {
      title: "Vídeos Tutoriais",
      description: "Aprenda com vídeos passo a passo",
      icon: <Video className="h-5 w-5" />,
      action: "Assistir"
    },
    {
      title: "Base de Conhecimento",
      description: "Artigos e documentação técnica",
      icon: <ExternalLink className="h-5 w-5" />,
      action: "Acessar"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="franchisee" />
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Central de Suporte</h1>
            <p className="text-gray-600">Precisa de ajuda? Estamos aqui para você!</p>
          </div>

          {/* Canais de Suporte */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {channel.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{channel.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <div className={`w-2 h-2 rounded-full ${channel.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-500">{channel.status}</span>
                  </div>
                  <Button className="w-full" size="sm">
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Ticket */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Abrir Ticket de Suporte
                </CardTitle>
                <CardDescription>
                  Descreva seu problema e nossa equipe técnica entrará em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      placeholder="Resumo do problema"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select 
                        value={ticketForm.category} 
                        onValueChange={(value) => setTicketForm({...ticketForm, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Técnico</SelectItem>
                          <SelectItem value="billing">Financeiro</SelectItem>
                          <SelectItem value="product">Produto</SelectItem>
                          <SelectItem value="training">Treinamento</SelectItem>
                          <SelectItem value="other">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select 
                        value={ticketForm.priority} 
                        onValueChange={(value) => setTicketForm({...ticketForm, priority: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição Detalhada</Label>
                    <Textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      placeholder="Descreva o problema em detalhes..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createTicketMutation.isPending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {createTicketMutation.isPending ? "Enviando..." : "Enviar Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Meus Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Meus Tickets</CardTitle>
                <CardDescription>
                  Acompanhe o status dos seus chamados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Carregando tickets...</div>
                ) : userTickets.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum ticket encontrado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTickets.map((ticket: any) => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{ticket.subject}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            ticket.status === 'resolved' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status === 'open' ? 'Aberto' :
                             ticket.status === 'in_progress' ? 'Em Andamento' :
                             ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Categoria: {ticket.category}</span>
                          <span>Prioridade: {ticket.priority}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Criado em: {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Respostas rápidas para dúvidas comuns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="font-medium text-sm mb-2 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item.question}
                    </h4>
                    <p className="text-sm text-gray-600 ml-6">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recursos de Ajuda */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos de Ajuda</CardTitle>
              <CardDescription>
                Materiais e documentação para ajudar você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-500">{resource.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {resource.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Sistema Principal</p>
                    <p className="text-xs text-gray-500">Operacional</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Pagamentos</p>
                    <p className="text-xs text-gray-500">Operacional</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">API</p>
                    <p className="text-xs text-gray-500">Operacional</p>
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