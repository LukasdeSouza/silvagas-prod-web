import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  expire_at: string;
  product_id?: string;
}

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: Notification | null;
  onSave: (data: Omit<Notification, "id">) => Promise<void>;
  products: Product[];
}

export const NotificationDialog = ({
  open,
  onOpenChange,
  notification,
  onSave,
  products,
}: NotificationDialogProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [productId, setProductId] = useState<string>("");

  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setMessage(notification.message);
      setExpireAt(notification.expire_at.split("T")[0]);
      setProductId(notification.product_id || "none");
    } else {
      setTitle("");
      setMessage("");
      setExpireAt("");
      setProductId("none");
    }
  }, [notification, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title,
      message,
      expire_at: new Date(expireAt).toISOString(),
      product_id: productId === "none" ? undefined : productId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {notification ? "Editar Notificação" : "Nova Notificação"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="product">Produto (Opcional)</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum produto</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expire_at">Data de Expiração</Label>
            <Input
              id="expire_at"
              type="date"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
