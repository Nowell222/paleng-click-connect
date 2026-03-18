import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Building2, Banknote, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const gateways = [
  { id: "gcash", label: "GCash", icon: Smartphone, color: "bg-blue-500" },
  { id: "paymaya", label: "PayMaya", icon: Smartphone, color: "bg-green-500" },
  { id: "instapay", label: "Instapay", icon: Building2, color: "bg-primary" },
  { id: "cash", label: "Cash (at Cashier)", icon: Banknote, color: "bg-muted" },
];

const VendorPayOnline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [payType, setPayType] = useState<"full" | "staggered">("full");
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const { data } = useQuery({
    queryKey: ["vendor-pay-info", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: vendor } = await supabase.from("vendors").select("id, stalls(stall_number, section, monthly_rate)").eq("user_id", user!.id).single();
      return vendor;
    },
  });

  const stall = data?.stalls as any;
  const monthlyRate = stall?.monthly_rate || 1450;
  const payAmount = payType === "full" ? monthlyRate : monthlyRate / 2;

  const makePayment = useMutation({
    mutationFn: async () => {
      const { data: payment, error } = await supabase.from("payments").insert({
        vendor_id: data!.id,
        stall_id: null,
        amount: payAmount,
        payment_method: selected as any,
        payment_type: payType === "full" ? "due" : "staggered",
        status: "completed",
        period_month: new Date().getMonth() + 1,
        period_year: new Date().getFullYear(),
      }).select("reference_number").single();
      if (error) throw error;
      return payment;
    },
    onSuccess: (payment) => {
      setRefNumber(payment.reference_number || "");
      setConfirmed(true);
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-history"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
        <p className="mt-2 text-muted-foreground">Your payment of ₱{payAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })} has been processed.</p>
        <p className="mt-1 text-sm text-muted-foreground">Reference: {refNumber}</p>
        <Button variant="outline" className="mt-6" onClick={() => { setConfirmed(false); setSelected(null); }}>Make Another Payment</Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pay Online</h1>
        <p className="text-sm text-muted-foreground">Choose your payment method and complete your stall fee</p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Payment Details</h3>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stall</span>
            <span className="font-medium text-foreground">{stall?.stall_number || "—"} ({stall?.section || "General"})</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="font-medium text-foreground">Monthly Rate</span>
            <span className="font-mono text-lg font-bold text-foreground">₱{Number(monthlyRate).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <h3 className="mb-3 text-sm font-medium text-foreground">Payment Type</h3>
        <div className="flex rounded-xl bg-secondary p-1">
          <button onClick={() => setPayType("full")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${payType === "full" ? "bg-card text-foreground shadow-civic" : "text-muted-foreground"}`}>Full Payment</button>
          <button onClick={() => setPayType("staggered")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${payType === "staggered" ? "bg-card text-foreground shadow-civic" : "text-muted-foreground"}`}>Staggered</button>
        </div>
        {payType === "staggered" && (
          <div className="mt-3 rounded-xl bg-secondary/50 p-3 text-sm text-muted-foreground">
            Pay in <strong className="text-foreground">2 installments</strong>: ₱{(monthlyRate / 2).toLocaleString("en-PH", { minimumFractionDigits: 2 })} now
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <h3 className="mb-3 text-sm font-medium text-foreground">Choose Payment Gateway</h3>
        <div className="grid grid-cols-2 gap-3">
          {gateways.map((g) => (
            <button key={g.id} onClick={() => setSelected(g.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${selected === g.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-secondary/50"}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${g.color}`}>
                <g.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Button variant="hero" size="xl" className="w-full" disabled={!selected || makePayment.isPending} onClick={() => makePayment.mutate()}>
        {makePayment.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
        Confirm Payment — ₱{payAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
      </Button>
    </div>
  );
};

export default VendorPayOnline;
