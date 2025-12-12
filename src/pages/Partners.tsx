import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PartnerTable } from "@/components/PartnerTable";
import { PartnerDialog } from "@/components/PartnerDialog";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

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

const Partners = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isLoading: isRoleLoading } = useUserRole();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar parceiros",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const partner = partners.find(p => p.id === id);
      
      if (partner?.logo_url) {
        const fileName = partner.logo_url.split("/").pop();
        if (fileName) {
          await supabase.storage.from("partner-logos").remove([fileName]);
        }
      }

      const { error } = await supabase.from("partners").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Parceiro excluído",
        description: "O parceiro foi removido com sucesso.",
      });

      fetchPartners();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir parceiro",
        description: error.message,
      });
    }
  };

  const handleSave = () => {
    setDialogOpen(false);
    setSelectedPartner(null);
    fetchPartners();
  };

  const handleNewPartner = () => {
    setSelectedPartner(null);
    setDialogOpen(true);
  };

  if (isRoleLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onSignOut={handleSignOut} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSignOut={handleSignOut} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Parceiros</h1>
              <p className="text-muted-foreground">
                Gerencie os parceiros e seus cupons de desconto
              </p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={handleNewPartner} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Parceiro
            </Button>
          )}
        </div>

        <PartnerTable
          partners={partners}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PartnerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          partner={selectedPartner}
          onSave={handleSave}
        />
      </main>
    </div>
  );
};

export default Partners;
