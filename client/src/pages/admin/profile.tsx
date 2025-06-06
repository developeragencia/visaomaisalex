import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings,
  Shield,
  Crown,
  Edit,
  Save,
  Camera,
  Activity,
  Users,
  Building,
  TrendingUp,
  Calendar,
  BarChart3,
  Globe,
  Lock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type User as UserType, type Franchise } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Buscar dados para dashboard do admin
  const { data: allUsers = [] } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
    queryFn: () => apiRequest("/api/users")
  });

  const { data: franchises = [] } = useQuery<Franchise[]>({
    queryKey: ["/api/franchises"],
    queryFn: () => apiRequest("/api/franchises")
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

  const stats = {
    totalUsers: allUsers.length,
    clients: allUsers.filter(u => u.user_type === 'client').length,
    franchisees: allUsers.filter(u => u.user_type === 'franchisee').length,
    admins: allUsers.filter(u => u.user_type === 'admin').length,
    totalFranchises: franchises.length,
    activeFranchises: franchises.filter(f => f.status === 'approved').length,
    pendingFranchises: franchises.filter(f => f.status === 'pending').length
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userType="admin" activeItem="profile" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Perfil do Administrador
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie seu perfil e visualize estatísticas do sistema
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              Super Admin
            </Badge>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="system">Sistema</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
              </TabsList>

              {/* Perfil */}
              <TabsContent value="profile" className="space-y-6">
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
                        <AvatarFallback className="text-lg bg-purple-100 text-purple-600">
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
                        <Label htmlFor="role">Cargo</Label>
                        <Input
                          id="role"
                          value="Super Administrador"
                          disabled
                          className="bg-gray-50 dark:bg-gray-800"
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

                {/* Privilégios de Admin */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privilégios de Administrador
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Gerenciar usuários</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Gerenciar franquias</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Configurar planos</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Acesso financeiro</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Marketing e campanhas</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Monitoramento do sistema</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dashboard */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Estatísticas Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Usuários</p>
                          <p className="text-lg font-semibold">{stats.totalUsers}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Building className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Franquias Ativas</p>
                          <p className="text-lg font-semibold">{stats.activeFranchises}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Receita Total</p>
                          <p className="text-lg font-semibold">R$ 285.450</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Sistema Online</p>
                          <p className="text-lg font-semibold text-green-600">99.8%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Distribuição de Usuários */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição de Usuários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Clientes</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(stats.clients / stats.totalUsers) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold w-8">{stats.clients}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Franqueados</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full" 
                                style={{ width: `${(stats.franchisees / stats.totalUsers) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold w-8">{stats.franchisees}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Administradores</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${(stats.admins / stats.totalUsers) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold w-8">{stats.admins}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Status das Franquias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Aprovadas</span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">{stats.activeFranchises}</Badge>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Pendentes</span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingFranchises}</Badge>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total</span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">{stats.totalFranchises}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Atividade Recente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Atividade Recente do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">3 novos usuários registrados</p>
                          <p className="text-xs text-gray-500">Há 2 horas</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Building className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Franquia "Visão+ Norte" aprovada</p>
                          <p className="text-xs text-gray-500">Há 4 horas</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Receita mensal atingiu meta</p>
                          <p className="text-xs text-gray-500">Ontem</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sistema */}
              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configurações do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Informações do Sistema</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Versão:</span>
                            <span className="font-medium">v2.1.3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Última Atualização:</span>
                            <span className="font-medium">{format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Banco de Dados:</span>
                            <span className="font-medium text-green-600">Online</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Backup:</span>
                            <span className="font-medium text-green-600">Automático</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Estatísticas de Performance</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Uptime:</span>
                            <span className="font-medium text-green-600">99.8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tempo de Resposta:</span>
                            <span className="font-medium">45ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Uso de CPU:</span>
                            <span className="font-medium">23%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Uso de Memória:</span>
                            <span className="font-medium">67%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h4 className="font-medium mb-4">Ações de Sistema</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-auto p-4">
                          <div className="text-center">
                            <Globe className="h-6 w-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">Backup Manual</div>
                            <div className="text-xs text-gray-500">Criar backup agora</div>
                          </div>
                        </Button>

                        <Button variant="outline" className="h-auto p-4">
                          <div className="text-center">
                            <Activity className="h-6 w-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">Logs do Sistema</div>
                            <div className="text-xs text-gray-500">Ver atividades</div>
                          </div>
                        </Button>

                        <Button variant="outline" className="h-auto p-4">
                          <div className="text-center">
                            <Settings className="h-6 w-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">Manutenção</div>
                            <div className="text-xs text-gray-500">Configurar modo</div>
                          </div>
                        </Button>
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
                      <Lock className="h-5 w-5" />
                      Configurações de Segurança
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Alterar Senha de Admin</p>
                          <p className="text-sm text-gray-500">
                            Última alteração há 3 meses
                          </p>
                        </div>
                        <Button variant="outline">
                          Alterar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Autenticação Dois Fatores</p>
                          <p className="text-sm text-gray-500">
                            Protege conta com código adicional
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Sessões de Admin</p>
                          <p className="text-sm text-gray-500">
                            Gerenciar dispositivos conectados
                          </p>
                        </div>
                        <Button variant="outline">
                          Ver Sessões
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Log de Auditoria</p>
                          <p className="text-sm text-gray-500">
                            Histórico de ações administrativas
                          </p>
                        </div>
                        <Button variant="outline">
                          Ver Logs
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Política de Senhas</p>
                          <p className="text-sm text-gray-500">
                            Configurar requisitos de senha
                          </p>
                        </div>
                        <Button variant="outline">
                          Configurar
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