import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Bell,
  FileText,
  Search,
  Filter,
  Download,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const monthlyData = [
  { month: "Oct", collected: 680000, target: 800000 },
  { month: "Nov", collected: 720000, target: 800000 },
  { month: "Dec", collected: 650000, target: 800000 },
  { month: "Jan", collected: 760000, target: 800000 },
  { month: "Feb", collected: 810000, target: 800000 },
  { month: "Mar", collected: 842000, target: 800000 },
];

const delinquencyTrend = [
  { month: "Oct", rate: 22.5 },
  { month: "Nov", rate: 21.8 },
  { month: "Dec", rate: 20.9 },
  { month: "Jan", rate: 20.0 },
  { month: "Feb", rate: 19.1 },
  { month: "Mar", rate: 18.2 },
];

const recentTransactions = [
  { vendor: "Maria Santos", stall: "A-042", amount: "₱1,450", method: "GCash", time: "2 min ago" },
  { vendor: "Juan Reyes", stall: "B-015", amount: "₱2,100", method: "Cash", time: "8 min ago" },
  { vendor: "Rosa Garcia", stall: "C-003", amount: "₱1,450", method: "PayMaya", time: "15 min ago" },
  { vendor: "Pedro Lim", stall: "A-088", amount: "₱725", method: "Instapay", time: "22 min ago" },
  { vendor: "Ana Cruz", stall: "D-011", amount: "₱1,450", method: "GCash", time: "30 min ago" },
];

const delinquentVendors = [
  { name: "Carlos Dela Cruz", stall: "B-044", amount: "₱4,350", days: 45 },
  { name: "Elena Mendoza", stall: "C-022", amount: "₱2,900", days: 32 },
  { name: "Ricardo Tan", stall: "A-091", amount: "₱1,450", days: 15 },
];

const statCards = [
  { label: "Total Collections", value: "₱842,000", change: "+12.4%", up: true, icon: DollarSign },
  { label: "Active Stalls", value: "942 / 955", change: "98.6%", up: true, icon: Users },
  { label: "Delinquency Rate", value: "18.2%", change: "↓ 1.8%", up: false, icon: TrendingDown },
  { label: "This Month", value: "₱142,000", change: "+8.2%", up: true, icon: TrendingUp },
];

const AdminDashboard = () => {
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
            <span className="ml-2 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">5</span>
            </button>
            <Link to="/">
              <Button variant="ghost" size="sm">Logout</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Compliance Pulse */}
      <div className="border-b bg-card px-4 py-2">
        <div className="container mx-auto flex items-center gap-6 overflow-x-auto text-sm">
          <span className="whitespace-nowrap text-muted-foreground">Total Collections: <strong className="text-foreground font-mono">₱842,000</strong></span>
          <span className="text-border">|</span>
          <span className="whitespace-nowrap text-muted-foreground">Delinquency: <strong className="text-accent font-mono">18.2%</strong> <span className="text-success">(↓ 1.8%)</span></span>
          <span className="text-border">|</span>
          <span className="whitespace-nowrap text-muted-foreground">Active Stalls: <strong className="text-foreground font-mono">942/955</strong></span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
            <Button variant="default" size="sm">
              <FileText className="mr-1.5 h-4 w-4" />
              Reports
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-2xl border bg-card p-5 shadow-civic"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">{stat.value}</p>
              <p className={`mt-1 text-sm font-medium ${stat.up ? "text-success" : "text-accent"}`}>{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-civic">
            <h3 className="mb-4 font-semibold text-foreground">Monthly Collections</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 42%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 42%)" }} tickFormatter={(v) => `₱${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
                <Bar dataKey="collected" fill="hsl(185, 60%, 35%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" fill="hsl(220, 10%, 92%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-civic">
            <h3 className="mb-4 font-semibold text-foreground">Delinquency Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={delinquencyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 42%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 42%)" }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Line type="monotone" dataKey="rate" stroke="hsl(22, 85%, 55%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(22, 85%, 55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two columns: Recent Transactions + Delinquent Vendors */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent Transactions */}
          <div className="rounded-2xl border bg-card shadow-civic lg:col-span-3">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold text-foreground">Recent Transactions</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search vendor..." className="h-9 w-48 pl-9 rounded-lg" />
                </div>
                <Button variant="outline" size="sm"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="divide-y">
              {recentTransactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.vendor}</p>
                    <p className="text-xs text-muted-foreground">Stall {t.stall} • {t.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-foreground">{t.amount}</p>
                    <p className="text-xs text-muted-foreground">{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delinquent Vendors */}
          <div className="rounded-2xl border bg-card shadow-civic lg:col-span-2">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold text-foreground">Delinquent Vendors</h3>
              <Button variant="accent" size="sm">
                <Send className="mr-1.5 h-3.5 w-3.5" />
                SMS All
              </Button>
            </div>
            <div className="divide-y">
              {delinquentVendors.map((v, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{v.name}</p>
                      <p className="text-xs text-muted-foreground">Stall {v.stall}</p>
                    </div>
                    <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">{v.days} days</span>
                  </div>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">{v.amount} overdue</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
