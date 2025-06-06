import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Eye, 
  Shield, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Heart, 
  Target, 
  TrendingUp, 
  Zap,
  Building2,
  Phone,
  Mail,
  MapPin,
  Award,
  BarChart3,
  Smartphone,
  Menu,
  X,
  Home,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  User,
  CreditCard,
  Camera,
  Scan
} from "lucide-react";

// Import logos
import logoHorizontal from '/logo-horizontal.png';
import logoHorizontalLight from '/logo-horizontal-light.png';
import logoIcon from '/logo-icon.png';

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setLocation('/auth');
  };

  const handleFranchisee = () => {
    setLocation('/franchise');
  };

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: "Início", href: "/" },
    { icon: <User className="h-5 w-5" />, label: "Minha Conta", href: "/dashboard" },
    { icon: <Calendar className="h-5 w-5" />, label: "Agendamentos", href: "/appointments" },
    { icon: <Eye className="h-5 w-5" />, label: "Exames", href: "/exams" },
    { icon: <Camera className="h-5 w-5" />, label: "Medições", href: "/measurements" },
    { icon: <CreditCard className="h-5 w-5" />, label: "Planos", href: "/plans" },
    { icon: <Building2 className="h-5 w-5" />, label: "Franquias", href: "/franchise" },
    { icon: <FileText className="h-5 w-5" />, label: "Relatórios", href: "/reports" },
    { icon: <Settings className="h-5 w-5" />, label: "Configurações", href: "/settings" },
    { icon: <HelpCircle className="h-5 w-5" />, label: "Suporte", href: "/support" }
  ];

  const testimonials = [
    {
      text: "Assinei achando que era só mais uma promoção, mas fui surpreendido com o cuidado no atendimento e na escolha das lentes. Já indiquei para minha família inteira!",
      author: "Carla M.",
      location: "Gramado"
    },
    {
      text: "Meu filho usa óculos e o plano me deu tranquilidade. Já trocamos as lentes sem custo. Vale cada centavo.",
      author: "Marcos P.",
      location: "Canela"
    },
    {
      text: "Nunca fui de ir ao oftalmo todo ano. Agora faço o exame e troco meu óculos com qualidade. E tudo por R$49. É surreal.",
      author: "Denise A.",
      location: "cliente Visão+ desde o lançamento"
    }
  ];

  const faqItems = [
    {
      question: "O que está incluso no plano Visão+?",
      answer: "Exame de vista completo 1x por ano, armação + lentes, troca de lentes (caso mude o grau) e garantia estendida."
    },
    {
      question: "Quanto custa o plano?",
      answer: "A partir de R$49/mês. Simples, sem taxas escondidas."
    },
    {
      question: "Posso cancelar quando quiser?",
      answer: "Sim. Você pode cancelar a qualquer momento sem multa."
    },
    {
      question: "Como faço o agendamento?",
      answer: "Pelo WhatsApp ou pelo nosso app (em breve!). Você escolhe a melhor data."
    },
    {
      question: "E se eu não usar no mês? Perco o benefício?",
      answer: "Não. O plano é anual e garante todos os benefícios, mesmo que você não use todo mês."
    }
  ];

  const features = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Exames Completos",
      description: "Avaliação visual completa com tecnologia de ponta"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Garantia Estendida",
      description: "Proteção total para seus óculos e lentes"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Para Toda Família",
      description: "Planos que atendem todas as idades"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Atendimento Premium",
      description: "Suporte especializado quando você precisar"
    }
  ];

  const stats = [
    { number: "15+", label: "Anos de Experiência" },
    { number: "50K+", label: "Clientes Atendidos" },
    { number: "200+", label: "Cidades" },
    { number: "24/7", label: "Suporte Disponível" }
  ];

  const franchiseBenefits = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Modelo validado e escalável",
      description: "Sistema comprovado de receita recorrente"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Suporte completo",
      description: "Acompanhamento desde o primeiro dia"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Tecnologia integrada",
      description: "Plataforma própria + CRM + app exclusivo"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Treinamento contínuo",
      description: "Capacitação permanente da equipe"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <motion.div 
        className={`fixed top-0 left-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
        animate={{ x: isMenuOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 flex items-center">
              <img 
                src={logoHorizontalLight} 
                alt="Visão+" 
                className="h-8 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* User Profile Section */}
          <div className="bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-xl p-4 mb-6 border border-orange-400/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Bem-vindo!</p>
                <p className="text-orange-300 text-sm">Faça login para continuar</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-1 flex-1">
            <div className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
              Menu Principal
            </div>
            
            {menuItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-orange-500/20 hover:text-orange-400 transition-colors h-12 rounded-xl"
                  onClick={() => {
                    setLocation(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-3">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Button>
              </motion.div>
            ))}
            
            <div className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3 pt-4">
              Serviços
            </div>
            
            {menuItems.slice(4, 7).map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: (index + 4) * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-orange-500/20 hover:text-orange-400 transition-colors h-12 rounded-xl"
                  onClick={() => {
                    setLocation(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-3">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Button>
              </motion.div>
            ))}
            
            <div className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3 pt-4">
              Sistema
            </div>
            
            {menuItems.slice(7).map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: (index + 7) * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-orange-500/20 hover:text-orange-400 transition-colors h-12 rounded-xl"
                  onClick={() => {
                    setLocation(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-3">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </nav>
          
          {/* Footer Section */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-2">Versão 2.0.1</p>
              <p className="text-gray-500 text-xs">© 2025 Visão+ Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Mobile Menu Button - Only visible on mobile */}
              <motion.button
                className="mr-4 p-2 text-white hover:bg-orange-500/20 hover:text-orange-400 rounded-lg transition-colors border border-white/20 hover:border-orange-400/50 lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="h-8 flex items-center">
                  <img 
                    src={logoHorizontalLight} 
                    alt="Visão+" 
                    className="h-8 w-auto"
                  />
                </div>
              </motion.div>
            </div>

            {/* Desktop Navigation - Only visible on desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <motion.a
                href="#inicio"
                className="text-white hover:text-orange-400 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Início
              </motion.a>
              <motion.a
                href="#sobre"
                className="text-white hover:text-orange-400 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Sobre
              </motion.a>
              <motion.a
                href="#servicos"
                className="text-white hover:text-orange-400 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Serviços
              </motion.a>
              <motion.a
                href="#planos"
                className="text-white hover:text-orange-400 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Planos
              </motion.a>
              <motion.a
                href="#depoimentos"
                className="text-white hover:text-orange-400 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Depoimentos
              </motion.a>
              <motion.button
                className="text-white hover:text-orange-400 transition-colors font-medium"
                onClick={handleFranchisee}
                whileHover={{ scale: 1.05 }}
              >
                Franquias
              </motion.button>
            </nav>
            
            <motion.div
              className="flex items-center space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Button 
                variant="outline" 
                className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                onClick={handleGetStarted}
              >
                Entrar
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold mb-8 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">Cuidado visual</span>{" "}
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  por assinatura
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Exame, óculos e acompanhamento incluídos por <strong className="text-orange-400">R$49/mês</strong>. 
                Sem surpresas, sem burocracia.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
                  onClick={handleGetStarted}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Começar meu plano visual
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-8 py-4 text-lg"
                  onClick={handleFranchisee}
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Seja franqueado
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Phone Mockup with Optical Measurement */}
              <div className="relative max-w-sm mx-auto">
                {/* Phone Frame */}
                <motion.div 
                  className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Phone Screen */}
                  <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 rounded-[2.5rem] p-6 h-[600px] relative overflow-hidden">
                    
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-white text-sm mb-6">
                      <span>09:49</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-1 h-3 bg-white rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <div className="text-primary text-sm font-bold">V+</div>
                        </div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">
                        Medição Óptica
                      </h3>
                      <p className="text-orange-300 text-sm">
                        Análise com IA
                      </p>
                    </div>

                    {/* Face Detection Animation */}
                    <div className="relative mb-6">
                      <motion.div 
                        className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border-2 border-orange-400 relative"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {/* Face outline */}
                        <motion.div 
                          className="absolute inset-4 border-2 border-orange-300 rounded-full"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        
                        {/* Eye markers */}
                        <motion.div 
                          className="absolute top-16 left-12 w-3 h-3 bg-orange-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div 
                          className="absolute top-16 right-12 w-3 h-3 bg-orange-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                        
                        {/* Scanning lines */}
                        <motion.div 
                          className="absolute inset-0 border-l-2 border-orange-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                      
                      {/* Scan indicator */}
                      <motion.div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center space-x-2"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Scan className="h-5 w-5 text-orange-400" />
                        <span className="text-white text-sm">Analisando...</span>
                      </motion.div>
                    </div>

                    {/* Measurement Data */}
                    <div className="space-y-3">
                      {[
                        { label: "Distância Pupilar", value: "62mm", color: "text-green-400" },
                        { label: "Altura Seg.", value: "18mm", color: "text-blue-400" },
                        { label: "Precisão", value: "98.5%", color: "text-orange-400" }
                      ].map((item, index) => (
                        <motion.div 
                          key={index}
                          className="flex justify-between items-center bg-white/10 rounded-lg p-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                        >
                          <span className="text-white text-sm">{item.label}</span>
                          <span className={`font-bold ${item.color}`}>{item.value}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl mt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{ boxShadow: ["0 0 0 0 rgba(251, 146, 60, 0.4)", "0 0 0 10px rgba(251, 146, 60, 0)", "0 0 0 0 rgba(251, 146, 60, 0)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Salvar Medição
                    </motion.button>
                  </div>
                  
                  {/* Phone highlights */}
                  <motion.div 
                    className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                {/* Floating elements around phone */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Eye className="h-6 w-6 text-orange-400" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center"
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <Camera className="h-6 w-6 text-purple-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicos" className="py-20 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher o Visão+?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Democratizando o acesso à saúde visual com tecnologia e cuidado humano
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Nossos Planos
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades e comece a cuidar da sua visão hoje mesmo
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Básico",
                price: "R$ 39",
                period: "/mês",
                description: "Ideal para começar os cuidados visuais",
                features: [
                  "1 exame de vista por ano",
                  "Armação básica incluída",
                  "Lentes simples",
                  "Suporte por WhatsApp",
                  "Agendamento online"
                ],
                popular: false,
                color: "from-gray-500/20 to-gray-600/20",
                borderColor: "border-gray-400"
              },
              {
                name: "Premium",
                price: "R$ 69",
                period: "/mês",
                description: "Nosso plano mais completo",
                features: [
                  "2 exames de vista por ano",
                  "Armação premium incluída",
                  "Lentes anti-reflexo",
                  "Troca de lentes ilimitada",
                  "Suporte 24/7",
                  "App exclusivo"
                ],
                popular: true,
                color: "from-orange-500/20 to-purple-600/20",
                borderColor: "border-orange-400"
              },
              {
                name: "Família",
                price: "R$ 149",
                period: "/mês",
                description: "Para toda a família",
                features: [
                  "Até 4 pessoas incluídas",
                  "Exames ilimitados",
                  "Armações premium",
                  "Lentes especiais",
                  "Consultas domiciliares",
                  "Prioridade no atendimento"
                ],
                popular: false,
                color: "from-purple-500/20 to-blue-600/20",
                borderColor: "border-purple-400"
              }
            ].map((plan, index) => (
              <motion.div 
                key={index}
                className={`relative bg-gradient-to-br ${plan.color} backdrop-blur-lg rounded-3xl p-8 border ${plan.popular ? 'border-orange-400 ring-2 ring-orange-400/50' : plan.borderColor}`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </motion.div>
                )}
                
                <div className="text-center mb-8 pt-4">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-6 ${plan.popular ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'} rounded-full flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="text-primary text-xs font-bold">V+</div>
                    </div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Visão+ {plan.name}
                  </h3>
                  
                  <div className={`text-4xl font-bold ${plan.popular ? 'text-orange-400' : 'text-gray-300'} mb-2`}>
                    {plan.price}<span className="text-lg text-gray-400">{plan.period}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    {plan.description}
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {plan.features.map((benefit, benefitIndex) => (
                    <motion.div 
                      key={benefitIndex}
                      className="flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 + benefitIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className={`h-5 w-5 ${plan.popular ? 'text-orange-400' : 'text-gray-400'} mr-3 flex-shrink-0`} />
                      <span className="text-white text-sm">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className={`w-full py-4 text-lg font-semibold rounded-xl ${
                      plan.popular 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                    }`}
                    onClick={handleGetStarted}
                  >
                    Escolher {plan.name}
                  </Button>
                </motion.div>

                {/* Highlight Features for Popular Plan */}
                {plan.popular && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-orange-400 font-bold text-sm">Sem</div>
                        <div className="text-white text-xs">Taxa</div>
                      </div>
                      <div>
                        <div className="text-orange-400 font-bold text-sm">Sem</div>
                        <div className="text-white text-xs">Fidelidade</div>
                      </div>
                      <div>
                        <div className="text-orange-400 font-bold text-sm">Sem</div>
                        <div className="text-white text-xs">Surpresas</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div 
            className="text-center mt-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-600/10 rounded-2xl p-6 border border-orange-400/30 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 text-center mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Cancele quando quiser</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Sem multa</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Primeira consulta em 48h</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-orange-300 font-bold text-lg">
                  Mais de 50.000 clientes já confiam no Visão+
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Todos os planos incluem garantia de satisfação de 30 dias
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Tudo começou com <strong className="text-orange-400">Jefferson e Eudaziany</strong>, 
                fundadores do Visão+, que sonhavam com algo maior do que uma ótica: 
                um plano visual acessível, recorrente e completo, que combinasse tecnologia e cuidado humano.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Com a ajuda da inteligência artificial e a experiência prática de quem vive o dia a dia 
                do atendimento, nasceu o Visão+: um modelo de assinatura inovador, 
                com exame, óculos e acompanhamento incluídos, sem surpresas, sem burocracia.
              </p>
              
              <div className="bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-2xl p-6 border border-orange-400/30">
                <p className="text-white font-medium text-center italic">
                  "Hoje, o Visão+ é mais do que uma marca: é um movimento. 
                  E você também pode fazer parte dele."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Nossa Missão
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Proporcionar acesso facilitado à saúde visual de qualidade por meio de um modelo 
                    inovador de assinatura, democratizando o cuidado com os olhos e promovendo 
                    bem-estar para todas as classes sociais.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Nossa Visão
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Ser reconhecida nacionalmente como a maior e melhor rede de soluções em saúde 
                    visual por assinatura, revolucionando o mercado óptico com inovação, 
                    acessibilidade e excelência no atendimento.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div 
            className="mt-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white text-center mb-12">
              Nossos Valores
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { icon: <Shield className="h-6 w-6" />, title: "Acessibilidade", desc: "Cuidado visual para todos" },
                { icon: <Zap className="h-6 w-6" />, title: "Inovação", desc: "Transformando o mercado" },
                { icon: <CheckCircle className="h-6 w-6" />, title: "Transparência", desc: "Clareza em tudo" },
                { icon: <Star className="h-6 w-6" />, title: "Excelência", desc: "Qualidade premium" },
                { icon: <Heart className="h-6 w-6" />, title: "Cuidado", desc: "Foco na saúde visual" }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-300">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              O que dizem nossos clientes
            </h2>
            <p className="text-xl text-gray-300">
              Depoimentos reais de quem já faz parte da família Visão+
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-orange-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white/5 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-300">
              Tire suas dúvidas sobre o plano de assinatura Visão+
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Seja um Franqueado Visão+
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Leve o plano de assinatura visual mais inovador do Brasil para a sua cidade
            </p>
            <p className="text-lg text-gray-400 max-w-4xl mx-auto">
              O Visão+ é mais do que uma ótica — é um modelo de negócios recorrente, acessível e com alto valor percebido pelo cliente.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {franchiseBenefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-300 mb-8 text-lg">
              <strong className="text-orange-400">Vagas limitadas por região.</strong> Seja um dos pioneiros na revolução do cuidado visual.
            </p>
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-lg font-semibold"
              onClick={handleFranchisee}
            >
              <Building2 className="mr-2 h-6 w-6" />
              QUERO SER UM FRANQUEADO VISÃO+
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-orange-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold text-white mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Pronto para cuidar da sua visão?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Junte-se a milhares de clientes que confiam no Visão+ para seus cuidados ópticos
          </motion.p>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-xl font-semibold"
              onClick={handleGetStarted}
            >
              Começar Agora
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="h-8 flex items-center mb-4">
                <div className="text-white text-xl font-bold">Visão+</div>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Plataforma completa de cuidados ópticos profissionais com tecnologia avançada.
              </p>
              <div className="flex space-x-4">
                <motion.div 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Phone className="h-5 w-5" />
                </motion.div>
                <motion.div 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="h-5 w-5" />
                </motion.div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Serviços</h3>
              <ul className="space-y-2">
                {["Exames Completos", "Medições Ópticas", "Carteirinha Digital", "Agendamento Online", "Suporte 24/7"].map((service, index) => (
                  <li key={index}>
                    <span className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Empresa</h3>
              <ul className="space-y-2">
                {["Sobre Nós", "Seja Franqueado", "Carreiras", "Imprensa", "Blog"].map((item, index) => (
                  <li key={index}>
                    <span className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2 mb-6">
                {["Central de Ajuda", "Política de Privacidade", "Termos de Uso", "FAQ"].map((item, index) => (
                  <li key={index}>
                    <span className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span className="text-white text-sm font-medium">Matriz</span>
                </div>
                <p className="text-gray-400 text-sm">São Paulo, SP<br />Brasil</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Visão+. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-sm">Site Seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Certificado</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}