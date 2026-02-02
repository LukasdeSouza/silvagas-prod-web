import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Building2, Ticket, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface PartnerTableProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

export const PartnerTable = ({ partners, onEdit, onDelete }: PartnerTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPartners = useMemo(() => {
    if (!searchTerm.trim()) return partners;
    
    const term = searchTerm.toLowerCase();
    return partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(term) ||
        partner.coupon_code.toLowerCase().includes(term) ||
        partner.description?.toLowerCase().includes(term) ||
        partner.address?.toLowerCase().includes(term)
    );
  }, [partners, searchTerm]);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (partners.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Nenhum parceiro encontrado. Clique em "Novo Parceiro" para adicionar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, cupom, descrição ou endereço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPartners.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchTerm ? "Nenhum parceiro encontrado com esse termo." : "Nenhum parceiro encontrado. Clique em \"Novo Parceiro\" para adicionar."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cupom</TableHead>
                <TableHead className="text-right">Desconto</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <p className="font-semibold">{partner.name}</p>
                  {partner.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {partner.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {partner.address || "—"}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Ticket className="h-4 w-4 text-primary" />
                  <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                    {partner.coupon_code}
                  </code>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold text-primary">
                {formatPrice(Number(partner.discount_amount))}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={partner.is_active ? "default" : "secondary"}>
                  {partner.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(partner.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(partner)}
                    title="Editar parceiro"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Excluir parceiro">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o parceiro "{partner.name}"? Esta
                          ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(partner.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
