import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Eye, 
  Brain, 
  Calendar, 
  ArrowRight, 
  ArrowUpRight,
  Clock,
  Sun,
  Droplets
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
  action?: {
    label: string;
    href: string;
  };
  category: "eye" | "general" | "lifestyle";
}

// Recomendações personalizadas baseadas no perfil do usuário
// Numa aplicação real, essas recomendações viriam da API com base em histórico do usuário
const recommendations: Recommendation[] = [
  {
    id: "eye-exam",
    title: "Consulta oftalmológica",
    description: "Sua última consulta foi há mais de 6 meses. Agende um novo exame para manter a saúde ocular.",
    icon: <Eye className="h-5 w-5 text-primary" />,
    priority: "high",
    action: {
      label: "Agendar consulta",
      href: "/client/appointments"
    },
    category: "eye"
  },
  {
    id: "dry-eyes",
    title: "Sintomas de olho seco",
    description: "Baseado no seu último exame, você apresenta sintomas de olho seco. Aplicar colírios lubrificantes pode ajudar.",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    priority: "medium",
    action: {
      label: "Ver produtos recomendados",
      href: "/client/products"
    },
    category: "eye"
  },
  {
    id: "screen-time",
    title: "Tempo de exposição à tela",
    description: "Reduzir o tempo de tela e fazer pausas regulares pode melhorar sua saúde visual.",
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    priority: "low",
    category: "lifestyle"
  },
  {
    id: "uv-protection",
    title: "Proteção contra UV",
    description: "Usar óculos com proteção UV é essencial para prevenir danos aos olhos, especialmente no verão.",
    icon: <Sun className="h-5 w-5 text-amber-500" />,
    priority: "medium",
    action: {
      label: "Ver óculos de sol",
      href: "/client/products?category=sunglasses"
    },
    category: "eye"
  },
  {
    id: "hydration",
    title: "Hidratação adequada",
    description: "Beber água suficiente é importante para a saúde dos olhos e produção adequada de lágrimas.",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    priority: "low",
    category: "general"
  },
  {
    id: "nutrition",
    title: "Nutrição para saúde ocular",
    description: "Alimentos ricos em vitaminas A, C, E e ômega-3 podem melhorar sua saúde ocular.",
    icon: <Heart className="h-5 w-5 text-red-500" />,
    priority: "medium",
    category: "general"
  }
];

export function HealthRecommendations() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Garante que o componente está corretamente montado antes de ser acessado pelo tour
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Filtra as recomendações por categoria
  const filteredRecommendations = activeCategory === "all" 
    ? recommendations 
    : recommendations.filter(rec => rec.category === activeCategory);
  
  // Limita as recomendações se não estiver expandido
  const displayRecommendations = expanded 
    ? filteredRecommendations 
    : filteredRecommendations.slice(0, 3);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center">
            <Heart className="h-5 w-5 text-primary mr-2" />
            Recomendações de Saúde
          </CardTitle>
          
          <div className="flex gap-1">
            <Badge 
              variant={activeCategory === "all" ? "default" : "outline"}
              className={`cursor-pointer ${activeCategory === "all" ? "bg-primary" : "hover:bg-primary/10"}`}
              onClick={() => setActiveCategory("all")}
            >
              Todas
            </Badge>
            <Badge 
              variant={activeCategory === "eye" ? "default" : "outline"}
              className={`cursor-pointer ${activeCategory === "eye" ? "bg-primary" : "hover:bg-primary/10"}`}
              onClick={() => setActiveCategory("eye")}
            >
              Visão
            </Badge>
            <Badge 
              variant={activeCategory === "general" ? "default" : "outline"}
              className={`cursor-pointer ${activeCategory === "general" ? "bg-primary" : "hover:bg-primary/10"}`}
              onClick={() => setActiveCategory("general")}
            >
              Geral
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {displayRecommendations.map((rec) => (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 hover:bg-gray-50"
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center 
                  ${rec.priority === "high" ? "bg-red-100" : rec.priority === "medium" ? "bg-amber-100" : "bg-blue-100"}`}
                >
                  {rec.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-0.5 mb-2">{rec.description}</p>
                    </div>
                    
                    <Badge 
                      className={`
                        ${rec.priority === "high" ? "bg-red-500" : 
                          rec.priority === "medium" ? "bg-amber-500" : 
                          "bg-blue-500"} text-white`}
                    >
                      {rec.priority === "high" ? "Importante" : 
                        rec.priority === "medium" ? "Recomendado" : 
                        "Sugestão"}
                    </Badge>
                  </div>
                  
                  {rec.action && (
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto" asChild>
                      <a href={rec.action.href}>
                        {rec.action.label}
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredRecommendations.length > 3 && (
          <div className="p-3 bg-gray-50 text-center">
            <Button 
              variant="outline" 
              onClick={() => setExpanded(!expanded)}
              className="w-full"
            >
              {expanded ? "Ver menos" : `Ver mais ${filteredRecommendations.length - 3} recomendações`}
              <ArrowRight className={`ml-1 h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}