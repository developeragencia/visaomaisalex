import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { VisaoLogo } from "@/components/logo";
import { CheckCircle, Users, Target, TrendingUp, Award, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function FranchiseOpportunity() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    investment: "",
    experience: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solicitação enviada com sucesso!",
      description: "Nossa equipe entrará em contato em breve."
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      investment: "",
      experience: "",
      message: ""
    });
  };

  const benefits = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Modelo de assinatura validado e escalável",
      description: "Sistema recorrente com alta previsibilidade de faturamento"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Suporte completo na implantação e operação",
      description: "Acompanhamento desde o início até o crescimento do negócio"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Plataforma própria + CRM + app exclusivo",
      description: "Tecnologia de ponta para gestão e atendimento aos clientes"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Fornecedores homologados com alto padrão",
      description: "Produtos de qualidade com preços competitivos"
    }
  ];

  const idealProfile = [
    "Espírito empreendedor",
    "Foco em gestão, vendas e atendimento",
    "Desejo de inovar no mercado óptico"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <VisaoLogo className="h-12" />
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Falar com especialista
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-lg px-6 py-2">
              Seja um Franqueado Visão+
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Leve o plano de assinatura visual mais{" "}
              <span className="bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                inovador do Brasil
              </span>{" "}
              para a sua cidade
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              O Visão+ é mais do que uma ótica — é um modelo de negócios recorrente, 
              acessível e com alto valor percebido pelo cliente. Nossa franquia foi 
              desenhada para empreendedores que buscam resultado, impacto social e crescimento acelerado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-lg px-8 py-4">
                <ArrowRight className="h-5 w-5 mr-2" />
                Quero ser um Franqueado Visão+
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Ver apresentação completa
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ao se tornar um franqueado, você terá acesso a:
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-3 bg-gradient-to-r from-purple-100 to-orange-100 rounded-lg text-purple-600">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <CheckCircle className="h-6 w-6 inline mr-2 text-green-500" />
                  Treinamento contínuo
                </h3>
                <p className="text-gray-600">
                  Para você e sua equipe, garantindo excelência no atendimento e resultados consistentes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <CheckCircle className="h-6 w-6 inline mr-2 text-green-500" />
                  Marketing e funis prontos
                </h3>
                <p className="text-gray-600">
                  Estratégias comprovadas para captação de assinantes e crescimento acelerado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ideal Profile Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
              Perfil ideal do franqueado
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {idealProfile.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                >
                  <CheckCircle className="h-8 w-8 mx-auto mb-4 text-white" />
                  <p className="text-lg font-medium">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-red-500 text-white">
              Vagas limitadas por região
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Preencha o formulário e receba a apresentação completa
            </h2>
            <p className="text-xl text-gray-600">
              Nossa equipe entrará em contato para apresentar todos os detalhes da franquia Visão+
            </p>
          </motion.div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Quero ser um Franqueado Visão+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade de interesse *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="investment">Capacidade de investimento</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.investment}
                      onChange={(e) => setFormData(prev => ({ ...prev, investment: e.target.value }))}
                    >
                      <option value="">Selecione</option>
                      <option value="50-100k">R$ 50.000 - R$ 100.000</option>
                      <option value="100-200k">R$ 100.000 - R$ 200.000</option>
                      <option value="200k+">Acima de R$ 200.000</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Experiência no setor</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    >
                      <option value="">Selecione</option>
                      <option value="nenhuma">Nenhuma experiência</option>
                      <option value="pouca">Pouca experiência</option>
                      <option value="experiente">Experiente no setor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Conte-nos mais sobre seu interesse</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-lg py-6"
                >
                  Quero receber a apresentação completa
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <VisaoLogo className="h-10 mb-4" />
              <p className="text-gray-300">
                Transformando o cuidado visual através da inovação e tecnologia.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(54) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>franquias@visaomais.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Serra Gaúcha, RS</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Franquias</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Modelo de negócio</li>
                <li>Investimento</li>
                <li>Suporte</li>
                <li>Territórios disponíveis</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Visão+. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}