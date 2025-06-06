import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Eye, CreditCard, ArrowRight, Building2, User, UserPlus, Search, Smartphone } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import backgroundImage from "@assets/133.png";

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      const userType = user.user_type || 'client';
      setTimeout(() => {
        if (userType === 'admin') {
          setLocation('/admin/dashboard');
        } else if (userType === 'franchisee') {
          setLocation('/franchisee/dashboard');
        } else {
          setLocation('/client/dashboard');
        }
      }, 100); // Small delay to ensure page loads first
    }
  }, [user, setLocation]);

  const handleGetStarted = () => {
    setLocation('/auth');
  };

  const handleClientLogin = () => {
    setLocation('/auth');
  };

  const handleRegister = () => {
    setLocation('/auth');
  };

  const handleFranchisee = () => {
    setLocation('/franchise');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Better Image Positioning */}
      <div className="absolute inset-0">
        {/* Background Image with Better Positioning */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center 30%',
            filter: 'brightness(0.7) contrast(1.1)',
          }}
        />
        
        {/* Enhanced Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-purple-600/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-purple-800/40"></div>
        
        {/* Enhanced Animated Purple Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-40 h-40 bg-purple-400/25 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-24 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-bounce slow"></div>
          <div className="absolute bottom-24 left-1/4 w-44 h-44 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-purple-400/35 rounded-full blur-2xl animate-bounce delay-500"></div>
          <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-purple-600/25 rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute top-20 right-1/3 w-24 h-24 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Logo at Top with New Brand */}
        <div className="w-full text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <div className="h-20 md:h-28 flex items-center justify-center">
              <img 
                src="/logo-horizontal-light.png" 
                alt="Visão+" 
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-20">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-8 filter drop-shadow-2xl leading-tight"
              >
                Bem-vindo à Visão+
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-100 mb-4 filter drop-shadow-lg max-w-4xl mx-auto leading-relaxed"
              >
                Sua plataforma completa de cuidados ópticos profissionais
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="w-24 h-1 bg-gradient-to-r from-purple-400 to-orange-400 mx-auto rounded-full"
              />
            </div>

            {/* Action Buttons - Horizontal Layout */}
            <div className="space-y-4 mb-20 max-w-4xl mx-auto">
              
              {/* Já sou Cliente */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="w-full"
              >
                <Button
                  onClick={handleClientLogin}
                  className="group relative overflow-hidden w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-blue-400/60 text-white py-6 px-8 h-auto flex items-center justify-between rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(59,130,246,0.3)] hover:bg-white/15"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-500/30 rounded-2xl border border-blue-300/40 group-hover:scale-110 transition-transform duration-300">
                      <User className="h-8 w-8 text-blue-100" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-xl sm:text-2xl text-white tracking-wide">
                        Já sou Cliente
                      </h3>
                      <p className="text-sm text-blue-100/80 mt-1">
                        Acesse sua conta pessoal
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-200 group-hover:translate-x-1 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>
              </motion.div>

              {/* Cadastro */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-full"
              >
                <Button
                  onClick={handleRegister}
                  className="group relative overflow-hidden w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-purple-400/60 text-white py-6 px-8 h-auto flex items-center justify-between rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(168,85,247,0.3)] hover:bg-white/15"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-purple-500/30 rounded-2xl border border-purple-300/40 group-hover:scale-110 transition-transform duration-300">
                      <UserPlus className="h-8 w-8 text-purple-100" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-xl sm:text-2xl text-white tracking-wide">
                        Cadastro
                      </h3>
                      <p className="text-sm text-purple-100/80 mt-1">
                        Criar nova conta
                      </p>
                    </div>
                  </div>
                  <div className="text-purple-200 group-hover:translate-x-1 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>
              </motion.div>

              {/* Seja um Franqueado */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="w-full"
              >
                <Button
                  onClick={handleFranchisee}
                  className="group relative overflow-hidden w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-orange-400/60 text-white py-6 px-8 h-auto flex items-center justify-between rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(249,115,22,0.3)] hover:bg-white/15"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-orange-500/30 rounded-2xl border border-orange-300/40 group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="h-8 w-8 text-orange-100" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-xl sm:text-2xl text-white tracking-wide">
                        Seja um Franqueado
                      </h3>
                      <p className="text-sm text-orange-100/80 mt-1">
                        Portal empresarial
                      </p>
                    </div>
                  </div>
                  <div className="text-orange-200 group-hover:translate-x-1 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>
              </motion.div>

            </div>


          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center py-8"
        >
          <div className="text-white/70 text-sm">
            © {new Date().getFullYear()} Visão+ • Todos os direitos reservados
          </div>
          <div className="text-white/50 text-xs mt-1">
            Tecnologia e inovação em cuidados ópticos
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
