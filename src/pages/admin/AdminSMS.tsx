import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Users, CheckCircle2, Clock } from "lucide-react";

const logs = [
  { recipient: "Maria Santos (09171234567)", type: "Reminder", status: "Delivered", time: "Mar 15, 10:32 AM" },
  { recipient: "Juan Reyes (09181234567)", type: "Confirmation", status: "Delivered", time: "Mar 15, 10:15 AM" },
  { recipient: "Elena Mendoza (09191234567)", type: "Overdue", status: "Failed", time: "Mar 14, 3:45 PM" },
  { recipient: "Pedro Lim (09201234567)", type: "Reminder", status: "Delivered", time: "Mar 14, 9:00 AM" },
  { recipient: "Bulk (45 vendors)", type: "Announcement", status: "Delivered", time: "Mar 13, 2:00 PM" },
];

const AdminSMS = () => {
  const [tab, setTab] = useState<"send" | "bulk" | "logs">("send");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SMS Management</h1>
        <p className="text-sm text-muted-foreground">Send reminders, confirmations, and announcements to vendors</p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-secondary p-1 max-w-md">
        {(["send", "bulk", "logs"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all ${tab === t ? "bg-card text-foreground shadow-civic" : "text-muted-foreground"}`}>
            {t === "send" ? "Single SMS" : t === "bulk" ? "Bulk SMS" : "SMS Logs"}
          </button>
        ))}
      </div>

      {tab === "send" && (
        <div className="rounded-2xl border bg-card p-6 shadow-civic max-w-lg space-y-4">
          <div className="space-y-1.5">
            <Label>Recipient</Label>
            <Input placeholder="Search vendor name or number..." className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Message Type</Label>
            <select className="h-11 w-full rounded-xl border bg-background px-3 text-sm">
              <option>Payment Reminder</option>
              <option>Overdue Alert</option>
              <option>Payment Confirmation</option>
              <option>Announcement</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea placeholder="Type your message..." className="min-h-[100px] rounded-xl" />
          </div>
          <Button size="lg"><Send className="mr-2 h-4 w-4" /> Send SMS</Button>
        </div>
      )}

      {tab === "bulk" && (
        <div className="rounded-2xl border bg-card p-6 shadow-civic max-w-lg space-y-4">
          <div className="space-y-1.5">
            <Label>Send To</Label>
            <select className="h-11 w-full rounded-xl border bg-background px-3 text-sm">
              <option>All Vendors (955)</option>
              <option>Delinquent Vendors (174)</option>
              <option>Active Vendors (942)</option>
              <option>Fish Section</option>
              <option>Meat Section</option>
              <option>Vegetable Section</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea placeholder="Compose bulk message..." className="min-h-[100px] rounded-xl" />
          </div>
          <Button size="lg" variant="accent"><Users className="mr-2 h-4 w-4" /> Send Bulk SMS</Button>
        </div>
      )}

      {tab === "logs" && (
        <div className="rounded-2xl border bg-card shadow-civic overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Recipient</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((l, i) => (
                <tr key={i} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium text-foreground">{l.recipient}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${l.status === "Delivered" ? "text-success" : "text-accent"}`}>
                      {l.status === "Delivered" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSMS;
