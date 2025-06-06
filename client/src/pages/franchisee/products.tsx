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
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Filter,
  ShoppingCart,
  Zap
} from "lucide-react";

export default function FranchiseeProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Buscar produtos
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  // Criar produto
  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/products', 'POST', data),
    onSuccess: () => {
      toast({
        title: "✅ Produto criado!",
        description: "O produto foi adicionado ao catálogo."
      });
      setShowCreateForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao criar produto",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  });

  // Atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest(`/api/products/${id}`, 'PATCH', data),
    onSuccess: () => {
      toast({
        title: "✅ Produto atualizado!",
        description: "As alterações foram salvas com sucesso."
      });
      setSelectedProduct(null);
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao atualizar",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  });

  // Deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/products/${id}`, 'DELETE'),
    onSuccess: () => {
      toast({
        title: "✅ Produto removido!",
        description: "O produto foi excluído do catálogo."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: () => {
      toast({
        title: "❌ Erro ao remover",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      brand: formData.get('brand') as string,
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      min_stock: parseInt(formData.get('min_stock') as string) || 5,
      is_active: true
    };

    createProductMutation.mutate(productData);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const productData = {
      id: selectedProduct.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      brand: formData.get('brand') as string,
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      min_stock: parseInt(formData.get('min_stock') as string) || 5,
      is_active: true
    };

    updateProductMutation.mutate(productData);
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      armacao: { label: "Armação", variant: "default" as const },
      lente: { label: "Lente", variant: "secondary" as const },
      oculos_sol: { label: "Óculos de Sol", variant: "outline" as const },
      acessorio: { label: "Acessório", variant: "destructive" as const }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.armacao;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStockStatus = (product: any) => {
    if (product.stock_quantity <= 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>;
    } else if (product.stock_quantity <= (product.min_stock || 5)) {
      return <Badge variant="outline">Estoque Baixo</Badge>;
    }
    return <Badge variant="default">Em Estoque</Badge>;
  };

  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="franchisee" />
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
              <p className="text-gray-600">Gerencie o catálogo de produtos da sua franquia</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
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
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      <SelectItem value="armacao">Armação</SelectItem>
                      <SelectItem value="lente">Lente</SelectItem>
                      <SelectItem value="oculos_sol">Óculos de Sol</SelectItem>
                      <SelectItem value="acessorio">Acessório</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p>Carregando produtos...</p>
                </CardContent>
              </Card>
            ) : filteredProducts.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Nenhum produto encontrado</p>
                </CardContent>
              </Card>
            ) : (
              filteredProducts.map((product: any) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do Produto */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProductMutation.mutate(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Descrição */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Badges */}
                      <div className="flex gap-2 flex-wrap">
                        {getCategoryBadge(product.category)}
                        {getStockStatus(product)}
                      </div>

                      {/* Preço e Estoque */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            R$ {product.price?.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Estoque</p>
                          <p className="font-semibold">{product.stock_quantity} unidades</p>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button size="sm" className="flex-1">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Vender
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Modal de Criar/Editar Produto */}
          {(showCreateForm || selectedProduct) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>
                    {selectedProduct ? "Editar Produto" : "Novo Produto"}
                  </CardTitle>
                  <CardDescription>
                    {selectedProduct ? "Atualize as informações do produto" : "Adicione um novo produto ao catálogo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome do Produto</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={selectedProduct?.name || ""}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand">Marca</Label>
                        <Input
                          id="brand"
                          name="brand"
                          defaultValue={selectedProduct?.brand || ""}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={selectedProduct?.description || ""}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          defaultValue={selectedProduct?.price || ""}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
                        <Input
                          id="stock_quantity"
                          name="stock_quantity"
                          type="number"
                          defaultValue={selectedProduct?.stock_quantity || ""}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="min_stock">Estoque Mínimo</Label>
                        <Input
                          id="min_stock"
                          name="min_stock"
                          type="number"
                          defaultValue={selectedProduct?.min_stock || 5}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select name="category" defaultValue={selectedProduct?.category || ""} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="armacao">Armação</SelectItem>
                          <SelectItem value="lente">Lente</SelectItem>
                          <SelectItem value="oculos_sol">Óculos de Sol</SelectItem>
                          <SelectItem value="acessorio">Acessório</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        className="flex-1"
                      >
                        {selectedProduct ? 
                          (updateProductMutation.isPending ? "Atualizando..." : "Atualizar Produto") :
                          (createProductMutation.isPending ? "Criando..." : "Criar Produto")
                        }
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowCreateForm(false);
                          setSelectedProduct(null);
                        }}
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