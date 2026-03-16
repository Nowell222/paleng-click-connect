import { DollarSign, Users, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Today's Collections", value: "₱28,500", icon: DollarSign },
  { label: "Transactions Today", value: "18", icon: CheckCircle2 },
  { label: "Pending", value: "5", icon: Clock },
  { label: "Vendors Served", value: "15", icon: Users },
];

const recent = [
  { vendor: "Maria Santos", stall: "A-042", amount: "₱1,450.00", ref: "PC-2026-00412", time: "10:32 AM" },
  { vendor: "Juan Reyes", stall: "B-015", amount: "₱2,100.00", ref: "PC-2026-00411", time: "10:15 AM" },
  { vendor: "Rosa Garcia", stall: "C-003", amount: "₱1,450.00", ref: "PC-2026-00410", time: "9:45 AM" },
];

const CashierDashboardHome = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-foreground">Cashier Terminal</h1>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-civic">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">{s.value}</p>
        </div>
      ))}
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <Link to="/cashier/accept" className="rounded-2xl border bg-primary p-6 shadow-civic-lg text-center hover:bg-primary/90 transition-colors">
        <DollarSign className="mx-auto h-8 w-8 text-primary-foreground" />
        <h3 className="mt-2 text-lg font-bold text-primary-foreground">Accept Payment</h3>
        <p className="mt-1 text-sm text-primary-foreground/80">Process cash or online payments</p>
      </Link>
      <Link to="/cashier/search" className="rounded-2xl border bg-card p-6 shadow-civic text-center hover:bg-secondary/50 transition-colors">
        <Users className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-2 text-lg font-bold text-foreground">Search Vendor</h3>
        <p className="mt-1 text-sm text-muted-foreground">Look up vendor details and dues</p>
      </Link>
    </div>

    <div className="rounded-2xl border bg-card shadow-civic">
      <div className="border-b p-4"><h3 className="font-semibold text-foreground">Recent Receipts</h3></div>
      <div className="divide-y">
        {recent.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">{r.vendor}</p>
                <p className="text-xs text-muted-foreground">Stall {r.stall} • {r.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold text-foreground">{r.amount}</p>
              <p className="text-xs text-muted-foreground">{r.ref}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CashierDashboardHome;
