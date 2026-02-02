import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Bell, 
  Package, 
  LogOut, 
  LayoutDashboard, 
  Wrench, 
  Trophy, 
  ShoppingCart, 
  Star,
  ChevronRight,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import silvaGasLogo from "@/assets/silva-gas-logo.png";

export function AppSidebar() {
  const { isAdmin } = useUserRole();
  const { open: collapsed } = useSidebar();
  const navigate = useNavigate();
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .single();
        
        if (data && !error) {
          setUserPoints(data.points);
        }
      }
    };

    fetchUserPoints();

    // Subscribe to realtime updates for points
    const channel = supabase
      .channel('points-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload: any) => {
          if (userId && payload.new.id === userId) {
            setUserPoints(payload.new.points);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="transition-all duration-300 ease-in-out">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <img 
            src={silvaGasLogo} 
            alt="Silva Gás" 
            className="h-8 w-8 object-contain transition-transform duration-300 hover:scale-110" 
          />
          {collapsed && (
            <span className="font-bold text-lg text-primary animate-fade-in">
              Silva Gás
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="transition-all duration-300">
        <SidebarGroup>
          <SidebarGroupLabel className="transition-opacity duration-200">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard"
                    className={({ isActive }) =>
                      `transition-all duration-200 hover:scale-105 ${
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }`
                    }
                  >
                    <Package className="h-4 w-4 transition-transform duration-200" />
                    <span className={collapsed ? "animate-fade-in" : ""}>Produtos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/accessories"
                    className={({ isActive }) =>
                      `transition-all duration-200 hover:scale-105 ${
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }`
                    }
                  >
                    <Wrench className="h-4 w-4 transition-transform duration-200" />
                    <span className={collapsed ? "animate-fade-in" : ""}>Acessórios</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/orders"
                    className={({ isActive }) =>
                      `transition-all duration-200 hover:scale-105 ${
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }`
                    }
                  >
                    <ShoppingCart className="h-4 w-4 transition-transform duration-200" />
                    <span className={collapsed ? "animate-fade-in" : ""}>Pedidos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/partners"
                    className={({ isActive }) =>
                      `transition-all duration-200 hover:scale-105 ${
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }`
                    }
                  >
                    <Building2 className="h-4 w-4 transition-transform duration-200" />
                    <span className={collapsed ? "animate-fade-in" : ""}>Parceiros</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/sorteios"
                    className={({ isActive }) =>
                      `transition-all duration-200 hover:scale-105 ${
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }`
                    }
                  >
                    <Trophy className="h-4 w-4 transition-transform duration-200" />
                    <span className={collapsed ? "animate-fade-in" : ""}>Sorteios</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/notifications"
                    className={({ isActive }) =>
                      `transition-all duration-200 hover:scale-105 ${
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }`
                    }
                  >
                    <Bell className="h-4 w-4 transition-transform duration-200" />
                    <span className={collapsed ? "animate-fade-in" : ""}>Notificações</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup className="animate-fade-in">
            <SidebarGroupLabel className="transition-opacity duration-200">
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/admin"
                      className={({ isActive }) =>
                        `transition-all duration-200 hover:scale-105 ${
                          isActive ? "bg-primary text-primary-foreground" : ""
                        }`
                      }
                    >
                      <LayoutDashboard className="h-4 w-4 transition-transform duration-200" />
                      <span className={collapsed ? "animate-fade-in" : ""}>Admin</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/redemption-levels"
                      className={({ isActive }) =>
                        `transition-all duration-200 hover:scale-105 ${
                          isActive ? "bg-primary text-primary-foreground" : ""
                        }`
                      }
                    >
                      <Package className="h-4 w-4 transition-transform duration-200" />
                      <span className={collapsed ? "animate-fade-in" : ""}>Níveis de Resgate</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="transition-all duration-300">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-primary/10 transition-all duration-200 hover:bg-primary/20">
              <Star className="h-4 w-4 text-primary fill-primary flex-shrink-0 transition-transform duration-200 hover:scale-110" />
              {collapsed && (
                <>
                  <span className="font-semibold text-primary animate-fade-in">{userPoints}</span>
                  <span className="text-xs text-muted-foreground animate-fade-in">pontos</span>
                </>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="transition-all duration-200 hover:scale-105 hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 transition-transform duration-200" />
              <span className={collapsed ? "animate-fade-in" : ""}>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
