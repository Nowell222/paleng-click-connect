import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const dailyData = [
  { day: "Mon", amount: 28000 }, { day: "Tue", amount: 32000 }, { day: "Wed", amount: 25000 },
  { day: "Thu", amount: 31000 }, { day: "Fri", amount: 38000 }, { day: "Sat", amount: 45000 },
];

const reportTypes = [
  { label: "Daily Collection", desc: "View/Print daily collection summary" },
  { label: "Weekly Collection", desc: "View/Print weekly collection summary" },
  { label: "Monthly Collection", desc: "View/Print monthly collection summary" },
  { label: "Delinquent Vendors", desc: "List of vendors with overdue payments" },
  { label: "Vendor Payment History", desc: "Individual vendor payment records" },
  { label: "Stall Summary", desc: "Overview of all stalls and their status" },
];

const AdminReports = () => {
  const [period, setPeriod] = useState("Daily");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate, view, and export collection and vendor reports</p>
      </div>

      {/* Advance Filtering */}
      <div className="rounded-2xl border bg-card p-5 shadow-civic">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Advanced Filtering</h3>
        <div className="flex flex-wrap gap-3">
          <input type="date" className="h-10 rounded-xl border bg-background px-3 text-sm" />
          <span className="self-center text-sm text-muted-foreground">to</span>
          <input type="date" className="h-10 rounded-xl border bg-background px-3 text-sm" />
          <div className="flex rounded-xl bg-secondary p-1">
            {["Daily", "Weekly", "Monthly"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${period === p ? "bg-card text-foreground shadow-civic" : "text-muted-foreground"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{period} Collections</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF</Button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,88%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} tickFormatter={(v) => `₱${v / 1000}k`} />
            <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
            <Bar dataKey="amount" fill="hsl(185,60%,35%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-civic text-center">
          <p className="text-sm text-muted-foreground">Collectible Overdue</p>
          <p className="mt-1 font-mono text-xl font-bold text-accent">₱284,500</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-civic text-center">
          <p className="text-sm text-muted-foreground">Total Cash Collected</p>
          <p className="mt-1 font-mono text-xl font-bold text-foreground">₱842,000</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-civic text-center">
          <p className="text-sm text-muted-foreground">Monthly Total</p>
          <p className="mt-1 font-mono text-xl font-bold text-success">₱142,000</p>
        </div>
      </div>

      {/* Report Types */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Available Reports</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((r) => (
            <div key={r.label} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-civic">
              <FileText className="h-8 w-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
