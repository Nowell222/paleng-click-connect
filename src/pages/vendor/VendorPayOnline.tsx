import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2, Banknote, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
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

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const VendorPayOnline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [payType, setPayType] = useState<"full" | "staggered">("full");
  const [staggeredAmount, setStaggeredAmount] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-pay-info", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: vendor } = await supabase.from("vendors").select("id, stall_id, stalls(stall_number, section, monthly_rate)").eq("user_id", user!.id).single();
      if (!vendor) return null;
      const currentYear = new Date().getFullYear();
      const { data: payments } = await supabase
        .from("payments")
        .select("period_month, period_year, amount, payment_type, status")
        .eq("vendor_id", vendor.id)
        .eq("status", "completed")
        .eq("period_year", currentYear);

      // Calculate paid amounts per month (for staggered tracking)
      const monthPaidMap: Record<number, number> = {};
      (payments || []).forEach(p => {
        if (p.period_month) {
          monthPaidMap[p.period_month] = (monthPaidMap[p.period_month] || 0) + Number(p.amount);
        }
      });

      const stall = vendor.stalls as any;
      const monthlyRate = stall?.monthly_rate || 1450;

      // Find next unpaid month (first month where total paid < monthly rate)
      let nextUnpaidMonth = 1;
      for (let m = 1; m <= 12; m++) {
        const paid = monthPaidMap[m] || 0;
        if (paid < monthlyRate) {
          nextUnpaidMonth = m;
          break;
        }
        if (m === 12) nextUnpaidMonth = 13; // all paid
      }

      // Calculate remaining balance for the next unpaid month (for staggered)
      const paidForNextMonth = monthPaidMap[nextUnpaidMonth] || 0;
      const remainingBalance = monthlyRate - paidForNextMonth;

      return {
        vendor,
        stall,
        monthlyRate,
        monthPaidMap,
        nextUnpaidMonth,
        paidForNextMonth,
        remainingBalance,
        allPaid: nextUnpaidMonth > 12,
      };
    },
  });

  const stall = data?.stall;
  const monthlyRate = data?.monthlyRate || 1450;
  const nextUnpaidMonth = data?.nextUnpaidMonth || (new Date().getMonth() + 1);
  const remainingBalance = data?.remainingBalance || monthlyRate;
  const paidForNextMonth = data?.paidForNextMonth || 0;
  const payAmount = payType === "full" ? remainingBalance : Number(staggeredAmount || 0);

  const makePayment = useMutation({
    mutationFn: async () => {
      if (payType === "staggered" && (!staggeredAmount || Number(staggeredAmount) <= 0)) {
        throw new Error("Please enter a valid amount");
      }
      if (payType === "staggered" && Number(staggeredAmount) > remainingBalance) {
        throw new Error(`Amount cannot exceed remaining balance of ₱${remainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`);
      }
      const { data: payment, error } = await supabase.from("payments").insert({
        vendor_id: data!.vendor.id,
        stall_id: data!.vendor.stall_id || null,
        amount: payAmount,
        payment_method: selected as any,
        payment_type: payType === "full" ? "due" : "staggered",
        status: "completed",
        period_month: nextUnpaidMonth,
        period_year: new Date().getFullYear(),
      }).select("reference_number").single();
      if (error) throw error;
      return payment;
    },
    onSuccess: (payment) => {
      setRefNumber(payment.reference_number || "");
      setConfirmed(true);
      queryClient.invalidateQueries({ queryKey: ["vendor-pay-info"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-history"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-statement"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (data?.allPaid) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">All Paid for {new Date().getFullYear()}!</h2>
        <p className="mt-2 text-muted-foreground">You have no outstanding balance. All monthly fees are settled.</p>
      </div>
    );
  }

  if (confirmed) {
    const newRemaining = remainingBalance - payAmount;
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
        <p className="mt-2 text-muted-foreground">
          ₱{payAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })} for {MONTHS[nextUnpaidMonth - 1]} {new Date().getFullYear()}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Reference: {refNumber}</p>
        {payType === "staggered" && newRemaining > 0 && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 max-w-sm">
            <p className="text-sm font-medium text-foreground">Remaining for {MONTHS[nextUnpaidMonth - 1]}:</p>
            <p className="font-mono text-lg font-bold text-primary">₱{newRemaining.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
          </div>
        )}
        <Button variant="outline" className="mt-6" onClick={() => { setConfirmed(false); setSelected(null); setStaggeredAmount(""); }}>
          {newRemaining > 0 ? "Pay Remaining Balance" : "Pay Next Month (Advance)"}
        </Button>
      </div>
    );
  }

  const isAdvancePayment = nextUnpaidMonth > new Date().getMonth() + 1;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pay Online</h1>
        <p className="text-sm text-muted-foreground">Choose your payment method and complete your stall fee</p>
      </div>

      {/* Billing Info */}
      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Payment Details</h3>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stall</span>
            <span className="font-medium text-foreground">{stall?.stall_number || "—"} ({stall?.section || "General"})</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Billing Month</span>
            <span className="font-semibold text-foreground">
              {MONTHS[nextUnpaidMonth - 1]} {new Date().getFullYear()}
              {isAdvancePayment && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Advance</span>}
            </span>
          </div>
          {paidForNextMonth > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Already Paid</span>
              <span className="font-mono font-medium text-success">₱{paidForNextMonth.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="font-medium text-foreground">{paidForNextMonth > 0 ? "Remaining Balance" : "Monthly Rate"}</span>
            <span className="font-mono text-lg font-bold text-foreground">₱{remainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Payment Type */}
      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <h3 className="mb-3 text-sm font-medium text-foreground">Payment Type</h3>
        <div className="flex rounded-xl bg-secondary p-1">
          <button onClick={() => setPayType("full")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${payType === "full" ? "bg-card text-foreground shadow-civic" : "text-muted-foreground"}`}>Full Payment</button>
          <button onClick={() => setPayType("staggered")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${payType === "staggered" ? "bg-card text-foreground shadow-civic" : "text-muted-foreground"}`}>Staggered</button>
        </div>
        {payType === "staggered" && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-secondary/50 p-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Pay any amount towards your balance</p>
                  <p className="text-muted-foreground mt-0.5">
                    Remaining: <strong className="text-foreground">₱{remainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong>
                    {paidForNextMonth > 0 && <span> (already paid ₱{paidForNextMonth.toLocaleString("en-PH", { minimumFractionDigits: 2 })})</span>}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Amount to Pay (₱)</Label>
              <Input
                type="number"
                placeholder={`Max ₱${remainingBalance.toLocaleString()}`}
                value={staggeredAmount}
                onChange={e => setStaggeredAmount(e.target.value)}
                className="h-11 rounded-xl font-mono"
                max={remainingBalance}
              />
            </div>
            {staggeredAmount && Number(staggeredAmount) > 0 && Number(staggeredAmount) < remainingBalance && (
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm">
                <p className="text-accent font-medium">After this payment, you'll still owe:</p>
                <p className="font-mono text-lg font-bold text-accent">
                  ₱{(remainingBalance - Number(staggeredAmount)).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-muted-foreground text-xs mt-1">for {MONTHS[nextUnpaidMonth - 1]} {new Date().getFullYear()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gateway Selection */}
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

      <Button
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!selected || makePayment.isPending || (payType === "staggered" && (!staggeredAmount || Number(staggeredAmount) <= 0))}
        onClick={() => makePayment.mutate()}
      >
        {makePayment.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
        Confirm Payment — ₱{(payType === "full" ? remainingBalance : Number(staggeredAmount || 0)).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
      </Button>
    </div>
  );
};

export default VendorPayOnline;
