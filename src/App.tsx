import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Support from "./pages/Support";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import Accessories from "./pages/Accessories";
import Sorteios from "./pages/Sorteios";
import Orders from "./pages/Orders";
import RedemptionLevels from "./pages/RedemptionLevels";
import Marketing from "./pages/Marketing";
import Partners from "./pages/Partners";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import { SplashScreen } from "./components/SplashScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/suporte" element={<Support />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sorteios" element={<Sorteios />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/redemption-levels" element={<RedemptionLevels />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/users" element={<Users />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
