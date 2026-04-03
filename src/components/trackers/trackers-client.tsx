"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Target, Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateTrackerModal } from "@/components/dashboard/create-tracker-modal";

interface Tracker {
  id: string; name: string; description: string | null; frequencyType: string;
  daysOfWeek: number[];
  targetCount: number; color: string; createdAt: string;
  streak: number; totalCompleted: number; totalLogs: number;
}

export function TrackersClient({ trackers }: { trackers: Tracker[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = trackers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trackers</h1>
          <p className="text-sm text-muted-foreground mt-1">{trackers.length} habits tracked</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Habit
        </Button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text" placeholder="Filter habits..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm outline-none w-full"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Target className="w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">{search ? "No results" : "No habits yet"}</h3>
            <p className="text-sm text-muted-foreground">{search ? "Try a different search" : "Create your first habit"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover-lift">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.color + "20" }}>
                      <Target className="w-5 h-5" style={{ color: t.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{t.frequencyType} · {t.totalCompleted} completions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center hidden sm:block">
                      <p className="font-semibold flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" />{t.streak}</p>
                      <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{t.totalCompleted}</p>
                      <p className="text-xs text-muted-foreground">Done</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <CreateTrackerModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
