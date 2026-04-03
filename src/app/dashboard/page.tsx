import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const trackers = await prisma.tracker.findMany({
    where: { userId },
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
    orderBy: { createdAt: "desc" },
  });

  const totalHabits = trackers.length;

  // Calculate streaks and completions
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalCompletedToday = 0;
  const trackerData = trackers.map((t) => {
    const todayLog = t.logs.find((l) => {
      const logDate = new Date(l.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
    if (todayLog?.status === "completed") totalCompletedToday++;

    // Calculate streak
    let streak = 0;
    const sortedLogs = [...t.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const log of sortedLogs) {
      if (log.status === "completed") streak++;
      else break;
    }

    return {
      id: t.id,
      name: t.name,
      description: t.description,
      frequencyType: t.frequencyType,
      targetCount: t.targetCount,
      color: t.color,
      createdAt: t.createdAt.toISOString(),
      streak,
      completedToday: todayLog?.status === "completed",
      totalLogs: t.logs.filter((l) => l.status === "completed").length,
    };
  });

  const completionRate = totalHabits > 0 ? Math.round((totalCompletedToday / totalHabits) * 100) : 0;
  const longestStreak = trackerData.length > 0 ? Math.max(...trackerData.map((t) => t.streak)) : 0;

  return (
    <DashboardClient
      trackers={trackerData}
      stats={{ totalHabits, completedToday: totalCompletedToday, completionRate, longestStreak }}
    />
  );
}
