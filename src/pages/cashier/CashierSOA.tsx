import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Printer, Download } from "lucide-react";

const CashierSOA = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Print Statement of Account</h1>
      <p className="text-sm text-muted-foreground">Search a vendor and print their official Statement of Account</p>
    </div>

    <div className="rounded-2xl border bg-card p-6 shadow-civic max-w-lg space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Enter vendor name or stall number..." className="h-11 pl-10 rounded-xl" />
        </div>
        <Button>Search</Button>
      </div>
    </div>

    {/* Preview SOA */}
    <div className="rounded-2xl border bg-card p-6 shadow-civic max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Statement Preview</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
        </div>
      </div>

      <div className="mb-4 border-b pb-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Municipality of San Juan, Batangas</p>
        <p className="text-sm font-semibold text-foreground">STATEMENT OF ACCOUNT</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div><p className="text-muted-foreground">Vendor</p><p className="font-medium text-foreground">Maria Santos</p></div>
        <div><p className="text-muted-foreground">Stall</p><p className="font-mono font-medium text-foreground">A-042</p></div>
      </div>

      <table className="w-full text-sm">
        <thead><tr className="border-b"><th className="pb-2 text-left text-muted-foreground">Period</th><th className="pb-2 text-right text-muted-foreground">Amount</th><th className="pb-2 text-right text-muted-foreground">Status</th></tr></thead>
        <tbody className="divide-y">
          {["January", "February", "March"].map((m) => (
            <tr key={m}><td className="py-2 text-foreground">{m} 2026</td><td className="py-2 text-right font-mono">₱1,450.00</td><td className="py-2 text-right text-success font-semibold">Paid</td></tr>
          ))}
          <tr><td className="py-2 text-foreground">April 2026</td><td className="py-2 text-right font-mono">₱1,450.00</td><td className="py-2 text-right text-muted-foreground">Pending</td></tr>
        </tbody>
      </table>

      <div className="flex justify-between border-t pt-3 mt-3 text-sm">
        <span className="font-medium text-foreground">Outstanding</span>
        <span className="font-mono text-lg font-bold text-accent">₱1,450.00</span>
      </div>
    </div>
  </div>
);

export default CashierSOA;
