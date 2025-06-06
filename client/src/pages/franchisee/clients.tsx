import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { 
  Users, 
  Plus, 
  Search, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Edit,
  UserPlus,
  Star,
  ShoppingBag
} from "lucide-react";

interface Client {
  id: number;
  username: string;
  name: string;
  cpf: string | null;
  phone: string | null;
  user_type: string;
  status: string;
  created_at: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  birth_date?: string;
  notes?: string;
  visit_count?: number;
  last_visit?: string;
  total_spent?: number;
}

export default function FranchiseeClients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar clientes
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['/api/franchisee/clients'],
    queryFn: async () => {
      const response = await fetch('/api/franchisee/clients', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      return response.json();
    }
  });

  // Criar novo cliente
  const createClientMutation = useMutation({
    mutationFn: async (clientData: any) => {
      const response = await fetch('/api/franchisee/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (!response.ok) throw new Error('Erro ao criar cliente');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchisee/clients'] });
      toast({ title: "Cliente cadastrado com sucesso!" });
      setIsNewClientOpen(false);
    },
    onError: () => {
      toast({ title: "Erro ao cadastrar cliente", variant: "destructive" });
    }
  });

  // Atualizar cliente
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...clientData }: any) => {
      const response = await fetch(`/api/franchisee/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(clientData)
      });
      if (!response.ok) throw new Error('Erro ao atualizar cliente');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchisee/clients'] });
      toast({ title: "Cliente atualizado com sucesso!" });
      setIsEditMode(false);
      setSelectedClient(null);
    }
  });

  // Excluir cliente
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: number) => {
      const response = await fetch(`/api/franchisee/clients/${clientId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Erro ao excluir cliente');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchisee/clients'] });
      toast({ title: "Cliente excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir cliente", variant: "destructive" });
    }
  });

  // Filtrar clientes
  const filteredClients = clients.filter((client: any) => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (client.phone && client.phone.includes(searchTerm));
  });

  // Estatísticas
  const activeClients = clients.filter((c: Client) => c.status === 'active').length;
  const totalClients = clients.length;
  const newClientsThisMonth = clients.filter((c: Client) => {
    const createdAt = new Date(c.created_at);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length;
  
  const totalSpent = clients.reduce((sum: number, client: any) => sum + (client.total_spent || 0), 0);
  const avgSpent = totalClients > 0 ? totalSpent / totalClients : 0;

  const ClientForm = ({ client, onSubmit, onCancel }: { 
    client?: Client; 
    onSubmit: (data: any) => void; 
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: client?.name || '',
      username: client?.username || '',
      phone: client?.phone || '',
      cpf: client?.cpf || '',
      address: client?.address || '',
      city: client?.city || '',
      state: client?.state || '',
      birth_date: client?.birth_date || '',
      notes: client?.notes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(client ? { id: client.id, ...formData } : formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            placeholder="Nome do cliente"
          />
        </div>

        <div>
          <Label htmlFor="username">E-mail *</Label>
          <Input
            id="username"
            type="email"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            placeholder="email@cliente.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            value={formData.cpf || ''}
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Rua, número, bairro"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              placeholder="SP"
              maxLength={2}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Observações sobre o cliente, preferências, etc."
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {client ? "Atualizar" : "Cadastrar"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="franchisee" />
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        
        <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
              <DialogDescription>
                Cadastre um novo cliente no sistema
              </DialogDescription>
            </DialogHeader>
            <ClientForm 
              onSubmit={(data) => createClientMutation.mutate(data)}
              onCancel={() => setIsNewClientOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeClients} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              De todos os clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {avgSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Por cliente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter((c: Client) => {
                const clientDate = new Date(c.created_at);
                const now = new Date();
                return clientDate.getMonth() === now.getMonth() && 
                       clientDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadastrados recentemente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} clientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando clientes...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client: Client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">
                          {client.visit_count} visitas
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {client.phone}
                        </div>
                        {client.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.city && client.state ? (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {client.city}, {client.state}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.last_visit ? (
                        new Date(client.last_visit).toLocaleDateString('pt-BR')
                      ) : (
                        <span className="text-gray-400">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {(client.total_spent || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={client.status === 'active' ? 'default' : 'secondary'}
                      >
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedClient(client)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedClient(client);
                            setIsEditMode(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes/edição do cliente */}
      {selectedClient && (
        <Dialog 
          open={!!selectedClient} 
          onOpenChange={() => {
            setSelectedClient(null);
            setIsEditMode(false);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Editar Cliente' : 'Detalhes do Cliente'}
              </DialogTitle>
            </DialogHeader>
            
            {isEditMode ? (
              <ClientForm 
                client={selectedClient}
                onSubmit={(data) => updateClientMutation.mutate(data)}
                onCancel={() => {
                  setIsEditMode(false);
                  setSelectedClient(null);
                }}
              />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <p className="font-medium">{selectedClient.name}</p>
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <p>{selectedClient.email || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Telefone</Label>
                    <p>{selectedClient.phone}</p>
                  </div>
                  <div>
                    <Label>CPF</Label>
                    <p>{selectedClient.cpf || '-'}</p>
                  </div>
                </div>

                <div>
                  <Label>Endereço</Label>
                  <p>{selectedClient.address || '-'}</p>
                  {selectedClient.city && selectedClient.state && (
                    <p className="text-sm text-gray-500">
                      {selectedClient.city}, {selectedClient.state}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data de Nascimento</Label>
                    <p>
                      {selectedClient.birth_date ? 
                        new Date(selectedClient.birth_date).toLocaleDateString('pt-BR') : 
                        '-'
                      }
                    </p>
                  </div>
                  <div>
                    <Label>Cliente desde</Label>
                    <p>{new Date(selectedClient.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Total Gasto</Label>
                    <p className="text-lg font-bold">R$ {(selectedClient.total_spent || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <Label>Visitas</Label>
                    <p className="text-lg font-bold">{selectedClient.visit_count}</p>
                  </div>
                  <div>
                    <Label>Última Visita</Label>
                    <p>
                      {selectedClient.last_visit ? 
                        new Date(selectedClient.last_visit).toLocaleDateString('pt-BR') : 
                        'Nunca'
                      }
                    </p>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div>
                    <Label>Observações</Label>
                    <p className="bg-gray-50 p-3 rounded-lg">{selectedClient.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => setIsEditMode(true)}>
                    Editar Cliente
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedClient(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
      </div>
      </div>
      
      {/* Menu Inferior Móvel */}
      <MobileNav activeItem="clients" />
    </div>
  );
}