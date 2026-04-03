"use client";

import { Flame, CheckCircle2, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface TrackerData {
  id: string;
  name: string;
  description: string | null;
  frequencyType: string;
  targetCount: number;
  color: string;
  streak: number;
  completedToday: boolean;
  totalLogs: number;
}

export function TrackerCard({ tracker }: { tracker: TrackerData }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/trackers/${tracker.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Habit deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setDeleting(false);
    setMenuOpen(false);
  };

  const handleToggle = async () => {
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackerId: tracker.id,
          date: new Date().toISOString(),
          status: tracker.completedToday ? "missed" : "completed",
        }),
      });
      if (res.ok) {
        router.refresh();
        toast.success(tracker.completedToday ? "Marked incomplete" : "Marked complete! 🎉");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <Card className="group hover-lift relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 opacity-80" style={{ backgroundColor: tracker.color }} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{tracker.name}</h3>
            {tracker.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{tracker.description}</p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-36 rounded-xl border bg-card shadow-lg p-1">
                  <button
                    onClick={() => { setMenuOpen(false); router.push(`/dashboard/trackers/${tracker.id}/edit`); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-secondary"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="capitalize px-2 py-0.5 rounded-md bg-secondary">{tracker.frequencyType}</span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" />{tracker.streak} streak</span>
        </div>

        <button
          onClick={handleToggle}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            tracker.completedToday
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-secondary hover:bg-secondary/80 border border-border/50"
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${tracker.completedToday ? "fill-emerald-500" : ""}`} />
          {tracker.completedToday ? "Completed" : "Mark Complete"}
        </button>
      </CardContent>
    </Card>
  );
}
