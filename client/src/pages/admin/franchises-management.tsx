import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Search, CheckCircle, XCircle, Plus, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function FranchisesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: franchises = [], isLoading } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => apiRequest('GET', '/api/franchises'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const approveMutation = useMutation({
    mutationFn: (franchiseId: number) => apiRequest('PATCH', `/api/franchises/${franchiseId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchises'] });
      toast({ title: "Franquia aprovada com sucesso!" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (franchiseId: number) => apiRequest('PATCH', `/api/franchises/${franchiseId}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchises'] });
      toast({ title: "Franquia rejeitada" });
    },
  });

  const filteredFranchises = franchises.filter(franchise => 
    franchise.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeFranchises = franchises.filter(f => f.status === 'active').length;
  const pendingFranchises = franchises.filter(f => f.status === 'pending').length;

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
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Franquias</h1>
              <p className="mt-2 text-gray-600">
                Gerencie todas as franquias da rede Visão+
              </p>
            </motion.div>

            {/* Estatísticas das franquias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-green-100">Franquias Ativas</p>
                      <p className="text-3xl font-bold">{activeFranchises}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-orange-100">Pendentes</p>
                      <p className="text-3xl font-bold">{pendingFranchises}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-blue-100">Total</p>
                      <p className="text-3xl font-bold">{franchises.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Franquias ({franchises.length})
                  </CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Franquia
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar franquias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFranchises.map((franchise) => (
                      <TableRow key={franchise.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{franchise.name}</p>
                            <p className="text-sm text-gray-500">{franchise.owner_name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{franchise.city}, {franchise.state}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              {franchise.phone}
                            </div>
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1 text-gray-400" />
                              {franchise.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={franchise.status === 'active' ? 'default' : 'secondary'}>
                            {franchise.status === 'active' ? 'Ativa' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {franchise.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => approveMutation.mutate(franchise.id)}
                                  disabled={approveMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectMutation.mutate(franchise.id)}
                                  disabled={rejectMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredFranchises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma franquia encontrada
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Menu mobile para celular */}
      <MobileNav activeItem="franchises" />
    </div>
  );
}