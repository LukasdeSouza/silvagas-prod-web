import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Accessory = Database["public"]["Tables"]["accessories"]["Row"];

interface AccessoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessory?: Accessory | null;
  onSave: () => void;
}

export const AccessoryDialog = ({
  open,
  onOpenChange,
  accessory,
  onSave,
}: AccessoryDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (accessory) {
      setFormData({
        name: accessory.name,
        price: accessory.price.toString(),
        stock: accessory.stock.toString(),
      });
      setImagePreview(accessory.image_url || null);
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        price: "",
        stock: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [accessory, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 10MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erro",
          description: "Por favor, selecione uma imagem válida",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      let imageUrl = accessory?.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        if (accessory?.image_url) {
          const oldPath = accessory.image_url.split("/").pop();
          if (oldPath) {
            await supabase.storage
              .from("product-images")
              .remove([`${user.id}/${oldPath}`]);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const accessoryData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: imageUrl,
        user_id: user.id,
      };

      if (accessory) {
        const { error } = await supabase
          .from("accessories")
          .update(accessoryData)
          .eq("id", accessory.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Acessório atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("accessories")
          .insert([accessoryData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Acessório cadastrado com sucesso!",
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving accessory:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar acessório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accessory ? "Editar Acessório" : "Novo Acessório"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Acessório</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Quantidade em Estoque</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagem do Acessório</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
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
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <Label
                  htmlFor="image"
                  className="cursor-pointer text-primary hover:underline"
                >
                  Clique para fazer upload da imagem
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Máximo 10MB
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
