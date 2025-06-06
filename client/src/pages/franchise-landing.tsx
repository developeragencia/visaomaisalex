import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Star,
  Building2,
  Target
} from "lucide-react";
// Logo substituído por texto

export default function FranchiseLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800">
      {/* Header */}
      <header className="bg-purple-900/50 backdrop-blur-sm border-b border-purple-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo-horizontal-light.png" 
                alt="Visão+ Logo" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/franchise/register">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-200 rounded-full text-sm font-medium mb-6">
              🚀 Oportunidade Exclusiva
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Seja um
              <span className="block text-orange-400">
                Franqueado Visão+
              </span>
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
              O primeiro sistema de ótica com Inteligência Artificial do Brasil. 
              Revolucione o mercado na sua cidade com tecnologia de ponta.
            </p>
          </div>
          
          <Link href="/franchise/register">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Quero Ser Franqueado
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">180M+</div>
              <div className="text-purple-300">Brasileiros precisam de óculos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">35%</div>
              <div className="text-purple-300">ROI no primeiro ano</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">99.8%</div>
              <div className="text-purple-300">Precisão da IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-purple-800/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por que escolher a Visão+?
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Mais que uma franquia, uma oportunidade de transformar vidas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-orange-500/20 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-orange-400" />
                </div>
                <CardTitle className="text-white">Tecnologia IA</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-200 text-sm">
                  Medição óptica por selfie em 30 segundos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <CardTitle className="text-white">Alto Retorno</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-200 text-sm">
                  ROI comprovado de 35% no primeiro ano
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Suporte Total</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-200 text-sm">
                  Treinamento e suporte 24/7
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-500/20 rounded-full w-fit">
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-white">Marca Forte</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-200 text-sm">
                  95% de satisfação dos clientes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Requisitos para ser franqueado
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-orange-500/20 rounded-full w-fit">
                <Building2 className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Localização</h3>
              <p className="text-purple-200">
                Ponto comercial de 80m² a 120m² em área movimentada
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-green-500/20 rounded-full w-fit">
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Investimento</h3>
              <p className="text-purple-200">
                Capital de R$ 150.000 a R$ 250.000
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-blue-500/20 rounded-full w-fit">
                <Target className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Perfil</h3>
              <p className="text-purple-200">
                Experiência em gestão ou vontade de empreender
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="py-20 bg-purple-800/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Diferenciais Exclusivos
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                Tecnologia que coloca você à frente da concorrência
              </p>
              
              <div className="space-y-4">
                {[
                  "Medição óptica com IA - única no Brasil",
                  "App exclusivo para clientes",
                  "Sistema de gestão integrado",
                  "Marketing digital personalizado",
                  "Produtos premium importados",
                  "Treinamento contínuo"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-purple-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-6">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    IA Revolucionária
                  </h3>
                  <p className="text-purple-200 mb-6">
                    Primeiro sistema no Brasil a usar IA para medições ópticas precisas através de selfies
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-400">30s</div>
                      <div className="text-sm text-purple-300">Medição completa</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">99.8%</div>
                      <div className="text-sm text-purple-300">Precisão</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para transformar vidas?
            </h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Cadastre-se agora e receba nossa apresentação completa com todas as informações sobre investimento e retorno.
            </p>
            
            <Link href="/franchise/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all"
              >
                <Shield className="h-5 w-5 mr-2" />
                Cadastro Gratuito
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>

            <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center space-x-2 text-purple-200">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Sem compromisso</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-200">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Resposta em 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900/50 border-t border-purple-700/50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img 
                src="/logo-horizontal-light.png" 
                alt="Visão+ Logo" 
                className="h-8 w-auto mb-4"
              />
              <p className="text-purple-200 text-sm">
                Revolucionando o mercado óptico brasileiro com tecnologia e inovação.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-purple-200 text-sm">
                <p>📞 (11) 4000-0000</p>
                <p>✉️ franquias@visaomais.com</p>
                <p>📍 São Paulo, SP</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Horário</h4>
              <div className="text-purple-200 text-sm space-y-1">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 12h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-purple-300 text-sm">
              © 2024 Visão+. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}