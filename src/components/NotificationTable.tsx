import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  expire_at: string;
  created_at: string;
}

interface NotificationTableProps {
  notifications: Notification[];
  onEdit: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export const NotificationTable = ({
  notifications,
  onEdit,
  onDelete,
}: NotificationTableProps) => {
  const isExpired = (expireAt: string) => {
    return new Date(expireAt) < new Date();
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Mensagem</TableHead>
            <TableHead>Expira em</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhuma notificação cadastrada
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">{notification.title}</TableCell>
                <TableCell className="max-w-md truncate">{notification.message}</TableCell>
                <TableCell>
                  {format(new Date(notification.expire_at), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isExpired(notification.expire_at)
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isExpired(notification.expire_at) ? "Expirada" : "Ativa"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(notification)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
