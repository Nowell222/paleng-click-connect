import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";

const news = [
  { id: 1, title: "Market Clean-up Drive", date: "Mar 15, 2026", content: "General cleaning scheduled for all sections this Saturday. All vendors are expected to participate." },
  { id: 2, title: "New Payment Policy", date: "Mar 10, 2026", content: "Staggered payment option is now available for all vendors starting April 2026." },
  { id: 3, title: "Holiday Schedule", date: "Mar 5, 2026", content: "The Municipal Treasurer's Office will be closed on March 28-30 for Holy Week." },
];

const AdminNews = () => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">News & Updates</h1>
          <p className="text-sm text-muted-foreground">Publish announcements visible to all vendors</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-2 h-4 w-4" /> New Announcement
        </Button>
      </div>

      {showCreate && (
        <div className="rounded-2xl border bg-card p-6 shadow-civic max-w-xl space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="Announcement title" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Content</Label>
            <Textarea placeholder="Write your announcement..." className="min-h-[120px] rounded-xl" />
          </div>
          <div className="flex gap-2">
            <Button>Publish</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {news.map((n) => (
          <div key={n.id} className="rounded-2xl border bg-card p-5 shadow-civic">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{n.title}</h3>
                <p className="text-xs text-muted-foreground">{n.date}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNews;
