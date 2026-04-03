"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#64748b"];
const frequencies = ["daily", "weekly", "custom"];

export function CreateTrackerModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequencyType, setFrequencyType] = useState("daily");
  const [targetCount, setTargetCount] = useState(1);
  const [color, setColor] = useState(colors[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/trackers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, frequencyType, targetCount, color }),
      });
      if (res.ok) {
        toast.success("Habit created! 🎯");
        onOpenChange(false);
        setName(""); setDescription(""); setFrequencyType("daily"); setTargetCount(1); setColor(colors[0]);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>Define a new habit you want to track consistently.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="tracker-name">Name</Label>
            <Input id="tracker-name" placeholder="e.g. Morning Run" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tracker-desc">Description (optional)</Label>
            <Input id="tracker-desc" placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <div className="flex gap-2">
                {frequencies.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequencyType(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      frequencyType === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target / Day</Label>
              <Input id="target" type="number" min={1} max={99} value={targetCount} onChange={(e) => setTargetCount(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-lg transition-all ${color === c ? "ring-2 ring-offset-2 ring-foreground" : "hover:scale-110"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Habit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
