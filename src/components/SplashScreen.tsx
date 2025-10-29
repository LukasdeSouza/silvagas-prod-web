import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import silvaGasLogo from "@/assets/silva-gas-logo.png";
import { Loader2 } from "lucide-react";

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 animate-fade-in">
        {/* Logo container */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-in">
          <img 
            src={silvaGasLogo} 
            alt="Silva Gás Logo" 
            className="h-32 w-auto"
          />
        </div>

        {/* Loading text and spinner */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
            <p className="text-white text-xl font-medium">
              Carregando informações do sistema...
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
