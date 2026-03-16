import { Button } from "@/components/ui/button";
import { QrCode, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const stalls = [
  { stall: "A-042", vendor: "Maria Santos", section: "Fish", status: "Active" },
  { stall: "B-015", vendor: "Juan Reyes", section: "Vegetables", status: "Active" },
  { stall: "C-003", vendor: "Rosa Garcia", section: "Meat", status: "Active" },
  { stall: "A-088", vendor: "Pedro Lim", section: "Dry Goods", status: "Active" },
  { stall: "B-044", vendor: "Carlos Dela Cruz", section: "Fish", status: "Delinquent" },
  { stall: "D-011", vendor: "Ana Cruz", section: "Bolante", status: "Active" },
];

const AdminQRCodes = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">QR Code Management</h1>
        <p className="text-sm text-muted-foreground">Each vendor stall has a unique QR code for identification and payments</p>
      </div>
      <Button><Download className="mr-2 h-4 w-4" /> Download All QR Codes</Button>
    </div>

    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search vendor or stall..." className="h-11 pl-10 rounded-xl" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stalls.map((s) => (
        <div key={s.stall} className="rounded-2xl border bg-card p-5 shadow-civic">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-lg font-bold text-foreground">{s.stall}</p>
              <p className="text-sm text-muted-foreground">{s.vendor}</p>
              <p className="text-xs text-muted-foreground">{s.section} Section</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.status === "Active" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>{s.status}</span>
          </div>
          <div className="mt-4 flex items-center justify-center rounded-xl border-2 border-dashed border-muted py-6">
            <QrCode className="h-20 w-20 text-muted-foreground/40" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
            <Button variant="outline" size="sm" className="flex-1">Print</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminQRCodes;
