import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

const VendorStatement = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Statement of Account</h1>
        <p className="text-sm text-muted-foreground">Official summary of your stall rental payments</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Print</Button>
        <Button><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
      </div>
    </div>

    <div className="rounded-2xl border bg-card p-6 shadow-civic max-w-2xl">
      <div className="mb-6 border-b pb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Republic of the Philippines</p>
        <p className="text-sm font-semibold text-foreground">Municipality of San Juan, Batangas</p>
        <p className="text-xs text-muted-foreground">Municipal Treasurer's Office</p>
        <h2 className="mt-3 text-lg font-bold text-foreground">STATEMENT OF ACCOUNT</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <p className="text-muted-foreground">Vendor Name</p>
          <p className="font-medium text-foreground">Maria Santos</p>
        </div>
        <div>
          <p className="text-muted-foreground">Stall Number</p>
          <p className="font-mono font-medium text-foreground">A-042</p>
        </div>
        <div>
          <p className="text-muted-foreground">Section</p>
          <p className="font-medium text-foreground">Fish</p>
        </div>
        <div>
          <p className="text-muted-foreground">Statement Date</p>
          <p className="font-medium text-foreground">March 16, 2026</p>
        </div>
      </div>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium text-muted-foreground">Period</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Amount</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {["January", "February", "March"].map((m) => (
            <tr key={m}>
              <td className="py-2 text-foreground">{m} 2026</td>
              <td className="py-2 text-right font-mono text-foreground">₱1,450.00</td>
              <td className="py-2 text-right text-success font-semibold">Paid</td>
            </tr>
          ))}
          {["April", "May", "June"].map((m) => (
            <tr key={m}>
              <td className="py-2 text-foreground">{m} 2026</td>
              <td className="py-2 text-right font-mono text-foreground">₱1,450.00</td>
              <td className="py-2 text-right text-muted-foreground">Pending</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between border-t pt-4 text-sm">
        <span className="font-medium text-foreground">Total Outstanding</span>
        <span className="font-mono text-xl font-bold text-accent">₱4,350.00</span>
      </div>
    </div>
  </div>
);

export default VendorStatement;
