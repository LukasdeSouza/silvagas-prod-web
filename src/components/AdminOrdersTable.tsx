import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CreditCard, Banknote, QrCode } from "lucide-react";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method?: string | null;
}

interface AdminOrdersTableProps {
  orders: Order[];
}

export const AdminOrdersTable = ({ orders }: AdminOrdersTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentMethodLabel = (method: string | null | undefined) => {
    switch (method) {
      case "cash":
        return { label: "Dinheiro", icon: Banknote, color: "text-green-600" };
      case "pix":
        return { label: "PIX", icon: QrCode, color: "text-primary" };
      case "credit_card":
        return { label: "Crédito", icon: CreditCard, color: "text-blue-600" };
      case "debit_card":
        return { label: "Débito", icon: CreditCard, color: "text-orange-600" };
      default:
        return { label: "—", icon: null, color: "text-muted-foreground" };
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Nenhuma compra encontrada
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const paymentInfo = getPaymentMethodLabel(order.payment_method);
              const PaymentIcon = paymentInfo.icon;
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${paymentInfo.color}`}>
                      {PaymentIcon && <PaymentIcon className="h-4 w-4" />}
                      <span>{paymentInfo.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {Number(order.total_amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
