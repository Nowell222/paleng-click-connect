import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle2, CreditCard } from "lucide-react";

const CashierAcceptPayment = () => {
  const [found, setFound] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Payment Recorded!</h2>
        <p className="mt-2 text-muted-foreground">₱1,450.00 from Maria Santos (Stall A-042)</p>
        <p className="mt-1 text-sm text-muted-foreground">Receipt: PC-2026-00413</p>
        <div className="mt-6 flex gap-2">
          <Button variant="outline">Print Receipt</Button>
          <Button onClick={() => { setDone(false); setFound(false); }}>New Payment</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Accept Payment</h1>
        <p className="text-sm text-muted-foreground">Process cash payments from vendors</p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-civic space-y-4">
        <div className="space-y-1.5">
          <Label>Search Vendor</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Name or stall number..." className="h-11 pl-10 rounded-xl" />
            </div>
            <Button onClick={() => setFound(true)}>Search</Button>
          </div>
        </div>
      </div>

      {found && (
        <>
          <div className="rounded-2xl border bg-card p-6 shadow-civic space-y-3">
            <h3 className="font-semibold text-foreground">Vendor Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-muted-foreground">Name</p><p className="font-medium text-foreground">Maria Santos</p></div>
              <div><p className="text-muted-foreground">Stall</p><p className="font-mono font-medium text-foreground">A-042</p></div>
              <div><p className="text-muted-foreground">Section</p><p className="font-medium text-foreground">Fish</p></div>
              <div><p className="text-muted-foreground">Contact</p><p className="font-medium text-foreground">09171234567</p></div>
            </div>
            <div className="rounded-xl bg-accent/10 p-3">
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              <p className="font-mono text-2xl font-bold text-accent">₱1,450.00</p>
              <p className="text-xs text-muted-foreground">Due: April 1, 2026</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-civic space-y-4">
            <h3 className="font-semibold text-foreground">Payment Details</h3>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input defaultValue="1450.00" className="h-11 rounded-xl font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Payment Method</Label>
              <select className="h-11 w-full rounded-xl border bg-background px-3 text-sm">
                <option>Cash</option>
                <option>GCash</option>
                <option>PayMaya</option>
              </select>
            </div>
            <Button variant="hero" size="lg" className="w-full" onClick={() => setDone(true)}>
              <CreditCard className="mr-2 h-5 w-5" /> Record Payment
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CashierAcceptPayment;
