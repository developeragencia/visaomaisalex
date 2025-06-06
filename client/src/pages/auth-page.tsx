import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <VisaoLogo className="h-16" />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-primary/60" />
                  </motion.div>
                </motion.div>
              </div>
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Bem-vindo ao Visão+
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Sua plataforma completa de cuidados ópticos
              </motion.p>
            </motion.div>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
                <CardContent className="pt-6 relative">
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
                              {/* Test Credentials with modern grid design - MOVED TO TOP */}
                              <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-center mb-4">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Acesso Rápido</h3>
                                  <p className="text-xs text-gray-500">Demonstração da plataforma</p>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      loginForm.setValue("username", "admin@visaomais.com");
                                      loginForm.setValue("password", "123456");
                                    }}
                                    className="flex flex-col items-center justify-center py-4 px-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
                                  >
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                                      <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium">Admin</span>
                                  </button>
                                  
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      loginForm.setValue("username", "franqueado@visaomais.com");
                                      loginForm.setValue("password", "123456");
                                    }}
                                    className="flex flex-col items-center justify-center py-4 px-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
                                  >
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                                      <Building className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium">Franquia</span>
                                  </button>
                                  
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      loginForm.setValue("username", "cliente@visaomais.com");
                                      loginForm.setValue("password", "123456");
                                    }}
                                    className="flex flex-col items-center justify-center py-4 px-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                                  >
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                                      <UserCheck className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium">Cliente</span>
                                  </button>
                                </div>
                                
                                <div className="text-center">
                                  <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                                    <span className="text-xs text-gray-600 font-medium">Clique para preencher automaticamente</span>
                                  </div>
                                </div>
                              </div>

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