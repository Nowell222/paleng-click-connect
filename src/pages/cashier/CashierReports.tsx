import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", amount: 28000 }, { day: "Tue", amount: 32000 }, { day: "Wed", amount: 25000 },
  { day: "Thu", amount: 31000 }, { day: "Fri", amount: 38000 }, { day: "Sat", amount: 45000 },
];

const reports = [
  { label: "Daily Collection Report", desc: "Today's payment summary" },
  { label: "Payment Receipt Log", desc: "All receipts issued today" },
  { label: "Vendor Payment Status", desc: "Outstanding balances per vendor" },
];

const CashierReports = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>
      <p className="text-sm text-muted-foreground">Generate and print collection reports</p>
    </div>

    <div className="rounded-2xl border bg-card p-6 shadow-civic">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Daily Collections</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,88%)" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} tickFormatter={(v) => `₱${v / 1000}k`} />
          <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
          <Bar dataKey="amount" fill="hsl(185,60%,35%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      {reports.map((r) => (
        <div key={r.label} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-civic">
          <FileText className="h-8 w-8 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{r.label}</p>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
          </div>
          <Button variant="outline" size="sm">View</Button>
        </div>
      ))}
    </div>
  </div>
);

export default CashierReports;
