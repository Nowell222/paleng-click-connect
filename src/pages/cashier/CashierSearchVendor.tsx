import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const vendors = [
  { name: "Maria Santos", stall: "A-042", section: "Fish", contact: "09171234567", balance: "₱1,450.00", status: "Current" },
  { name: "Juan Reyes", stall: "B-015", section: "Vegetables", contact: "09181234567", balance: "₱0.00", status: "Paid" },
  { name: "Carlos Dela Cruz", stall: "B-044", section: "Fish", contact: "09221234567", balance: "₱4,350.00", status: "Overdue" },
  { name: "Elena Mendoza", stall: "C-022", section: "Meat", contact: "09191234567", balance: "₱2,900.00", status: "Overdue" },
  { name: "Pedro Lim", stall: "A-088", section: "Dry Goods", contact: "09201234567", balance: "₱1,450.00", status: "Current" },
];

const CashierSearchVendor = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Search Vendor</h1>
      <p className="text-sm text-muted-foreground">Look up vendor information and outstanding dues</p>
    </div>

    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search by name, stall number, or section..." className="h-12 pl-10 rounded-xl" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((v) => (
        <div key={v.stall} className="rounded-2xl border bg-card p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{v.name}</p>
              <p className="text-xs text-muted-foreground">Stall {v.stall} • {v.section}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-muted-foreground">Contact: {v.contact}</p>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-mono font-bold text-foreground">{v.balance}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              v.status === "Paid" ? "bg-success/10 text-success" : v.status === "Overdue" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
            }`}>{v.status}</span>
            <Button size="sm">Accept Payment</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CashierSearchVendor;
