import React from "react";

// Componente vazio para evitar erros
export function OnboardingTour() {
  // Retorna null para não renderizar nada
  return null;
  
  // Passos do tour
  const steps = [
    {
      title: "Bem-vindo ao Visão+",
      description: "Este tour rápido vai ajudar você a conhecer as principais funcionalidades do sistema. Você pode interrompê-lo a qualquer momento.",
    },
    {
      title: "Menu de navegação",
      description: "No menu lateral você encontra acesso a todas as funcionalidades do sistema Visão+.",
    },
    {
      title: "Recomendações de saúde",
      description: "Aqui você encontra recomendações personalizadas para cuidar da sua saúde ocular.",
    },
    {
      title: "Agendamento de consultas",
      description: "Você pode agendar consultas e acompanhar seus agendamentos através do painel.",
    }
  ];
  
  // Filtra os passos relevantes para o tipo de usuário
  const filteredSteps = userType === 'client' 
    ? steps 
    : steps.slice(0, 2);
  
  const completeTour = () => {
    localStorage.setItem("tourCompleted", "true");
    setShowTour(false);
  };
  
  const nextStep = () => {
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  if (!showTour) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md mx-4"
        >
          <Card className="p-5 shadow-lg border-2 border-primary/20">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-primary">
                {filteredSteps[currentStep].title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={completeTour}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-gray-600 mb-6">{filteredSteps[currentStep].description}</p>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">
                  {currentStep + 1} de {filteredSteps.length}
                </span>
              </div>
              
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    className="h-9 px-3"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                )}
                
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="h-9 px-3 bg-primary hover:bg-primary/90"
                >
                  {currentStep < filteredSteps.length - 1 ? (
                    <>
                      Próximo
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Concluir"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}