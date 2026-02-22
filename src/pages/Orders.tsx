import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2, ShoppingCart, CreditCard, Banknote, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: string | null;
  user_id: string;
  user_email?: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserRole();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, startDate, endDate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    fetchOrders();
  };

  const getPaymentMethodInfo = (method: string | null) => {
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

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at, payment_method, user_id")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch user emails from Auth for admins
      const userIds = [...new Set((ordersData || []).map(o => o.user_id))];
      let userEmailsMap: Record<string, string> = {};
      
      if (isAdmin && userIds.length > 0) {
        try {
          const { data: authData } = await supabase.functions.invoke("get-auth-users", {
            body: { user_ids: userIds },
          });
          
          if (authData?.users) {
            userEmailsMap = Object.fromEntries(
              Object.entries(authData.users).map(([id, u]: [string, any]) => [id, u.email])
            );
          }
        } catch (e) {
          console.error("Error fetching auth users:", e);
        }
      }

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from("order_items")
            .select("id, product_name, quantity, price")
            .eq("order_id", order.id);

          if (itemsError) throw itemsError;

          return {
            ...order,
            user_email: userEmailsMap[order.user_id] || undefined,
            order_items: items || [],
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) <= new Date(endDate)
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);


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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Entregue";
      case "pending":
        return "A Caminho";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!isAdmin) return;
    
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status atualizado",
        description: `Pedido alterado para ${getStatusLabel(newStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Meus Pedidos</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">A caminho</SelectItem>
                    <SelectItem value="completed">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Data Início</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Data Fim</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Pedidos ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    {isAdmin && <TableHead>Cliente</TableHead>}
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead>Alterar Status</TableHead>}
                    <TableHead>Itens</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 7 : 5} className="text-center text-muted-foreground">
                        Nenhum pedido encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentOrders.map((order) => {
                      const paymentInfo = getPaymentMethodInfo(order.payment_method);
                      const PaymentIcon = paymentInfo.icon;
                      return (
                      <>
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id
                          )}
                        >
                          <TableCell>
                            {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          {isAdmin && (
                            <TableCell>
                              <span className="text-sm">{order.user_email || "—"}</span>
                            </TableCell>
                          )}
                          <TableCell>
                            <div className={`flex items-center gap-2 ${paymentInfo.color}`}>
                              {PaymentIcon && <PaymentIcon className="h-4 w-4" />}
                              <span>{paymentInfo.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </TableCell>
                          {isAdmin && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                                disabled={updatingOrderId === order.id}
                              >
                                <SelectTrigger className="w-[130px]">
                                  {updatingOrderId === order.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">A caminho</SelectItem>
                                  <SelectItem value="completed">Entregue</SelectItem>
                                  <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          )}
                          <TableCell>
                            {order.order_items.length} {order.order_items.length === 1 ? "item" : "itens"}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            R$ {Number(order.total_amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        {expandedOrderId === order.id && (
                          <TableRow>
                            <TableCell colSpan={isAdmin ? 7 : 5} className="bg-muted/30">
                              <div className="py-4">
                                <h4 className="font-semibold mb-3">Itens do Pedido:</h4>
                                <div className="space-y-2">
                                  {order.order_items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-center p-3 bg-background rounded-md"
                                    >
                                      <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Quantidade: {item.quantity}
                                        </p>
                                      </div>
                                      <p className="font-semibold">
                                        R$ {Number(item.price).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );})
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default Orders;
