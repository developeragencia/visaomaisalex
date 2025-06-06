import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Search, Plus, Edit, Trash2, Package, Eye, Glasses } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export default function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('GET', '/api/products'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: number) => apiRequest('DELETE', `/api/products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Produto excluído com sucesso!" });
    },
  });

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProducts = products.filter(p => p.active).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'óculos': return <Glasses className="h-5 w-5" />;
      case 'lentes': return <Eye className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'óculos': return 'from-blue-500 to-blue-600';
      case 'lentes': return 'from-green-500 to-green-600';
      case 'acessórios': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
              <p className="mt-2 text-gray-600">
                Configure e gerencie o catálogo de produtos da Visão+
              </p>
            </motion.div>

            {/* Estatísticas dos produtos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-green-100">Produtos Ativos</p>
                      <p className="text-3xl font-bold">{activeProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-blue-100">Total de Produtos</p>
                      <p className="text-3xl font-bold">{products.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Glasses className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-purple-100">Óculos</p>
                      <p className="text-3xl font-bold">{products.filter(p => p.category === 'óculos').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-orange-100">Lentes</p>
                      <p className="text-3xl font-bold">{products.filter(p => p.category === 'lentes').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categorias em destaque */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {['óculos', 'lentes', 'acessórios'].map((category) => {
                const categoryProducts = products.filter(p => p.category?.toLowerCase() === category);
                const categoryValue = categoryProducts.reduce((acc, p) => acc + (p.price || 0), 0);
                
                return (
                  <Card key={category} className={`bg-gradient-to-r ${getCategoryColor(category)} text-white`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        {getCategoryIcon(category)}
                        <Badge variant="secondary" className="text-gray-900">
                          {categoryProducts.length} produtos
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2 capitalize">{category}</h3>
                      <p className="text-2xl font-bold">{formatCurrency(categoryValue)}</p>
                      <p className="text-sm opacity-90">Valor total da categoria</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Produtos ({products.length})
                  </CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
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
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getCategoryIcon(product.category)}
                            <div className="ml-3">
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.brand}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.active ? 'default' : 'secondary'}>
                            {product.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMutation.mutate(product.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Menu mobile para celular */}
      <MobileNav activeItem="products" />
    </div>
  );
}