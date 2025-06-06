import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Phone, Globe, AlertCircle } from "lucide-react";
// Logo substituído por texto

export function InfoPage() {
  // Remover toda a lógica de verificação de domínio
  // A página será mostrada apenas quando chamada pelo App.tsx

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full mx-auto"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <img 
                src="/logo-horizontal.png"
                alt="Visão+ Logo" 
                className="h-12 sm:h-16 mx-auto mb-3 sm:mb-4 max-w-full"
              />
            </motion.div>

            {/* Ícone de Aviso */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-4 sm:mb-6"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
              </div>
            </motion.div>

            {/* Título Principal */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight"
            >
              Site em Desenvolvimento
            </motion.h1>

            {/* Mensagem Principal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mb-6 sm:mb-8 px-2"
            >
              <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Site aguardando proprietário para finalização do projeto!
              </p>
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                Em caso de dúvida entre em contato com o Desenvolvedor
              </p>
            </motion.div>

            {/* Informações do Desenvolvedor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 mx-2 sm:mx-0"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Alex Developer
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-gray-600 flex-wrap">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base break-all">alexdesenvolvedor.com.br</span>
                </div>
                
                <Button
                  onClick={() => window.open('https://alexdesenvolvedor.com.br', '_blank')}
                  className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  Visitar Site do Desenvolvedor
                </Button>
              </div>
            </motion.div>

            {/* Rodapé */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-xs sm:text-sm text-gray-400 border-t pt-4 sm:pt-6 mx-2 sm:mx-0"
            >
              <p className="leading-relaxed">© 2025 Visão+ - Todos os direitos reservados</p>
              <p className="mt-1 leading-relaxed">Desenvolvido por Alex Developer</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}