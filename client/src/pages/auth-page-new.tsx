import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, Sparkles, Shield, UserCheck, Building } from "lucide-react";
import { useLocation } from "wouter";
import { formatPhone, formatCPF } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { VisaoLogo } from "@/components/logo";
// Logo substituído por texto

const loginSchema = z.object({
  username: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  username: z.string().email({ message: "E-mail inválido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/client/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      cpf: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      username: data.username,
      password: data.password,
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      user_type: "client",
    });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    registerForm.setValue("cpf", formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    registerForm.setValue("phone", formatted);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="min-h-screen w-full flex flex-col lg:flex-row relative z-10">
        {/* Left Panel - Form */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md">
            {/* Logo and Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <div className="flex items-center justify-center h-20">
                    <svg viewBox="0 0 400 80" className="h-full w-auto">
                      {/* Ícone do olho roxo com cruz laranja */}
                      <ellipse cx="40" cy="40" rx="35" ry="25" fill="#6B46C1" stroke="#F97316" strokeWidth="3"/>
                      
                      {/* Cruz laranja dentro do olho */}
                      <rect x="36" y="25" width="8" height="30" fill="#F97316" rx="2"/>
                      <rect x="25" y="36" width="30" height="8" fill="#F97316" rx="2"/>
                      
                      {/* Texto VISÃO */}
                      <text x="90" y="35" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#6B46C1">V</text>
                      <text x="110" y="35" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#6B46C1">I</text>
                      <text x="125" y="35" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#6B46C1">S</text>
                      <text x="145" y="35" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#6B46C1">Ã</text>
                      <text x="170" y="35" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#6B46C1">O</text>
                      
                      {/* Acento til no Ã */}
                      <path d="M155 15 Q160 10 165 15" stroke="#6B46C1" strokeWidth="2" fill="none"/>
                      
                      {/* Símbolo + */}
                      <text x="195" y="35" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#F97316">+</text>
                      
                      {/* Cruz adicional laranja no final */}
                      <rect x="230" y="25" width="6" height="25" fill="#F97316" rx="2"/>
                      <rect x="220" y="35" width="25" height="6" fill="#F97316" rx="2"/>
                    </svg>
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 2
                    }}
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full animate-pulse"></div>
                  </motion.div>
                </motion.div>
              </div>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-orange-600 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Bem-vindo à Visão+
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Sua plataforma completa de cuidados ópticos profissionais
              </motion.p>
              <motion.div
                className="w-16 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-auto mt-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "4rem" }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.div>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border border-white/20 overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5" />
                <CardContent className="pt-8 pb-8 px-8 relative">
                  <Tabs 
                    defaultValue="login" 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 backdrop-blur-sm">
                        <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-md font-medium">
                          Entrar
                        </TabsTrigger>
                        <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:shadow-md font-medium">
                          Registrar
                        </TabsTrigger>
                      </TabsList>
                    </motion.div>
                    
                    <AnimatePresence mode="wait">
                      {/* Login Form */}
                      <TabsContent value="login" key="login">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                              <FormField
                                control={loginForm.control}
                                name="username"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input 
                                          placeholder="seu@email.com" 
                                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                          {...field} 
                                          disabled={loginMutation.isPending}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Senha</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input 
                                          type={showPassword ? "text" : "password"}
                                          placeholder="******" 
                                          className="pl-10 pr-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                          {...field} 
                                          disabled={loginMutation.isPending}
                                        />
                                        <button
                                          type="button"
                                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                          onClick={() => setShowPassword(!showPassword)}
                                        >
                                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="flex items-center justify-between">
                                <FormField
                                  control={loginForm.control}
                                  name="rememberMe"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                      <FormControl>
                                        <Checkbox 
                                          checked={field.value} 
                                          onCheckedChange={field.onChange}
                                          disabled={loginMutation.isPending}
                                        />
                                      </FormControl>
                                      <FormLabel className="cursor-pointer text-sm">Lembrar-me</FormLabel>
                                    </FormItem>
                                  )}
                                />
                                
                                <a href="#" className="text-sm text-primary hover:text-primary-dark transition-colors">
                                  Esqueceu a senha?
                                </a>
                              </div>
                              
                              <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
                                disabled={loginMutation.isPending}
                              >
                                {loginMutation.isPending ? (
                                  <div className="flex items-center">
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    Entrando...
                                  </div>
                                ) : "Entrar"}
                              </Button>
                              
                              {/* Test Credentials with modern design */}
                              <motion.div 
                                className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                <p className="text-sm font-medium text-gray-700 mb-3 text-center">Acesso rápido para demonstração:</p>
                                <div className="grid grid-cols-1 gap-3">
                                  <motion.button 
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      loginForm.setValue("username", "admin@visaomais.com");
                                      loginForm.setValue("password", "123456");
                                    }}
                                    className="flex items-center justify-center py-3 px-4 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md"
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Administrador
                                  </motion.button>
                                  <motion.button 
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      loginForm.setValue("username", "franqueado@visaomais.com");
                                      loginForm.setValue("password", "123456");
                                    }}
                                    className="flex items-center justify-center py-3 px-4 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                                  >
                                    <Building className="w-4 h-4 mr-2" />
                                    Franqueado
                                  </motion.button>
                                  <motion.button 
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      loginForm.setValue("username", "cliente@visaomais.com");
                                      loginForm.setValue("password", "123456");
                                    }}
                                    className="flex items-center justify-center py-3 px-4 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Cliente
                                  </motion.button>
                                </div>
                                <div className="text-xs text-gray-500 border-t pt-3 mt-3 text-center">
                                  <p>Clique em um dos botões acima para preencher as credenciais automaticamente.</p>
                                </div>
                              </motion.div>
                            </form>
                          </Form>
                        </motion.div>
                      </TabsContent>
                      
                      {/* Register Form */}
                      <TabsContent value="register" key="register">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                              <FormField
                                control={registerForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Nome completo</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input 
                                          placeholder="Seu nome completo" 
                                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                          {...field} 
                                          disabled={registerMutation.isPending}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="username"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input 
                                          placeholder="seu@email.com" 
                                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                          {...field} 
                                          disabled={registerMutation.isPending}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={registerForm.control}
                                  name="cpf"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">CPF</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <Input 
                                            placeholder="000.000.000-00" 
                                            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                            {...field} 
                                            onChange={(e) => {
                                              field.onChange(e);
                                              handleCpfChange(e);
                                            }}
                                            disabled={registerMutation.isPending}
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={registerForm.control}
                                  name="phone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">Telefone</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <Input 
                                            placeholder="(00) 00000-0000" 
                                            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                            {...field} 
                                            onChange={(e) => {
                                              field.onChange(e);
                                              handlePhoneChange(e);
                                            }}
                                            disabled={registerMutation.isPending}
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Senha</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input 
                                          type={showPassword ? "text" : "password"}
                                          placeholder="******" 
                                          className="pl-10 pr-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                          {...field} 
                                          disabled={registerMutation.isPending}
                                        />
                                        <button
                                          type="button"
                                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                          onClick={() => setShowPassword(!showPassword)}
                                        >
                                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Confirmar senha</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input 
                                          type={showPassword ? "text" : "password"}
                                          placeholder="******" 
                                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                                          {...field} 
                                          disabled={registerMutation.isPending}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
                                disabled={registerMutation.isPending}
                              >
                                {registerMutation.isPending ? (
                                  <div className="flex items-center">
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    Registrando...
                                  </div>
                                ) : "Registrar"}
                              </Button>
                            </form>
                          </Form>
                        </motion.div>
                      </TabsContent>
                    </AnimatePresence>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="text-center text-sm text-gray-500 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p>© 2024 Visão+. Todos os direitos reservados.</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Right Panel - Hero */}
        <motion.div 
          className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-secondary relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6">Cuidados ópticos modernos</h2>
              <p className="text-xl mb-8 opacity-90">
                Tecnologia avançada para sua saúde visual
              </p>
              <div className="flex flex-col space-y-4">
                <motion.div 
                  className="flex items-center text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
                  <span>Medições digitais precisas</span>
                </motion.div>
                <motion.div 
                  className="flex items-center text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
                  <span>Agendamento online simplificado</span>
                </motion.div>
                <motion.div 
                  className="flex items-center text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
                  <span>Acompanhamento completo da saúde ocular</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-24 h-24 border border-white/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
}