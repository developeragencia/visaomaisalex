import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingBag,
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Glasses,
  Package
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type Product } from "@shared/schema";

export default function ClientProducts() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  // Buscar produtos reais do banco de dados
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Filtrar produtos
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    const matchesPrice = (() => {
      const price = product.price / 100; // Converter de centavos
      switch (priceRange) {
        case "under100": return price < 100;
        case "100to300": return price >= 100 && price <= 300;
        case "300to500": return price >= 300 && price <= 500;
        case "over500": return price > 500;
        default: return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "frames", label: "Armações" },
    { value: "lenses", label: "Lentes" },
    { value: "sunglasses", label: "Óculos de Sol" },
    { value: "accessories", label: "Acessórios" }
  ];

  const priceRanges = [
    { value: "all", label: "Todos os Preços" },
    { value: "under100", label: "Até R$ 100" },
    { value: "100to300", label: "R$ 100 - R$ 300" },
    { value: "300to500", label: "R$ 300 - R$ 500" },
    { value: "over500", label: "Acima de R$ 500" }
  ];

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    toast({
      title: favorites.includes(productId) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: "Produto atualizado na sua lista de favoritos."
    });
  };

  const addToCart = (product: Product) => {
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`
    });
  };

  const requestQuote = (product: Product) => {
    toast({
      title: "Orçamento solicitado!",
      description: "Entraremos em contato com você em breve."
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userType="client" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Produtos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Explore nossa seleção de óculos, lentes e acessórios
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                {filteredProducts.length} produtos encontrados
              </Badge>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setPriceRange("all");
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Glasses className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Armações</p>
                    <p className="text-lg font-semibold">
                      {products.filter((p: Product) => p.category === 'frames').length}
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
                    <p className="text-sm font-medium text-gray-500">Lentes</p>
                    <p className="text-lg font-semibold">
                      {products.filter((p: Product) => p.category === 'lenses').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Óculos de Sol</p>
                    <p className="text-lg font-semibold">
                      {products.filter((p: Product) => p.category === 'sunglasses').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Acessórios</p>
                    <p className="text-lg font-semibold">
                      {products.filter((p: Product) => p.category === 'accessories').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Produtos */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-0">
                    {/* Imagem do Produto */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Glasses className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay com botões */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={favorites.includes(product.id) ? "default" : "secondary"}
                            onClick={() => toggleFavorite(product.id)}
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>

                      {/* Badge de categoria */}
                      <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800">
                        {categories.find(c => c.value === product.category)?.label || product.category}
                      </Badge>
                    </div>

                    {/* Informações do Produto */}
                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Avaliação (simulada) */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                      </div>

                      {/* Preço */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-green-600">
                            R$ {(product.price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-sm text-gray-500 ml-2 line-through">
                            R$ {((product.price / 100) * 1.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          15% OFF
                        </Badge>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => requestQuote(product)}
                        >
                          Orçamento
                        </Button>
                      </div>

                      {/* Informações adicionais */}
                      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>📦 Frete grátis</span>
                          <span>🔄 Troca em 30 dias</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500 mb-6">
                  Tente ajustar os filtros para encontrar o que procura
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}>
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Seção de Desconto com Plano */}
          {filteredProducts.length > 0 && (
            <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Descontos Exclusivos para Clientes</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Como cliente Visão+, você tem até 20% de desconto em armações e 15% em lentes!
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">até 20%</div>
                    <div className="text-sm text-gray-500">de desconto</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}