import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

interface SorteioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export const SorteioDialog = ({
  open,
  onOpenChange,
  onSave,
}: SorteioDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    product_id: "",
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: error.message,
      });
      return;
    }

    setProducts(data || []);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("sorteio-images")
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("sorteio-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(user.id);
      }

      const { data: sorteioData, error: sorteioError } = await supabase
        .from("sorteios")
        .insert({
          name: formData.name,
          description: formData.description,
          product_id: formData.product_id || null,
          image_url: imageUrl,
          created_by: user.id,
        })
        .select()
        .single();

      if (sorteioError) throw sorteioError;

      // Add all users as participants
      const { data: allUsers, error: usersError } = await supabase
        .from("user_roles")
        .select("user_id");

      if (usersError) throw usersError;

      if (allUsers && allUsers.length > 0) {
        const participants = allUsers.map((u) => ({
          sorteio_id: sorteioData.id,
          user_id: u.user_id,
        }));

        const { error: participantsError } = await supabase
          .from("sorteio_participants")
          .insert(participants);

        if (participantsError) throw participantsError;
      }

      toast({
        title: "Sorteio criado!",
        description: "O sorteio foi criado com sucesso e todos os usuários foram adicionados como participantes.",
      });

      // Reset form
      setFormData({ name: "", description: "", product_id: "" });
      setImageFile(null);
      setImagePreview("");
      onSave();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar sorteio",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Sorteio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Sorteio *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Ex: Sorteio de Natal"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descreva o sorteio..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="product">Produto (Opcional)</Label>
            <Select
              value={formData.product_id}
              onValueChange={(value) =>
                setFormData({ ...formData, product_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Imagem do Sorteio</Label>
            <div className="mt-2">
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
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Clique para fazer upload
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ℹ️ Todos os usuários cadastrados na plataforma serão automaticamente adicionados como participantes deste sorteio.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Sorteio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
