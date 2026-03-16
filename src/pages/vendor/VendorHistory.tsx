import { CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const payments = [
  { date: "Mar 01, 2026", amount: "₱1,450.00", method: "GCash", status: "Paid", ref: "PC-2026-00390" },
  { date: "Feb 01, 2026", amount: "₱1,450.00", method: "Cash", status: "Paid", ref: "PC-2026-00345" },
  { date: "Jan 01, 2026", amount: "₱1,450.00", method: "PayMaya", status: "Paid", ref: "PC-2026-00301" },
  { date: "Dec 01, 2025", amount: "₱1,450.00", method: "GCash", status: "Late", ref: "PC-2025-00280" },
  { date: "Nov 01, 2025", amount: "₱1,450.00", method: "Cash", status: "Paid", ref: "PC-2025-00242" },
  { date: "Oct 01, 2025", amount: "₱1,450.00", method: "GCash", status: "Paid", ref: "PC-2025-00198" },
];

const VendorHistory = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
      <p className="text-sm text-muted-foreground">Complete record of all your stall payments</p>
    </div>

    <div className="rounded-2xl border bg-card shadow-civic overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reference</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Receipt</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {payments.map((p, i) => (
            <tr key={i} className="hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{p.date}</td>
              <td className="px-4 py-3 font-mono font-semibold text-foreground">{p.amount}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${p.status === "Paid" ? "text-success" : "text-accent"}`}>
                  {p.status === "Paid" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.ref}</td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default VendorHistory;
