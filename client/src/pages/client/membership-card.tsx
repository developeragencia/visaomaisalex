import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CreditCard, Download, Share2, QrCode, CalendarClock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
// Logo substituído por texto

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// Mock data
const membershipData = {
  id: "VIS-1234567",
  name: "Maria Silva",
  cpf: "123.456.789-00",
  plan: "Visão+ Premium",
  validUntil: new Date(2023, 11, 31),
  status: "active",
  since: new Date(2020, 5, 15),
  benefits: [
    { name: "Consultas Oftalmológicas", limit: "Ilimitadas", used: 3 },
    { name: "Medições Ópticas", limit: "12/ano", used: 5 },
    { name: "Testes de Acuidade", limit: "4/ano", used: 1 },
    { name: "Desconto em Armações", limit: "40%", used: null },
    { name: "Desconto em Lentes", limit: "30%", used: null }
  ],
  nextPayment: new Date(2023, 6, 15),
  price: 89.90
};

export default function MembershipCard() {
  const { user } = useAuth();
  const [cardRotated, setCardRotated] = useState(false);
  
  const cardFrontStyles = `
    bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl 
    p-6 shadow-lg relative overflow-hidden h-60 cursor-pointer transition-all transform
    ${cardRotated ? "scale-0 absolute inset-0" : "scale-100"}
  `;
  
  const cardBackStyles = `
    bg-white text-primary border-2 border-primary rounded-xl 
    p-6 shadow-lg relative overflow-hidden h-60 cursor-pointer transition-all transform
    ${cardRotated ? "scale-100" : "scale-0 absolute inset-0"}
  `;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar userType="client" />
        
        {/* Main Content */}
        <motion.div 
          className="flex-1 overflow-y-auto p-4 md:p-6 pb-16 md:pb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="container mx-auto max-w-4xl">
            <motion.div variants={itemVariants}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold">Cartão de Membro</h1>
                  <p className="text-gray-500">Acesse todos os benefícios do seu plano Visão+</p>
                </div>
                
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button variant="outline" className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>
              
              {/* Status do plano */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CheckCircle className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Plano {membershipData.plan}</p>
                    <p className="text-sm text-gray-500">
                      Cliente desde {format(membershipData.since, "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <Badge className={`${
                  membershipData.status === "active" ? "bg-green-500" : "bg-yellow-500"
                } text-white`}>
                  {membershipData.status === "active" ? "Ativo" : "Pendente"}
                </Badge>
              </div>
            </motion.div>
            
            {/* Card de membro (frente e verso) */}
            <motion.div 
              variants={itemVariants}
              className="max-w-md mx-auto mb-8 perspective"
            >
              <div className="relative">
                {/* Frente do cartão */}
                <div 
                  className={cardFrontStyles}
                  onClick={() => setCardRotated(true)}
                >
                  {/* Elementos circulares decorativos */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full -ml-8 -mb-8"></div>
                  
                  <div className="relative">
                    {/* Logo */}
                    <div className="flex justify-between items-start">
                      <div className="mb-6">
                        <div className="h-10 flex items-center">
                          <div className="text-white text-xl font-bold">Visão+</div>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-secondary text-white">PREMIUM</Badge>
                      </div>
                    </div>
                    
                    {/* Informações do titular */}
                    <div className="mb-2">
                      <p className="text-xs text-white/70">MEMBRO</p>
                      <p className="text-xl font-bold">{membershipData.name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/70">ID</p>
                        <p className="font-medium">{membershipData.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70">VALIDADE</p>
                        <p className="font-medium">
                          {format(membershipData.validUntil, "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-white/70 italic">
                      Clique para ver detalhes
                    </div>
                  </div>
                </div>
                
                {/* Verso do cartão */}
                <div 
                  className={cardBackStyles}
                  onClick={() => setCardRotated(false)}
                >
                  <div className="relative h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-primary/70">ID MEMBRO</p>
                      <Badge variant="outline" className="border-primary text-primary">
                        Clique para virar
                      </Badge>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      {/* QR Code (mockado) */}
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-md flex items-center justify-center mb-1">
                          <QrCode className="h-24 w-24 text-primary/80" />
                        </div>
                        <p className="text-xs text-primary/70">
                          Escaneie para verificar
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center text-xs text-primary/60 mt-auto">
                      Este cartão é pessoal e intransferível.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Informações do plano */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Benefícios do Plano</h3>
                  
                  <div className="space-y-4">
                    {membershipData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium">{benefit.name}</p>
                          <p className="text-sm text-gray-500">
                            Limite: {benefit.limit}
                          </p>
                        </div>
                        
                        {benefit.used !== null ? (
                          <Badge variant="outline" className="whitespace-nowrap bg-gray-50">
                            {benefit.used} utilizado(s)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="whitespace-nowrap border-secondary text-secondary">
                            Benefício ativo
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">Próximo pagamento</span>
                      </div>
                      <span className="font-medium">
                        {format(membershipData.nextPayment, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Valor mensal</span>
                      <span className="font-medium text-lg">
                        R$ {membershipData.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start mt-5 bg-blue-50 p-3 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      Apresente seu cartão digital ou ID de membro ao realizar consultas ou adquirir produtos com desconto em nossas unidades.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Histórico de uso (expandido) */}
            <motion.div variants={itemVariants} className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Histórico e Limite de Uso</h3>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Consultas Oftalmológicas</h4>
                    <span className="text-sm text-gray-600">Ilimitadas</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <UsageItem 
                    date="12/06/2023" 
                    location="Visão+ Centro" 
                    desc="Consulta de rotina" 
                    doctor="Dra. Ana Silva" 
                  />
                  <UsageItem 
                    date="23/03/2023" 
                    location="Visão+ Zona Sul" 
                    desc="Consulta de acompanhamento" 
                    doctor="Dr. Carlos Mendes" 
                  />
                  <UsageItem 
                    date="05/01/2023" 
                    location="Visão+ Centro" 
                    desc="Consulta de emergência" 
                    doctor="Dra. Ana Silva" 
                  />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <Button className="bg-primary hover:bg-primary-dark">
                  Ver histórico completo
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav activeItem="card" />
    </div>
  );
}

// Componente para item de histórico de uso
function UsageItem({ date, location, desc, doctor }: { date: string; location: string; desc: string; doctor: string }) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mr-3">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{desc}</p>
          <p className="text-sm text-gray-500">
            {doctor} • {location}
          </p>
        </div>
      </div>
      <div className="text-sm text-gray-500">{date}</div>
    </div>
  );
}