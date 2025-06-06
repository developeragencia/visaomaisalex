import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Package, 
  Plus, 
  Search, 
  Edit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  DollarSign
} from "lucide-react";

interface InventoryItem {
  id: number;
  product_id: number;
  franchise_id: number;
  quantity: number;
  min_stock: number;
  max_stock: number;
  product: {
    name: string;
    category: string;
    price: number;
    brand?: string;
    model?: string;
  };
}

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar inventário da franquia
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['/api/franchisee/inventory', user?.id],
    enabled: !!user?.id
  });

  // Dados de exemplo para exibição
  const mockInventory: InventoryItem[] = [
    {
      id: 1,
      product_id: 1,
      franchise_id: user?.id || 1,
      quantity: 25,
      min_stock: 10,
      max_stock: 50,
      product: {
        name: "Óculos Ray-Ban Aviator",
        category: "Óculos de Sol",
        price: 450,
        brand: "Ray-Ban",
        model: "Aviator"
      }
    },
    {
      id: 2,
      product_id: 2,
      franchise_id: user?.id || 1,
      quantity: 5,
      min_stock: 15,
      max_stock: 40,
      product: {
        name: "Lentes de Contato Transitions",
        category: "Lentes",
        price: 280,
        brand: "Transitions",
        model: "Signature"
      }
    },
    {
      id: 3,
      product_id: 3,
      franchise_id: user?.id || 1,
      quantity: 18,
      min_stock: 10,
      max_stock: 30,
      product: {
        name: "Armação Oakley Holbrook",
        category: "Armações",
        price: 320,
        brand: "Oakley",
        model: "Holbrook"
      }
    }
  ];

  const displayInventory = inventory.length > 0 ? inventory : mockInventory;

  // Filtrar inventário
  const filteredInventory = displayInventory.filter((item: InventoryItem) => {
    const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.product.category === filterCategory;
    const matchesStock = filterStock === "all" || 
                        (filterStock === "low" && item.quantity <= item.min_stock) ||
                        (filterStock === "normal" && item.quantity > item.min_stock && item.quantity < item.max_stock) ||
                        (filterStock === "high" && item.quantity >= item.max_stock);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Estatísticas
  const totalProducts = displayInventory.length;
  const lowStockCount = displayInventory.filter((item: InventoryItem) => 
    item.quantity <= item.min_stock
  ).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="franchisee" />
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Gerenciamento de Estoque
                </h1>
                <p className="text-gray-600">
                  Controle seu inventário e monitore níveis de estoque
                </p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{lowStockCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {displayInventory.reduce((acc: number, item: InventoryItem) => 
                      acc + (item.quantity * item.product.price), 0
                    ).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="Óculos de Sol">Óculos de Sol</SelectItem>
                  <SelectItem value="Armações">Armações</SelectItem>
                  <SelectItem value="Lentes">Lentes</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStock} onValueChange={setFilterStock}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Nível de Estoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Níveis</SelectItem>
                  <SelectItem value="low">Estoque Baixo</SelectItem>
                  <SelectItem value="normal">Estoque Normal</SelectItem>
                  <SelectItem value="high">Estoque Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabela de Inventário */}
          <div className="bg-white rounded-lg shadow">
            <Card>
              <CardHeader>
                <CardTitle>Produtos em Estoque</CardTitle>
                <CardDescription>
                  Lista completa de produtos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item: InventoryItem) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              {item.product.brand && (
                                <div className="text-sm text-gray-500">
                                  {item.product.brand} {item.product.model}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{item.product.category}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{item.quantity}</span>
                              {item.quantity <= item.min_stock && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>R$ {item.product.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                item.quantity <= item.min_stock ? "destructive" :
                                item.quantity >= item.max_stock ? "default" : "secondary"
                              }
                            >
                              {item.quantity <= item.min_stock ? "Baixo" :
                               item.quantity >= item.max_stock ? "Alto" : "Normal"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
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