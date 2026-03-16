import { QrCode, MapPin, User, Calendar } from "lucide-react";

const VendorStallInfo = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Stall Information</h1>
      <p className="text-sm text-muted-foreground">Details about your market stall</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border bg-card p-6 shadow-civic space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Stall #A-042</h3>
            <p className="text-sm text-muted-foreground">Fish Section • Ground Floor</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Vendor</p>
              <p className="font-medium text-foreground">Maria Santos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Award Date</p>
              <p className="font-medium text-foreground">January 15, 2020</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">San Juan Public Market, Building A, Row 4</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 p-3 text-sm">
          <p className="text-muted-foreground">Monthly Rental</p>
          <p className="font-mono text-lg font-bold text-foreground">₱1,450.00</p>
        </div>

        <div className="rounded-xl bg-success/5 border border-success/20 p-3 text-sm">
          <p className="font-semibold text-success">Status: Active</p>
          <p className="text-muted-foreground">Stall is in good standing</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-civic flex flex-col items-center justify-center">
        <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-muted">
          <QrCode className="h-24 w-24 text-muted-foreground/40" />
        </div>
        <p className="font-semibold text-foreground">Your QR Code</p>
        <p className="text-sm text-muted-foreground">Use for inspection verification and payments</p>
      </div>
    </div>
  </div>
);

export default VendorStallInfo;
