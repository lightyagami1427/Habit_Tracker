"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Map, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface Plan { id: string; name: string; config: Record<string, string[]>; createdAt: string; }

export function PlansClient({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [config, setConfig] = useState<Record<string, string[]>>(
    Object.fromEntries(DAYS.map((d) => [d, []]))
  );
  const [dayInput, setDayInput] = useState<Record<string, string>>(
    Object.fromEntries(DAYS.map((d) => [d, ""]))
  );
  const [loading, setLoading] = useState(false);

  const addActivity = (day: string) => {
    const val = dayInput[day]?.trim();
    if (!val) return;
    setConfig((prev) => ({ ...prev, [day]: [...(prev[day] || []), val] }));
    setDayInput((prev) => ({ ...prev, [day]: "" }));
  };

  const removeActivity = (day: string, idx: number) => {
    setConfig((prev) => ({ ...prev, [day]: prev[day].filter((_, i) => i !== idx) }));
  };

  const handleCreate = async () => {
    if (!planName.trim()) { toast.error("Plan name is required"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: planName, config }),
      });
      if (res.ok) {
        toast.success("Plan created!");
        setCreateOpen(false);
        setPlanName("");
        setConfig(Object.fromEntries(DAYS.map((d) => [d, []])));
        router.refresh();
      } else toast.error("Failed to create plan");
    } catch { toast.error("Something went wrong"); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Plan deleted"); router.refresh(); }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Custom Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">Create weekly activity schedules</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Map className="w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No plans yet</h3>
            <p className="text-sm text-muted-foreground">Create a weekly plan to organize your habits</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {plans.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{p.name}</h3>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {DAYS.filter((d) => (p.config[d]?.length || 0) > 0).map((d) => (
                      <div key={d} className="flex items-start gap-3 text-sm">
                        <span className="capitalize font-medium text-muted-foreground w-20 shrink-0 pt-0.5">{d.slice(0, 3)}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.config[d].map((a, j) => (
                            <span key={j} className="px-2.5 py-0.5 rounded-lg bg-secondary text-xs font-medium">{a}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Weekly Plan</DialogTitle>
            <DialogDescription>Assign activities to each day of the week.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input placeholder="e.g. Fitness Week" value={planName} onChange={(e) => setPlanName(e.target.value)} />
            </div>
            {DAYS.map((day) => (
              <div key={day} className="space-y-2">
                <Label className="capitalize">{day}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add activity..."
                    value={dayInput[day]}
                    onChange={(e) => setDayInput((p) => ({ ...p, [day]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addActivity(day))}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => addActivity(day)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {config[day]?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {config[day].map((a, j) => (
                      <span key={j} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary text-xs font-medium">
                        {a}
                        <button onClick={() => removeActivity(day, j)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button onClick={handleCreate} className="w-full" size="lg" disabled={loading}>
              Create Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
