import React, { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type Accessory = Database["public"]["Tables"]["accessories"]["Row"];

interface AccessoryTableProps {
  accessories: Accessory[];
  onEdit: (accessory: Accessory) => void;
  onDelete: (id: string) => void;
}

export const AccessoryTable = ({ accessories, onEdit, onDelete }: AccessoryTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accessoryToDelete, setAccessoryToDelete] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  };

  const handleDeleteClick = (id: string) => {
    setAccessoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (accessoryToDelete) {
      onDelete(accessoryToDelete);
      setDeleteDialogOpen(false);
      setAccessoryToDelete(null);
    }
  };

  if (accessories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum acessório cadastrado ainda.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessories.map((accessory) => (
              <TableRow key={accessory.id}>
                <TableCell>
                  {accessory.image_url ? (
                    <img
                      src={accessory.image_url}
                      alt={accessory.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                      Sem imagem
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{accessory.name}</TableCell>
                <TableCell>{formatPrice(Number(accessory.price))}</TableCell>
                <TableCell>{accessory.stock}</TableCell>
                <TableCell>{formatDate(accessory.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(accessory)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(accessory.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este acessório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
