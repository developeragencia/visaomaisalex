import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings,
  Bell,
  Shield,
  CreditCard,
  Edit,
  Camera,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Eye,
  Save
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type UserPlan, type Plan, type Measurement } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    date_of_birth: user?.date_of_birth || "",
    address: user?.address || ""
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    whatsapp: true,
    appointments: true,
    promotions: false
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Buscar plano do usuário
  const { data: userPlan } = useQuery<UserPlan & { plan: Plan }>({
    queryKey: ["/api/user-plans", user?.id],
    queryFn: () => apiRequest(`/api/user-plans?userId=${user?.id}`),
    enabled: !!user?.id
  });

  // Buscar medições
  const { data: measurements = [] } = useQuery<Measurement[]>({
    queryKey: ["/api/measurements", user?.id],
    queryFn: () => apiRequest(`/api/measurements?userId=${user?.id}`),
    enabled: !!user?.id
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/users/${user?.id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Preferência salva",
      description: `Notificações por ${key} ${value ? 'ativadas' : 'desativadas'}.`
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userType="client" activeItem="profile" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Meu Perfil
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie suas informações pessoais e configurações
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="personal" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Pessoal</TabsTrigger>
                <TabsTrigger value="plan">Meu Plano</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
              </TabsList>

              {/* Informações Pessoais */}
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription>
                      Mantenha suas informações sempre atualizadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="" alt={user?.name} />
                        <AvatarFallback className="text-lg">
                          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Alterar Foto
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG até 2MB
                        </p>
                      </div>
                    </div>

                    {/* Formulário */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user?.username}
                          disabled
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birth">Data de Nascimento</Label>
                        <Input
                          id="birth"
                          type="date"
                          value={profileData.date_of_birth}
                          onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Rua, número, bairro, cidade - CEP"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
                      {isEditing ? (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {updateProfileMutation.isPending ? "Salvando..." : "Salvar"}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Perfil
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Estatísticas do Perfil */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Membro desde</p>
                          <p className="text-lg font-semibold">
                            {format(new Date(user?.created_at || 0), "MMM yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Eye className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Medições</p>
                          <p className="text-lg font-semibold">{measurements.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Shield className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <Badge className="bg-green-100 text-green-800">Verificado</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Meu Plano */}
              <TabsContent value="plan" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Meu Plano
                    </CardTitle>
                    <CardDescription>
                      Informações sobre seu plano atual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userPlan ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{userPlan.plan.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {userPlan.plan.description}
                            </p>
                          </div>
                          <Badge className={userPlan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {userPlan.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Preço Mensal</p>
                            <p className="text-2xl font-bold text-green-600">
                              R$ {(userPlan.plan.price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-500">Início</p>
                            <p className="text-lg font-semibold">
                              {userPlan.start_date ? 
                                format(new Date(userPlan.start_date), "dd/MM/yyyy") : 
                                "Não definido"
                              }
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-500">Renovação</p>
                            <p className="text-lg font-semibold">
                              {userPlan.end_date ? 
                                format(new Date(userPlan.end_date), "dd/MM/yyyy") : 
                                "Vitalício"
                              }
                            </p>
                          </div>
                        </div>

                        <div className="pt-6 border-t">
                          <h4 className="font-medium mb-4">Benefícios do Plano</h4>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>✓ Consultas de rotina ilimitadas</li>
                            <li>✓ Exames especializados inclusos</li>
                            <li>✓ Desconto de 20% em armações</li>
                            <li>✓ Desconto de 15% em lentes</li>
                            <li>✓ Atendimento prioritário</li>
                            <li>✓ Histórico digital de medições</li>
                          </ul>
                        </div>

                        <div className="flex gap-4">
                          <Button variant="outline">
                            Alterar Plano
                          </Button>
                          <Button variant="outline">
                            Histórico de Pagamentos
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="font-medium mb-2">Nenhum plano ativo</h3>
                        <p className="text-gray-500 mb-4">
                          Escolha um plano para ter acesso completo aos nossos serviços
                        </p>
                        <Link href="/client/plans">
                          <Button>
                            Ver Planos Disponíveis
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notificações */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Preferências de Notificação
                    </CardTitle>
                    <CardDescription>
                      Configure como deseja receber nossas notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Canais de Notificação */}
                    <div>
                      <h4 className="font-medium mb-4">Canais de Comunicação</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-sm text-gray-500">Receber notificações por email</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">SMS</p>
                              <p className="text-sm text-gray-500">Receber notificações por SMS</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.sms}
                            onCheckedChange={(checked) => handleNotificationChange('SMS', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="font-medium">WhatsApp</p>
                              <p className="text-sm text-gray-500">Receber notificações via WhatsApp</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.whatsapp}
                            onCheckedChange={(checked) => handleNotificationChange('WhatsApp', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tipos de Notificação */}
                    <div className="pt-6 border-t">
                      <h4 className="font-medium mb-4">Tipos de Notificação</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Lembretes de Consulta</p>
                            <p className="text-sm text-gray-500">Receber lembretes sobre consultas agendadas</p>
                          </div>
                          <Switch
                            checked={notifications.appointments}
                            onCheckedChange={(checked) => handleNotificationChange('consultas', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Promoções e Ofertas</p>
                            <p className="text-sm text-gray-500">Receber informações sobre promoções especiais</p>
                          </div>
                          <Switch
                            checked={notifications.promotions}
                            onCheckedChange={(checked) => handleNotificationChange('promoções', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Segurança */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Segurança da Conta
                    </CardTitle>
                    <CardDescription>
                      Mantenha sua conta segura
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Alterar Senha</p>
                          <p className="text-sm text-gray-500">
                            Última alteração há 2 meses
                          </p>
                        </div>
                        <Button variant="outline">
                          Alterar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Autenticação em Duas Etapas</p>
                          <p className="text-sm text-gray-500">
                            Adicione uma camada extra de segurança
                          </p>
                        </div>
                        <Button variant="outline">
                          Configurar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Sessões Ativas</p>
                          <p className="text-sm text-gray-500">
                            Gerencie dispositivos conectados
                          </p>
                        </div>
                        <Button variant="outline">
                          Ver Sessões
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Baixar Meus Dados</p>
                          <p className="text-sm text-gray-500">
                            Solicite uma cópia dos seus dados
                          </p>
                        </div>
                        <Button variant="outline">
                          Solicitar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                        <div>
                          <p className="font-medium text-red-600">Excluir Conta</p>
                          <p className="text-sm text-gray-500">
                            Esta ação não pode ser desfeita
                          </p>
                        </div>
                        <Button variant="destructive">
                          Excluir
                        </Button>
                      </div>
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