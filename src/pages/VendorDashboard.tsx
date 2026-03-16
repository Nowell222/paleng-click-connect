import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Clock,
  Bell,
  FileText,
  ChevronRight,
  QrCode,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const payments = [
  { date: "Mar 01, 2026", amount: "₱1,450.00", method: "GCash", status: "Paid" },
  { date: "Feb 01, 2026", amount: "₱1,450.00", method: "Cash", status: "Paid" },
  { date: "Jan 01, 2026", amount: "₱1,450.00", method: "PayMaya", status: "Paid" },
  { date: "Dec 01, 2025", amount: "₱1,450.00", method: "GCash", status: "Late" },
];

const announcements = [
  { title: "Market Clean-up Drive", date: "Mar 15, 2026", excerpt: "General cleaning scheduled for all sections." },
  { title: "New Payment Policy", date: "Mar 10, 2026", excerpt: "Staggered payment option now available for all vendors." },
];

const staggeredPayments = [
  { label: "Jan", paid: true },
  { label: "Feb", paid: true },
  { label: "Mar", paid: true },
  { label: "Apr", paid: false },
  { label: "May", paid: false },
  { label: "Jun", paid: false },
];

const VendorDashboard = () => {
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
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">2</span>
            </button>
            <Link to="/">
              <Button variant="ghost" size="sm">Logout</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Urgency Bar */}
      <div className="bg-primary px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary-foreground/80" />
            <span className="text-sm font-medium text-primary-foreground">Next payment due: <strong>April 1, 2026</strong></span>
          </div>
          <span className="font-mono text-sm font-bold text-primary-foreground">₱1,450.00</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stall #A-042</h1>
          <p className="text-sm text-muted-foreground">Maria Santos • Fish Section</p>
        </div>

        {/* Action Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Payment Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-2xl border bg-card p-6 shadow-civic"
          >
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Current Due</span>
              <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-bold text-success">ON TIME</span>
            </div>
            <h2 className="mt-2 font-mono text-4xl font-bold text-foreground">₱1,450.00</h2>
            <p className="mt-1 text-sm text-muted-foreground">Due on April 1, 2026</p>
            <Button variant="hero" size="lg" className="mt-6 w-full">
              <CreditCard className="mr-2 h-5 w-5" />
              Pay via GCash
            </Button>
          </motion.div>

          {/* QR Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-2xl border bg-card p-6 shadow-civic flex flex-col items-center justify-center text-center"
          >
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-muted">
              <QrCode className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-foreground">Your Stall QR Code</h3>
            <p className="mt-1 text-sm text-muted-foreground">Stall #A-042 • Fish Section</p>
            <Button variant="outline" size="default" className="mt-4">
              Download QR
            </Button>
          </motion.div>
        </div>

        {/* Staggered Payment Progress */}
        <div className="rounded-2xl border bg-card p-6 shadow-civic">
          <h3 className="mb-4 font-semibold text-foreground">Payment Progress (2026)</h3>
          <div className="flex items-center gap-2">
            {staggeredPayments.map((p) => (
              <div key={p.label} className="flex flex-1 flex-col items-center gap-2">
                <div className={`h-3 w-full rounded-full ${p.paid ? "bg-success" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground">{p.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">3 of 6</span> monthly payments completed
          </p>
        </div>

        {/* Payment History */}
        <div className="rounded-2xl border bg-card shadow-civic">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold text-foreground">Recent Payments</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="divide-y">
            {payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  {p.status === "Paid" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-accent" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.date}</p>
                    <p className="text-xs text-muted-foreground">{p.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-foreground">{p.amount}</p>
                  <p className={`text-xs font-medium ${p.status === "Paid" ? "text-success" : "text-accent"}`}>{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="rounded-2xl border bg-card shadow-civic">
          <div className="border-b p-4">
            <h3 className="font-semibold text-foreground">Announcements</h3>
          </div>
          <div className="divide-y">
            {announcements.map((a, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{a.title}</h4>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
