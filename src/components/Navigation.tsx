import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Bell, Package, LogOut, LayoutDashboard, Wrench, Trophy, ShoppingCart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface NavigationProps {
  onSignOut: () => void;
}

export const Navigation = ({ onSignOut }: NavigationProps) => {
  const { isAdmin } = useUserRole();
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

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-primary">Silva Gás</h1>
            <div className="flex gap-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <Package className="h-4 w-4" />
                Produtos
              </NavLink>
              <NavLink
                to="/accessories"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <Wrench className="h-4 w-4" />
                Acessórios
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <ShoppingCart className="h-4 w-4" />
                Pedidos
              </NavLink>
              <NavLink
                to="/partners"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <Building2 className="h-4 w-4" />
                Parceiros
              </NavLink>
              <NavLink
                to="/sorteios"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <Trophy className="h-4 w-4" />
                Sorteios
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`
                    }
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin
                  </NavLink>
                  <NavLink
                    to="/redemption-levels"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`
                    }
                  >
                    <Package className="h-4 w-4" />
                    Níveis de Resgate
                  </NavLink>
                </>
              )}
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <Bell className="h-4 w-4" />
                Notificações
              </NavLink>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <span className="font-semibold text-primary">{userPoints}</span>
              <span className="text-sm text-muted-foreground">pontos</span>
            </div>
            <Button
              variant="ghost"
              onClick={onSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
