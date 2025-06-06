import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";

export default function FranchiseeAppointments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Buscar agendamentos
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  // Buscar clientes para o formulário
  const { data: clients } = useQuery({
    queryKey: ['/api/franchisee/clients'],
  });

  // Criar agendamento
  const createAppointmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/appointments', 'POST', data),
    onSuccess: () => {
      toast({
        title: "✅ Agendamento criado!",
        description: "O agendamento foi criado com sucesso."
      });
      setShowCreateForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao criar agendamento",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  });

  // Atualizar status do agendamento
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest(`/api/appointments/${id}`, 'PATCH', { status }),
    onSuccess: () => {
      toast({
        title: "✅ Status atualizado!",
        description: "O status do agendamento foi alterado."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao atualizar",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  });

  // Deletar agendamento
  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/appointments/${id}`, 'DELETE'),
    onSuccess: () => {
      toast({
        title: "✅ Agendamento removido!",
        description: "O agendamento foi excluído com sucesso."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao remover",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const appointmentData = {
      user_id: parseInt(formData.get('client_id') as string),
      appointment_date: formData.get('date') as string,
      appointment_time: formData.get('time') as string,
      service_type: formData.get('service_type') as string,
      notes: formData.get('notes') as string,
      status: 'scheduled'
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Agendado", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      completed: { label: "Concluído", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
      no_show: { label: "Não Compareceu", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredAppointments = appointments?.filter((appointment: any) => {
    const matchesSearch = appointment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="franchisee" />
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
              <p className="text-gray-600">Gerencie os agendamentos da sua franquia</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por cliente ou serviço..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="no_show">Não Compareceu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Agendamentos */}
          <div className="grid gap-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p>Carregando agendamentos...</p>
                </CardContent>
              </Card>
            ) : filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Nenhum agendamento encontrado</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment: any) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold">{appointment.client_name || 'Cliente'}</h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.appointment_time}</span>
                          </div>
                          <div>
                            <span className="font-medium">Serviço:</span> {appointment.service_type}
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Observações:</span> {appointment.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {appointment.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({ 
                              id: appointment.id, 
                              status: 'confirmed' 
                            })}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({ 
                              id: appointment.id, 
                              status: 'completed' 
                            })}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: appointment.id, 
                            status: 'cancelled' 
                          })}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteAppointmentMutation.mutate(appointment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Modal de Criar Agendamento */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle>Novo Agendamento</CardTitle>
                  <CardDescription>
                    Agende um novo atendimento para um cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAppointment} className="space-y-4">
                    <div>
                      <Label htmlFor="client_id">Cliente</Label>
                      <Select name="client_id" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients?.map((client: any) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name || client.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="service_type">Tipo de Serviço</Label>
                      <Select name="service_type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consulta">Consulta</SelectItem>
                          <SelectItem value="exame">Exame</SelectItem>
                          <SelectItem value="medicao">Medição Óptica</SelectItem>
                          <SelectItem value="entrega">Entrega de Produto</SelectItem>
                          <SelectItem value="manutencao">Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Observações adicionais..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        disabled={createAppointmentMutation.isPending}
                        className="flex-1"
                      >
                        {createAppointmentMutation.isPending ? "Criando..." : "Criar Agendamento"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}