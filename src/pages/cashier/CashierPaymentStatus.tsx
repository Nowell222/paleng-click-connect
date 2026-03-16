import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const payments = [
  { vendor: "Maria Santos", stall: "A-042", amount: "₱1,450.00", method: "Cash", status: "Completed", time: "10:32 AM" },
  { vendor: "Juan Reyes", stall: "B-015", amount: "₱2,100.00", method: "Cash", status: "Completed", time: "10:15 AM" },
  { vendor: "Rosa Garcia", stall: "C-003", amount: "₱1,450.00", method: "GCash", status: "Pending", time: "9:45 AM" },
  { vendor: "Pedro Lim", stall: "A-088", amount: "₱725.00", method: "Cash", status: "Completed", time: "9:30 AM" },
  { vendor: "Ana Cruz", stall: "D-011", amount: "₱1,450.00", method: "PayMaya", status: "Failed", time: "9:10 AM" },
];

const statusIcon = { Completed: CheckCircle2, Pending: Clock, Failed: AlertCircle };
const statusColor = { Completed: "text-success", Pending: "text-primary", Failed: "text-accent" };

const CashierPaymentStatus = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Payment Status</h1>
      <p className="text-sm text-muted-foreground">View status of all processed payments</p>
    </div>

    <div className="rounded-2xl border bg-card shadow-civic overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vendor</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stall</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {payments.map((p, i) => {
            const Icon = statusIcon[p.status as keyof typeof statusIcon];
            const color = statusColor[p.status as keyof typeof statusColor];
            return (
              <tr key={i} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{p.vendor}</td>
                <td className="px-4 py-3 font-mono text-foreground">{p.stall}</td>
                <td className="px-4 py-3 font-mono font-semibold text-foreground">{p.amount}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${color}`}>
                    <Icon className="h-3 w-3" /> {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default CashierPaymentStatus;
