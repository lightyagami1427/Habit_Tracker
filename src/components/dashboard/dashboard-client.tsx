"use client";

import { motion } from "framer-motion";
import { Target, Flame, CheckCircle2, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrackerCard } from "@/components/dashboard/tracker-card";
import { CreateTrackerModal } from "@/components/dashboard/create-tracker-modal";
import { useState } from "react";

interface TrackerData {
  id: string;
  name: string;
  description: string | null;
  frequencyType: string;
  daysOfWeek: number[];
  targetCount: number;
  color: string;
  createdAt: string;
  streak: number;
  completedToday: boolean;
  totalLogs: number;
}

interface Stats {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  longestStreak: number;
}

const statCards = [
  { key: "totalHabits", label: "Total Habits", icon: Target, color: "text-blue-500" },
  { key: "completedToday", label: "Done Today", icon: CheckCircle2, color: "text-emerald-500" },
  { key: "completionRate", label: "Completion", icon: TrendingUp, color: "text-amber-500", suffix: "%" },
  { key: "longestStreak", label: "Best Streak", icon: Flame, color: "text-orange-500", suffix: " days" },
];

export function DashboardClient({ trackers, stats }: { trackers: TrackerData[]; stats: Stats }) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your daily progress</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Habit
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="hover-lift">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold">
                  {stats[s.key as keyof Stats]}{s.suffix || ""}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trackers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Habits</h2>
        {trackers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No habits yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first habit to start tracking</p>
              <Button onClick={() => setCreateOpen(true)} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Create Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackers.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <TrackerCard tracker={t} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CreateTrackerModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
