import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RedemptionLevel {
  id: string;
  points_required: number;
  discount_amount: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface RedemptionLevelsTableProps {
  levels: RedemptionLevel[];
  onEdit: (level: RedemptionLevel) => void;
  onDelete: (id: string) => void;
}

export function RedemptionLevelsTable({ levels, onEdit, onDelete }: RedemptionLevelsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pontos</TableHead>
            <TableHead>Desconto</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum nível de resgate cadastrado
              </TableCell>
            </TableRow>
          ) : (
            levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="font-medium">{level.points_required} pontos</TableCell>
                <TableCell>R$ {level.discount_amount.toFixed(2)}</TableCell>
                <TableCell>{level.description || "-"}</TableCell>
                <TableCell>
                  <Badge variant={level.is_active ? "default" : "secondary"}>
                    {level.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(level)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(level.id)}
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
}