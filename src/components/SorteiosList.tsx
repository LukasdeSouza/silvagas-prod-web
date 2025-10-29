import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Package } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Sorteio = Database["public"]["Tables"]["sorteios"]["Row"];

interface SorteiosListProps {
  sorteios: Sorteio[];
  onDelete: (id: string) => void;
}

export const SorteiosList = ({ sorteios, onDelete }: SorteiosListProps) => {
  if (sorteios.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum sorteio criado ainda. Crie seu primeiro sorteio!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sorteios.map((sorteio) => (
        <Card key={sorteio.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {sorteio.image_url && (
            <div className="h-48 overflow-hidden">
              <img
                src={sorteio.image_url}
                alt={sorteio.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <span className="text-lg">{sorteio.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sorteio.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {sorteio.description}
              </p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(sorteio.created_at).toLocaleDateString("pt-BR")}
              </div>
              {sorteio.product_id && (
                <div className="flex items-center text-muted-foreground">
                  <Package className="h-4 w-4 mr-2" />
                  Produto vinculado
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(sorteio.id)}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
