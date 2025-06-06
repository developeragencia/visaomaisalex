import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/login-visao";
import WelcomePage from "@/pages/welcome-page";
import LandingPage from "@/pages/landing-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
// Tour será implementado posteriormente

// Client pages
import ClientDashboard from "@/pages/client/dashboard";
import OpticalMeasurement from "@/pages/optical-measurement-pro";
import MembershipCard from "@/pages/client/membership-card";
import ClientDigitalCard from "@/pages/client/digital-card";
import Appointments from "@/pages/client/appointments";
import ClientProducts from "@/pages/client/products";
import ClientProfile from "@/pages/client/profile";
import ClientPlans from "@/pages/client/plans";

// Franchisee pages
import FranchiseeDashboard from "@/pages/franchisee/dashboard";
import FranchiseeSales from "@/pages/franchisee/sales";
import FranchiseeClients from "@/pages/franchisee/clients";
import FranchiseeReports from "@/pages/franchisee/reports";
import FranchiseeInventoryManagement from "@/pages/franchisee/inventory-management";
import FranchiseeAppointments from "@/pages/franchisee/appointments";
import FranchiseeProducts from "@/pages/franchisee/products";
import FranchiseeProfile from "@/pages/franchisee/profile";
import FranchiseeSupport from "@/pages/franchisee/support";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import UsersManagement from "@/pages/admin/users-management";
import FranchisesManagement from "@/pages/admin/franchises-management";
import PlansManagement from "@/pages/admin/plans-management";
import ProductsManagement from "@/pages/admin/products-management";
import FinancialManagement from "@/pages/admin/financial-management";
import Marketing from "@/pages/admin/marketing";
import Integrations from "@/pages/admin/integrations";
import Monitoring from "@/pages/admin/monitoring";
import AdminProfile from "@/pages/admin/profile";

// Public pages
import FranchiseOpportunity from "@/pages/franchise-opportunity";
import AboutUs from "@/pages/about-us";
import FranchiseLanding from "@/pages/franchise-landing";
import FranchiseRegister from "@/pages/franchise-register";


import LoadingScreen from "@/components/loading-screen";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);



  useEffect(() => {
    // Detectar se é dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Tela de carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Switch>
      {/* Landing/Welcome screens - diferentes para mobile e desktop */}
      <Route path="/" component={isMobile ? WelcomePage : LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Public pages */}
      <Route path="/franquia" component={FranchiseOpportunity} />
      <Route path="/sobre" component={AboutUs} />
      <Route path="/franchise" component={FranchiseLanding} />
      <Route path="/franchise/register" component={FranchiseRegister} />
      
      {/* Client routes */}
      <Route path="/client/dashboard" component={ClientDashboard} />
      <Route path="/client/optical-measurement" component={OpticalMeasurement} />
      <Route path="/client/membership-card" component={MembershipCard} />
      <Route path="/client/digital-card" component={ClientDigitalCard} />
      <Route path="/client/appointments" component={Appointments} />
      <Route path="/client/products" component={ClientProducts} />
      <Route path="/client/profile" component={ClientProfile} />
      <Route path="/client/plans" component={ClientPlans} />
      
      {/* Franchisee routes */}
      <Route path="/franchisee/dashboard" component={FranchiseeDashboard} />
      <Route path="/franchisee/sales" component={FranchiseeSales} />
      <Route path="/franchisee/clients" component={FranchiseeClients} />
      <Route path="/franchisee/reports" component={FranchiseeReports} />
      <Route path="/franchisee/inventory" component={FranchiseeInventoryManagement} />
      <Route path="/franchisee/appointments" component={FranchiseeAppointments} />
      <Route path="/franchisee/products" component={FranchiseeProducts} />
      <Route path="/franchisee/profile" component={FranchiseeProfile} />
      <Route path="/franchisee/support" component={FranchiseeSupport} />
      
      {/* Admin routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/franchises" component={FranchisesManagement} />
      <Route path="/admin/users" component={UsersManagement} />
      <Route path="/admin/plans" component={PlansManagement} />
      <Route path="/admin/products" component={ProductsManagement} />
      <Route path="/admin/financial" component={FinancialManagement} />
      <Route path="/admin/marketing" component={Marketing} />
      <Route path="/admin/integrations" component={Integrations} />
      <Route path="/admin/monitoring" component={Monitoring} />
      <Route path="/admin/profile" component={AdminProfile} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
