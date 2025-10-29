import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SorteioRouletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sorteioId: string;
  sorteioName: string;
}

interface Participant {
  user_id: string;
  email: string;
}

export const SorteioRoulette = ({
  open,
  onOpenChange,
  sorteioId,
  sorteioName,
}: SorteioRouletteProps) => {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentHighlight, setCurrentHighlight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchParticipants();
      setWinner(null);
    }
  }, [open, sorteioId]);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sorteio_participants")
        .select(`
          user_id,
          profiles!inner(email)
        `)
        .eq("sorteio_id", sorteioId);

      if (error) throw error;

      const participantsData = (data || []).map((p: any) => ({
        user_id: p.user_id,
        email: p.profiles.email,
      }));

      setParticipants(participantsData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar participantes",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRoulette = () => {
    if (participants.length === 0) {
      toast({
        variant: "destructive",
        title: "Sem participantes",
        description: "Não há participantes neste sorteio.",
      });
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    let counter = 0;
    const totalSpins = 30 + Math.floor(Math.random() * 20);

    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % participants.length);
      counter++;

      if (counter >= totalSpins) {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winnerEmail = participants[winnerIndex].email;
        setWinner(winnerEmail);
        setIsSpinning(false);

        toast({
          title: "🎉 Temos um vencedor!",
          description: winnerEmail,
        });
      }
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Realizar Sorteio: {sorteioName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Total de participantes: {participants.length}
              </p>
            </div>

            {/* Roulette Display */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg">
              {participants.map((participant, index) => (
                <Card
                  key={participant.user_id}
                  className={`transition-all duration-200 ${
                    isSpinning && index === currentHighlight
                      ? "ring-4 ring-primary scale-105 bg-primary/20"
                      : winner === participant.email
                      ? "ring-4 ring-green-500 scale-105 bg-green-500/20"
                      : ""
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-xs truncate text-center">
                      {participant.email}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Winner Display */}
            {winner && (
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary rounded-lg p-6 text-center animate-fade-in">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-2xl font-bold mb-2">🎉 Vencedor!</h3>
                <p className="text-lg bg-background px-4 py-2 rounded inline-block">
                  {winner}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSpinning}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                onClick={startRoulette}
                disabled={isSpinning || participants.length === 0}
                className="flex-1"
              >
                {isSpinning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSpinning ? "Sorteando..." : "Iniciar Sorteio"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
