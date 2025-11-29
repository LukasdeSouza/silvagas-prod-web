import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RedemptionLevel {
  id?: string;
  points_required: number;
  discount_amount: number;
  description: string;
  is_active: boolean;
}

interface RedemptionLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: RedemptionLevel | null;
  onSave: () => void;
}

export function RedemptionLevelDialog({ open, onOpenChange, level, onSave }: RedemptionLevelDialogProps) {
  const [formData, setFormData] = useState<RedemptionLevel>({
    points_required: 0,
    discount_amount: 0,
    description: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (level) {
      setFormData(level);
    } else {
      setFormData({
        points_required: 0,
        discount_amount: 0,
        description: "",
        is_active: true,
      });
    }
  }, [level, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const levelData = {
        points_required: formData.points_required,
        discount_amount: formData.discount_amount,
        description: formData.description,
        is_active: formData.is_active,
      };

      if (level?.id) {
        const { error } = await supabase
          .from("points_redemption_levels")
          .update(levelData)
          .eq("id", level.id);

        if (error) throw error;
        toast.success("Nível atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("points_redemption_levels")
          .insert([levelData]);

        if (error) throw error;
        toast.success("Nível criado com sucesso!");
      }

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {level ? "Editar Nível de Resgate" : "Novo Nível de Resgate"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="points_required">Pontos Necessários</Label>
            <Input
              id="points_required"
              type="number"
              min="1"
              value={formData.points_required}
              onChange={(e) =>
                setFormData({ ...formData, points_required: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_amount">Valor do Desconto (R$)</Label>
            <Input
              id="discount_amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.discount_amount}
              onChange={(e) =>
                setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ex: Pacote básico, Melhor custo-benefício..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="is_active">Ativo</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}