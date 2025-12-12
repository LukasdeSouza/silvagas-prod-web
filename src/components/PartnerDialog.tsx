import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Partner {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  logo_url: string | null;
  coupon_code: string;
  discount_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
  onSave: () => void;
}

export const PartnerDialog = ({ open, onOpenChange, partner, onSave }: PartnerDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    coupon_code: "",
    discount_amount: "",
    is_active: true,
  });

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        description: partner.description || "",
        address: partner.address || "",
        coupon_code: partner.coupon_code,
        discount_amount: partner.discount_amount.toString(),
        is_active: partner.is_active,
      });
      setImagePreview(partner.logo_url || null);
    } else {
      setFormData({
        name: "",
        description: "",
        address: "",
        coupon_code: "",
        discount_amount: "",
        is_active: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [partner, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "A imagem não pode exceder 10MB.",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = partner?.logo_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("partner-logos")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("partner-logos")
          .getPublicUrl(fileName);

        logoUrl = publicUrl;

        if (partner?.logo_url) {
          const oldFileName = partner.logo_url.split("/").pop();
          if (oldFileName) {
            await supabase.storage
              .from("partner-logos")
              .remove([oldFileName]);
          }
        }
      }

      const partnerData = {
        name: formData.name,
        description: formData.description || null,
        address: formData.address || null,
        logo_url: logoUrl,
        coupon_code: formData.coupon_code,
        discount_amount: parseFloat(formData.discount_amount),
        is_active: formData.is_active,
      };

      if (partner) {
        const { error } = await supabase
          .from("partners")
          .update(partnerData)
          .eq("id", partner.id);

        if (error) throw error;

        toast({
          title: "Parceiro atualizado!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const { error } = await supabase.from("partners").insert(partnerData);

        if (error) throw error;

        toast({
          title: "Parceiro criado!",
          description: "O novo parceiro foi adicionado com sucesso.",
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar parceiro",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{partner ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle>
          <DialogDescription>
            {partner
              ? "Faça as alterações desejadas no parceiro."
              : "Preencha os dados do novo parceiro."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo do Parceiro</Label>
              <div className="flex flex-col gap-2">
                {imagePreview ? (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain bg-muted"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg">
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Clique para adicionar logo
                      </span>
                    </label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Parceiro *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Restaurante XYZ"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do parceiro..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ex: Rua das Flores, 123 - Centro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="coupon_code">Código do Cupom *</Label>
                <Input
                  id="coupon_code"
                  value={formData.coupon_code}
                  onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                  placeholder="Ex: PARCEIRO10"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount_amount">Valor do Desconto (R$) *</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Parceiro Ativo</Label>
                <p className="text-xs text-muted-foreground">
                  Parceiros inativos não aparecem para os usuários
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
