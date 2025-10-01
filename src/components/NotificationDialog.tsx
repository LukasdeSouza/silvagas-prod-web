import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Notification {
  id: string;
  title: string;
  message: string;
  expire_at: string;
}

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: Notification | null;
  onSave: (data: Omit<Notification, "id">) => Promise<void>;
}

export const NotificationDialog = ({
  open,
  onOpenChange,
  notification,
  onSave,
}: NotificationDialogProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [expireAt, setExpireAt] = useState("");

  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setMessage(notification.message);
      setExpireAt(notification.expire_at.split("T")[0]);
    } else {
      setTitle("");
      setMessage("");
      setExpireAt("");
    }
  }, [notification, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title,
      message,
      expire_at: new Date(expireAt).toISOString(),
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
