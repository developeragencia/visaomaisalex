import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

// Custom hook para gerenciar estado no localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Definição das etapas do tour
interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  highlight?: boolean;
  userType: ("client" | "franchisee" | "admin")[];
}

export function OnboardingTour() {
  const [location] = useLocation();
  const { user, userType } = useAuth();
  const [tourCompleted, setTourCompleted] = useLocalStorage("tourCompleted", false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  
  // Reset para testes (remover em produção)
  useEffect(() => {
    // Permitir resetar o tour com parâmetro URL para testes
    if (typeof window !== 'undefined' && window.location.search.includes('reset-tour')) {
      setTourCompleted(false);
    }
  }, []);

  // Passos do tour para diferentes tipos de usuário e páginas
  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Bem-vindo ao Visão+",
      description: "Este tour rápido vai te ajudar a conhecer as principais funcionalidades do sistema. Você pode interrompê-lo a qualquer momento.",
      target: "body",
      position: "top",
      userType: ["client", "franchisee", "admin"]
    },
    {
      id: 2,
      title: "Menu de navegação",
      description: "Aqui você encontra todos os recursos disponíveis no sistema. Clique nos ícones para acessar as diferentes seções.",
      target: "[data-tour='sidebar']",
      position: "right",
      highlight: true,
      userType: ["client", "franchisee", "admin"]
    },
    {
      id: 3,
      title: "Recomendações de saúde",
      description: "Nesta seção você encontra recomendações personalizadas para cuidar da sua saúde ocular, baseadas no seu perfil e histórico.",
      target: "[data-tour='health-recommendations']",
      position: "top",
      highlight: true,
      userType: ["client"]
    },
    {
      id: 4,
      title: "Agendamento de consultas",
      description: "Aqui você pode agendar novas consultas ou gerenciar seus agendamentos existentes.",
      target: "[data-tour='appointments']",
      position: "top",
      highlight: true,
      userType: ["client"]
    },
    {
      id: 5,
      title: "Estatísticas da loja",
      description: "Acompanhe o desempenho da sua franquia com estatísticas detalhadas de vendas, consultas e satisfação dos clientes.",
      target: "[data-tour='statistics']",
      position: "top",
      highlight: true,
      userType: ["franchisee"]
    },
    {
      id: 6,
      title: "Painel administrativo",
      description: "Aqui você pode gerenciar todas as franquias, aprovar novos franqueados e monitorar o desempenho da rede.",
      target: "[data-tour='admin-panel']",
      position: "top",
      highlight: true,
      userType: ["admin"]
    }
  ];

  // Filtra os passos com base no tipo de usuário e página atual
  const relevantSteps = steps.filter(step => {
    if (!userType || !step.userType.includes(userType)) {
      return false;
    }
    
    if (step.target === "body") {
      return true;
    }
    
    // Verifica se o elemento alvo existe na página atual
    const element = document.querySelector(step.target);
    return !!element;
  });

  // Verifica se o tour deve ser mostrado ou não
  useEffect(() => {
    // Evita loop infinito
    if (tourCompleted || !userType) {
      return;
    }
    
    // Inicia o tour apenas uma vez após a página ser carregada
    const timer = setTimeout(() => {
      if (!visible) {
        setCurrentStep(0);
        setVisible(true);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [tourCompleted, location, userType, visible]);

  // Atualiza a posição do elemento alvo quando o passo muda
  useEffect(() => {
    if (!visible || currentStep >= relevantSteps.length) {
      return;
    }
    
    const step = relevantSteps[currentStep];
    if (step.target === "body") {
      setTargetElement(null);
      return;
    }
    
    // Aguarda um pouco para garantir que o DOM está completamente carregado
    const timer = setTimeout(() => {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetElement(rect);
      } else {
        setTargetElement(null);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentStep, visible, relevantSteps]);

  // Avança para o próximo passo
  const nextStep = () => {
    if (currentStep < relevantSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  // Volta para o passo anterior
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Completa o tour
  const completeTour = () => {
    setVisible(false);
    setTourCompleted(true);
  };

  // Reinicia o tour
  const resetTour = () => {
    setTourCompleted(false);
    setCurrentStep(0);
    setVisible(true);
  };

  // Se não há passos relevantes ou o tour já foi concluído, não mostra nada
  if (!visible || relevantSteps.length === 0) {
    return null;
  }

  const currentTourStep = relevantSteps[currentStep];

  // Calcula a posição do tooltip com base na posição do elemento alvo
  const getTooltipPosition = () => {
    if (!targetElement || currentTourStep.target === "body") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      };
    }

    const padding = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    switch (currentTourStep.position) {
      case "top":
        return {
          top: `${targetElement.top - tooltipHeight - padding}px`,
          left: `${targetElement.left + targetElement.width / 2 - tooltipWidth / 2}px`
        };
      case "bottom":
        return {
          top: `${targetElement.bottom + padding}px`,
          left: `${targetElement.left + targetElement.width / 2 - tooltipWidth / 2}px`
        };
      case "left":
        return {
          top: `${targetElement.top + targetElement.height / 2 - tooltipHeight / 2}px`,
          left: `${targetElement.left - tooltipWidth - padding}px`
        };
      case "right":
        return {
          top: `${targetElement.top + targetElement.height / 2 - tooltipHeight / 2}px`,
          left: `${targetElement.right + padding}px`
        };
      default:
        return {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        };
    }
  };

  // Renderiza o tooltip
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay para destacar o elemento alvo */}
          {currentTourStep.highlight && targetElement && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 pointer-events-none"
              style={{
                mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='white'/%3E%3Crect x='${
                  targetElement.left - 10
                }' y='${targetElement.top - 10}' width='${
                  targetElement.width + 20
                }' height='${
                  targetElement.height + 20
                }' rx='8' fill='black'/%3E%3C/svg%3E")`,
                WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='white'/%3E%3Crect x='${
                  targetElement.left - 10
                }' y='${targetElement.top - 10}' width='${
                  targetElement.width + 20
                }' height='${
                  targetElement.height + 20
                }' rx='8' fill='black'/%3E%3C/svg%3E")`
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 w-80 max-w-[90vw]"
            style={getTooltipPosition()}
          >
            <Card className="p-4 shadow-lg border-2 border-primary/20">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-primary">
                  {currentTourStep.title}
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
              
              <p className="text-gray-600 mb-4">{currentTourStep.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} de {relevantSteps.length}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      className="h-8 px-2"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    onClick={nextStep}
                    className="h-8 px-2 bg-primary hover:bg-primary/90"
                  >
                    {currentStep < relevantSteps.length - 1 ? (
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
        </>
      )}
    </AnimatePresence>
  );
}