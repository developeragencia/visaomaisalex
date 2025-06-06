import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus, Eye, CheckCircle, AlertCircle, CalendarDays, X, MoreVertical, Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import type { InsertAppointment } from "@shared/schema";

export default function ClientAppointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDateChangeModalOpen, setIsDateChangeModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState<string>('');
  
  const [newAppointment, setNewAppointment] = useState<Partial<InsertAppointment>>({
    date: new Date(),
    appointment_type: '',
    notes: '',
    user_id: user?.id || 0,
    franchise_id: 1,
    status: 'scheduled'
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: Partial<InsertAppointment>) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
      if (!response.ok) throw new Error('Failed to create appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setNewAppointment({
        date: new Date(),
        appointment_type: '',
        notes: '',
        user_id: user?.id || 0,
        franchise_id: 1,
        status: 'scheduled'
      });
      setIsCreateModalOpen(false);
      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao criar appointment:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const changeDateMutation = useMutation({
    mutationFn: async ({ id, newDate }: { id: number, newDate: string }) => {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointment_date: new Date(newDate).toISOString() })
      });
      if (!response.ok) throw new Error('Failed to update appointment date');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setIsDateChangeModalOpen(false);
      setSelectedAppointment(null);
      setNewDate('');
      toast({
        title: "Sucesso!",
        description: "Data do agendamento alterada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao alterar data do agendamento.",
        variant: "destructive"
      });
    }
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (!response.ok) throw new Error('Failed to cancel appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Sucesso!",
        description: "Agendamento cancelado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao cancelar agendamento.",
        variant: "destructive"
      });
    }
  });

  const handleCreateAppointment = () => {
    if (!newAppointment.user_id) {
      toast({
        title: "Erro",
        description: "Selecione o cliente.",
        variant: "destructive"
      });
      return;
    }

    if (!newAppointment.appointment_type) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de consulta.",
        variant: "destructive"
      });
      return;
    }

    if (!newAppointment.date) {
      toast({
        title: "Erro",
        description: "Selecione a data da consulta.",
        variant: "destructive"
      });
      return;
    }

    createAppointmentMutation.mutate(newAppointment);
  };

  const handleChangeDateAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setNewDate(new Date(appointment.date).toISOString().split('T')[0]);
    setIsDateChangeModalOpen(true);
  };

  const handleConfirmDateChange = () => {
    if (!selectedAppointment || !newDate) return;
    
    changeDateMutation.mutate({
      id: selectedAppointment.id,
      newDate: newDate
    });
  };

  const handleCancelAppointment = (id: number) => {
    cancelAppointmentMutation.mutate(id);
  };

  // Buscar appointments reais do banco de dados
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: async () => {
      const response = await fetch('/api/appointments', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Lista de clientes para o campo de seleção
  const mockClients = [
    { id: 1, name: "João Silva" },
    { id: 2, name: "Maria Santos" },
    { id: 3, name: "Pedro Oliveira" },
    { id: 4, name: "Ana Costa" },
    { id: 5, name: "Carlos Ferreira" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType={(user?.user_type as "client" | "franchisee" | "admin") || "client"} />
      <div className="flex-1 overflow-hidden">
        <div className="p-6 pb-20 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                Meus Agendamentos
              </h1>
              <p className="text-gray-600">
                Gerencie suas consultas e agendamentos
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-purple-200 hover:border-purple-300">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                        <Plus className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Agendar</h3>
                      <p className="text-sm text-gray-500">Nova consulta</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                    <DialogDescription>
                      {user?.user_type === 'franchisee' ? 'Cadastre uma nova consulta para um cliente' : 'Agende sua próxima consulta'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {user?.user_type === 'franchisee' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Cliente</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          value={newAppointment.user_id || ""}
                          onChange={(e) => setNewAppointment(prev => ({
                            ...prev,
                            user_id: parseInt(e.target.value)
                          }))}
                          required
                        >
                          <option value="">Selecione o cliente</option>
                          <option value="1">Maria Silva</option>
                          <option value="2">João Santos</option>
                          <option value="3">Ana Costa</option>
                          <option value="4">Pedro Oliveira</option>
                          <option value="5">Carlos Lima</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="date">Data da Consulta</Label>
                      <Input
                        id="date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={newAppointment.date ? new Date(newAppointment.date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setNewAppointment(prev => ({
                          ...prev,
                          date: new Date(e.target.value + 'T09:00:00')
                        }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário da Consulta</Label>
                      <select
                        id="time"
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => {
                          const currentDate = newAppointment.date ? new Date(newAppointment.date) : new Date();
                          const [hours, minutes] = e.target.value.split(':');
                          currentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                          setNewAppointment(prev => ({
                            ...prev,
                            date: currentDate
                          }));
                        }}
                        required
                      >
                        <option value="">Selecione o horário</option>
                        <option value="08:00">08:00</option>
                        <option value="08:30">08:30</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                        <option value="17:00">17:00</option>
                        <option value="17:30">17:30</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="appointment_type">Tipo de Consulta</Label>
                      <select
                        id="appointment_type"
                        className="w-full p-2 border rounded-md"
                        value={newAppointment.appointment_type || ''}
                        onChange={(e) => setNewAppointment(prev => ({
                          ...prev,
                          appointment_type: e.target.value
                        }))}
                        required
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="consulta_rotina">Consulta de Rotina</option>
                        <option value="exame_vista">Exame de Vista</option>
                        <option value="adaptacao_lentes">Adaptação de Lentes</option>
                        <option value="retorno">Retorno</option>
                        <option value="medição_óptica">Medição Óptica</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        placeholder="Adicione observações..."
                        value={newAppointment.notes || ''}
                        onChange={(e) => setNewAppointment(prev => ({
                          ...prev,
                          notes: e.target.value
                        }))}
                      />
                    </div>
                    <Button 
                      onClick={handleCreateAppointment}
                      disabled={createAppointmentMutation.isPending}
                      className="w-full"
                    >
                      {createAppointmentMutation.isPending ? 'Agendando...' : 'Agendar Consulta'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Link href="/client/optical-measurement">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-orange-200 hover:border-orange-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                      <Eye className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Medição</h3>
                    <p className="text-sm text-gray-500">Óptica</p>
                  </CardContent>
                </Card>
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 hover:border-blue-300">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Horários</h3>
                      <p className="text-sm text-gray-500">Disponíveis</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Horários Disponíveis</DialogTitle>
                    <DialogDescription>
                      Confira os horários disponíveis para agendamento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Manhã</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>08:00</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>08:30</span>
                            <span className="text-red-600">Ocupado</span>
                          </div>
                          <div className="flex justify-between">
                            <span>09:00</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>09:30</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>10:00</span>
                            <span className="text-red-600">Ocupado</span>
                          </div>
                          <div className="flex justify-between">
                            <span>10:30</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>11:00</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>11:30</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Tarde</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>14:00</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>14:30</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>15:00</span>
                            <span className="text-red-600">Ocupado</span>
                          </div>
                          <div className="flex justify-between">
                            <span>15:30</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>16:00</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>16:30</span>
                            <span className="text-red-600">Ocupado</span>
                          </div>
                          <div className="flex justify-between">
                            <span>17:00</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                          <div className="flex justify-between">
                            <span>17:30</span>
                            <span className="text-green-600">Disponível</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 hover:border-green-300">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Contato</h3>
                      <p className="text-sm text-gray-500">Suporte</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Entre em Contato</DialogTitle>
                    <DialogDescription>
                      Fale conosco para tirar dúvidas ou solicitar suporte
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold">Telefone</h4>
                          <p className="text-sm text-gray-600">(11) 99999-9999</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mb-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">E-mail</h4>
                          <p className="text-sm text-gray-600">contato@visaomais.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold">WhatsApp</h4>
                          <p className="text-sm text-gray-600">(11) 99999-9999</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Horário de atendimento: Segunda a Sexta, 8h às 18h
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Appointments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Próximas Consultas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximas Consultas
                  </CardTitle>
                  <CardDescription>
                    Suas consultas agendadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Carregando agendamentos...</p>
                    </div>
                  ) : appointments && Array.isArray(appointments) && appointments.length > 0 ? (
                    <div className="space-y-4">
                      {Array.isArray(appointments) && appointments.map((appointment: any) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Calendar className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {appointment.appointment_type === 'consulta_rotina' ? 'Consulta de Rotina' : 
                                 appointment.appointment_type === 'exame_vista' ? 'Exame de Vista' :
                                 appointment.appointment_type === 'adaptacao_lentes' ? 'Adaptação de Lentes' :
                                 appointment.appointment_type === 'retorno' ? 'Retorno' : appointment.appointment_type}
                              </p>
                              <p className="text-sm text-gray-500">
                                {appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString('pt-BR') : 'Data não disponível'}
                              </p>
                              {appointment.notes && (
                                <p className="text-xs text-gray-400 mt-1">{appointment.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              {appointment.status === 'scheduled' ? 'Agendado' : 
                               appointment.status === 'completed' ? 'Concluído' :
                               appointment.status === 'cancelled' ? 'Cancelado' : appointment.status}
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {appointment.status === 'scheduled' && (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={() => handleChangeDateAppointment(appointment)}
                                      className="flex items-center gap-2"
                                    >
                                      <CalendarDays className="h-4 w-4" />
                                      Alterar Data
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          onSelect={(e) => e.preventDefault()}
                                          className="flex items-center gap-2 text-red-600"
                                        >
                                          <X className="h-4 w-4" />
                                          Cancelar
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Tem certeza que deseja cancelar este agendamento? Você poderá reagendar posteriormente.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Voltar</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleCancelAppointment(appointment.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Cancelar Agendamento
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                                {appointment.status !== 'scheduled' && (
                                  <DropdownMenuItem disabled className="text-gray-400">
                                    Nenhuma ação disponível
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nenhum agendamento encontrado</p>
                      <p className="text-sm text-gray-400">Clique em "Agendar" para criar seu primeiro agendamento</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Histórico */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Histórico de Consultas
                  </CardTitle>
                  <CardDescription>
                    Suas consultas anteriores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhuma consulta anterior</p>
                    <p className="text-sm text-gray-400">Suas consultas aparecerão aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modal de Alteração de Data */}
            <Dialog open={isDateChangeModalOpen} onOpenChange={setIsDateChangeModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Data do Agendamento</DialogTitle>
                  <DialogDescription>
                    Escolha uma nova data para o seu agendamento
                  </DialogDescription>
                </DialogHeader>
                {selectedAppointment && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">Agendamento Atual:</p>
                      <p className="text-sm text-gray-600">
                        {selectedAppointment.appointment_type === 'consulta_rotina' ? 'Consulta de Rotina' : 
                         selectedAppointment.appointment_type === 'exame_vista' ? 'Exame de Vista' :
                         selectedAppointment.appointment_type === 'adaptacao_lentes' ? 'Adaptação de Lentes' :
                         selectedAppointment.appointment_type === 'retorno' ? 'Retorno' : selectedAppointment.appointment_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        Data atual: {selectedAppointment.appointment_date ? new Date(selectedAppointment.appointment_date).toLocaleDateString('pt-BR') : 'Data não disponível'}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="new-date">Nova Data</Label>
                      <Input
                        id="new-date"
                        type="date"
                        value={newDate}
                        min={new Date().toISOString().split('T')[0]} // Não permite datas passadas
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleConfirmDateChange}
                        disabled={changeDateMutation.isPending || !newDate}
                        className="flex-1"
                      >
                        {changeDateMutation.isPending ? 'Salvando...' : 'Confirmar Nova Data'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDateChangeModalOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
}