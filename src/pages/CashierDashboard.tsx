import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bell,
  Receipt,
  CheckCircle2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const pendingPayments = [
  { vendor: "Luis Bautista", stall: "A-055", amount: "₱1,450.00", due: "Apr 1, 2026" },
  { vendor: "Carmen Villanueva", stall: "B-023", amount: "₱2,900.00", due: "Mar 15, 2026" },
  { vendor: "Roberto Aquino", stall: "C-009", amount: "₱1,450.00", due: "Apr 1, 2026" },
];

const recentReceipts = [
  { vendor: "Maria Santos", stall: "A-042", amount: "₱1,450.00", ref: "PC-2026-00412", time: "10:32 AM" },
  { vendor: "Juan Reyes", stall: "B-015", amount: "₱2,100.00", ref: "PC-2026-00411", time: "10:15 AM" },
];

const CashierDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">PC</span>
            </div>
            <span className="font-semibold text-foreground">PALENG-CLICK</span>
            <span className="ml-2 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">Cashier</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <Link to="/">
              <Button variant="ghost" size="sm">Logout</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Cashier Terminal</h1>

        {/* Search Vendor */}
        <div className="rounded-2xl border bg-card p-6 shadow-civic">
          <h3 className="mb-4 font-semibold text-foreground">Search Vendor</h3>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Enter vendor name or stall number..." className="h-12 pl-10 rounded-xl" />
            </div>
            <Button variant="default" size="lg">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Payments */}
          <div className="rounded-2xl border bg-card shadow-civic">
            <div className="border-b p-4">
              <h3 className="font-semibold text-foreground">Pending Payments</h3>
            </div>
            <div className="divide-y">
              {pendingPayments.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.vendor}</p>
                      <p className="text-xs text-muted-foreground">Stall {p.stall} • Due {p.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-foreground">{p.amount}</span>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Receipts */}
          <div className="rounded-2xl border bg-card shadow-civic">
            <div className="border-b p-4">
              <h3 className="font-semibold text-foreground">Recent Receipts</h3>
            </div>
            <div className="divide-y">
              {recentReceipts.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.vendor}</p>
                      <p className="text-xs text-muted-foreground">Stall {r.stall} • {r.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-foreground">{r.amount}</p>
                      <p className="text-xs text-muted-foreground">{r.ref}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Receipt className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashierDashboard;
