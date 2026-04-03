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
const frequencies = [
  { id: "daily", label: "Everyday" },
  { id: "specific", label: "Specific Days" }
];

const weekDays = [
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
  { label: "S", value: 0 },
];

export function CreateTrackerModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequencyType, setFrequencyType] = useState("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [targetCount, setTargetCount] = useState(1);
  const [color, setColor] = useState(colors[0]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (frequencyType === "specific" && selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/trackers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          description, 
          frequencyType, 
          targetCount, 
          color,
          daysOfWeek: frequencyType === "daily" ? [] : selectedDays
        }),
      });
      if (res.ok) {
        toast.success("Habit created! 🎯");
        onOpenChange(false);
        setName(""); setDescription(""); setFrequencyType("daily"); setSelectedDays([]); setTargetCount(1); setColor(colors[0]);
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
      <DialogContent className="sm:max-w-[425px]">
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
          
          <div className="space-y-3">
            <Label>Schedule</Label>
            <div className="flex p-1 rounded-xl bg-secondary/50 w-fit">
              {frequencies.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrequencyType(f.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    frequencyType === f.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-background/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {frequencyType === "specific" && (
              <div className="flex gap-1.5 mt-2">
                {weekDays.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDay(d.value)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                      selectedDays.includes(d.value)
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-muted-foreground border-border hover:border-foreground/20"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target / Day</Label>
              <Input id="target" type="number" min={1} max={99} value={targetCount} onChange={(e) => setTargetCount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:scale-110 opacity-70"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
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
