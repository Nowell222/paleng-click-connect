import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Smartphone, Building2, Banknote, CheckCircle2,
  Loader2, AlertTriangle, QrCode, Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePaymentRealtime } from "@/hooks/usePaymentRealtime";
import { useEffect } from "react";

const ONLINE_GATEWAYS = [
  { id: "gcash",    label: "GCash",    icon: Smartphone, color: "bg-blue-500",  desc: "Scan with GCash app" },
  { id: "paymaya",  label: "Maya",     icon: Smartphone, color: "bg-green-500", desc: "Scan with Maya app" },
  { id: "instapay", label: "InstaPay", icon: Building2,  color: "bg-primary",   desc: "Bank transfer via QR" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── QR Modal ────────────────────────────────────────────────────────────────
interface QRModalProps {
  qrImage: string | null;
  redirectUrl: string | null;
  amount: number;
  channel: string;
  paymentId: string;
  month: string;
  year: number;
  refId: string;
  onSuccess: (data: { amount: number; payment_method: string }) => void;
  onClose: () => void;
}

const QRModal = ({ qrImage, redirectUrl, amount, channel, paymentId, month, year, refId, onSuccess, onClose }: QRModalProps) => {
  const [elapsed, setElapsed] = useState(0);
  const EXPIRY = 600;

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = EXPIRY - elapsed;
  const expired = remaining <= 0;
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  usePaymentRealtime({
    paymentId,
    onConfirmed: (d) => onSuccess({ amount: d.amount, payment_method: d.payment_method }),
    onFailed: () => { toast.error("Payment failed or was cancelled."); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl">
        <div className="mb-4 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Scan to Pay</h2>
          <p className="text-sm text-muted-foreground">
            {channel === "gcash" ? "Open GCash → Pay QR" : channel === "paymaya" ? "Open Maya → Scan QR" : "Open your bank app → Scan QR"}
          </p>
        </div>

        <div className="flex justify-center mb-4">
          {qrImage ? (
            <div className="rounded-xl border-2 border-primary/20 bg-white p-3">
              <img src={qrImage} alt="Payment QR Code" className="h-48 w-48 object-contain" />
            </div>
          ) : redirectUrl ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <p className="text-sm text-muted-foreground text-center">Tap to open payment page:</p>
              <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="lg">Open {channel === "gcash" ? "GCash" : "Maya"} Payment</Button>
              </a>
            </div>
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-border">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="mb-4 rounded-xl bg-secondary/50 p-3 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount to Pay</p>
          <p className="font-mono text-2xl font-bold text-foreground">
            ₱{amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">{month} {year}</p>
        </div>

        {!expired ? (
          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Expires in <strong className={remaining < 60 ? "text-destructive" : "text-foreground"}>{mm}:{String(ss).padStart(2, "0")}</strong></span>
          </div>
        ) : (
          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>QR expired. Please generate a new one.</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span>Waiting for payment confirmation...</span>
        </div>

        <p className="text-center text-xs text-muted-foreground font-mono mb-3">Ref: {refId}</p>

        <Button variant="outline" size="sm" className="w-full" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const VendorPayOnline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<string | null>(null);
  const [payType, setPayType] = useState<"full" | "staggered">("full");
  const [staggeredAmount, setStaggeredAmount] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{ amount: number; payment_method: string } | null>(null);
  const [refNumber, setRefNumber] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-pay-info", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: vendor } = await supabase
        .from("vendors").select("id, stall_id, stalls(stall_number, section, monthly_rate)")
        .eq("user_id", user!.id).single();
      if (!vendor) return null;
      const currentYear = new Date().getFullYear();
      const { data: payments } = await supabase.from("payments")
        .select("period_month, period_year, amount, payment_type, status")
        .eq("vendor_id", vendor.id).eq("status", "completed").eq("period_year", currentYear);
      const monthPaidMap: Record<number, number> = {};
      (payments || []).forEach((p) => {
        if (p.period_month) monthPaidMap[p.period_month] = (monthPaidMap[p.period_month] || 0) + Number(p.amount);
      });
      const stall = vendor.stalls as any;
      const monthlyRate = stall?.monthly_rate || 1450;
      let nextUnpaidMonth = 1;
      for (let m = 1; m <= 12; m++) {
        if ((monthPaidMap[m] || 0) < monthlyRate) { nextUnpaidMonth = m; break; }
        if (m === 12) nextUnpaidMonth = 13;
      }
      const paidForNextMonth = monthPaidMap[nextUnpaidMonth] || 0;
      const remainingBalance = monthlyRate - paidForNextMonth;
      return { vendor, stall, monthlyRate, nextUnpaidMonth, paidForNextMonth, remainingBalance, allPaid: nextUnpaidMonth > 12 };
    },
  });

  const stall = data?.stall;
  const nextUnpaidMonth = data?.nextUnpaidMonth || (new Date().getMonth() + 1);
  const remainingBalance = data?.remainingBalance || (data?.monthlyRate || 1450);
  const paidForNextMonth = data?.paidForNextMonth || 0;
  const payAmount = payType === "full" ? remainingBalance : Number(staggeredAmount || 0);

  const handlePay = async () => {
    if (!selected || !data) return;
    if (selected === "cash") { toast.info("Please proceed to the cashier window to pay in cash."); return; }
    if (payType === "staggered") {
      if (!staggeredAmount || Number(staggeredAmount) <= 0) { toast.error("Please enter a valid amount"); return; }
      if (Number(staggeredAmount) > remainingBalance) { toast.error(`Amount cannot exceed ₱${remainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`); return; }
    }
    setGeneratingQR(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("paymongo-create-source", {
        body: {
          amount: payAmount, channel: selected,
          vendor_id: data.vendor.id, stall_id: data.vendor.stall_id || null,
          payment_type: payType === "full" ? "due" : "staggered",
          period_month: nextUnpaidMonth, period_year: new Date().getFullYear(),
        },
      });
      if (error || result?.error) throw new Error(error?.message || result?.error);
      setQrImage(result.qr_image);
      setRedirectUrl(result.redirect_url);
      setPendingPaymentId(result.payment_id);
      setRefNumber(result.ref_id);
      setShowQR(true);
    } catch (err: any) {
      toast.error("Failed to generate QR: " + err.message);
    } finally {
      setGeneratingQR(false);
    }
  };

  const handlePaymentSuccess = (payData: { amount: number; payment_method: string }) => {
    setShowQR(false);
    setConfirmedData(payData);
    setConfirmed(true);
    queryClient.invalidateQueries({ queryKey: ["vendor-pay-info"] });
    queryClient.invalidateQueries({ queryKey: ["vendor-dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["vendor-history"] });
    queryClient.invalidateQueries({ queryKey: ["vendor-statement"] });
    queryClient.invalidateQueries({ queryKey: ["vendor-notifications"] });
    toast.success("Payment confirmed!");
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (data?.allPaid) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"><CheckCircle2 className="h-10 w-10 text-success" /></div>
      <h2 className="text-2xl font-bold text-foreground">All Paid for {new Date().getFullYear()}!</h2>
      <p className="mt-2 text-muted-foreground">You have no outstanding balance.</p>
    </div>
  );

  if (confirmed && confirmedData) {
    const newRemaining = remainingBalance - confirmedData.amount;
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"><CheckCircle2 className="h-10 w-10 text-success" /></div>
        <h2 className="text-2xl font-bold text-foreground">Payment Confirmed!</h2>
        <p className="mt-2 text-muted-foreground">₱{confirmedData.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })} for {MONTHS[nextUnpaidMonth - 1]} {new Date().getFullYear()}</p>
        <p className="mt-1 text-sm text-muted-foreground capitalize">via {confirmedData.payment_method}</p>
        <p className="mt-1 text-xs font-mono text-muted-foreground">Ref: {refNumber}</p>
        {payType === "staggered" && newRemaining > 0 && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 max-w-sm">
            <p className="text-sm font-medium text-foreground">Remaining for {MONTHS[nextUnpaidMonth - 1]}:</p>
            <p className="font-mono text-lg font-bold text-primary">₱{newRemaining.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
          </div>
        )}
        <Button variant="outline" className="mt-6" onClick={() => { setConfirmed(false); setConfirmedData(null); setSelected(null); setStaggeredAmount(""); }}>
          {newRemaining > 0 ? "Pay Remaining Balance" : "Pay Next Month"}
        </Button>
      </div>
    );
  }

  const isAdvancePayment = nextUnpaidMonth > new Date().getMonth() + 1;

  return (
    <>
      {showQR && pendingPaymentId && (
        <QRModal
          qrImage={qrImage} redirectUrl={redirectUrl} amount={payAmount}
          channel={selected!} paymentId={pendingPaymentId}
          month={MONTHS[nextUnpaidMonth - 1]} year={new Date().getFullYear()}
          refId={refNumber}
          onSuccess={handlePaymentSuccess}
          onClose={() => { setShowQR(false); setPendingPaymentId(null); }}
        />
      )}

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
                    <p className="text-muted-foreground mt-0.5">Remaining: <strong className="text-foreground">₱{remainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong></p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Amount to Pay (₱)</Label>
                <Input type="number" placeholder={`Max ₱${remainingBalance.toLocaleString()}`} value={staggeredAmount}
                  onChange={(e) => setStaggeredAmount(e.target.value)} className="h-11 rounded-xl font-mono" max={remainingBalance} />
              </div>
              {staggeredAmount && Number(staggeredAmount) > 0 && Number(staggeredAmount) < remainingBalance && (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm">
                  <p className="text-accent font-medium">After this payment, you'll still owe:</p>
                  <p className="font-mono text-lg font-bold text-accent">₱{(remainingBalance - Number(staggeredAmount)).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gateway Selection */}
        <div className="rounded-2xl border bg-card p-6 shadow-civic">
          <h3 className="mb-3 text-sm font-medium text-foreground">Online Payment (QR Code)</h3>
          <div className="space-y-2">
            {ONLINE_GATEWAYS.map((g) => (
              <button key={g.id} onClick={() => setSelected(g.id)}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 transition-all ${selected === g.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-secondary/50"}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${g.color}`}>
                  <g.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-foreground">{g.label}</p>
                  <p className="text-xs text-muted-foreground">{g.desc}</p>
                </div>
                {selected === g.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3"><div className="flex-1 border-t" /><span className="text-xs text-muted-foreground">or</span><div className="flex-1 border-t" /></div>
          <button onClick={() => setSelected("cash")}
            className={`mt-3 flex w-full items-center gap-4 rounded-xl border p-4 transition-all ${selected === "cash" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-secondary/50"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Banknote className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-foreground">Cash at Cashier</p>
              <p className="text-xs text-muted-foreground">Pay in person at the market office</p>
            </div>
            {selected === "cash" && <CheckCircle2 className="h-5 w-5 text-primary" />}
          </button>
        </div>

        {selected && selected !== "cash" && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground mb-2">How it works:</p>
            <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
              <li>Click the button below to generate your QR code</li>
              <li>Open your {selected === "gcash" ? "GCash" : selected === "paymaya" ? "Maya" : "banking"} app and scan</li>
              <li>Confirm the payment in your app</li>
              <li>This page updates automatically when payment is confirmed</li>
            </ol>
          </div>
        )}

        <Button variant="hero" size="xl" className="w-full"
          disabled={!selected || generatingQR || (payType === "staggered" && (!staggeredAmount || Number(staggeredAmount) <= 0))}
          onClick={handlePay}>
          {generatingQR ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Generating QR...</>
          ) : selected === "cash" ? (
            <><Banknote className="mr-2 h-5 w-5" />Go to Cashier — ₱{payAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</>
          ) : (
            <><QrCode className="mr-2 h-5 w-5" />Generate QR — ₱{payAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</>
          )}
        </Button>
      </div>
    </>
  );
};

export default VendorPayOnline;
