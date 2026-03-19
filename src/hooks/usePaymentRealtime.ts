import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UsePaymentRealtimeOptions {
  paymentId: string | null;
  onConfirmed: (data: { payment_id: string; amount: number; payment_method: string }) => void;
  onFailed?: () => void;
}

export function usePaymentRealtime({ paymentId, onConfirmed, onFailed }: UsePaymentRealtimeOptions) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase
      .channel(`payment-status-${paymentId}`)
      // Listens for DB row change when webhook updates status
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payments",
          filter: `id=eq.${paymentId}`,
        },
        (payload) => {
          const row = payload.new as any;
          if (row.status === "completed") {
            onConfirmed({ payment_id: row.id, amount: row.amount, payment_method: row.payment_method });
          } else if (row.status === "failed") {
            onFailed?.();
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [paymentId]);
}