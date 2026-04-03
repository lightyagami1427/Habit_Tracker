"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, subDays, isSameDay } from "date-fns";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Tracker { id: string; name: string; color: string; frequencyType: string; }
interface LogEntry { id: string; trackerId: string; date: string; status: string; }

export function DailyLogClient({ trackers, logs }: { trackers: Tracker[]; logs: LogEntry[] }) {
  const router = useRouter();
  const [offset, setOffset] = useState(0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i + offset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const getLog = (trackerId: string, date: Date) => {
    return logs.find((l) => l.trackerId === trackerId && isSameDay(new Date(l.date), date));
  };

  const toggleLog = async (trackerId: string, date: Date) => {
    const existing = getLog(trackerId, date);
    const newStatus = existing?.status === "completed" ? "missed" : "completed";
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackerId, date: date.toISOString(), status: newStatus }),
      });
      router.refresh();
      if (newStatus === "completed") toast.success("Done! 🎉");
    } catch {
      toast.error("Failed to update");
    }
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your habits day by day</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setOffset(offset + 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOffset(0)} disabled={offset === 0}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => setOffset(Math.max(0, offset - 1))} disabled={offset === 0}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {trackers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarDays className="w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No habits to log</h3>
            <p className="text-sm text-muted-foreground">Create a habit first to start logging</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4 min-w-[160px]">Habit</th>
                  {days.map((d) => (
                    <th key={d.toISOString()} className={`text-center p-4 min-w-[60px] ${isToday(d) ? "bg-secondary/50" : ""}`}>
                      <div className="text-[10px] font-medium text-muted-foreground uppercase">{format(d, "EEE")}</div>
                      <div className={`text-sm font-semibold mt-0.5 ${isToday(d) ? "text-foreground" : "text-muted-foreground"}`}>
                        {format(d, "d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trackers.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/30 last:border-0"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-sm font-medium">{t.name}</span>
                      </div>
                    </td>
                    {days.map((d) => {
                      const log = getLog(t.id, d);
                      const completed = log?.status === "completed";
                      return (
                        <td key={d.toISOString()} className={`text-center p-4 ${isToday(d) ? "bg-secondary/50" : ""}`}>
                          <button
                            onClick={() => toggleLog(t.id, d)}
                            className="mx-auto block transition-all duration-200 hover:scale-125"
                          >
                            {completed ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-6 h-6 text-border hover:text-muted-foreground" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
