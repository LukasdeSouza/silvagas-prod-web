import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Package, Trophy, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SorteioRoulette } from "./SorteioRoulette";
import type { Database } from "@/integrations/supabase/types";

type Sorteio = Database["public"]["Tables"]["sorteios"]["Row"];

interface SorteiosListProps {
  sorteios: Sorteio[];
  onDelete: (id: string) => void;
}

export const SorteiosList = ({ sorteios, onDelete }: SorteiosListProps) => {
  const [selectedSorteio, setSelectedSorteio] = useState<Sorteio | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  const handleRealizarSorteio = (sorteio: Sorteio) => {
    setSelectedSorteio(sorteio);
    setIsRouletteOpen(true);
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorteios.map((sorteio) => {
          const shouldDrawToday = sorteio.end_date && isToday(sorteio.end_date);
          
          return (
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
                {shouldDrawToday && (
                  <Alert className="mb-4 border-primary bg-primary/10">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary font-medium">
                      Último dia! Realize o sorteio hoje.
                    </AlertDescription>
                  </Alert>
                )}
                
                {sorteio.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {sorteio.description}
                  </p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Início: {sorteio.start_date ? formatDate(sorteio.start_date) : "N/A"}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Fim: {sorteio.end_date ? formatDate(sorteio.end_date) : "N/A"}
                  </div>
                  {sorteio.product_id && (
                    <div className="flex items-center text-muted-foreground">
                      <Package className="h-4 w-4 mr-2" />
                      Produto vinculado
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleRealizarSorteio(sorteio)}
                    className="w-full"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Realizar Sorteio
                  </Button>
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
          );
        })}
      </div>

      {selectedSorteio && (
        <SorteioRoulette
          open={isRouletteOpen}
          onOpenChange={setIsRouletteOpen}
          sorteioId={selectedSorteio.id}
          sorteioName={selectedSorteio.name}
        />
      )}
    </>
  );
};
