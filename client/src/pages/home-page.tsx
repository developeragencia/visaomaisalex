import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user, userType } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect based on user type
    if (user && userType) {
      switch (userType) {
        case 'admin':
          setLocation('/admin/dashboard');
          break;
        case 'franchisee':
          setLocation('/franchisee/dashboard');
          break;
        case 'client':
        default:
          setLocation('/client/dashboard');
          break;
      }
    }
  }, [user, userType, setLocation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <img 
        src="/logo-horizontal-roxa.png" 
        alt="Visão+" 
        className="h-16 w-auto object-contain"
      />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
