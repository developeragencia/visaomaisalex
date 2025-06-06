import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

// Mock exams data
const exams = [
  { 
    id: 1, 
    type: "Refração", 
    doctor: "Dra. Ana Silva", 
    location: "Visão+ Centro", 
    date: new Date(2023, 4, 15), 
    prescription: true,
    notes: "Leve aumento da miopia no olho direito. Prescrição de lentes atualizadas."
  },
  { 
    id: 2, 
    type: "Fundoscopia", 
    doctor: "Dr. Carlos Mendes", 
    location: "Visão+ Zona Sul", 
    date: new Date(2023, 2, 8), 
    prescription: false,
    notes: "Exame de fundo de olho normal, sem alterações identificadas."
  },
  { 
    id: 3, 
    type: "Tonometria", 
    doctor: "Dra. Ana Silva", 
    location: "Visão+ Centro", 
    date: new Date(2022, 11, 20), 
    prescription: false,
    notes: "Pressão intraocular dentro dos limites normais."
  }
];

export default function Exams() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Filtrar exames
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.doctor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exam.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || exam.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Tipos de exames únicos para o filtro
  const uniqueTypes = Array.from(new Set(exams.map(exam => exam.type)));
  const examTypes = ["all", ...uniqueTypes];

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
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Meus Exames</h1>
                <p className="text-gray-500">Visualize o histórico dos seus exames oftalmológicos</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button className="bg-secondary hover:bg-secondary-dark">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Novo Exame
                </Button>
              </div>
            </div>
            
            {/* Filtros e busca */}
            <motion.div variants={itemVariants} className="mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          placeholder="Buscar por médico ou tipo de exame"
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Select 
                        value={typeFilter} 
                        onValueChange={setTypeFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {examTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === "all" ? "Todos os tipos" : type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Lista de exames */}
            <div className="space-y-4">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <motion.div key={exam.id} variants={itemVariants}>
                    <Card className="overflow-hidden hover:border-primary transition-all duration-200">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div className="flex items-center mb-2 md:mb-0">
                              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4">
                                <FileText className="text-primary" size={20} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{exam.type}</h3>
                                <p className="text-gray-500 text-sm">{exam.doctor} • {exam.location}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Badge className="bg-primary text-white">
                                {format(exam.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{exam.notes}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Eye className="mr-1 h-4 w-4" />
                              Ver Detalhes
                            </Button>
                            
                            {exam.prescription && (
                              <Button variant="outline" size="sm" className="flex items-center text-primary border-primary hover:bg-primary hover:text-white">
                                <Download className="mr-1 h-4 w-4" />
                                Baixar Prescrição
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <FileText className="text-gray-400" size={24} />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Nenhum exame encontrado</h3>
                      {searchTerm || typeFilter !== "all" ? (
                        <p className="text-gray-500 mb-4">Não há exames correspondentes aos filtros aplicados.</p>
                      ) : (
                        <p className="text-gray-500 mb-4">Você ainda não realizou nenhum exame oftalmológico.</p>
                      )}
                      <Button className="bg-secondary hover:bg-secondary-dark">
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar Exame
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav activeItem="home" />
    </div>
  );
}