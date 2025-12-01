import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RedemptionLevelsTable } from "@/components/RedemptionLevelsTable";
import { RedemptionLevelDialog } from "@/components/RedemptionLevelDialog";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

interface RedemptionLevel {
  id: string;
  points_required: number;
  discount_amount: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

const RedemptionLevels = () => {
  const [levels, setLevels] = useState<RedemptionLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<RedemptionLevel | null>(null);
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchLevels();
    }
  }, [isAdmin]);

  const fetchLevels = async () => {
    try {
      const { data, error } = await supabase
        .from("points_redemption_levels")
        .select("*")
        .order("points_required", { ascending: true });

      if (error) throw error;
      setLevels(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar níveis: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (level: RedemptionLevel) => {
    setEditingLevel(level);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este nível?")) return;

    try {
      const { error } = await supabase
        .from("points_redemption_levels")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Nível excluído com sucesso!");
      fetchLevels();
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
    }
  };

  const handleAddNew = () => {
    setEditingLevel(null);
    setDialogOpen(true);
  };

  const handleSave = () => {
    fetchLevels();
  };

  if (roleLoading || !isAdmin) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Níveis de Resgate de Pontos</h1>
            <p className="text-muted-foreground mt-1">
              Configure os pacotes de resgate que os usuários podem escolher
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Nível
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <RedemptionLevelsTable
            levels={levels}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <RedemptionLevelDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          level={editingLevel}
          onSave={handleSave}
        />
      </div>
    </AuthLayout>
  );
};

export default RedemptionLevels;