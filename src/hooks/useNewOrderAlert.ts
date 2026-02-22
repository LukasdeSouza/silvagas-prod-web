import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

function playNotificationSound() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Two-tone alert
  const playTone = (freq: number, startTime: number, duration: number) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const now = audioCtx.currentTime;
  playTone(880, now, 0.15);
  playTone(1100, now + 0.18, 0.15);
  playTone(880, now + 0.4, 0.15);
  playTone(1100, now + 0.58, 0.15);
}

export function useNewOrderAlert() {
  const { toast } = useToast();
  const { isAdmin } = useUserRole();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("new-orders-alert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          // Skip the first load to avoid alert on page refresh
          if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
          }

          playNotificationSound();

          const amount = Number(payload.new.total_amount).toFixed(2);
          toast({
            title: "🔔 Novo Pedido Recebido!",
            description: `Um novo pedido de R$ ${amount} foi criado. Acompanhe o status de entrega.`,
            duration: 10000,
          });
        }
      )
      .subscribe();

    // After subscribing, mark first load as done after a short delay
    const timer = setTimeout(() => {
      isFirstLoad.current = false;
    }, 2000);

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);
}
