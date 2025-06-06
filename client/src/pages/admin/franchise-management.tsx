import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertFranchiseSchema, type InsertFranchise, type Franchise } from "@shared/schema";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function FranchiseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar todas as franquias
  const { data: franchises = [], isLoading } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: async () => {
      const response = await fetch('/api/franchises', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch franchises');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Form para criar/editar franquia
  const form = useForm<InsertFranchise>({
    resolver: zodResolver(insertFranchiseSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      manager_name: "",
      status: "pending"
    }
  });

  // Mutation para criar franquia
  const createFranchiseMutation = useMutation({
    mutationFn: async (data: InsertFranchise) => {
      const response = await fetch('/api/franchises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create franchise');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchises'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso!",
        description: "Franquia criada com sucesso.",
      });
    }
  });

  // Mutation para atualizar franquia
  const updateFranchiseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertFranchise> }) => {
      const response = await fetch(`/api/franchises/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update franchise');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchises'] });
      setEditingFranchise(null);
      toast({
        title: "Sucesso!",
        description: "Franquia atualizada com sucesso.",
      });
    }
  });

  // Mutation para deletar franquia
  const deleteFranchiseMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/franchises/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete franchise');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchises'] });
      toast({
        title: "Franquia removida",
        description: "Franquia foi removida com sucesso.",
      });
    }
  });

  // Mutation para aprovar franquia
  const approveFranchiseMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/franchises/${id}/approve`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to approve franchise');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchises'] });
      toast({
        title: "Franquia aprovada!",
        description: "Franquia foi aprovada e está ativa.",
      });
    }
  });

  const filteredFranchises = franchises.filter((franchise: Franchise) => {
    const matchesSearch = franchise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         franchise.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || franchise.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const onSubmit = (data: InsertFranchise) => {
    if (editingFranchise) {
      updateFranchiseMutation.mutate({ id: editingFranchise.id, data });
    } else {
      createFranchiseMutation.mutate(data);
    }
  };

  const handleEdit = (franchise: Franchise) => {
    setEditingFranchise(franchise);
    form.reset({
      name: franchise.name,
      address: franchise.address,
      phone: franchise.phone || "",
      email: franchise.email || "",
      manager_name: franchise.manager_name || "",
      status: franchise.status
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Ativa" },
      pending: { variant: "secondary" as const, label: "Pendente" },
      inactive: { variant: "outline" as const, label: "Inativa" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="admin" />
      <div className="flex-1 overflow-hidden md:ml-0">
        <div className="p-6 pt-20 md:pt-6 pb-20 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Gerenciamento de Franquias
                  </h1>
                  <p className="text-gray-600">
                    Gerencie todas as franquias do sistema
                  </p>
                </div>
                <Dialog open={isAddDialogOpen || !!editingFranchise} onOpenChange={(open) => {
                  if (!open) {
                    setIsAddDialogOpen(false);
                    setEditingFranchise(null);
                    form.reset();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Nova Franquia
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingFranchise ? 'Editar Franquia' : 'Nova Franquia'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingFranchise 
                          ? 'Atualize as informações da franquia'
                          : 'Adicione uma nova franquia ao sistema'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da Franquia</FormLabel>
                              <FormControl>
                                <Input placeholder="Visão+ Centro" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endereço</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Rua das Flores, 123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(11) 9999-9999" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="contato@franquia.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="manager_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Gerente</FormLabel>
                              <FormControl>
                                <Input placeholder="João Silva" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="active">Ativa</SelectItem>
                                  <SelectItem value="inactive">Inativa</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-2 pt-4">
                          <Button
                            type="submit"
                            disabled={createFranchiseMutation.isPending || updateFranchiseMutation.isPending}
                            className="flex-1"
                          >
                            {editingFranchise ? 'Atualizar' : 'Criar'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsAddDialogOpen(false);
                              setEditingFranchise(null);
                              form.reset();
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar franquias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabela de Franquias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Franquias ({filteredFranchises.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Gerente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Carregando franquias...
                          </TableCell>
                        </TableRow>
                      ) : filteredFranchises.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Nenhuma franquia encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredFranchises.map((franchise: Franchise) => (
                          <TableRow key={franchise.id}>
                            <TableCell className="font-medium">{franchise.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{franchise.address}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {franchise.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs">{franchise.phone}</span>
                                  </div>
                                )}
                                {franchise.email && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs">{franchise.email}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{franchise.manager_name || "-"}</TableCell>
                            <TableCell>{getStatusBadge(franchise.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {franchise.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => approveFranchiseMutation.mutate(franchise.id)}
                                    disabled={approveFranchiseMutation.isPending}
                                  >
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(franchise)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteFranchiseMutation.mutate(franchise.id)}
                                  disabled={deleteFranchiseMutation.isPending}
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}