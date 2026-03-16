import { motion } from "framer-motion";
import {
  Users,
  TrendingDown,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
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

const recentTx = [
  { vendor: "Maria Santos", stall: "A-042", amount: "₱1,450", method: "GCash", time: "2 min ago" },
  { vendor: "Juan Reyes", stall: "B-015", amount: "₱2,100", method: "Cash", time: "8 min ago" },
  { vendor: "Rosa Garcia", stall: "C-003", amount: "₱1,450", method: "PayMaya", time: "15 min ago" },
  { vendor: "Pedro Lim", stall: "A-088", amount: "₱725", method: "Instapay", time: "22 min ago" },
];

const stats = [
  { label: "Total Collections", value: "₱842,000", change: "+12.4%", up: true, icon: DollarSign },
  { label: "Active Stalls", value: "942 / 955", change: "98.6%", up: true, icon: Users },
  { label: "Delinquency Rate", value: "18.2%", change: "↓ 1.8%", up: false, icon: TrendingDown },
  { label: "This Month", value: "₱142,000", change: "+8.2%", up: true, icon: TrendingUp },
];

const delinquent = [
  { name: "Carlos Dela Cruz", stall: "B-044", amount: "₱4,350", days: 45 },
  { name: "Elena Mendoza", stall: "C-022", amount: "₱2,900", days: 32 },
  { name: "Ricardo Tan", stall: "A-091", amount: "₱1,450", days: 15 },
];

const AdminDashboardHome = () => (
  <div className="space-y-6">
    {/* Compliance Pulse */}
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card px-4 py-2.5 text-sm shadow-civic">
      <span className="text-muted-foreground">Total Collections: <strong className="text-foreground font-mono">₱842,000</strong></span>
      <span className="text-border">|</span>
      <span className="text-muted-foreground">Delinquency: <strong className="text-accent font-mono">18.2%</strong> <span className="text-success">(↓ 1.8%)</span></span>
      <span className="text-border">|</span>
      <span className="text-muted-foreground">Active Stalls: <strong className="text-foreground font-mono">942/955</strong></span>
    </div>

    {/* Stat Cards */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border bg-card p-5 shadow-civic">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">{s.value}</p>
          <p className={`mt-1 text-sm font-medium ${s.up ? "text-success" : "text-accent"}`}>{s.change}</p>
        </motion.div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <h3 className="mb-4 font-semibold text-foreground">Monthly Collections</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} tickFormatter={(v) => `₱${v / 1000}k`} />
            <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
            <Bar dataKey="collected" fill="hsl(185,60%,35%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" fill="hsl(220,10%,92%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-civic">
        <h3 className="mb-4 font-semibold text-foreground">Delinquency Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={delinquencyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(220,10%,42%)" }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Line type="monotone" dataKey="rate" stroke="hsl(22,85%,55%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(22,85%,55%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Recent + Delinquent */}
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="rounded-2xl border bg-card shadow-civic lg:col-span-3">
        <div className="border-b p-4"><h3 className="font-semibold text-foreground">Recent Transactions</h3></div>
        <div className="divide-y">
          {recentTx.map((t, i) => (
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
      <div className="rounded-2xl border bg-card shadow-civic lg:col-span-2">
        <div className="border-b p-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-accent" /> Delinquent Vendors
          </h3>
        </div>
        <div className="divide-y">
          {delinquent.map((v, i) => (
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
  </div>
);

export default AdminDashboardHome;
