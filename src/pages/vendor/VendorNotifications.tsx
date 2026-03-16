import { Bell, CreditCard, Megaphone, AlertTriangle } from "lucide-react";

const notifications = [
  { type: "reminder", icon: Bell, title: "Payment Due Reminder", message: "Your stall fee of ₱1,450.00 is due on April 1, 2026.", time: "2 hours ago", read: false },
  { type: "confirmation", icon: CreditCard, title: "Payment Confirmed", message: "Your payment of ₱1,450.00 for March 2026 has been received. Ref: PC-2026-00390", time: "Mar 1, 2026", read: true },
  { type: "announcement", icon: Megaphone, title: "Market Clean-up Drive", message: "General cleaning scheduled for all sections this Saturday. All vendors are expected to participate.", time: "Mar 15, 2026", read: false },
  { type: "overdue", icon: AlertTriangle, title: "Overdue Notice", message: "Your December 2025 payment of ₱1,450.00 was settled late. Please ensure timely payments.", time: "Dec 5, 2025", read: true },
  { type: "confirmation", icon: CreditCard, title: "Payment Confirmed", message: "Your payment of ₱1,450.00 for February 2026 has been received. Ref: PC-2026-00345", time: "Feb 1, 2026", read: true },
];

const typeStyles = {
  reminder: "bg-primary/10 text-primary",
  confirmation: "bg-success/10 text-success",
  announcement: "bg-secondary text-muted-foreground",
  overdue: "bg-accent/10 text-accent",
};

const VendorNotifications = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
      <p className="text-sm text-muted-foreground">Due reminders, payment confirmations, and announcements</p>
    </div>

    <div className="space-y-3">
      {notifications.map((n, i) => (
        <div key={i} className={`rounded-2xl border bg-card p-4 shadow-civic transition-colors ${!n.read ? "border-l-4 border-l-primary" : ""}`}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${typeStyles[n.type as keyof typeof typeStyles]}`}>
              <n.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{n.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VendorNotifications;
