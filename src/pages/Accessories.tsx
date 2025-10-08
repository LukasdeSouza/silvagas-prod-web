import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { AccessoryTable } from "@/components/AccessoryTable";
import { AccessoryDialog } from "@/components/AccessoryDialog";
import { Database } from "@/integrations/supabase/types";

type Accessory = Database["public"]["Tables"]["accessories"]["Row"];

const Accessories = () => {
  const { toast } = useToast();
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("accessories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAccessories(data || []);
    } catch (error) {
      console.error("Error fetching accessories:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar acessórios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("accessories").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Acessório excluído com sucesso!",
      });

      fetchAccessories();
    } catch (error) {
      console.error("Error deleting accessory:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir acessório",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    fetchAccessories();
    setEditingAccessory(null);
  };

  const handleNewAccessory = () => {
    setEditingAccessory(null);
    setDialogOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation onSignOut={handleSignOut} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2 animate-fade-in">
              Acessórios e Outros
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus acessórios e outros itens
            </p>
          </div>
          <Button
            onClick={handleNewAccessory}
            className="flex items-center gap-2 shadow-elegant hover:shadow-glow transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Acessório
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <AccessoryTable
            accessories={accessories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <AccessoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          accessory={editingAccessory}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Accessories;
