import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
// Logo substituído por texto

const franchiseApplicationSchema = z.object({
  // Dados Pessoais
  full_name: z.string().min(2, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  rg: z.string().min(7, "RG é obrigatório"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  
  // Endereço
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zip_code: z.string().min(8, "CEP é obrigatório"),
  
  // Dados da Empresa
  company_name: z.string().min(2, "Nome da empresa é obrigatório"),
  cnpj: z.string().optional(),
  business_experience: z.string().min(10, "Descreva sua experiência empresarial"),
  
  // Localização Pretendida
  target_city: z.string().min(2, "Cidade pretendida é obrigatória"),
  target_state: z.string().min(2, "Estado pretendido é obrigatório"),
  has_location: z.boolean(),
  location_details: z.string().optional(),
  
  // Investimento
  available_capital: z.string().min(1, "Capital disponível é obrigatório"),
  financing_needed: z.boolean(),
  investment_timeline: z.string().min(1, "Prazo de investimento é obrigatório"),
  
  // Dados de Acesso
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirm_password: z.string().min(6, "Confirmação de senha é obrigatória"),
  
  // Aceites
  terms_accepted: z.boolean().refine(val => val === true, "Você deve aceitar os termos"),
  data_processing_accepted: z.boolean().refine(val => val === true, "Você deve aceitar o processamento de dados"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Senhas não conferem",
  path: ["confirm_password"]
});

type FranchiseApplicationForm = z.infer<typeof franchiseApplicationSchema>;

export default function FranchiseRegister() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<FranchiseApplicationForm>({
    resolver: zodResolver(franchiseApplicationSchema),
    defaultValues: {
      has_location: false,
      financing_needed: false,
      terms_accepted: false,
      data_processing_accepted: false
    }
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async (data: FranchiseApplicationForm) => {
      const response = await fetch('/api/franchise-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao enviar aplicação');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Aplicação Enviada com Sucesso!",
        description: "Sua solicitação está sendo analisada. Entraremos em contato em até 24h.",
      });
      setLocation('/franchise/success');
    },
    onError: (error) => {
      toast({
        title: "Erro ao Enviar Aplicação",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FranchiseApplicationForm) => {
    submitApplicationMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: <User className="h-5 w-5" /> },
    { number: 2, title: "Experiência & Localização", icon: <Building2 className="h-5 w-5" /> },
    { number: 3, title: "Investimento", icon: <DollarSign className="h-5 w-5" /> },
    { number: 4, title: "Dados de Acesso", icon: <Shield className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/franchise" className="flex items-center space-x-3 text-white hover:text-orange-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <div className="h-8 flex items-center">
                <div className="text-primary text-xl font-bold">Visão+</div>
              </div>
            </Link>
            <div className="text-white/90 text-sm font-medium">
              Cadastro de Franqueado
            </div>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-orange-500 border-orange-500 text-white' 
                      : 'border-white/40 text-white/60'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-24 mx-4 rounded transition-colors duration-300 ${
                      currentStep > step.number ? 'bg-orange-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white">{steps[currentStep - 1].title}</h2>
              <p className="text-purple-200">Passo {currentStep} de {steps.length}</p>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                {currentStep === 1 && "Informações Pessoais"}
                {currentStep === 2 && "Experiência e Localização"}
                {currentStep === 3 && "Capacidade de Investimento"}
                {currentStep === 4 && "Criação de Acesso ao Painel"}
              </CardTitle>
              <CardDescription className="text-purple-200">
                {currentStep === 1 && "Nos conte sobre você"}
                {currentStep === 2 && "Sua experiência e onde quer empreender"}
                {currentStep === 3 && "Detalhes sobre seu investimento"}
                {currentStep === 4 && "Crie suas credenciais de acesso"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Step 1: Dados Pessoais */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="João Silva Santos" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="joao@email.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">CPF</FormLabel>
                              <FormControl>
                                <Input placeholder="123.456.789-00" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="rg"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">RG</FormLabel>
                              <FormControl>
                                <Input placeholder="12.345.678-9" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birth_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Data de Nascimento</FormLabel>
                              <FormControl>
                                <Input type="date" className="bg-white/10 border-white/20 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Endereço</FormLabel>
                              <FormControl>
                                <Input placeholder="Rua das Flores, 123" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zip_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">CEP</FormLabel>
                              <FormControl>
                                <Input placeholder="01234-567" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Cidade</FormLabel>
                              <FormControl>
                                <Input placeholder="São Paulo" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Estado</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Selecione o estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SP">São Paulo</SelectItem>
                                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                  <SelectItem value="MG">Minas Gerais</SelectItem>
                                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                  <SelectItem value="PR">Paraná</SelectItem>
                                  <SelectItem value="SC">Santa Catarina</SelectItem>
                                  {/* Adicione outros estados conforme necessário */}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Experiência & Localização */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Nome da Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="Silva & Santos LTDA" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">CNPJ (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="12.345.678/0001-90" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="business_experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Experiência Empresarial</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Conte sobre sua experiência empresarial, conhecimento do mercado óptico, experiência em gestão..."
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="target_city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Cidade Pretendida</FormLabel>
                              <FormControl>
                                <Input placeholder="São Paulo" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="target_state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Estado Pretendido</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Selecione o estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SP">São Paulo</SelectItem>
                                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                  <SelectItem value="MG">Minas Gerais</SelectItem>
                                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                  <SelectItem value="PR">Paraná</SelectItem>
                                  <SelectItem value="SC">Santa Catarina</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="has_location"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-white/20"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white">
                                Já possui localização definida
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("has_location") && (
                        <FormField
                          control={form.control}
                          name="location_details"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Detalhes da Localização</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descreva o local: endereço, metragem, características..."
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Step 3: Investimento */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="available_capital"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Capital Disponível para Investimento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Selecione a faixa de investimento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="150k-200k">R$ 150.000 - R$ 200.000</SelectItem>
                                <SelectItem value="200k-250k">R$ 200.000 - R$ 250.000</SelectItem>
                                <SelectItem value="250k-300k">R$ 250.000 - R$ 300.000</SelectItem>
                                <SelectItem value="300k+">Acima de R$ 300.000</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="financing_needed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-white/20"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white">
                                Preciso de financiamento
                              </FormLabel>
                              <FormDescription className="text-purple-200">
                                Podemos ajudar com opções de financiamento
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="investment_timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Prazo para Investir</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Quando pretende investir?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="immediate">Imediatamente</SelectItem>
                                <SelectItem value="3months">Em até 3 meses</SelectItem>
                                <SelectItem value="6months">Em até 6 meses</SelectItem>
                                <SelectItem value="12months">Em até 1 ano</SelectItem>
                                <SelectItem value="future">Ainda estou avaliando</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Dados de Acesso */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-orange-300 font-medium mb-1">Dados de Acesso ao Painel</h3>
                            <p className="text-orange-200/80 text-sm">
                              Estes serão seus dados de login quando sua aplicação for aprovada. 
                              Escolha um username único e uma senha forte.
                            </p>
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="seu_username" 
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-purple-200">
                              Este será seu nome de usuário para acessar o painel da franquia
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Senha</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••" 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10" 
                                    {...field} 
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4 text-white/50" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-white/50" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirm_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Confirmar Senha</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••" 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10" 
                                    {...field} 
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4 text-white/50" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-white/50" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4 pt-4">
                        <FormField
                          control={form.control}
                          name="terms_accepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-white/20"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-sm">
                                  Aceito os termos e condições da franquia Visão+
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="data_processing_accepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-white/20"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-sm">
                                  Autorizo o processamento dos meus dados pessoais conforme LGPD
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Anterior
                      </Button>
                    )}
                    
                    {currentStep < 4 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="ml-auto bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Próximo
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={submitApplicationMutation.isPending}
                        className="ml-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      >
                        {submitApplicationMutation.isPending ? (
                          "Enviando..."
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Enviar Aplicação
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}