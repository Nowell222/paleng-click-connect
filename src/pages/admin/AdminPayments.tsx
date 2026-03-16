import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

const payments = [
  { name: "User 05", type: "Manual", due: "April 11, 2024", amount: "₱1,000.00", status: "Paid" },
  { name: "User 02", type: "On-Due", due: "April 13, 2024", amount: "₱700.00", status: "Paid" },
  { name: "User 03", type: "On-Due", due: "April 14, 2024", amount: "₱1,250.00", status: "Paid" },
  { name: "User 04", type: "Manual", due: "April 16, 2024", amount: "₱500.00", status: "Paid" },
  { name: "User 05", type: "Staggered", due: "April 20, 2024", amount: "₱2,000.00", status: "Pending" },
  { name: "User 06", type: "On-Due", due: "April 2, 2024", amount: "₱1,000.00", status: "Pending" },
  { name: "User 07", type: "Staggered", due: "April 23, 2024", amount: "₱1,850.00", status: "Paid" },
  { name: "User 08", type: "Staggered", due: "April 25, 2024", amount: "₱940.00", status: "Pending" },
];

const AdminPayments = () => {
  const [paymentType, setPaymentType] = useState("All");
  const [search, setSearch] = useState("");

  const types = ["All", "On-Due", "Manual", "Staggered"];
  const filtered = payments.filter(
    (p) =>
      (paymentType === "All" || p.type === paymentType) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
        <p className="text-sm text-muted-foreground">View and manage all stall payments, generate schedules</p>
      </div>

      {/* Payment Gateway + Type selectors */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-civic">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Payment Gateway</h3>
          <div className="flex gap-2">
            {["GCash", "PayMaya", "Instapay", "Cash"].map((g) => (
              <span key={g} className="rounded-lg border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">{g}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-civic">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Payment Schedule Generation</h3>
          <div className="flex gap-2">
            <select className="h-10 flex-1 rounded-xl border bg-background px-3 text-sm">
              <option>Due</option>
              <option>Staggered</option>
            </select>
            <Button>Generate Schedule</Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl bg-secondary p-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setPaymentType(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                paymentType === t ? "bg-card text-foreground shadow-civic" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-9 w-48 pl-9 rounded-lg" />
        </div>
        <Button variant="outline" size="sm"><Filter className="mr-1.5 h-4 w-4" /> Filter</Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card shadow-civic overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Payment Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p, i) => (
              <tr key={i} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.due}</td>
                <td className="px-4 py-3 font-mono font-semibold text-foreground">{p.amount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "Paid" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
