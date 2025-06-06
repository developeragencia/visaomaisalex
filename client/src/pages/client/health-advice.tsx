import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { 
  Eye, 
  Sun, 
  Moon, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Heart,
  Lightbulb,
  Activity,
  Calendar
} from "lucide-react";

export default function HealthAdvice() {
  const { user } = useAuth();

  const healthTips = [
    {
      category: "Proteção Solar",
      icon: Sun,
      color: "bg-orange-500",
      tips: [
        "Use óculos de sol com proteção UV 400",
        "Prefira lentes com filtro para luz azul",
        "Evite exposição solar direta entre 10h-16h",
        "Use chapéus de aba larga em dias ensolarados"
      ]
    },
    {
      category: "Ergonomia Visual",
      icon: Eye,
      color: "bg-blue-500",
      tips: [
        "Mantenha distância de 50-70cm da tela",
        "Ajuste brilho da tela conforme ambiente",
        "Posicione monitor ligeiramente abaixo dos olhos",
        "Use iluminação adequada no ambiente"
      ]
    },
    {
      category: "Pausas e Exercícios",
      icon: Clock,
      color: "bg-green-500",
      tips: [
        "Regra 20-20-20: a cada 20min, olhe 20seg para 6m",
        "Pisque conscientemente para hidratar os olhos",
        "Faça exercícios de foco: perto e longe",
        "Descanse 15min a cada 2h de tela"
      ]
    },
    {
      category: "Alimentação",
      icon: Heart,
      color: "bg-red-500",
      tips: [
        "Consuma alimentos ricos em ômega-3",
        "Inclua vegetais verde-escuros na dieta",
        "Beba bastante água para hidratação",
        "Vitaminas A, C e E são essenciais"
      ]
    }
  ];

  const personalizedAdvice = [
    {
      priority: "alta",
      title: "Consulta de Rotina",
      description: "Agende sua consulta anual para acompanhamento preventivo",
      action: "Agendar Consulta",
      icon: Calendar
    },
    {
      priority: "média",
      title: "Atualização de Grau",
      description: "Suas últimas medições indicam possível mudança no grau",
      action: "Nova Medição",
      icon: Activity
    },
    {
      priority: "baixa",
      title: "Dicas Personalizadas",
      description: "Recomendações baseadas no seu histórico de uso",
      action: "Ver Detalhes",
      icon: Lightbulb
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="client" />
      <div className="flex-1 overflow-hidden md:ml-0">
        <div className="p-6 pt-20 md:pt-6 pb-20 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Conselhos de Saúde Ocular
                </h1>
                <Badge className="bg-green-100 text-green-800">
                  Personalizado
                </Badge>
              </div>
              <p className="text-gray-600">
                Dicas e recomendações para manter sua visão saudável
              </p>
            </div>

            {/* Recomendações Personalizadas */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recomendações para Você</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {personalizedAdvice.map((advice, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <advice.icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{advice.title}</CardTitle>
                        </div>
                        <Badge 
                          variant={advice.priority === 'alta' ? 'destructive' : 
                                 advice.priority === 'média' ? 'default' : 'secondary'}
                        >
                          {advice.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{advice.description}</p>
                      <Button size="sm" className="w-full">
                        {advice.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Dicas de Saúde */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Dicas Essenciais</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {healthTips.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color} text-white`}>
                          <category.icon className="h-5 w-5" />
                        </div>
                        <CardTitle>{category.category}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Alertas Importantes */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-orange-800">Sinais de Alerta</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-800">Procure ajuda imediata se:</h4>
                    <ul className="space-y-1 text-sm text-orange-700">
                      <li>• Perda súbita de visão</li>
                      <li>• Dor intensa nos olhos</li>
                      <li>• Flashes de luz frequentes</li>
                      <li>• Moscas volantes excessivas</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-800">Agende consulta se:</h4>
                    <ul className="space-y-1 text-sm text-orange-700">
                      <li>• Visão embaçada persistente</li>
                      <li>• Dores de cabeça frequentes</li>
                      <li>• Olhos secos constantemente</li>
                      <li>• Dificuldade para enxergar à noite</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}