import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationTable } from "@/components/NotificationTable";
import { NotificationDialog } from "@/components/NotificationDialog";
import { Navigation } from "@/components/Navigation";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  expire_at: string;
  created_at: string;
  updated_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [searchTerm, notifications]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar notificações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    if (!searchTerm.trim()) {
      setFilteredNotifications(notifications);
      return;
    }

    const filtered = notifications.filter((notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotifications(filtered);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleAddNotification = () => {
    setSelectedNotification(null);
    setDialogOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setDialogOpen(true);
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      });
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir notificação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveNotification = async (data: Omit<Notification, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (selectedNotification) {
        const { error } = await supabase
          .from("notifications")
          .update(data)
          .eq("id", selectedNotification.id);

        if (error) throw error;

        toast({
          title: "Notificação atualizada",
          description: "A notificação foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("notifications")
          .insert([{ ...data, user_id: user.id }]);

        if (error) throw error;

        toast({
          title: "Notificação criada",
          description: "A notificação foi criada com sucesso.",
        });
      }

      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar notificação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSignOut={handleSignOut} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Notificações</h1>
          <p className="text-muted-foreground">Gerencie as notificações do sistema</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddNotification}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Notificação
          </Button>
        </div>

        <NotificationTable
          notifications={filteredNotifications}
          onEdit={handleEditNotification}
          onDelete={handleDeleteNotification}
        />

        <NotificationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          notification={selectedNotification}
          onSave={handleSaveNotification}
        />
      </div>
    </div>
  );
};

export default Notifications;
