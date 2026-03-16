import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Search, MoreHorizontal, Shield, Store, Banknote } from "lucide-react";

const users = [
  { id: 1, name: "Maria Santos", role: "Vendor", stall: "A-042", contact: "09171234567", status: "Active" },
  { id: 2, name: "Juan Reyes", role: "Vendor", stall: "B-015", contact: "09181234567", status: "Active" },
  { id: 3, name: "Elena Mendoza", role: "Vendor", stall: "C-022", contact: "09191234567", status: "Suspended" },
  { id: 4, name: "Pedro Lim", role: "Vendor", stall: "A-088", contact: "09201234567", status: "Active" },
  { id: 5, name: "Ana Cruz", role: "Cashier", stall: "—", contact: "09211234567", status: "Active" },
  { id: 6, name: "Carlos Dela Cruz", role: "Vendor", stall: "B-044", contact: "09221234567", status: "Active" },
];

const roleIcons = { Vendor: Store, Cashier: Banknote, Admin: Shield };

const AdminUserManagement = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.stall.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">Create, update, and manage vendor and cashier accounts</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <UserPlus className="mr-2 h-4 w-4" /> Create Account
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="rounded-2xl border bg-card p-6 shadow-civic">
          <h3 className="mb-4 font-semibold text-foreground">Create New Account</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input placeholder="First name" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Middle Name</Label>
              <Input placeholder="Middle name" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input placeholder="Last name" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input placeholder="Address" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Number</Label>
              <Input placeholder="09XX XXX XXXX" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Stall Number</Label>
              <Input placeholder="e.g. A-042" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <select className="h-11 w-full rounded-xl border bg-background px-3 text-sm">
                <option>Vendor</option>
                <option>Cashier</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Document Upload</Label>
              <Input type="file" className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>Create Account</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or stall..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-11 pl-10 rounded-xl" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card shadow-civic overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stall</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contact</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((u) => {
              const Icon = roleIcons[u.role as keyof typeof roleIcons] || Store;
              return (
                <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground">{u.stall}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.contact}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.status === "Active" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
