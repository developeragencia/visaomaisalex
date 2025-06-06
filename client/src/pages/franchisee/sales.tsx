import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  Calendar,
  User,
  Package,
  Eye,
  Edit,
  Trash2,
  Receipt
} from "lucide-react";

interface Sale {
  id: number;
  client_name: string;
  client_phone: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_method: string;
  status: string;
  sale_date: string;
  notes?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function FranchiseeSales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar vendas
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['/api/franchisee/sales'],
    queryFn: async () => {
      const response = await fetch('/api/franchisee/sales', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch sales');
      return response.json();
    },
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  // Buscar produtos para venda
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  // Criar nova venda
  const createSaleMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const response = await fetch('/api/franchisee/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      if (!response.ok) throw new Error('Erro ao criar venda');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchisee/sales'] });
      toast({ title: "Venda registrada com sucesso!" });
      setIsNewSaleOpen(false);
    },
    onError: () => {
      toast({ title: "Erro ao registrar venda", variant: "destructive" });
    }
  });

  // Atualizar status da venda
  const updateSaleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/franchisee/sales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Erro ao atualizar venda');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/franchisee/sales'] });
      toast({ title: "Status atualizado com sucesso!" });
    }
  });

  // Filtrar vendas
  const filteredSales = sales.filter((sale: Sale) => {
    const matchesSearch = sale.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculações com proteção contra NaN
  const totalSales = sales.reduce((sum: number, sale: Sale) => {
    const price = sale.total_price || 0;
    return sum + (typeof price === 'number' && !isNaN(price) ? price : 0);
  }, 0);
  
  const todaySales = sales.filter((sale: Sale) => {
    const today = new Date().toDateString();
    const saleDate = new Date(sale.sale_date).toDateString();
    return today === saleDate;
  }).reduce((sum: number, sale: Sale) => {
    const price = sale.total_price || 0;
    return sum + (typeof price === 'number' && !isNaN(price) ? price : 0);
  }, 0);

  const NewSaleForm = () => {
    const [formData, setFormData] = useState({
      client_name: '',
      client_phone: '',
      product_id: '',
      quantity: 1,
      payment_method: '',
      notes: ''
    });

    const selectedProduct = products.find((p: Product) => p.id === parseInt(formData.product_id));
    const totalPrice = selectedProduct ? selectedProduct.price * formData.quantity : 0;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedProduct) return;

      createSaleMutation.mutate({
        ...formData,
        product_name: selectedProduct.name,
        unit_price: selectedProduct.price,
        total_price: totalPrice,
        quantity: parseInt(formData.quantity.toString())
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_name">Nome do Cliente</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({...formData, client_name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="client_phone">Telefone</Label>
            <Input
              id="client_phone"
              value={formData.client_phone}
              onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="product">Produto</Label>
          <Select 
            value={formData.product_id} 
            onValueChange={(value) => setFormData({...formData, product_id: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product: Product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedProduct?.stock || 1}
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              required
            />
          </div>
          <div>
            <Label htmlFor="payment_method">Forma de Pagamento</Label>
            <Select 
              value={formData.payment_method} 
              onValueChange={(value) => setFormData({...formData, payment_method: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="parcelado">Parcelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Observações</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Observações adicionais"
          />
        </div>

        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total da Venda:</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={createSaleMutation.isPending}>
            {createSaleMutation.isPending ? "Registrando..." : "Registrar Venda"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsNewSaleOpen(false)}>
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
      {/* Header com estatísticas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600">Gerencie suas vendas e faturamento</p>
        </div>
        
        <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
              <DialogDescription>
                Registre uma nova venda no sistema
              </DialogDescription>
            </DialogHeader>
            <NewSaleForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {todaySales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {sales.filter((s: Sale) => new Date(s.sale_date).toDateString() === new Date().toDateString()).length} vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {sales.length} vendas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {sales.length > 0 ? (totalSales / sales.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Por venda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Pendentes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales.filter((s: Sale) => s.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando entrega
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por cliente ou produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            {filteredSales.length} vendas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando vendas...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale: Sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.sale_date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sale.client_name}</div>
                        <div className="text-sm text-gray-500">{sale.client_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{sale.product_name}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell className="font-medium">
                      R$ {(sale.total_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {sale.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          sale.status === 'completed' ? 'default' :
                          sale.status === 'pending' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {sale.status === 'completed' ? 'Concluída' :
                         sale.status === 'pending' ? 'Pendente' :
                         'Cancelada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedSale(sale)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {sale.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateSaleStatusMutation.mutate({
                              id: sale.id,
                              status: 'completed'
                            })}
                          >
                            Concluir
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes da venda */}
      {selectedSale && (
        <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Venda #{selectedSale.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="font-medium">{selectedSale.client_name}</p>
                  <p className="text-sm text-gray-500">{selectedSale.client_phone}</p>
                </div>
                <div>
                  <Label>Data da Venda</Label>
                  <p>{new Date(selectedSale.sale_date).toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Produto</Label>
                  <p className="font-medium">{selectedSale.product_name}</p>
                </div>
                <div>
                  <Label>Quantidade</Label>
                  <p>{selectedSale.quantity} unidades</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valor Unitário</Label>
                  <p>R$ {selectedSale.unit_price.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Total</Label>
                  <p className="text-lg font-bold">R$ {selectedSale.total_price.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Forma de Pagamento</Label>
                  <p>{selectedSale.payment_method}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge 
                    variant={
                      selectedSale.status === 'completed' ? 'default' :
                      selectedSale.status === 'pending' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {selectedSale.status}
                  </Badge>
                </div>
              </div>

              {selectedSale.notes && (
                <div>
                  <Label>Observações</Label>
                  <p>{selectedSale.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      </div>
      </div>
      
      {/* Menu Inferior Móvel */}
      <MobileNav activeItem="products" />
    </div>
  );
}