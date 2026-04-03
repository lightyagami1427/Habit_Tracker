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
  daysOfWeek: number[];
  targetCount: number;
  color: string;
  streak: number;
  completedToday: boolean;
  totalLogs: number;
}

const getScheduleLabel = (type: string, days: number[]) => {
  if (type === "daily") return "Everyday";
  if (!days || days.length === 0) return "Daily";
  if (days.length === 7) return "Everyday";
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  if (days.length === 5 && !days.includes(0) && !days.includes(6)) return "Weekdays";
  if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends";
  
  return days.sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
    .map(d => dayNames[d])
    .join(", ");
};

export function TrackerCard({ tracker }: { tracker: TrackerData }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(tracker.completedToday);
  const [isToggling, setIsToggling] = useState(false);

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
    if (isToggling) return;
    
    // Optimistic Update
    const previousState = isCompleted;
    setIsCompleted(!previousState);
    setIsToggling(true);

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackerId: tracker.id,
          date: new Date().toISOString(),
          status: previousState ? "missed" : "completed",
        }),
      });
      
      if (res.ok) {
        router.refresh();
        toast.success(!previousState ? "Marked complete! 🎉" : "Marked incomplete");
      } else {
        setIsCompleted(previousState);
        toast.error("Failed to update");
      }
    } catch {
      setIsCompleted(previousState);
      toast.error("Failed to update");
    } finally {
      setIsToggling(false);
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
          <span className="capitalize px-2 py-0.5 rounded-md bg-secondary">
            {getScheduleLabel(tracker.frequencyType, tracker.daysOfWeek)}
          </span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" />{tracker.streak} streak</span>
        </div>

        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-secondary hover:bg-secondary/80 border border-border/50"
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? "fill-emerald-500" : ""}`} />
          {isCompleted ? "Completed" : "Mark Complete"}
        </button>
      </CardContent>
    </Card>
  );
}
