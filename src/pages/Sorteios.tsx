import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trophy, Users, Gift } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SorteioDialog } from "@/components/SorteioDialog";
import { SorteiosList } from "@/components/SorteiosList";
import type { Database } from "@/integrations/supabase/types";

type Sorteio = Database["public"]["Tables"]["sorteios"]["Row"];

const Sorteios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchSorteios(), fetchUserCount()]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSorteios = async () => {
    const { data, error } = await supabase
      .from("sorteios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setSorteios(data || []);
  };

  const fetchUserCount = async () => {
    const { count, error } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    setTotalUsers(count || 0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSaveSorteio = () => {
    setIsDialogOpen(false);
    fetchSorteios();
  };

  const handleDeleteSorteio = async (id: string) => {
    try {
      const { error } = await supabase.from("sorteios").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Sorteio excluído!",
        description: "O sorteio foi removido com sucesso.",
      });
      fetchSorteios();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir sorteio",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSignOut={handleSignOut} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Sorteios
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie e crie sorteios para seus clientes
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Sorteios
              </CardTitle>
              <Trophy className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {sorteios.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sorteios Ativos
              </CardTitle>
              <Gift className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {sorteios.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Meus Sorteios</h2>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Sorteio
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando sorteios...</p>
          </div>
        ) : (
          <SorteiosList
            sorteios={sorteios}
            onDelete={handleDeleteSorteio}
          />
        )}
      </main>

      <SorteioDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveSorteio}
      />
    </div>
  );
};

export default Sorteios;
